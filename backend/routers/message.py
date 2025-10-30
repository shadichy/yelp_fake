
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from .. import database
from ..models.user import User
from ..models.message import Message as MessageModel
from ..schemas.message import Message, MessageCreate
from ..dependencies import get_current_user
from typing import List

router = APIRouter(
    prefix="/messages",
    tags=["messages"],
)

@router.post("/", response_model=Message)
def send_message(
    message: MessageCreate,
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user),
):
    receiver = db.query(User).filter(User.id == message.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found.",
        )

    db_message = MessageModel(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        content=message.content,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/{user_id}", response_model=List[Message])
def get_messages(
    user_id: int,
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user),
):
    messages = (
        db.query(MessageModel)
        .filter(
            or_(
                (MessageModel.sender_id == current_user.id and MessageModel.receiver_id == user_id),
                (MessageModel.sender_id == user_id and MessageModel.receiver_id == current_user.id),
            )
        )
        .order_by(MessageModel.sent_at.asc())
        .all()
    )
    return messages
