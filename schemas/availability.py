from pydantic import BaseModel
import datetime

class AvailabilityBase(BaseModel):
    start_time: datetime.datetime
    end_time: datetime.datetime

class AvailabilityCreate(AvailabilityBase):
    pass

class Availability(AvailabilityBase):
    id: int
    therapist_id: int

    model_config = {"from_attributes": True}
