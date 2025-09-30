from fastapi import FastAPI
from pydantic import BaseModel
from datetime import date
from motor.motor_asyncio import AsyncIOMotorClient
from bson import json_util
import json

app = FastAPI()

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["date_database"]
collection = db["dates"]

class DateInput(BaseModel):
    input_date: date

@app.post("/receive_date")
async def receive_date(date_input: DateInput):
    await collection.insert_one({"date": date_input.input_date.isoformat()})
    return {"received_date": date_input.input_date}

@app.get("/get_dates")
async def get_dates():
    dates_cursor = collection.find({})
    dates = await dates_cursor.to_list(length=100)
    return json.loads(json_util.dumps(dates))