import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..main import app
from ..database import Base, get_db
from ..models import User
from ..hashing import Hasher

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

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def _get_db_override():
        yield db_session

    app.dependency_overrides[get_db] = _get_db_override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.pop(get_db)

@pytest.fixture(scope="function")
def patient_user(db_session):
    user = User(
        email="patient@example.com",
        hashed_password=Hasher.get_password_hash("patientpassword"),
        user_type="PATIENT",
        verified=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def therapist_user(db_session):
    user = User(
        email="therapist@example.com",
        hashed_password=Hasher.get_password_hash("therapistpassword"),
        user_type="THERAPIST",
        verified=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def patient_token(client, patient_user):
    response = client.post("/users/login", data={"username": "patient@example.com", "password": "patientpassword"})
    token = response.json()
    token["user"] = patient_user
    return token

@pytest.fixture(scope="function")
def therapist_token(client, therapist_user):
    response = client.post("/users/login", data={"username": "therapist@example.com", "password": "therapistpassword"})
    token = response.json()
    token["user"] = therapist_user
    return token