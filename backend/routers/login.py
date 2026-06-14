from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import LoginRequest, TokenResponse
from auth import verify_password, create_access_token

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):

    # Since there's no username, just grab the first (and only) row
    user = db.query(User).first()

    # Check if a user exists in the DB at all
    # Then verify the submitted password against the stored hash
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Password correct — issue the token
    # Since there's no username, we use a fixed subject label
    token = create_access_token(data={"sub": "owner"})

    return TokenResponse(
        access_token=token,
        token_type="bearer"
    )