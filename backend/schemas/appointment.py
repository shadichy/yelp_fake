from pydantic import BaseModel
import datetime
from .enums import AppointmentStatus

class AppointmentBase(BaseModel):
    start_time: datetime.datetime
    end_time: datetime.datetime

class AppointmentCreate(AppointmentBase):
    therapist_id: int

class AppointmentUpdate(BaseModel):
    status: AppointmentStatus

class Appointment(AppointmentBase):
    id: int
    patient_id: int
    therapist_id: int
    status: AppointmentStatus

    model_config = {"from_attributes": True}
