from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, models
from ..schemas.appointment import Appointment, AppointmentCreate, AppointmentUpdate
from ..dependencies import get_current_user
from typing import List

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
)

@router.post("/", response_model=Appointment)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.user_type != "PATIENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can create appointments.",
        )

    therapist = db.query(models.User).filter(models.User.id == appointment.therapist_id).first()
    if not therapist or therapist.user_type != "THERAPIST":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Therapist not found.",
        )

    # Check for availability
    availability = (
        db.query(models.Availability)
        .filter(
            models.Availability.therapist_id == appointment.therapist_id,
            models.Availability.start_time <= appointment.start_time,
            models.Availability.end_time >= appointment.end_time,
        )
        .first()
    )

    if not availability:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The selected time slot is not available.",
        )

    db_appointment = models.Appointment(
        patient_id=current_user.id,
        therapist_id=appointment.therapist_id,
        start_time=appointment.start_time,
        end_time=appointment.end_time,
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.get("/", response_model=List[Appointment])
def get_appointments(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.user_type == "PATIENT":
        appointments = db.query(models.Appointment).filter(models.Appointment.patient_id == current_user.id).all()
    elif current_user.user_type == "THERAPIST":
        appointments = db.query(models.Appointment).filter(models.Appointment.therapist_id == current_user.id).all()
    else:
        appointments = []
    return appointments

@router.patch("/{appointment_id}", response_model=Appointment)
def update_appointment_status(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()

    if not db_appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    if current_user.user_type == "THERAPIST" and db_appointment.therapist_id == current_user.id:
        db_appointment.status = appointment_update.status
        db.commit()
        db.refresh(db_appointment)
        return db_appointment
    
    if current_user.user_type == "PATIENT" and db_appointment.patient_id == current_user.id:
        if appointment_update.status == "CANCELLED":
            db_appointment.status = appointment_update.status
            db.commit()
            db.refresh(db_appointment)
            return db_appointment

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to update this appointment.",
    )