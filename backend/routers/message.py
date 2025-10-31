
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Dict

from .. import database
from ..models.user import User
from ..models.message import Message as MessageModel
from ..schemas.message import Message, MessageCreate
from ..dependencies import get_current_user
from ..schemas.profile import ProfileResponse

router = APIRouter(
    prefix="/messages",
    tags=["messages"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(database.get_db)):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            receiver_id = data['receiver_id']
            content = data['content']

            db_message = MessageModel(
                sender_id=user_id,
                receiver_id=receiver_id,
                content=content,
            )
            db.add(db_message)
            db.commit()
            db.refresh(db_message)

            await manager.send_personal_message(db_message.to_json(), receiver_id)
            await manager.send_personal_message(db_message.to_json(), user_id)

    except WebSocketDisconnect:
        manager.disconnect(user_id)

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

@router.get("/connected_users", response_model=List[ProfileResponse])
def get_connected_users(
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user),
):
    sent_to_users = db.query(MessageModel.receiver_id).filter(MessageModel.sender_id == current_user.id)
    received_from_users = db.query(MessageModel.sender_id).filter(MessageModel.receiver_id == current_user.id)

    connected_user_ids = {row[0] for row in sent_to_users.distinct()}.union({row[0] for row in received_from_users.distinct()})

    if not connected_user_ids:
        return []

    connected_users = db.query(User).filter(User.id.in_(connected_user_ids)).all()

    return connected_users

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
