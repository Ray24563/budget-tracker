from pydantic import BaseModel

# This is what the frontend SENDS to your backend when logging in
class LoginRequest(BaseModel):
    password: str   # Must be a string (plain text, only lives briefly)

# This is what your backend SENDS BACK after a successful login
class TokenResponse(BaseModel):
    access_token: str   # The JWT badge
    token_type: str     # Always "bearer" by convention