from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..viewmodels.setup_viewmodel import SetupViewModel
from ..schemas.user import User, UserCreate
from pydantic import BaseModel

router = APIRouter(
    prefix="/setup",
    tags=["setup"],
)

class SetupStatus(BaseModel):
    initialized: bool

def get_setup_vm(db: Session = Depends(get_db)) -> SetupViewModel:
    return SetupViewModel(db)

@router.get("/status", response_model=SetupStatus)
def get_setup_status(vm: SetupViewModel = Depends(get_setup_vm)):
    return SetupStatus(initialized=vm.check_is_initialized())

@router.post("/", response_model=User)
def create_first_admin(
    user: UserCreate, 
    vm: SetupViewModel = Depends(get_setup_vm)
):
    # We might want to force user_type to ADMIN in the VM, 
    # but the schema requires it. The VM overrides it anyway.
    return vm.setup_admin(user)
