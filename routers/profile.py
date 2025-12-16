from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from .. import jwt
from ..database import get_db
from ..models.user import User
from ..models.profile import Patient as PatientModel, Therapist as TherapistModel
from ..schemas.profile import PatientCreate, TherapistCreate, Patient, Therapist, PatientUpdate, TherapistUpdate, PatientDelete, TherapistDelete
from ..viewmodels.profile_viewmodel import ProfileViewModel
from typing import List

router = APIRouter(
    prefix="/profile",
    tags=["profile"],
)

def get_profile_vm(db: Session = Depends(get_db)) -> ProfileViewModel:
    return ProfileViewModel(db)

@router.post("/therapist/picture")
def upload_therapist_picture(
    file: UploadFile = File(...), 
    current_user: User = Depends(jwt.get_current_user),
    vm: ProfileViewModel = Depends(get_profile_vm)
):
    return vm.upload_therapist_picture(current_user, file)

@router.get("/therapists/search", response_model=List[Therapist])
def search_therapists(
    specialization: str | None = None, 
    lat: float | None = None, 
    lon: float | None = None, 
    radius: float | None = None, 
    location: str | None = None,
    page: int = 1, 
    limit: int = 10, 
    vm: ProfileViewModel = Depends(get_profile_vm)
) -> List[TherapistModel]:
    return vm.search_therapists(specialization, lat, lon, radius, location, page, limit)

@router.post("/patient", response_model=Patient)
def create_patient_profile(
    profile: PatientCreate, 
    current_user: User = Depends(jwt.get_current_user),
    vm: ProfileViewModel = Depends(get_profile_vm)
) -> PatientModel:
    return vm.create_patient_profile(current_user, profile)

@router.put("/patient", response_model=Patient)
def update_patient_profile(
    profile_update: PatientUpdate, 
    current_user: User = Depends(jwt.get_current_user),
    vm: ProfileViewModel = Depends(get_profile_vm)
) -> PatientModel:
    return vm.update_patient_profile(current_user, profile_update)

@router.delete("/patient", response_model=PatientDelete)
def delete_patient_profile(
    current_user: User = Depends(jwt.get_current_user),
    vm: ProfileViewModel = Depends(get_profile_vm)
) -> PatientDelete:
    return vm.delete_patient_profile(current_user)

@router.post("/therapist", response_model=Therapist)
def create_therapist_profile(
    profile: TherapistCreate, 
    current_user: User = Depends(jwt.get_current_user),
    vm: ProfileViewModel = Depends(get_profile_vm)
) -> TherapistModel:
    return vm.create_therapist_profile(current_user, profile)

@router.put("/therapist", response_model=Therapist)
def update_therapist_profile(
    profile_update: TherapistUpdate, 
    current_user: User = Depends(jwt.get_current_user),
    vm: ProfileViewModel = Depends(get_profile_vm)
) -> TherapistModel:
    return vm.update_therapist_profile(current_user, profile_update)

@router.delete("/therapist", response_model=TherapistDelete)
def delete_therapist_profile(
    current_user: User = Depends(jwt.get_current_user),
    vm: ProfileViewModel = Depends(get_profile_vm)
) -> TherapistDelete:
    return vm.delete_therapist_profile(current_user)

@router.get("/therapist/{therapist_id}", response_model=Therapist)
def get_therapist_profile_by_id(
    therapist_id: int, 
    vm: ProfileViewModel = Depends(get_profile_vm)
) -> TherapistModel:
    return vm.get_therapist_profile_by_id(therapist_id)

@router.get("/me", response_model=Patient | Therapist | None)
def get_my_profile(
    current_user: User = Depends(jwt.get_current_user),
    vm: ProfileViewModel = Depends(get_profile_vm)
):
    return vm.get_my_profile(current_user)
