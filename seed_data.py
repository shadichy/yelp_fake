from .database import SessionLocal, engine, Base
from .models.user import User
from .models.profile import Therapist, Patient
from .hashing import Hasher
from .schemas.enums import UserType

# Create tables if they don't exist (just in case)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    # Check if we already have users
    if db.query(User).first():
        print("Data already exists. Skipping seed.")
        return

    # Create Therapists
    therapists_data = [
        {
            "email": "dr.smith@example.com",
            "password": "password123",
            "full_name": "Dr. John Smith",
            "license_number": "LIC12345",
            "specialization": "Anxiety, Depression",
            "years_of_experience": 15,
            "office_address": "123 Healing St, Wellness City",
            "phone_number": "555-0101",
            "profile_picture_url": "https://i.pravatar.cc/150?u=1",
            "latitude": 40.7128,
            "longitude": -74.0060
        },
        {
            "email": "dr.doe@example.com",
            "password": "password123",
            "full_name": "Dr. Jane Doe",
            "license_number": "LIC67890",
            "specialization": "Family Therapy, Child Psychology",
            "years_of_experience": 10,
            "office_address": "456 Care Ave, Wellness City",
            "phone_number": "555-0102",
            "profile_picture_url": "https://i.pravatar.cc/150?u=2",
            "latitude": 40.7300,
            "longitude": -73.9900
        },
        {
            "email": "dr.williams@example.com",
            "password": "password123",
            "full_name": "Dr. Alan Williams",
            "license_number": "LIC11223",
            "specialization": "PTSD, Trauma",
            "years_of_experience": 20,
            "office_address": "789 Hope Blvd, Wellness City",
            "phone_number": "555-0103",
            "profile_picture_url": "https://i.pravatar.cc/150?u=3",
            "latitude": 40.7500,
            "longitude": -73.9800
        }
    ]

    for t_data in therapists_data:
        user = User(
            email=t_data["email"],
            hashed_password=Hasher.get_password_hash(t_data["password"]),
            user_type=UserType.THERAPIST,
            verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        therapist = Therapist(
            id=user.id,
            full_name=t_data["full_name"],
            license_number=t_data["license_number"],
            specialization=t_data["specialization"],
            years_of_experience=t_data["years_of_experience"],
            office_address=t_data["office_address"],
            phone_number=t_data["phone_number"],
            profile_picture_url=t_data["profile_picture_url"],
            latitude=t_data["latitude"],
            longitude=t_data["longitude"]
        )
        db.add(therapist)
    
    db.commit()
    print("Seeded therapists.")

if __name__ == "__main__":
    seed()
    db.close()
