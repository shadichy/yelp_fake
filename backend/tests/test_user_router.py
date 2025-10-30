from fastapi.testclient import TestClient


def test_create_user(client: TestClient):
    response = client.post(
        "/users/",
        json={"email": "test@example.com", "password": "testpassword", "user_type": "PATIENT"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
    assert response.json()["user_type"] == "PATIENT"


def test_create_user_with_existing_email(client: TestClient):
    client.post(
        "/users/",
        json={"email": "duplicate@example.com", "password": "password123", "user_type": "PATIENT"},
    )
    response = client.post(
        "/users/",
        json={"email": "duplicate@example.com", "password": "password456", "user_type": "THERAPIST"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login(client: TestClient):
    # First, create a user to login with
    client.post(
        "/users/",
        json={"email": "login_test@example.com", "password": "login_password", "user_type": "PATIENT"},
    )

    response = client.post(
        "/users/login",
        data={"username": "login_test@example.com", "password": "login_password"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_with_invalid_password(client: TestClient):
    client.post(
        "/users/",
        json={"email": "invalid_password@example.com", "password": "correct_password", "user_type": "PATIENT"},
    )

    response = client.post(
        "/users/login",
        data={"username": "invalid_password@example.com", "password": "wrong_password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_with_non_existent_user(client: TestClient):
    response = client.post(
        "/users/login",
        data={"username": "nonexistent@example.com", "password": "password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_create_user_with_invalid_user_type(client: TestClient):
    response = client.post(
        "/users/",
        json={"email": "invalid_user@example.com", "password": "password", "user_type": "INVALID_TYPE"},
    )
    assert response.status_code == 422  # Unprocessable Entity
