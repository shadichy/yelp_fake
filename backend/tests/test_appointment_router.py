import datetime
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from ..main import app
from ..models import User, Appointment

def test_create_appointment(client: TestClient, patient_token, therapist_user, therapist_token, db_session: Session):
    # First, therapist adds availability
    therapist_headers = {"Authorization": f"Bearer {therapist_token['access_token']}"}
    response = client.post("/availability/", json={"start_time": "2025-12-01T10:00:00", "end_time": "2025-12-01T11:00:00"}, headers=therapist_headers)
    assert response.status_code == 200

    response = client.post(
        "/appointments/",
        json={
            "therapist_id": therapist_user.id,
            "start_time": "2025-12-01T10:00:00",
            "end_time": "2025-12-01T11:00:00"
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["therapist_id"] == therapist_user.id
    assert data["status"] == "PENDING"

def test_get_patient_appointments(client: TestClient, patient_token, therapist_user, therapist_token, db_session: Session):
    # First, therapist adds availability
    therapist_headers = {"Authorization": f"Bearer {therapist_token['access_token']}"}
    response = client.post("/availability/", json={"start_time": "2025-12-01T10:00:00", "end_time": "2025-12-01T11:00:00"}, headers=therapist_headers)
    assert response.status_code == 200

    # Create an appointment first
    response = client.post(
        "/appointments/",
        json={
            "therapist_id": therapist_user.id,
            "start_time": "2025-12-01T10:00:00",
            "end_time": "2025-12-01T11:00:00"
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )
    assert response.status_code == 200

    response = client.get("/appointments/", headers={"Authorization": f"Bearer {patient_token['access_token']}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_get_therapist_appointments(client: TestClient, therapist_token, patient_token, therapist_user, db_session: Session):
    # First, therapist adds availability
    therapist_headers = {"Authorization": f"Bearer {therapist_token['access_token']}"}
    response = client.post("/availability/", json={"start_time": "2025-12-01T10:00:00", "end_time": "2025-12-01T11:00:00"}, headers=therapist_headers)
    assert response.status_code == 200

    # Create an appointment first
    response = client.post(
        "/appointments/",
        json={
            "therapist_id": therapist_user.id,
            "start_time": "2025-12-01T10:00:00",
            "end_time": "2025-12-01T11:00:00"
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )
    assert response.status_code == 200

    response = client.get("/appointments/", headers={"Authorization": f"Bearer {therapist_token['access_token']}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_update_appointment_status(client: TestClient, therapist_token, patient_user, patient_token, db_session: Session):
    # First, therapist adds availability
    therapist_headers = {"Authorization": f"Bearer {therapist_token['access_token']}"}
    response = client.post("/availability/", json={"start_time": "2025-12-01T11:00:00", "end_time": "2025-12-01T12:00:00"}, headers=therapist_headers)
    assert response.status_code == 200

    # Create an appointment first
    response = client.post(
        "/appointments/",
        json={
            "therapist_id": therapist_token['user'].id,
            "start_time": "2025-12-01T11:00:00",
            "end_time": "2025-12-01T12:00:00"
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )
    assert response.status_code == 200
    appointment_id = response.json()["id"]

    # Therapist confirms the appointment
    response = client.patch(
        f"/appointments/{appointment_id}",
        json={"status": "CONFIRMED"},
        headers={"Authorization": f"Bearer {therapist_token['access_token']}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "CONFIRMED"
