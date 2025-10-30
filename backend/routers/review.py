
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database
from ..models.user import User
from ..models.appointment import Appointment
from ..models.review import Review as ReviewModel
from ..schemas.review import Review, ReviewCreate
from ..dependencies import get_current_user
from typing import List

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"],
)

@router.post("/", response_model=Review)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.user_type != "PATIENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can write reviews.",
        )

    # Check if the patient had a completed appointment with the therapist
    completed_appointment = (
        db.query(Appointment)
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
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/{therapist_id}", response_model=List[Review])
def get_reviews(therapist_id: int, db: Session = Depends(database.get_db)):
    reviews = db.query(ReviewModel).filter(ReviewModel.therapist_id == therapist_id).all()
    return reviews
