from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from models import Task, DailyProgress, StartDate, StartDateModel, DailyProgressModel
from database import Base, engine, get_db
from datetime import datetime

app = FastAPI()

# Initialize database schema
Base.metadata.create_all(bind=engine)

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
        start_date = db.query(StartDateModel).filter(StartDateModel.id == "singleton").first()
        if not start_date:
            date_str = datetime.now().strftime("%Y-%m-%d")
            start_date = StartDateModel(id="singleton", date=date_str)
            db.add(start_date)
            db.commit()
            db.refresh(start_date)
        return {"date": start_date.date}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/start-date")
def update_start_date(start_date: StartDate, db: Session = Depends(get_db)):
    try:
        db_start_date = db.query(StartDateModel).filter(StartDateModel.id == "singleton").first()
        if not db_start_date:
            db_start_date = StartDateModel(id="singleton", date=start_date.date)
            db.add(db_start_date)
        else:
            db_start_date.date = start_date.date
        db.commit()
        return {"message": "Start date updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/progress", response_model=List[DailyProgress])
def get_progress(db: Session = Depends(get_db)):
    try:
        progress = db.query(DailyProgressModel).all()
        return progress
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/progress/{date}", response_model=DailyProgress, response_model_exclude_unset=True)
def get_progress_for_date(date: str, db: Session = Depends(get_db)):
    try:
        progress = db.query(DailyProgressModel).filter(DailyProgressModel.date == date).first()
        if not progress:
            return {"date": date, "tasks": INITIAL_TASKS, "all_completed": False}
        return progress
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/progress/{date}")
def update_progress(date: str, task_update: Task, task_index: int, db: Session = Depends(get_db)):
    try:
        if task_index < 0 or task_index >= len(INITIAL_TASKS):
            raise HTTPException(status_code=400, detail="Invalid task index")
        progress = db.query(DailyProgressModel).filter(DailyProgressModel.date == date).first()
        if not progress:
            progress = DailyProgressModel(
                date=date,
                tasks=INITIAL_TASKS,
                all_completed=False
            )
            db.add(progress)
        progress.tasks[task_index] = task_update.model_dump()
        progress.all_completed = all(task["completed"] for task in progress.tasks)
        db.commit()
        db.refresh(progress)
        return {"message": "Progress updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# main.py (only showing reset_progress)@app.delete("/progress")
def reset_progress(db: Session = Depends(get_db)):
    try:
        date_str = "2025-09-28"  # Use fixed date for consistency
        db.query(DailyProgressModel).delete()
        db.query(StartDateModel).delete()
        start_date = StartDateModel(id="singleton", date=date_str)
        daily_progress = DailyProgressModel(
            date=date_str,
            tasks=INITIAL_TASKS.copy(),  # Ensure fresh copy
            all_completed=False
        )
        db.add(start_date)
        db.add(daily_progress)
        db.commit()
        db.refresh(start_date)
        db.refresh(daily_progress)
        return {"message": "Challenge reset"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()