from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, models
from ..schemas.appointment import Appointment, AppointmentCreate, AppointmentUpdate
from ..dependencies import get_current_user
from ..viewmodels.appointment_viewmodel import AppointmentViewModel
from typing import List

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
)

def get_appointment_vm(db: Session = Depends(database.get_db)) -> AppointmentViewModel:
    return AppointmentViewModel(db)

@router.post("/", response_model=Appointment)
def create_appointment(
    appointment: AppointmentCreate,
    current_user: models.User = Depends(get_current_user),
    vm: AppointmentViewModel = Depends(get_appointment_vm),
):
    return vm.create_appointment(current_user, appointment)

@router.get("/", response_model=List[Appointment])
def get_appointments(
    current_user: models.User = Depends(get_current_user), 
    vm: AppointmentViewModel = Depends(get_appointment_vm)
):
    return vm.get_appointments(current_user)

@router.patch("/{appointment_id}", response_model=Appointment)
def update_appointment_status(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    current_user: models.User = Depends(get_current_user),
    vm: AppointmentViewModel = Depends(get_appointment_vm)
):
    return vm.update_appointment_status(current_user, appointment_id, appointment_update)
