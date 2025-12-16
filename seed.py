from backend.database import SessionLocal, engine, Base
from backend.models.user import User
from backend.models.profile import Patient, Therapist
from backend.models.appointment import Appointment
from backend.models.review import Review
from backend.models.message import Message
from backend.models.availability import Availability
from backend.schemas.enums import UserType, AppointmentStatus
from backend.hashing import Hasher
import random
import datetime
import string
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../backend/.env')) # Load .env relative to this script

def random_string(length=10):
    return ''.join(random.choices(string.ascii_letters, k=length))

def random_phone():
    return f"09{random.randint(10000000, 99999999)}"

def random_hanoi_location():
    # Hanoi center approx: 21.0285, 105.8542
    lat = 21.0285 + random.uniform(-0.05, 0.05)
    lon = 105.8542 + random.uniform(-0.05, 0.05)
    return lat, lon

def seed_data():
    db = SessionLocal()
    try:
        # Create all tables if they don't exist
        Base.metadata.create_all(bind=engine)

        # Clear existing data before seeding (optional, but good for testing)
        # Or check if data exists and only add if missing.
        # For a /tests/seed, clearing is often desired.
        print("Clearing existing data...")
        db.query(Message).delete()
        db.query(Review).delete()
        db.query(Appointment).delete()
        db.query(Availability).delete()
        db.query(Patient).delete()
        db.query(Therapist).delete()
        db.query(User).delete()
        db.commit()
        print("Existing data cleared.")

        # 1. Create Therapists
        specializations = ["Anxiety", "Depression", "Family Therapy", "PTSD", "Cognitive Behavioral Therapy"]
        therapists = []
        
        for i in range(10):
            email = f"therapist{i}_{random_string(5)}@example.com"
            
            user = User(
                email=email,
                hashed_password=Hasher.get_password_hash("password123"),
                user_type=UserType.THERAPIST,
                verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            lat, lon = random_hanoi_location()
            
            therapist_profile = Therapist(
                id=user.id,
                full_name=f"Dr. {random_string(5).capitalize()} {random_string(5).capitalize()}",
                license_number=f"LIC-{random_string(8).upper()}",
                specialization=random.choice(specializations),
                years_of_experience=random.randint(1, 30),
                office_address=f"{random.randint(1, 999)} Hanoi Street, District {random.choice(['Ba Dinh', 'Hoan Kiem', 'Tay Ho'])}",
                phone_number=random_phone(),
                latitude=lat,
                longitude=lon,
                profile_picture_url=f"https://i.pravatar.cc/150?u={user.id}"
            )
            db.add(therapist_profile)
            therapists.append(user)
            
            # Add Availability
            today = datetime.date.today()
            for d in range(1, 8): # Next 7 days
                day = today + datetime.timedelta(days=d)
                # Create 2-3 slots for the day
                for _ in range(random.randint(2,3)):
                    start_hour = random.randint(9, 17) # Between 9 AM and 5 PM
                    start_minute = random.choice([0, 30])
                    start_time = datetime.datetime.combine(day, datetime.time(start_hour, start_minute))
                    end_time = start_time + datetime.timedelta(hours=1) # 1 hour duration
                    
                    avail = Availability(
                        therapist_id=user.id,
                        start_time=start_time,
                        end_time=end_time
                    )
                    db.add(avail)

        db.commit() # Commit all availabilities
        print(f"Seeded {len(therapists)} therapists.")

        # 2. Create Patients
        patients = []
        for i in range(10):
            email = f"patient{i}_{random_string(5)}@example.com"

            user = User(
                email=email,
                hashed_password=Hasher.get_password_hash("password123"),
                user_type=UserType.PATIENT,
                verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            patient_profile = Patient(
                id=user.id,
                full_name=f"{random_string(5).capitalize()} {random_string(5).capitalize()}",
                date_of_birth=datetime.date(random.randint(1970, 2000), random.randint(1, 12), random.randint(1, 28)),
                address="Hanoi, Vietnam",
                phone_number=random_phone(),
                profile_picture_url=f"https://i.pravatar.cc/150?u={user.id}"
            )
            db.add(patient_profile)
            patients.append(user)
        db.commit() # Commit all patients
        print(f"Seeded {len(patients)} patients.")

        # 3. Create Interactions (Appointments, Reviews, Messages)
        if therapists and patients:
            for _ in range(20):
                patient = random.choice(patients)
                therapist = random.choice(therapists)
                
                # Appointment
                start_time = datetime.datetime.now() + datetime.timedelta(days=random.randint(-10, 10))
                end_time = start_time + datetime.timedelta(hours=1)
                status = random.choice([s for s in AppointmentStatus])
                
                appt = Appointment(
                    patient_id=patient.id,
                    therapist_id=therapist.id,
                    start_time=start_time,
                    end_time=end_time,
                    status=status
                )
                db.add(appt)
                
                # Review (if completed)
                if status == AppointmentStatus.COMPLETED:
                    review = Review(
                        patient_id=patient.id,
                        therapist_id=therapist.id,
                        rating=random.randint(1, 5),
                        comment=f"Sample review comment {random_string(20)}",
                        created_at=datetime.datetime.now() - datetime.timedelta(days=random.randint(1, 30))
                    )
                    db.add(review)
                
                # Message
                msg_time = datetime.datetime.now() - datetime.timedelta(minutes=random.randint(1, 60))
                msg = Message(
                    sender_id=patient.id,
                    receiver_id=therapist.id,
                    content=f"Hello doctor, {random_string(10)}",
                    sent_at=msg_time
                )
                db.add(msg)
                
                msg_reply = Message(
                    sender_id=therapist.id,
                    receiver_id=patient.id,
                    content=f"Hi patient, {random_string(10)}",
                    sent_at=msg_time + datetime.timedelta(minutes=random.randint(1, 5))
                )
                db.add(msg_reply)

        db.commit()
        print("Seeded sample interactions (appointments, reviews, messages).")
    
    except Exception as e:
        db.rollback()
        print(f"An error occurred during seeding: {e}")
    finally:
        db.close()
    
    print("Database seeding complete.")

if __name__ == "__main__":
    seed_data()
