from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from database import get_db
from models import Income
from schemas import IncomeCreate, IncomeResponse
import pytz
from datetime import datetime

PHT = pytz.timezone("Asia/Manila")

router = APIRouter()

# ─── Add Income ──────────────────────────────────────────
@router.post("/income", response_model=IncomeResponse)
def add_income(request: IncomeCreate, db: Session = Depends(get_db)):

    # Create a new Income record from the request data
    new_income = Income(
        date=request.date,
        time=datetime.now(PHT).time(),
        source=request.source,
        savings=request.savings,
        amount=request.amount
    )

    db.add(new_income)      # stage the insert
    db.commit()             # save to SQLite
    db.refresh(new_income)  # refresh to get the auto-assigned id

    return new_income

# ─── Get All Income ───────────────────────────────────────
@router.get("/income", response_model=List[IncomeResponse])
def get_all_income(db: Session = Depends(get_db)):

    # Query all income records
    # sorted by date descending (latest first)
    income = db.query(Income)\
               .order_by(desc(Income.date))\
               .all()

    return income

# ─── Delete Income ────────────────────────────────────────
@router.delete("/income/{income_id}")
def delete_income(income_id: int, db: Session = Depends(get_db)):

    # Find the income record by id
    income = db.query(Income).filter(Income.id == income_id).first()

    # If not found, return 404
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")

    db.delete(income)   # stage the delete
    db.commit()         # save to SQLite

    return { "message": "Income deleted successfully" }

@router.get("/income/presets")
def get_income_presets(db: Session = Depends(get_db)):

    # Get all income records
    income_records = db.query(Income).all()

    # Count frequency of each combination
    frequency = {}
    for record in income_records:
        key = (record.source, record.savings, record.amount)
        frequency[key] = frequency.get(key, 0) + 1

    # Sort by most frequent and take top 5
    sorted_presets = sorted(
        frequency.items(),
        key=lambda x: x[1],
        reverse=True
    )[:5]

    # Format response
    return [
        {
            "source": preset[0][0],
            "savings": preset[0][1],
            "amount": preset[0][2],
            "count": preset[1]
        }
        for preset in sorted_presets
    ]

@router.get("/income/salary")
def get_salary_income(db: Session = Depends(get_db)):
    salary_records = db.query(Income)\
                       .filter(Income.source == "Salary")\
                       .order_by(desc(Income.date))\
                       .all()
    return salary_records