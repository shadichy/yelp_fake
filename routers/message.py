from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Query, status
from sqlalchemy.orm import Session
from .. import database, jwt
from ..models.user import User
from ..schemas.message import Message, MessageCreate
from ..schemas import user as user_schema
from ..dependencies import get_current_user
from ..schemas.profile import ProfileResponse # Keeping the import for now, in case other parts of the code still rely on it for imports.
from ..viewmodels.message_viewmodel import MessageViewModel, manager
from typing import List

router = APIRouter(
    prefix="/messages",
    tags=["messages"],
)

def get_message_vm(db: Session = Depends(database.get_db)) -> MessageViewModel:
    return MessageViewModel(db)

async def get_user_from_token(token: str, db: Session) -> User:
    try:
        token_data = jwt.verify_token(token)
        user = db.query(User).filter(User.email == token_data.email).first()
        if user is None:
            raise WebSocketDisconnect(code=status.WS_1008_POLICY_VIOLATION)
        return user
    except Exception:
        raise WebSocketDisconnect(code=status.WS_1008_POLICY_VIOLATION)

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, 
    token: str = Query(...), 
    db: Session = Depends(database.get_db)
):
    # VM is created manually here because Depends doesn't work well inside websocket endpoint args for per-message logic?
    # Actually Depends works for the initial connection.
    # But we need the vm for the loop.
    vm = MessageViewModel(db)
    user = await get_user_from_token(token, db)
    await manager.connect(user.id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            receiver_id = data['receiver_id']
            content = data['content']

            await vm.save_and_send_message(user.id, receiver_id, content)

    except WebSocketDisconnect:
        manager.disconnect(user.id, websocket)

@router.post("/", response_model=Message)
def send_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    vm: MessageViewModel = Depends(get_message_vm)
):
    return vm.send_message(current_user, message)

# Changed response_model for /connected_users to List[user_schema.User]
@router.get("/connected_users", response_model=List[user_schema.User])
def get_connected_users(
    current_user: User = Depends(get_current_user),
    vm: MessageViewModel = Depends(get_message_vm)
):
    return vm.get_connected_users(current_user)

@router.get("/{user_id}", response_model=List[Message])
def get_messages(
    user_id: int,
    current_user: User = Depends(get_current_user),
    vm: MessageViewModel = Depends(get_message_vm)
):
    return vm.get_messages(current_user, user_id)