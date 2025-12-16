from sqlalchemy.orm import Session
from .. import models
from ..schemas.availability import AvailabilityCreate
from fastapi import HTTPException, status
from typing import List

class AvailabilityViewModel:
    def __init__(self, db: Session):
        self.db = db

    def create_availability(self, current_user: models.User, availability: AvailabilityCreate) -> models.Availability:
        if current_user.user_type != "THERAPIST":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only therapists can add availability.",
            )
        
        db_availability = models.Availability(
            **availability.model_dump(),
            therapist_id=current_user.id
        )
        self.db.add(db_availability)
        self.db.commit()
        self.db.refresh(db_availability)
        return db_availability

    def get_availability(self, therapist_id: int) -> List[models.Availability]:
        availability = self.db.query(models.Availability).filter(models.Availability.therapist_id == therapist_id).all()
        return availability

    def delete_availability(self, current_user: models.User, availability_id: int):
        db_availability = self.db.query(models.Availability).filter(models.Availability.id == availability_id).first()

        if not db_availability:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Availability not found.",
            )

        if db_availability.therapist_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own availability.",
            )

        self.db.delete(db_availability)
        self.db.commit()
