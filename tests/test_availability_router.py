from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.models import User, Availability

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

def test_get_availability(client: TestClient, therapist_token, db_session: Session):
    therapist_id = therapist_token['user'].id
    response = client.get(f"/availability/?therapist_id={therapist_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_delete_availability(client: TestClient, therapist_token, db_session: Session):
    availability_to_delete = db_session.query(Availability).filter(Availability.therapist_id == therapist_token['user'].id).first()
    availability_id = availability_to_delete.id

    response = client.delete(
        f"/availability/{availability_id}",
        headers={"Authorization": f"Bearer {therapist_token['access_token']}"}
    )
    assert response.status_code == 204