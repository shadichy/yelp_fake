import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..main import app
from ..database import Base, get_db
from ..models.user import User
from ..models.profile import Therapist
from ..jwt import create_access_token
import asyncio
import websockets
import json

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.mark.asyncio
async def test_websocket_messaging(db_session):
    # Create two users
    user1 = User(email="user1@example.com", password="password", user_type="PATIENT")
    user2 = User(email="user2@example.com", password="password", user_type="THERAPIST")
    db_session.add(user1)
    db_session.add(user2)
    db_session.commit()

    user1_token = create_access_token(data={"sub": str(user1.id)})
    user2_token = create_access_token(data={"sub": str(user2.id)})

    uri1 = f"ws://localhost:8000/ws/{user1.id}"
    uri2 = f"ws://localhost:8000/ws/{user2.id}"

    async with websockets.connect(uri1) as websocket1, websockets.connect(uri2) as websocket2:
        # User 1 sends a message to User 2
        message_to_send = {"receiver_id": user2.id, "content": "Hello, User 2!"}
        await websocket1.send(json.dumps(message_to_send))

        # User 2 should receive the message
        received_message_str = await websocket2.recv()
        received_message = json.loads(received_message_str)

        assert received_message["sender_id"] == user1.id
        assert received_message["receiver_id"] == user2.id
        assert received_message["content"] == "Hello, User 2!"

        # The sender (User 1) should also receive the message
        received_message_str_sender = await websocket1.recv()
        received_message_sender = json.loads(received_message_str_sender)
        assert received_message_sender["sender_id"] == user1.id
        assert received_message_sender["receiver_id"] == user2.id
        assert received_message_sender["content"] == "Hello, User 2!"
