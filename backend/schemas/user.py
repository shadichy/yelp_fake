from pydantic import BaseModel, EmailStr
from .enums import UserType

class UserBase(BaseModel):
    email: EmailStr
    user_type: UserType

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    model_config = {"from_attributes": True}
