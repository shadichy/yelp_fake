from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate
from ..schemas.enums import UserType
from ..hashing import Hasher
from fastapi import HTTPException, status

class SetupViewModel:
    def __init__(self, db: Session):
        self.db = db

    def check_is_initialized(self) -> bool:
        # Check if any ADMIN user exists
        admin = self.db.query(User).filter(User.user_type == UserType.ADMIN).first()
        return admin is not None

    def setup_admin(self, user: UserCreate) -> User:
        if self.check_is_initialized():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="System is already initialized.",
            )
        
        # Ensure the request is trying to create an admin? 
        # Or force it to be admin regardless of input?
        # The UserCreate schema has user_type. 
        # We should enforce ADMIN here.
        
        hashed_password = Hasher.get_password_hash(user.password)
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            user_type=UserType.ADMIN,
            verified=True # Admin is verified by default
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
