from pydantic import BaseModel, EmailStr, HttpUrl
import datetime
from typing import List, Optional

class PatientBase(BaseModel):
    full_name: str
    date_of_birth: Optional[datetime.date] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture_url: Optional[HttpUrl] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int

    class Config:
        from_attributes = True

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[datetime.date] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    profile_picture_url: Optional[HttpUrl] = None

class PatientDelete(BaseModel):
    message: str = "Patient profile deleted successfully"

class TherapistBase(BaseModel):
    full_name: str
    license_number: str
    specialization: Optional[List[str]] = None
    years_of_experience: Optional[int] = None
    office_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone_number: Optional[str] = None
    website: Optional[HttpUrl] = None
    availability: Optional[str] = None # Should be JSON
    profile_picture_url: Optional[HttpUrl] = None

class TherapistCreate(TherapistBase):
    pass

class Therapist(TherapistBase):
    id: int

    class Config:
        from_attributes = True

class TherapistUpdate(BaseModel):
    full_name: Optional[str] = None
    license_number: Optional[str] = None
    specialization: Optional[List[str]] = None
    years_of_experience: Optional[int] = None
    office_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone_number: Optional[str] = None
    website: Optional[HttpUrl] = None
    availability: Optional[str] = None # Should be JSON
    profile_picture_url: Optional[HttpUrl] = None

class TherapistDelete(BaseModel):
    message: str = "Therapist profile deleted successfully"