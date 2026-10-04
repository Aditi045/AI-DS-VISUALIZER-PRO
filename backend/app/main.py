from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import json

# Load .env before importing the database module so DATABASE_URL is available.
load_dotenv()

from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db, SQLALCHEMY_DATABASE_URL
from app.models.history import OperationHistory
from app.models.user import User

app = FastAPI(title="AI-DS VISUALIZER PRO API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI-DS VISUALIZER PRO API"}

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        user_count = db.query(User).count()
        history_count = db.query(OperationHistory).count()
        engine_name = "supabase-postgresql" if SQLALCHEMY_DATABASE_URL.startswith("postgresql") else "local-sqlite"
        return {"status": "healthy", "database": "connected", "engine": engine_name, "users": user_count, "history_records": history_count}
    except Exception:
        return {"status": "degraded", "database": "unavailable", "message": "SQLite could not be opened."}

from app.database import engine, Base
Base.metadata.create_all(bind=engine)
with engine.begin() as connection:
    try:
        if SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
            connection.execute(text("ALTER TABLE operation_history ADD COLUMN IF NOT EXISTS language VARCHAR(20) NOT NULL DEFAULT 'python'"))
        else:
            connection.execute(text("ALTER TABLE operation_history ADD COLUMN language VARCHAR(20) NOT NULL DEFAULT 'python'"))
    except Exception:
        pass

from app.api.nlp_router import router as nlp_router
from app.api.execute_router import router as execute_router
from app.api.chatbot_router import router as chatbot_router
from app.api.challenge_router import router as challenge_router
from app.api.learning_router import router as learning_router
from app.api.auth_router import router as auth_router
from app.api.program_router import router as program_router

app.include_router(nlp_router, prefix="/api/ai", tags=["ai"])
app.include_router(execute_router, prefix="/api/execute", tags=["execute"])
app.include_router(chatbot_router, prefix="/api/chat", tags=["chat"])
app.include_router(challenge_router, prefix="/api/challenge", tags=["challenge"])
app.include_router(learning_router, prefix="/api", tags=["learning"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(program_router, prefix="/api/program", tags=["program-execution"])


@app.get("/api/history")
def get_history(session_id: str = "demo-session", db: Session = Depends(get_db)):
    rows = db.query(OperationHistory).filter(OperationHistory.session_id == session_id).order_by(OperationHistory.created_at.desc()).limit(100).all()
    return [{"id": row.id, "command": row.command, "data_structure": row.data_structure, "language": row.language or "python", "operations": json.loads(row.operations), "created_at": row.created_at.isoformat() if row.created_at else None} for row in rows]


@app.delete("/api/history")
def clear_history(session_id: str = "demo-session", db: Session = Depends(get_db)):
    db.query(OperationHistory).filter(OperationHistory.session_id == session_id).delete()
    db.commit()
    return {"success": True}


@app.get("/api/progress")
def progress(session_id: str = "demo-session", db: Session = Depends(get_db)):
    total = db.query(OperationHistory).filter(OperationHistory.session_id == session_id).count()
    return {"visualizations": total, "operations": total, "xp": total * 10, "level": max(1, total // 10 + 1), "streak": 0, "weak_topics": [], "recommendations": ["Practice BST deletion next."]}


@app.get("/api/achievements")
def achievements(session_id: str = "demo-session", db: Session = Depends(get_db)):
    total = db.query(OperationHistory).filter(OperationHistory.session_id == session_id).count()
    return {"achievements": [{"id": "first-visualization", "name": "First Visualization", "unlocked": total > 0}, {"id": "practice-10", "name": "Consistent Learner", "unlocked": total >= 10}]}
