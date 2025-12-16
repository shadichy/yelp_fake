from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .. import database, models
from ..schemas.availability import Availability, AvailabilityCreate
from ..dependencies import get_current_user
from ..viewmodels.availability_viewmodel import AvailabilityViewModel
from typing import List

router = APIRouter(
    prefix="/availability",
    tags=["availability"],
)

def get_availability_vm(db: Session = Depends(database.get_db)) -> AvailabilityViewModel:
    return AvailabilityViewModel(db)

@router.post("/", response_model=Availability)
def create_availability(
    availability: AvailabilityCreate,
    current_user: models.User = Depends(get_current_user),
    vm: AvailabilityViewModel = Depends(get_availability_vm)
):
    return vm.create_availability(current_user, availability)

@router.get("/", response_model=List[Availability])
def get_availability(
    therapist_id: int,
    vm: AvailabilityViewModel = Depends(get_availability_vm)
):
    return vm.get_availability(therapist_id)

@router.delete("/{availability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability(
    availability_id: int,
    current_user: models.User = Depends(get_current_user),
    vm: AvailabilityViewModel = Depends(get_availability_vm)
):
    vm.delete_availability(current_user, availability_id)
