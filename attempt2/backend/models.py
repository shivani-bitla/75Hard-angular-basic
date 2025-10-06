from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from typing import Optional, Dict

class User(BaseModel):
    id: Optional[ObjectId] = Field(default=None, alias="_id")
    user_id: str
    username: str
    email: str
    created_at: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed: True
        json_encoders = {ObjectId: str, datetime: str}


class DailyLog(BaseModel):
    id: Optional[ObjectId] = Field(default=None, alias="_id")
    user_id: str
    challenge_id: str
    day_number: int
    date: datetime
    tasks: Dict[str, bool]
    notes: Optional[str] = None
    completed: bool
    created_at: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed: True
        json_encoders = {ObjectId: str, datetime: str}

class Challenge(BaseModel):
    id: Optional[ObjectId] = Field(default=None, alias="_id")
    user_id: str
    challenge_id: str
    start_date: datetime
    current_day: int
    total_days: int
    completion_status: str
    streak: int
    created_at: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed: True
        json_encoders = {ObjectId: str, datetime: str}