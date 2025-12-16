from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.models import Appointment

def test_create_appointment(client: TestClient, patient_token, therapist_token, db_session: Session):
    therapist_id = therapist_token['user'].id
    response = client.post(
        "/appointments/",
        json={
            "therapist_id": therapist_id,
            "start_time": "2025-12-01T10:00:00",
            "end_time": "2025-12-01T11:00:00"
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["therapist_id"] == therapist_id
    assert data["status"] == "PENDING"

def test_get_patient_appointments(client: TestClient, patient_token, db_session: Session):
    response = client.get("/appointments/", headers={"Authorization": f"Bearer {patient_token['access_token']}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_get_therapist_appointments(client: TestClient, therapist_token, db_session: Session):
    response = client.get("/appointments/", headers={"Authorization": f"Bearer {therapist_token['access_token']}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_update_appointment_status(client: TestClient, therapist_token, db_session: Session):
    appointment = db_session.query(Appointment).first()
    appointment_id = appointment.id

    response = client.patch(
        f"/appointments/{appointment_id}",
        json={"status": "CONFIRMED"},
        headers={"Authorization": f"Bearer {therapist_token['access_token']}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "CONFIRMED"
