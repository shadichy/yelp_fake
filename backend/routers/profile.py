from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import jwt
from ..database import get_db
from ..models.user import User
from ..models.profile import Patient as PatientModel, Therapist as TherapistModel
from ..schemas.profile import PatientCreate, TherapistCreate, Patient, Therapist, PatientUpdate, TherapistUpdate, PatientDelete, TherapistDelete, ProfileResponse

router = APIRouter(
    prefix="/profile",
    tags=["profile"],
)


def get_current_user(token: str = Depends(jwt.oauth2_scheme), db: Session = Depends(get_db)) -> User:
    token_data = jwt.verify_token(token)
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

@router.post("/patient", response_model=Patient)
def create_patient_profile(profile: PatientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.user_type != "PATIENT":
        raise HTTPException(status_code=403, detail="Only patients can create patient profiles.")
    if current_user.patient_profile:
        raise HTTPException(status_code=400, detail="Patient profile already exists.")
    
    db_profile = PatientModel(**profile.model_dump(), id=current_user.id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.put("/patient", response_model=Patient)
def update_patient_profile(profile_update: PatientUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.user_type != "PATIENT":
        raise HTTPException(status_code=403, detail="Only patients can update patient profiles.")
    
    db_profile = current_user.patient_profile
    if not db_profile:
        raise HTTPException(status_code=404, detail="Patient profile not found.")

    update_data = profile_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_profile, key, value)
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.delete("/patient", response_model=PatientDelete)
def delete_patient_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.user_type != "PATIENT":
        raise HTTPException(status_code=403, detail="Only patients can delete patient profiles.")
    
    db_profile = current_user.patient_profile
    if not db_profile:
        raise HTTPException(status_code=404, detail="Patient profile not found.")

    db.delete(db_profile)
    db.commit()
    return PatientDelete()

@router.post("/therapist", response_model=Therapist)
def create_therapist_profile(profile: TherapistCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.user_type != "THERAPIST":
        raise HTTPException(status_code=403, detail="Only therapists can create therapist profiles.")
    if current_user.therapist_profile:
        raise HTTPException(status_code=400, detail="Therapist profile already exists.")

    db_profile = TherapistModel(**profile.model_dump(), id=current_user.id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.put("/therapist", response_model=Therapist)
def update_therapist_profile(profile_update: TherapistUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.user_.user_type != "THERAPIST":
        raise HTTPException(status_code=403, detail="Only therapists can update therapist profiles.")
    
    db_profile = current_user.therapist_profile
    if not db_profile:
        raise HTTPException(status_code=404, detail="Therapist profile not found.")

    update_data = profile_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_profile, key, value)
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.delete("/therapist", response_model=TherapistDelete)
def delete_therapist_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.user_type != "THERAPIST":
        raise HTTPException(status_code=403, detail="Only therapists can delete therapist profiles.")
    
    db_profile = current_user.therapist_profile
    if not db_profile:
        raise HTTPException(status_code=404, detail="Therapist profile not found.")

    db.delete(db_profile)
    db.commit()
    return TherapistDelete()

@router.get("/", response_model=ProfileResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    if current_user.user_type == "PATIENT":
        return {"user_type": "PATIENT", "profile": current_user.patient_profile}
    else:
        return {"user_type": "THERAPIST", "profile": current_user.therapist_profile}