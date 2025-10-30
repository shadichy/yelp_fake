from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from ..main import app
from ..models import User, Appointment
from ..schemas.enums import AppointmentStatus

import datetime

def test_create_review(client: TestClient, patient_token, therapist_user, db_session: Session):
    # First, create a completed appointment
    therapist_id = therapist_user.id
    patient_id = patient_token['user'].id

    appointment = Appointment(
        patient_id=patient_id,
        therapist_id=therapist_id,
        start_time=datetime.datetime.fromisoformat("2025-12-01T10:00:00"),
        end_time=datetime.datetime.fromisoformat("2025-12-01T11:00:00"),
        status=AppointmentStatus.COMPLETED
    )
    db_session.add(appointment)
    db_session.commit()

    response = client.post(
        "/reviews/",
        json={
            "therapist_id": therapist_id,
            "rating": 5,
            "comment": "Excellent therapist!"
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == 5
    assert data["comment"] == "Excellent therapist!"

def test_get_reviews(client: TestClient, therapist_user, patient_token, db_session: Session):
    # Create a completed appointment first
    therapist_id = therapist_user.id
    patient_id = patient_token['user'].id

    appointment = Appointment(
        patient_id=patient_id,
        therapist_id=therapist_id,
        start_time=datetime.datetime.fromisoformat("2025-12-01T10:00:00"),
        end_time=datetime.datetime.fromisoformat("2025-12-01T11:00:00"),
        status=AppointmentStatus.COMPLETED
    )
    db_session.add(appointment)
    db_session.commit()

    # Create a review
    client.post(
        "/reviews/",
        json={
            "therapist_id": therapist_id,
            "rating": 5,
            "comment": "Excellent therapist!"
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )

    response = client.get(f"/reviews/{therapist_user.id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0