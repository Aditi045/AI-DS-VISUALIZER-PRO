from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import urllib.parse
import urllib.request
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

router = APIRouter()
TOKEN_SECRET = os.getenv("AUTH_SECRET", "change-this-local-secret")


def _password_hash(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 210_000).hex()
    return f"{salt}${digest}"


def _password_ok(password: str, encoded: str) -> bool:
    salt, expected = encoded.split("$", 1)
    actual = _password_hash(password, salt).split("$", 1)[1]
    return hmac.compare_digest(actual, expected)


def _token(user: User) -> str:
    payload = {"sub": user.id, "email": user.email, "exp": (datetime.utcnow() + timedelta(days=7)).timestamp()}
    raw = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    signature = hmac.new(TOKEN_SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}.{signature}"


class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)

    @validator("email")
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=1, max_length=128)

    @validator("email")
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class GoogleRequest(BaseModel):
    credential: str = Field(..., min_length=20)


def _response(user: User) -> dict:
    return {"success": True, "token": _token(user), "user": {"id": user.id, "name": user.name, "email": user.email}}


@router.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == request.email).first():
        return {"success": False, "error": "Email already registered", "message": "An account with this email already exists."}
    user = User(name=request.name.strip(), email=request.email, password_hash=_password_hash(request.password))
    db.add(user); db.commit(); db.refresh(user)
    return _response(user)


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not user.password_hash or not _password_ok(request.password, user.password_hash):
        return {"success": False, "error": "Invalid credentials", "message": "Email or password is incorrect."}
    return _response(user)


@router.post("/google")
def google_login(request: GoogleRequest, db: Session = Depends(get_db)):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        return {"success": False, "error": "Google login not configured", "message": "Set GOOGLE_CLIENT_ID in backend/.env and VITE_GOOGLE_CLIENT_ID in frontend/.env."}
    try:
        query = urllib.parse.urlencode({"id_token": request.credential})
        with urllib.request.urlopen(f"https://oauth2.googleapis.com/tokeninfo?{query}", timeout=5) as response:
            profile = json.loads(response.read().decode())
        if profile.get("aud") != client_id or not profile.get("sub") or not profile.get("email"):
            return {"success": False, "error": "Invalid Google credential", "message": "Google could not verify this account."}
        user = db.query(User).filter(User.google_sub == profile["sub"]).first() or db.query(User).filter(User.email == profile["email"].lower()).first()
        if not user:
            user = User(name=profile.get("name") or profile["email"].split("@")[0], email=profile["email"].lower(), google_sub=profile["sub"])
            db.add(user)
        elif not user.google_sub:
            user.google_sub = profile["sub"]
        db.commit(); db.refresh(user)
        return _response(user)
    except Exception:
        return {"success": False, "error": "Google login unavailable", "message": "Google sign-in could not be completed. Try email login."}
