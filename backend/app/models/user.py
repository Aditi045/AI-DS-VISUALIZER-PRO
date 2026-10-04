from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    google_sub = Column(String(255), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
