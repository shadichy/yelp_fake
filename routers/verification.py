from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database
from ..schemas.user import User
from ..viewmodels.verification_viewmodel import VerificationViewModel
from pydantic import EmailStr

router = APIRouter(
    prefix="/verification",
    tags=["verification"],
)

def get_verification_vm(db: Session = Depends(database.get_db)) -> VerificationViewModel:
    return VerificationViewModel(db)

@router.post("/request-verification-token")
async def request_verification_token(
    email: EmailStr, 
    vm: VerificationViewModel = Depends(get_verification_vm)
):
    return await vm.request_verification_token(email)


@router.get("/verify-email", response_model=User)
def verify_email(
    token: str, 
    vm: VerificationViewModel = Depends(get_verification_vm)
):
    return vm.verify_email(token)