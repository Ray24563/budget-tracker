from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

# This class = one table in your database called "users"
class User(Base):
    __tablename__ = "users"

    # id → auto-assigned number for each row (1, 2, 3...)
    id = Column(Integer, primary_key=True, index=True)

    # hashed_password → the SCRAMBLED version of the password
    # NEVER store the real password here
    hashed_password = Column(String)

# Income table
class Income(Base):
    __tablename__ = "income"

    id = Column(Integer, primary_key=True, index=True)

    # The date of the income
    date = Column(Date, nullable=False)

    # Where the money came from
    source = Column(String, nullable=False)

    # Which savings account it goes to
    # Options: Option1, Option2, Option3, Option4, Option5, Option6
    savings = Column(String, nullable=False)

    # How much
    amount = Column(Float, nullable=False)

# Expense table
class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    # The date of the expense
    date = Column(Date, nullable=False)

    # Category for analytics later
    # Transpo, Food & Drinks, Order, Electricity, Water, Gift, Others
    category = Column(String, nullable=False)

    # Description of the expense
    source = Column(String, nullable=False)

    # Which savings it deducts from
    savings = Column(String, nullable=False)

    # How much
    amount = Column(Float, nullable=False)