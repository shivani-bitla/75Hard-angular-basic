from sqlalchemy import create_engine, Column, String, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

# SQLite database
DATABASE_URL = "sqlite:///challenge.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Tables
class StartDateModel(Base):
    __tablename__ = "start_date"
    id = Column(String, primary_key=True, default="singleton")
    date = Column(String, nullable=False)

class DailyProgressModel(Base):
    __tablename__ = "daily_progress"
    date = Column(String, primary_key=True)
    tasks = Column(JSON, nullable=False)
    all_completed = Column(Boolean, nullable=False)

# Create tables
Base.metadata.create_all(engine)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()