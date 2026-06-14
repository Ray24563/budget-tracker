from sqlalchemy import Column, Integer, String
from database import Base

# This class = one table in your database called "users"
class User(Base):
    __tablename__ = "users"

    # id → auto-assigned number for each row (1, 2, 3...)
    id = Column(Integer, primary_key=True, index=True)

    # hashed_password → the SCRAMBLED version of the password
    # NEVER store the real password here
    hashed_password = Column(String)