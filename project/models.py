from pydantic import BaseModel
from typing import List

class Task(BaseModel):
    name: str
    completed: bool

class DailyProgress(BaseModel):
    date: str
    tasks: List[Task]
    all_completed: bool

class StartDate(BaseModel):
    date: str