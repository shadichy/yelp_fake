from fastapi_admin.app import app as admin_app
from fastapi_admin.resources import Model
from fastapi_admin.authentication import Authentication
from starlette.requests import Request
from starlette.responses import RedirectResponse
from .database import SessionLocal
from .models.user import User
from .models.profile import Patient, Therapist
from .models.verification_token import VerificationToken
from .hashing import Hasher
from . import jwt

class AdminAuth(Authentication):
    async def login(self, request: Request, credentials: dict) -> bool:
        db = SessionLocal()
        user = db.query(User).filter(User.email == credentials["username"]).first()
        db.close()

        if user and user.user_type == "ADMIN" and Hasher.verify_password(credentials["password"], user.hashed_password):
            access_token = jwt.create_access_token(data={"sub": user.email})
            request.session["token"] = access_token
            return True
        return False

    async def logout(self, request: Request):
        request.session.clear()

    async def is_authenticated(self, request: Request) -> bool:
        return "token" in request.session

@admin_app.register
class UserAdmin(Model):
    resource = User
    label = "User"
    icon = "fas fa-user"
    fields = [
        "id",
        "email",
        "verified",
        "user_type",
        "created_at",
    ]

@admin_app.register
class PatientAdmin(Model):
    resource = Patient
    label = "Patient"
    icon = "fas fa-user-injured"
    fields = [
        "id",
        "full_name",
        "date_of_birth",
        "address",
        "phone_number",
    ]

@admin_app.register
class TherapistAdmin(Model):
    resource = Therapist
    label = "Therapist"
    icon = "fas fa-user-md"
    fields = [
        "id",
        "full_name",
        "license_number",
        "specialization",
        "years_of_experience",
        "office_address",
        "phone_number",
        "website",
    ]

@admin_app.register
class VerificationTokenAdmin(Model):
    resource = VerificationToken
    label = "Verification Token"
    icon = "fas fa-key"
    fields = [
        "id",
        "token",
        "user_id",
        "expires_at",
        "created_at",
    ]