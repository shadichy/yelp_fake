from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship, Mapped, mapped_column
from ..database import Base
from ..schemas.enums import AppointmentStatus
import datetime

class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    therapist_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    start_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[AppointmentStatus] = mapped_column(SQLAlchemyEnum(AppointmentStatus), nullable=False, default=AppointmentStatus.PENDING)

