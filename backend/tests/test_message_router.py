from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from ..main import app
from ..models import User

def test_send_message(client: TestClient, patient_token, therapist_user, db_session: Session):
    therapist_id = therapist_user.id
    response = client.post(
        "/messages/",
        json={
            "receiver_id": therapist_id,
            "content": "Hello, I would like to book an appointment."
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Hello, I would like to book an appointment."
    assert data["receiver_id"] == therapist_id

def test_get_messages(client: TestClient, patient_token, therapist_user, db_session: Session):
    therapist_id = therapist_user.id
    # Create a message first
    client.post(
        "/messages/",
        json={
            "receiver_id": therapist_id,
            "content": "Hello, I would like to book an appointment."
        },
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )

    response = client.get(
        f"/messages/{therapist_id}",
        headers={"Authorization": f"Bearer {patient_token['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0