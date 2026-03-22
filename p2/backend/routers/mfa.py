from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from utils.mfa import generate_mfa_setup, verify_mfa_code

router = APIRouter()


def get_user_by_firebase_uid_or_id(user_id: str, db: Session) -> User:
    """Resolve a user by Firebase UID (google_id), email, or integer DB id."""
    # Try integer DB id first
    if user_id.isdigit():
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user:
            return user

    # Try Firebase UID stored as google_id
    user = db.query(User).filter(User.google_id == user_id).first()
    if user:
        return user

    # Try email
    user = db.query(User).filter(User.email == user_id).first()
    if user:
        return user

    raise HTTPException(status_code=404, detail="User not found")


@router.post("/mfa/setup")
def setup_mfa(user_id: str, db: Session = Depends(get_db)):
    user = get_user_by_firebase_uid_or_id(user_id, db)

    mfa_data = generate_mfa_setup(user.email)
    user.mfa_secret = mfa_data["secret"]
    db.commit()

    return {
        "message": "Scan this QR with Google Authenticator",
        "qr_code": mfa_data["qr_code"],
        "secret": mfa_data["secret"]
    }


@router.post("/mfa/verify")
def verify_mfa(user_id: str, token: str, db: Session = Depends(get_db)):
    user = get_user_by_firebase_uid_or_id(user_id, db)

    if not user.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA not setup")

    if not verify_mfa_code(user.mfa_secret, token):
        raise HTTPException(status_code=401, detail="Invalid token")

    user.mfa_enabled = True
    db.commit()

    return {"message": "MFA enabled successfully"}


@router.post("/mfa/disable")
def disable_mfa(user_id: str, token: str, db: Session = Depends(get_db)):
    user = get_user_by_firebase_uid_or_id(user_id, db)

    if not user.mfa_enabled:
        raise HTTPException(status_code=400, detail="MFA is not enabled")

    if not verify_mfa_code(user.mfa_secret, token):
        raise HTTPException(status_code=401, detail="Invalid token")

    user.mfa_enabled = False
    user.mfa_secret = None
    db.commit()

    return {"message": "MFA disabled successfully"}
