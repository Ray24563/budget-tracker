from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

# Load the secret values from your .env file
load_dotenv()

# Tell passlib to use bcrypt for scrambling passwords
# bcrypt is deliberately slow — makes it hard for hackers to guess
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Read settings from .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

def hash_password(password: str) -> str:
    # Scrambles "mypassword" into "$2b$12$eImi..."
    # You can NEVER unscramble it back — that's the point
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Takes what the user typed and the scrambled version
    # Scrambles the input the same way and checks if they match
    # Returns True if match, False if not
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    # Set when this badge/token expires
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    # Create and sign the token using your SECRET_KEY
    # The signature makes it impossible to fake
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)