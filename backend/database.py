from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# This is the address of your database file
# Think of it like a file path to where your data lives
DATABASE_URL = "sqlite:///./budget_tracker.db"

# The engine is like a phone line to your database
# check_same_thread=False lets multiple requests use it safely
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# SessionLocal is like a notepad for each conversation with the DB
# autocommit=False means we manually decide when to save changes
# autoflush=False means we manually decide when to send pending changes
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base is the parent that all your table definitions will inherit from
Base = declarative_base()

# This function gives each request its own fresh notepad (session)
# and makes sure it gets closed when the request is done
def get_db():
    db = SessionLocal()
    try:
        yield db        # Give the session to whoever needs it
    finally:
        db.close()      # Always close it after, no matter what