from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..schemas import user as user_schema
from ..database import get_db
from .. import jwt
from ..viewmodels.user_viewmodel import UserViewModel

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

def get_user_vm(db: Session = Depends(get_db)) -> UserViewModel:
    return UserViewModel(db)

@router.post("/", response_model=user_schema.User)
def create_user(
    user: user_schema.UserCreate, 
    vm: UserViewModel = Depends(get_user_vm)
) -> user_schema.User:
    return vm.create_user(user)

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    vm: UserViewModel = Depends(get_user_vm)
) -> dict[str, str]:
    return vm.login(form_data)

@router.get("/me", response_model=user_schema.User)
def read_users_me(
    current_user: user_schema.User = Depends(jwt.get_current_user),
) -> user_schema.User:
    return current_user