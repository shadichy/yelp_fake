from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import jwt
from ..database import SessionLocal
from ..models.user import User
from ..models.profile import Patient as PatientModel, Therapist as TherapistModel
from ..schemas.profile import PatientCreate, TherapistCreate, Patient, Therapist

router = APIRouter(
    prefix="/profile",
    tags=["profile"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

@router.get("/", response_model=Patient | Therapist)
def get_user_profile(current_user: User = Depends(get_current_user)):
    if current_user.user_type == "PATIENT":
        if not current_user.patient_profile:
            raise HTTPException(status_code=404, detail="Patient profile not found.")
        return current_user.patient_profile
    else:
        if not current_user.therapist_profile:
            raise HTTPException(status_code=404, detail="Therapist profile not found.")
        return current_user.therapist_profile
