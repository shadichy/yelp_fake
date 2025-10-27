from sqlalchemy import String, Enum, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from ..database import Base
import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .profile import Patient, Therapist
    from .verification_token import VerificationToken

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    user_type: Mapped[str] = mapped_column(Enum("PATIENT", "THERAPIST", "ADMIN", name="user_type_enum"), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    patient_profile: Mapped["Patient"] = relationship(back_populates="user", uselist=False)
    therapist_profile: Mapped["Therapist"] = relationship(back_populates="user", uselist=False)
    verification_tokens: Mapped[list["VerificationToken"]] = relationship(back_populates="user")
