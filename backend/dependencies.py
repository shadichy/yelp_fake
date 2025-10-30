from fastapi import Depends, HTTPException, status
from .jwt import get_current_user
from .models.user import User
from .schemas.enums import UserType

def get_current_therapist(current_user: User = Depends(get_current_user)) -> User:
    if current_user.user_type != UserType.THERAPIST:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user is not a therapist"
        )
    return current_user

def get_current_patient(current_user: User = Depends(get_current_user)) -> User:
    if current_user.user_type != UserType.PATIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user is not a patient"
        )
    return current_user
