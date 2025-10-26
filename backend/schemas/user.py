from pydantic import BaseModel, EmailStr
from enum import Enum

class UserType(str, Enum):
    PATIENT = "PATIENT"
    THERAPIST = "THERAPIST"

class UserBase(BaseModel):
    email: EmailStr
    user_type: UserType

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True
