from fastapi.testclient import TestClient

def test_create_user(client: TestClient):
    response = client.post(
        "/users/",
        json={"email": "test@example.com", "password": "testpassword", "user_type": "PATIENT"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
    assert response.json()["user_type"] == "PATIENT"

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
