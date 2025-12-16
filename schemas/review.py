import datetime
from pydantic import BaseModel

class ReviewBase(BaseModel):
    rating: int
    comment: str | None = None

class ReviewCreate(ReviewBase):
    therapist_id: int

class Review(ReviewBase):
    id: int
    patient_id: int
    therapist_id: int
    created_at: datetime.datetime

    model_config = {"from_attributes": True}
