import secrets
import datetime
from sqlalchemy.orm import Session
from . import models

def create_verification_token(db: Session, user_id: int) -> models.VerificationToken:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    db_token = models.VerificationToken(token=token, user_id=user_id, expires_at=expires_at)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def get_verification_token(db: Session, token: str) -> models.VerificationToken | None:
    return db.query(models.VerificationToken).filter(models.VerificationToken.token == token).first()

def use_verification_token(db: Session, db_token: models.VerificationToken) -> models.User:
    user = db_token.user
    user.verified = True
    db.delete(db_token)
    db.commit()
    db.refresh(user)
    return user
