from sqlalchemy.orm import Session
from ..models import user as user_model
from ..schemas import user as user_schema
from ..hashing import Hasher
from .. import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm

class UserViewModel:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: user_schema.UserCreate) -> user_model.User:
        db_user = (
            self.db.query(user_model.User).filter(user_model.User.email == user.email).first()
        )
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = Hasher.get_password_hash(user.password)
        db_user = user_model.User(
            email=user.email, hashed_password=hashed_password, user_type=user.user_type
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def login(self, form_data: OAuth2PasswordRequestForm) -> dict[str, str]:
        user = (
            self.db.query(user_model.User)
            .filter(user_model.User.email == form_data.username)
            .first()
        )
        if not user or not Hasher.verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = jwt.create_access_token(
            data={"sub": user.email}, user_type=user.user_type, user_id=user.id
        )
        return {"access_token": access_token, "token_type": "bearer"}
