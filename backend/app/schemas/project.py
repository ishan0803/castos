from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class ProjectCreate(BaseModel):
    title: str
    plot: str
    budget: float
    industry: str = "Hollywood"

class ProjectResponse(BaseModel):
    id: int
    title: str
    plot: str
    budget_cap: float
    industry: str
    status: str  # <--- Added
    raw_characters: Optional[Any] = None
    optimization_result: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True