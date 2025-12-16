from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base
import datetime
from .user import User

class Patient(Base):
    __tablename__ = 'patients'

    id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    date_of_birth: Mapped[datetime.date] = mapped_column(Date, nullable=True)
    address: Mapped[str] = mapped_column(String, nullable=True)
    phone_number: Mapped[str] = mapped_column(String, nullable=True)
    profile_picture_url: Mapped[str] = mapped_column(String, nullable=True)



class Therapist(Base):
    __tablename__ = 'therapists'

    id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    license_number: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    specialization: Mapped[str] = mapped_column(String, nullable=True) # Should be a list, will handle in schema
    years_of_experience: Mapped[int] = mapped_column(Integer, nullable=True)
    office_address: Mapped[str] = mapped_column(String, nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    phone_number: Mapped[str] = mapped_column(String, nullable=True)
    website: Mapped[str] = mapped_column(String, nullable=True)
    availability: Mapped[str] = mapped_column(String, nullable=True) # Should be JSON, will handle in schema
    profile_picture_url: Mapped[str] = mapped_column(String, nullable=True)


