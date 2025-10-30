import os
from sqlalchemy.exc import OperationalError
from .database import Base, engine
from .models import (
    appointment,
    availability,
    message,
    profile,
    relationships,
    review,
    user,
    verification_token,
)

LOCK_FILE = ".firstrun.lock"

def run_first_time_setup():
    if os.path.exists(LOCK_FILE):
        print("First-run setup already completed. Skipping.")
        return

    print("Running first-time setup...")
    try:
        # Create database tables
        Base.metadata.create_all(bind=engine)
        print("Database tables created.")

        # Create lock file
        with open(LOCK_FILE, "w") as f:
            f.write("First-run setup completed.")
        print("First-run lock file created.")

    except OperationalError as e:
        print(f"Database connection error during setup: {e}")
        print("Please ensure the database is running and accessible.")
    except Exception as e:
        print(f"An unexpected error occurred during first-run setup: {e}")

if __name__ == "__main__":
    run_first_time_setup()
