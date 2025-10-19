# test_main.py (relevant parts)
import pytest
from fastapi.testclient import TestClient
from main import app, INITIAL_TASKS
from database import SessionLocal, Base, engine, reset_database
from datetime import datetime

@pytest.fixture
def client():
    reset_database()  # Reset database at fixture start
    yield TestClient(app)
    reset_database()  # Reset database after fixture

@pytest.fixture
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_database():
    reset_database()  # Ensure clean state before each test
    yield

def test_reset_progress(client, db):
    test_date = "2025-09-28"
    task_update = {"name": INITIAL_TASKS[0]["name"], "completed": True}
    response = client.put(f"/progress/{test_date}?task_index=0", json=task_update)
    print(response.json())  # Debug output
    assert response.status_code == 200

    response = client.delete("/progress")
    print(response.json())  # Debug output
    assert response.status_code == 200
    assert response.json() == {"message": "Challenge reset"}

    response = client.get(f"/progress/{test_date}")
    print(response.json())  # Debug output
    assert response.status_code == 200
    assert response.json()["tasks"][0]["completed"] is False

    response = client.get("/start-date")
    print(response.json())  # Debug output
    assert response.status_code == 200
    assert response.json() == {"date": test_date}