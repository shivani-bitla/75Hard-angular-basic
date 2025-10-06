from fastapi import FastAPI
from pydantic import BaseModel
from datetime import date
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import ConfigurationError
import json, sys
from bson import json_util
import datetime

app = FastAPI()

uri = "mongodb+srv://test1:XbD37hFBN5zXQF1o@cluster0.rdzviva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except ConfigurationError:
    print("An Invalid URI host error was received. Is your Atlas host name correct in your connection string?")
    sys.exit(1)
db = client.test
collection = db["dates"]
today_str = datetime.date.today().isoformat()
if collection.count_documents({}) == 0:
    collection.insert_one({"_id": "current_date", "date": today_str})
collection.create_index("date", unique=True)

class DateInput(BaseModel):
    input_date: date

@app.post("/receive_date")
async def receive_date(date_input: DateInput):
    date_str = date_input.input_date.isoformat()
    try:
        collection.replace_one(
            {"_id": "current_date"},
            {"_id": "current_date", "date": date_str},
            upsert=True
        )
    except Exception as e:
        return {"error": str(e)}
    return {"received_date": date_input.input_date}

@app.get("/get_dates")
async def get_dates():
    dates_cursor = collection.find({})
    dates = dates_cursor.to_list(length=100)
    return json.loads(json_util.dumps(dates))