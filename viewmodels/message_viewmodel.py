from fastapi import WebSocket, status, HTTPException, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Dict, List
from ..models.user import User
from ..models.message import Message as MessageModel
from ..schemas.message import MessageCreate
from ..schemas.profile import ProfileResponse

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"DEBUG: User {user_id} connected. Active connections: {list(self.active_connections.keys())}")

    def disconnect(self, user_id: int, websocket: WebSocket):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        print(f"DEBUG: User {user_id} disconnected. Active connections: {list(self.active_connections.keys())}")

    async def send_personal_message(self, message: str, user_id: int):
        print(f"DEBUG: Sending message to user {user_id}")
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message)
                except Exception as e:
                    print(f"Error sending message to user {user_id}: {e}")
        else:
            print(f"DEBUG: User {user_id} is not connected.")

manager = ConnectionManager()

import datetime

class MessageViewModel:
    def __init__(self, db: Session):
        self.db = db

    def send_message(self, current_user: User, message: MessageCreate) -> MessageModel:
        receiver = self.db.query(User).filter(User.id == message.receiver_id).first()
        if not receiver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receiver not found.",
            )

        db_message = MessageModel(
            sender_id=current_user.id,
            receiver_id=message.receiver_id,
            content=message.content,
            sent_at=datetime.datetime.now(datetime.timezone.utc)
        )
        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)
        
        # We could broadcast here too if we wanted POST requests to update websockets
        return db_message

    def get_connected_users(self, current_user: User) -> List[User]:
        sent_to_users = self.db.query(MessageModel.receiver_id).filter(MessageModel.sender_id == current_user.id)
        received_from_users = self.db.query(MessageModel.sender_id).filter(MessageModel.receiver_id == current_user.id)

        connected_user_ids = {row[0] for row in sent_to_users.distinct()}.union({row[0] for row in received_from_users.distinct()})

        if not connected_user_ids:
            return []

        connected_users = self.db.query(User).filter(User.id.in_(connected_user_ids)).all()
        return connected_users

    def get_messages(self, current_user: User, user_id: int) -> List[MessageModel]:
        messages = (
            self.db.query(MessageModel)
            .filter(
                or_(
                    and_(MessageModel.sender_id == current_user.id, MessageModel.receiver_id == user_id),
                    and_(MessageModel.sender_id == user_id, MessageModel.receiver_id == current_user.id),
                )
            )
            .order_by(MessageModel.sent_at.asc())
            .all()
        )
        
        # Ensure timestamps are timezone aware (UTC) for Pydantic serialization
        for msg in messages:
            if msg.sent_at and msg.sent_at.tzinfo is None:
                msg.sent_at = msg.sent_at.replace(tzinfo=datetime.timezone.utc)
                
        return messages

    async def save_and_send_message(self, sender_id: int, receiver_id: int, content: str):
        db_message = MessageModel(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
            sent_at=datetime.datetime.now(datetime.timezone.utc)
        )
        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)

        # Broadcast using the global manager
        msg_json = None
        if hasattr(db_message, 'to_json'):
             msg_json = db_message.to_json()
        
        if msg_json:
            await manager.send_personal_message(msg_json, receiver_id)
            if sender_id != receiver_id:
                await manager.send_personal_message(msg_json, sender_id)
