from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import user as user_model
from ..schemas import user as user_schema
from ..database import SessionLocal
from ..hashing import Hasher

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
