import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.models.user import User
from backend.models.profile import Therapist
from backend.schemas.enums import UserType
import os

def test_upload_therapist_picture(client: TestClient, therapist_token, db_session: Session):
    therapist_id = therapist_token['user'].id
    therapist_profile = db_session.query(Therapist).filter(Therapist.id == therapist_id).first()

    file_content = b"test image data"
    with open("test_image.jpg", "wb") as f:
        f.write(file_content)

    with open("test_image.jpg", "rb") as f:
        response = client.post(
            "/profile/therapist/picture",
            files={"file": ("test_image.jpg", f, "image/jpeg")},
            headers={"Authorization": f"Bearer {therapist_token['access_token']}"}
        )

    os.remove("test_image.jpg")

    assert response.status_code == 200
    assert response.json() == {"message": "Profile picture updated successfully"}

    db_session.refresh(therapist_profile)
    assert therapist_profile.profile_picture_url is not None
    assert f"{therapist_id}_test_image.jpg" in therapist_profile.profile_picture_url

def test_search_therapists_pagination(client: TestClient, db_session: Session):
    # Create additional therapists to test pagination
    for i in range(4, 16):
        user = User(email=f"therapist{i}@example.com", password="password", user_type=UserType.THERAPIST, verified=True)
        db_session.add(user)
        db_session.commit()
        therapist = Therapist(id=user.id, full_name=f"Dr. Therapist {i}", specialization="Anxiety", years_of_experience=i)
        db_session.add(therapist)
        db_session.commit()

    response = client.get("/profile/therapists/search?specialization=Anxiety&page=1&limit=5")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["full_name"] == "Dr. Therapist 4"