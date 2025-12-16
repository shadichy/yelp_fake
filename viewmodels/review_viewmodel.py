from sqlalchemy.orm import Session
from ..models.user import User
from ..models.appointment import Appointment
from ..models.review import Review as ReviewModel
from ..schemas.review import ReviewCreate
from fastapi import HTTPException, status
from typing import List

class ReviewViewModel:
    def __init__(self, db: Session):
        self.db = db

    def create_review(self, current_user: User, review: ReviewCreate) -> ReviewModel:
        if current_user.user_type != "PATIENT":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only patients can write reviews.",
            )

        # Check if the patient had a completed appointment with the therapist
        completed_appointment = (
            self.db.query(Appointment)
            .filter(
                Appointment.patient_id == current_user.id,
                Appointment.therapist_id == review.therapist_id,
                Appointment.status == "COMPLETED",
            )
            .first()
        )

        if not completed_appointment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only review therapists with whom you have had a completed appointment.",
            )

        db_review = ReviewModel(
            **review.model_dump(),
            patient_id=current_user.id,
        )
        self.db.add(db_review)
        self.db.commit()
        self.db.refresh(db_review)
        return db_review

    def get_reviews(self, therapist_id: int) -> List[ReviewModel]:
        reviews = self.db.query(ReviewModel).filter(ReviewModel.therapist_id == therapist_id).all()
        return reviews
