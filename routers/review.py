from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database
from ..models.user import User
from ..schemas.review import Review, ReviewCreate
from ..dependencies import get_current_user
from ..viewmodels.review_viewmodel import ReviewViewModel
from typing import List

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"],
)

def get_review_vm(db: Session = Depends(database.get_db)) -> ReviewViewModel:
    return ReviewViewModel(db)

@router.post("/", response_model=Review)
def create_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    vm: ReviewViewModel = Depends(get_review_vm)
):
    return vm.create_review(current_user, review)

@router.get("/{therapist_id}", response_model=List[Review])
def get_reviews(
    therapist_id: int, 
    vm: ReviewViewModel = Depends(get_review_vm)
):
    return vm.get_reviews(therapist_id)