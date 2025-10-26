from fastapi.testclient import TestClient

def test_create_patient_profile(client: TestClient):
    # Create a patient user first
    user_response = client.post(
        "/users/",
        json={"email": "patient@example.com", "password": "patientpassword", "user_type": "PATIENT"},
    )
    assert user_response.status_code == 200

    # Log in as the patient
    login_response = client.post(
        "/users/login",
        data={"username": "patient@example.com", "password": "patientpassword"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # Create the patient profile
    profile_response = client.post(
        "/profile/patient",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Test Patient"},
    )
    assert profile_response.status_code == 200
    assert profile_response.json()["full_name"] == "Test Patient"

def test_create_therapist_profile(client: TestClient):
    # Create a therapist user first
    user_response = client.post(
        "/users/",
        json={"email": "therapist@example.com", "password": "therapistpassword", "user_type": "THERAPIST"},
    )
    assert user_response.status_code == 200

    # Log in as the therapist
    login_response = client.post(
        "/users/login",
        data={"username": "therapist@example.com", "password": "therapistpassword"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # Create the therapist profile
    profile_response = client.post(
        "/profile/therapist",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Test Therapist", "license_number": "12345"},
    )
    assert profile_response.status_code == 200
    assert profile_response.json()["full_name"] == "Test Therapist"
