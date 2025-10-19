from sqlalchemy import Column, String, JSON, Boolean
from pydantic import BaseModel, field_validator
from database import Base
from typing import List
from datetime import datetime

class Task(BaseModel):
    name: str
    completed: bool

class DailyProgress(BaseModel):
    date: str
    tasks: List[Task]
    all_completed: bool

    @field_validator("date")
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v

class StartDate(BaseModel):
    date: str

class DailyProgressModel(Base):
    __tablename__ = "daily_progress"
    date = Column(String, primary_key=True)
    tasks = Column(JSON, nullable=False)
    all_completed = Column(Boolean, nullable=False)


class StartDateModel(Base):
    __tablename__ = "start_date"
    id = Column(String, primary_key=True)
    date = Column(String, nullable=False)