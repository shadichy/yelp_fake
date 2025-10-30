
from pydantic import BaseModel
import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    receiver_id: int

class Message(MessageBase):
    id: int
    sender_id: int
    receiver_id: int
    sent_at: datetime.datetime

    model_config = {"from_attributes": True}
