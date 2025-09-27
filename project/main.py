from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from models import Task, DailyProgress, StartDate
from database import SessionLocal, StartDateModel, DailyProgressModel, get_db
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

INITIAL_TASKS = [
    {"name": "45 mins outdoor workout", "completed": False},
    {"name": "45 mins indoor workout", "completed": False},
    {"name": "Follow a meal plan", "completed": False},
    {"name": "Drink 1 gallon of water", "completed": False},
    {"name": "Upload to Instagram", "completed": False},
    {"name": "Build frontend app & upload to GitHub", "completed": False}
]

@app.get("/start-date", response_model=StartDate)
def get_start_date(db: Session = Depends(get_db)):
    try:
        logger.info("Fetching start date")
        start_date = db.query(StartDateModel).filter(StartDateModel.id == "singleton").first()
        if not start_date:
            date_str = datetime.now().strftime("%Y-%m-%d")
            start_date = StartDateModel(id="singleton", date=date_str)
            db.add(start_date)
            db.commit()
            db.refresh(start_date)
        logger.info(f"Start date: {start_date.date}")
        return {"date": start_date.date}
    except Exception as e:
        logger.error(f"Error in get_start_date: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/start-date")
def update_start_date(start_date: StartDate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Updating start date to {start_date.date}")
        db_start_date = db.query(StartDateModel).filter(StartDateModel.id == "singleton").first()
        if not db_start_date:
            db_start_date = StartDateModel(id="singleton", date=start_date.date)
            db.add(db_start_date)
        else:
            db_start_date.date = start_date.date
        db.commit()
        logger.info("Start date updated")
        return {"message": "Start date updated"}
    except Exception as e:
        logger.error(f"Error in update_start_date: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/progress", response_model=List[DailyProgress])
def get_progress(db: Session = Depends(get_db)):
    try:
        logger.info("Fetching all progress")
        progress = db.query(DailyProgressModel).all()
        logger.info(f"Progress fetched: {len(progress)} entries")
        return progress
    except Exception as e:
        logger.error(f"Error in get_progress: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/progress/{date}", response_model=DailyProgress, response_model_exclude_unset=True)
def get_progress_for_date(date: str, db: Session = Depends(get_db)):
    try:
        logger.info(f"Fetching progress for {date}")
        progress = db.query(DailyProgressModel).filter(DailyProgressModel.date == date).first()
        if not progress:
            logger.info(f"No progress for {date}, returning default")
            return {"date": date, "tasks": INITIAL_TASKS, "all_completed": False}
        logger.info(f"Progress for {date}: {progress.tasks}")
        return progress
    except Exception as e:
        logger.error(f"Error in get_progress_for_date: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/progress/{date}")
def update_progress(date: str, task_update: Task, task_index: int, db: Session = Depends(get_db)):
    try:
        logger.info(f"Updating progress for {date}, task index {task_index}")
        progress = db.query(DailyProgressModel).filter(DailyProgressModel.date == date).first()
        if not progress:
            progress = DailyProgressModel(
                date=date,
                tasks=INITIAL_TASKS,
                all_completed=False
            )
            db.add(progress)
        progress.tasks[task_index] = task_update.dict()
        progress.all_completed = all(task["completed"] for task in progress.tasks)
        db.commit()
        logger.info("Progress updated")
        return {"message": "Progress updated"}
    except Exception as e:
        logger.error(f"Error in update_progress: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/progress")
def reset_progress(db: Session = Depends(get_db)):
    try:
        logger.info("Resetting progress")
        db.query(DailyProgressModel).delete()
        db.query(StartDateModel).delete()
        db.commit()
        logger.info("Progress reset")
        return {"message": "Challenge reset"}
    except Exception as e:
        logger.error(f"Error in reset_progress: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))