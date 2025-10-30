from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, models
from ..schemas.availability import Availability, AvailabilityCreate
from ..dependencies import get_current_user
from typing import List

router = APIRouter(
    prefix="/availability",
    tags=["availability"],
)

@router.post("/", response_model=Availability)
def create_availability(
    availability: AvailabilityCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.user_type != "THERAPIST":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only therapists can add availability.",
        )
    
    db_availability = models.Availability(
        **availability.model_dump(),
        therapist_id=current_user.id
    )
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    return db_availability

@router.get("/", response_model=List[Availability])
def get_availability(
    therapist_id: int,
    db: Session = Depends(database.get_db),
):
    availability = db.query(models.Availability).filter(models.Availability.therapist_id == therapist_id).all()
    return availability

@router.delete("/{availability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability(
    availability_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_availability = db.query(models.Availability).filter(models.Availability.id == availability_id).first()

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

    db.delete(db_availability)
    db.commit()