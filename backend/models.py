from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

# Credentials table
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    hashed_password = Column(String)

# Income table
class Income(Base):
    __tablename__ = "income"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    source = Column(String, nullable=False)
    savings = Column(String, nullable=False)
    amount = Column(Float, nullable=False)

# Expense table
class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    category = Column(String, nullable=False)
    source = Column(String, nullable=False)
    savings = Column(String, nullable=False)
    amount = Column(Float, nullable=False)

class Transfer(Base):
    __tablename__ = "transfers"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    from_savings = Column(String, nullable=False)
    to_savings = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)