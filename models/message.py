
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from ..database import Base
import datetime
import json

class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    sender_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    receiver_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    sent_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def to_json(self):
        sent_at_aware = self.sent_at
        if sent_at_aware.tzinfo is None:
            sent_at_aware = sent_at_aware.replace(tzinfo=datetime.timezone.utc)
            
        return json.dumps({
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "content": self.content,
            "sent_at": sent_at_aware.isoformat(),
        })
