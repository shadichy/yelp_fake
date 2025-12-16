from sqlalchemy.orm import Session
from .. import models, verification
from ..schemas.user import User
from fastapi import HTTPException, status
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr
import datetime
import os
from typing import Optional

class VerificationViewModel:
    def __init__(self, db: Session):
        self.db = db
        # Initialize mail config - in a real app, you might want to wrap this to handle missing config gracefully
        # For now, we rely on the .env values being present or defaults
        self.conf = ConnectionConfig(
            MAIL_USERNAME=os.getenv("MAIL_USERNAME", "dummy"),
            MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "dummy"),
            MAIL_FROM=os.getenv("MAIL_FROM", "dummy@example.com"),
            MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
            MAIL_SERVER=os.getenv("MAIL_SERVER", "localhost"),
            MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() == "true",
            MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
            USE_CREDENTIALS=os.getenv("USE_CREDENTIALS", "True").lower() == "true",
            VALIDATE_CERTS=os.getenv("VALIDATE_CERTS", "True").lower() == "true"
        )

    async def request_verification_token(self, email: EmailStr) -> dict:
        user = self.db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )
        if user.verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already verified.",
            )

        token = verification.create_verification_token(self.db, user.id)
        
        message = MessageSchema(
            subject="Email Verification",
            recipients=[email],
            body=f"Click the link to verify your email: http://localhost:8000/verification/verify-email?token={token.token}",
            subtype=MessageType.html
        )

        fm = FastMail(self.conf)
        # Suppress sending in dev/test if credentials are dummy, or just let it fail/log
        if os.getenv("MAIL_SERVER") != "smtp.example.com":
             await fm.send_message(message)
        else:
             print(f"Mock email sent to {email}: {message.body}")

        return {"message": "Verification email sent."}

    def verify_email(self, token: str) -> User:
        db_token = verification.get_verification_token(self.db, token)
        # Fix datetime comparison for timezone awareness if needed, assuming stored UTC
        # If db_token.expires_at is naive, ensure we compare correctly. 
        # Assuming database.py sets it or models handle it. 
        # Here we use timezone.utc to match likely aware objects or naive conversion needs.
        
        # Simple check handling both aware and naive if needed, but usually models use datetime.datetime.utcnow() (naive) or now(utc) (aware)
        # Let's assume standard aware comparison
        now = datetime.datetime.now(datetime.timezone.utc)
        
        if db_token.expires_at.tzinfo is None:
             # If DB returns naive, make it aware assuming it was stored as UTC
             db_token.expires_at = db_token.expires_at.replace(tzinfo=datetime.timezone.utc)

        if not db_token or db_token.expires_at < now:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired token.",
            )
        
        user = verification.use_verification_token(self.db, db_token)
        return user
