from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..models import user as user_model
from ..schemas import user as user_schema
from ..database import get_db
from ..hashing import Hasher
from .. import jwt

router = APIRouter(
    prefix="/users",
    tags=["users"],
)



@router.post("/", response_model=user_schema.User)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = Hasher.get_password_hash(user.password)
    db_user = user_model.User(email=user.email, hashed_password=hashed_password, user_type=user.user_type)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.email == form_data.username).first()
    if not user or not Hasher.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = jwt.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}