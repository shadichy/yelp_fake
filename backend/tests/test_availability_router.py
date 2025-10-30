from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from ..main import app
from ..models import User

def test_create_availability(client: TestClient, therapist_token, db_session: Session):
    response = client.post(
        "/availability/",
        json={"start_time": "2025-11-01T10:00:00", "end_time": "2025-11-01T11:00:00"},
        headers={"Authorization": f"Bearer {therapist_token['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["start_time"] == "2025-11-01T10:00:00"
    assert data["end_time"] == "2025-11-01T11:00:00"

def test_get_availability(client: TestClient, therapist_user, therapist_token, db_session: Session):
    # Create an availability first
    client.post(
        "/availability/",
        json={"start_time": "2025-11-01T10:00:00", "end_time": "2025-11-01T11:00:00"},
        headers={"Authorization": f"Bearer {therapist_token['access_token']}"}
    )

    response = client.get(f"/availability/?therapist_id={therapist_user.id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_delete_availability(client: TestClient, therapist_token, db_session: Session):
    # First create an availability to delete
    response = client.post(
        "/availability/",
        json={"start_time": "2025-11-01T12:00:00", "end_time": "2025-11-01T13:00:00"},
        headers={"Authorization": f"Bearer {therapist_token['access_token']}"}
    )
    assert response.status_code == 200
    availability_id = response.json()["id"]

    # Now delete it
    response = client.delete(
        f"/availability/{availability_id}",
        headers={"Authorization": f"Bearer {therapist_token['access_token']}"}
    )
    assert response.status_code == 204