from sqlalchemy.orm import Session
from .. import models
from ..schemas.appointment import AppointmentCreate, AppointmentUpdate
from ..schemas.enums import AppointmentStatus
from fastapi import HTTPException, status
from typing import List

class AppointmentViewModel:
    def __init__(self, db: Session):
        self.db = db

    def create_appointment(self, current_user: models.User, appointment: AppointmentCreate) -> models.Appointment:
        if current_user.user_type != "PATIENT":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only patients can create appointments.",
            )

        therapist = self.db.query(models.User).filter(models.User.id == appointment.therapist_id).first()
        if not therapist or therapist.user_type != "THERAPIST":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Therapist not found.",
            )

        # Check for availability
        availability = (
            self.db.query(models.Availability)
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
        self.db.add(db_appointment)
        self.db.commit()
        self.db.refresh(db_appointment)
        return db_appointment

    def get_appointments(self, current_user: models.User) -> List[models.Appointment]:
        if current_user.user_type == "PATIENT":
            appointments = self.db.query(models.Appointment).filter(models.Appointment.patient_id == current_user.id).all()
        elif current_user.user_type == "THERAPIST":
            appointments = self.db.query(models.Appointment).filter(models.Appointment.therapist_id == current_user.id).all()
        else:
            appointments = []
        return appointments

    def update_appointment_status(self, current_user: models.User, appointment_id: int, appointment_update: AppointmentUpdate) -> models.Appointment:
        db_appointment = self.db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()

        if not db_appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found.",
            )

        if current_user.user_type == "THERAPIST" and db_appointment.therapist_id == current_user.id:
            db_appointment.status = appointment_update.status
            self.db.commit()
            self.db.refresh(db_appointment)
            return db_appointment
        
        if current_user.user_type == "PATIENT" and db_appointment.patient_id == current_user.id:
            if appointment_update.status == "CANCELLED":
                db_appointment.status = appointment_update.status
                self.db.commit()
                self.db.refresh(db_appointment)
                return db_appointment

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this appointment.",
        )
