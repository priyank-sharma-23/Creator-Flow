from pydantic import BaseModel
from typing import Optional
from datetime import date

class IdeaCreate(BaseModel):
    title: str
    description: str = ""
    category: str = "General"
    platform: str = "YouTube"
    status: str = "New"
    priority: str = "Medium"

class ProjectCreate(BaseModel):
    title: str
    description: str = ""
    platform: str = "YouTube"
    status: str = "Idea"
    priority: str = "Medium"
    deadline: Optional[date] = None

class TaskCreate(BaseModel):
    title: str
    project_id: Optional[int] = None
    status: str = "Pending"
    priority: str = "Medium"
    due_date: Optional[date] = None

class ScriptCreate(BaseModel):
    title: str
    project_id: Optional[int] = None
    content: str = ""

class AnalyticsCreate(BaseModel):
    project_id: Optional[int] = None
    platform: str = "YouTube"
    views: int = 0
    likes: int = 0
    comments: int = 0
