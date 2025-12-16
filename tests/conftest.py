import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from backend.database import Base, get_db
from backend.models.user import User
from backend.hashing import Hasher
from backend.database import Base, engine, SessionLocal
from backend.models import user, profile, appointment, availability, message, review, VerificationToken
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def seed_data():
    db = SessionLocal()
    try:
        # Create users
        users = [
            user.User(email="admin@example.com", hashed_password=Hasher.get_password_hash("adminpassword"), user_type="ADMIN", verified=True),
            user.User(email="patient1@example.com", hashed_password=Hasher.get_password_hash("password"), user_type="PATIENT", verified=True),
            user.User(email="therapist1@example.com", hashed_password=Hasher.get_password_hash("password"), user_type="THERAPIST", verified=True),
            user.User(email="patient2@example.com", hashed_password=Hasher.get_password_hash("password"), user_type="PATIENT", verified=True),
            user.User(email="therapist2@example.com", hashed_password=Hasher.get_password_hash("password"), user_type="THERAPIST", verified=True),
            user.User(email="patient3@example.com", hashed_password=Hasher.get_password_hash("password"), user_type="PATIENT", verified=True),
            user.User(email="therapist3@example.com", hashed_password=Hasher.get_password_hash("password"), user_type="THERAPIST", verified=True),
        ]
        db.add_all(users)
        db.commit()

        # Create patient profiles
        patients = [
            profile.Patient(id=users[1].id, full_name="Patient 1", date_of_birth=datetime.date(1990, 1, 1)),
            profile.Patient(id=users[3].id, full_name="Patient 2", date_of_birth=datetime.date(1992, 2, 2)),
            profile.Patient(id=users[5].id, full_name="Patient 3", date_of_birth=datetime.date(1985, 3, 3)),
        ]
        db.add_all(patients)
        db.commit()

        # Create therapist profiles
        therapists = [
            profile.Therapist(id=users[2].id, full_name="Therapist 1", license_number="LICENSE1", specialization="General", years_of_experience=5),
            profile.Therapist(id=users[4].id, full_name="Therapist 2", license_number="LICENSE2", specialization="Couples", years_of_experience=10),
            profile.Therapist(id=users[6].id, full_name="Therapist 3", license_number="LICENSE3", specialization="Addiction", years_of_experience=3),
        ]
        db.add_all(therapists)
        db.commit()

        # Create availabilities
        availabilities = [
            availability.Availability(therapist_id=users[2].id, start_time=datetime.datetime.now() + datetime.timedelta(days=1), end_time=datetime.datetime.now() + datetime.timedelta(days=1, hours=1)),
            availability.Availability(therapist_id=users[2].id, start_time=datetime.datetime.now() + datetime.timedelta(days=1, hours=2), end_time=datetime.datetime.now() + datetime.timedelta(days=1, hours=3)),
            availability.Availability(therapist_id=users[4].id, start_time=datetime.datetime.now() + datetime.timedelta(days=2), end_time=datetime.datetime.now() + datetime.timedelta(days=2, hours=1)),
            availability.Availability(therapist_id=users[6].id, start_time=datetime.datetime.now() + datetime.timedelta(days=3), end_time=datetime.datetime.now() + datetime.timedelta(days=3, hours=1)),
        ]
        db.add_all(availabilities)
        db.commit()

        # Create appointments
        appointments = [
            appointment.Appointment(patient_id=users[1].id, therapist_id=users[2].id, start_time=datetime.datetime.now() + datetime.timedelta(days=1), end_time=datetime.datetime.now() + datetime.timedelta(days=1, hours=1), status="PENDING"),
            appointment.Appointment(patient_id=users[3].id, therapist_id=users[4].id, start_time=datetime.datetime.now() + datetime.timedelta(days=2), end_time=datetime.datetime.now() + datetime.timedelta(days=2, hours=1), status="CONFIRMED"),
            appointment.Appointment(patient_id=users[5].id, therapist_id=users[6].id, start_time=datetime.datetime.now() + datetime.timedelta(days=3), end_time=datetime.datetime.now() + datetime.timedelta(days=3, hours=1), status="COMPLETED"),
            appointment.Appointment(patient_id=users[1].id, therapist_id=users[4].id, start_time=datetime.datetime.now() + datetime.timedelta(days=4), end_time=datetime.datetime.now() + datetime.timedelta(days=4, hours=1), status="CANCELLED"),
        ]
        db.add_all(appointments)
        db.commit()

        # Create messages
        messages = [
            message.Message(sender_id=users[1].id, receiver_id=users[2].id, content="Hello from patient 1 to therapist 1"),
            message.Message(sender_id=users[2].id, receiver_id=users[1].id, content="Hello from therapist 1 to patient 1"),
            message.Message(sender_id=users[3].id, receiver_id=users[4].id, content="Hello from patient 2 to therapist 2"),
            message.Message(sender_id=users[4].id, receiver_id=users[3].id, content="Hello from therapist 2 to patient 2"),
        ]
        db.add_all(messages)
        db.commit()

        # Create reviews
        reviews = [
            review.Review(patient_id=users[1].id, therapist_id=users[2].id, rating=5, comment="Great therapist!"),
            review.Review(patient_id=users[3].id, therapist_id=users[4].id, rating=4, comment="Very helpful."),
            review.Review(patient_id=users[5].id, therapist_id=users[6].id, rating=3, comment="It was okay."),
        ]
        db.add_all(reviews)
        db.commit()
        
        # Create verification tokens
        verification_tokens = [
            VerificationToken(token="validtoken", user_id=users[1].id, expires_at=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)),
            VerificationToken(token="expiredtoken", user_id=users[3].id, expires_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=1)),
        ]
        db.add_all(verification_tokens)
        db.commit()

        print("Database seeded with initial data.")
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_data()
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def client(db_session):
    def _get_db_override():
        yield db_session

    app.dependency_overrides[get_db] = _get_db_override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.pop(get_db)

@pytest.fixture(scope="function")
def patient_token(client, db_session):
    response = client.post("/users/login", data={"username": "patient1@example.com", "password": "password"})
    token = response.json()
    user = db_session.query(User).filter(User.email == "patient1@example.com").first()
    token["user"] = user
    return token

@pytest.fixture(scope="function")
def therapist_token(client, db_session):
    response = client.post("/users/login", data={"username": "therapist1@example.com", "password": "password"})
    token = response.json()
    user = db_session.query(User).filter(User.email == "therapist1@example.com").first()
    token["user"] = user
    return token