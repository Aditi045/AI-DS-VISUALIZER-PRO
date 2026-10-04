from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base
import datetime

class OperationHistory(Base):
    __tablename__ = "operation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    command = Column(String)
    data_structure = Column(String)
    language = Column(String(20), nullable=False, default="python")
    operations = Column(Text) # JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
