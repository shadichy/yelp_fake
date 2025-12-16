from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.models import Appointment
from backend.schemas.enums import AppointmentStatus
import datetime

def test_create_review(client: TestClient, patient_token, therapist_token, db_session: Session):
    therapist_id = therapist_token['user'].id
    
    # Ensure there is a completed appointment to review
    completed_appointment = db_session.query(Appointment).filter(
        Appointment.patient_id == patient_token['user'].id,
        Appointment.therapist_id == therapist_id,
        Appointment.status == AppointmentStatus.COMPLETED
    ).first()

    if not completed_appointment:
        completed_appointment = Appointment(
            patient_id=patient_token['user'].id,
            therapist_id=therapist_id,
            start_time=datetime.datetime.now() - datetime.timedelta(days=2),
            end_time=datetime.datetime.now() - datetime.timedelta(days=2, hours=-1),
            status=AppointmentStatus.COMPLETED
        )
        db_session.add(completed_appointment)
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

def test_get_reviews(client: TestClient, therapist_token, db_session: Session):
    therapist_id = therapist_token['user'].id
    response = client.get(f"/reviews/{therapist_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0