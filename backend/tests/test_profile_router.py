import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..main import app
from ..database import Base, get_db
from ..models.user import User
from ..models.profile import Therapist
from ..jwt import create_access_token
from ..schemas.enums import UserType
import os

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

def test_upload_therapist_picture(db_session):
    # Create a therapist user
    therapist_user = User(email="therapist@example.com", password="password", user_type=UserType.THERAPIST)
    db_session.add(therapist_user)
    db_session.commit()
    therapist_profile = Therapist(user_id=therapist_user.id, full_name="Dr. Therapist")
    db_session.add(therapist_profile)
    db_session.commit()

    therapist_token = create_access_token(data={"sub": str(therapist_user.id)})

    # Create a dummy file
    file_content = b"test image data"
    with open("test_image.jpg", "wb") as f:
        f.write(file_content)

    with open("test_image.jpg", "rb") as f:
        response = client.post(
            "/profile/therapist/picture",
            files={"file": ("test_image.jpg", f, "image/jpeg")},
            headers={"Authorization": f"Bearer {therapist_token}"}
        )

    os.remove("test_image.jpg")

    assert response.status_code == 200
    assert response.json() == {"message": "Profile picture updated successfully"}

    db_session.refresh(therapist_profile)
    assert therapist_profile.profile_picture_url is not None
    assert f"{therapist_user.id}_test_image.jpg" in therapist_profile.profile_picture_url

def test_search_therapists_pagination(db_session):
    # Create multiple therapists
    for i in range(15):
        user = User(email=f"therapist{i}@example.com", password="password", user_type=UserType.THERAPIST)
        db_session.add(user)
        db_session.commit()
        therapist = Therapist(user_id=user.id, full_name=f"Dr. Therapist {i}", specialization="Anxiety")
        db_session.add(therapist)
        db_session.commit()

    # Search with pagination
    response = client.get("/profile/therapists/search?specialization=Anxiety&page=2&limit=5")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["full_name"] == "Dr. Therapist 5"