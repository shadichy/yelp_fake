import pytest
from fastapi.testclient import TestClient
import json

@pytest.mark.asyncio
async def test_websocket_messaging(client: TestClient, patient_token, therapist_token):
    patient_id = patient_token['user'].id
    therapist_id = therapist_token['user'].id
    patient_access_token = patient_token['access_token']
    therapist_access_token = therapist_token['access_token']

    with client.websocket_connect(f"/ws?token={patient_access_token}") as websocket1, \
         client.websocket_connect(f"/ws?token={therapist_access_token}") as websocket2:
        
        message_to_send = {"receiver_id": therapist_id, "content": "Hello, Therapist!"}
        websocket1.send_json(message_to_send)

        # Therapist should receive the message
        received_message = websocket2.receive_json()
        assert received_message["sender_id"] == patient_id
        assert received_message["receiver_id"] == therapist_id
        assert received_message["content"] == "Hello, Therapist!"

        # The sender (Patient) should also receive the message
        received_message_sender = websocket1.receive_json()
        assert received_message_sender["sender_id"] == patient_id
        assert received_message_sender["receiver_id"] == therapist_id
        assert received_message_sender["content"] == "Hello, Therapist!"
