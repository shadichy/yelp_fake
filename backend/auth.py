from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import jwt
from .database import get_db
from .models.user import User

def get_current_user(token: str = Depends(jwt.oauth2_scheme), db: Session = Depends(get_db)) -> User:
    token_data = jwt.verify_token(token)
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
