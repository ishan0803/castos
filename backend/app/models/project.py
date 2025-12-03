from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    title = Column(String)
    plot = Column(String)
    budget_cap = Column(Float)
    industry = Column(String)
    
    # New Status Field: 'pending', 'completed', 'failed'
    status = Column(String, default="pending") 
    
    raw_characters = Column(JSON) 
    optimization_result = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())