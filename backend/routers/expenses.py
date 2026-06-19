from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from database import get_db
from models import Expense
from schemas import ExpenseCreate, ExpenseResponse

router = APIRouter()

# ─── Add Expense ──────────────────────────────────────────
@router.post("/expenses", response_model=ExpenseResponse)
def add_expense(request: ExpenseCreate, db: Session = Depends(get_db)):

    # Create a new Expense record from the request data
    new_expense = Expense(
        date=request.date,
        category=request.category,
        source=request.source,
        savings=request.savings,
        amount=request.amount
    )

    db.add(new_expense)         # stage the insert
    db.commit()                 # save to SQLite
    db.refresh(new_expense)     # refresh to get auto-assigned id

    return new_expense

# ─── Get All Expenses ─────────────────────────────────────
@router.get("/expenses", response_model=List[ExpenseResponse])
def get_all_expenses(db: Session = Depends(get_db)):

    # Query all expense records
    # sorted by date descending (latest first)
    expenses = db.query(Expense)\
                 .order_by(desc(Expense.date))\
                 .all()

    return expenses

# ─── Delete Expense ───────────────────────────────────────
@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):

    # Find the expense record by id
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    # If not found, return 404
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)  # stage the delete
    db.commit()         # save to SQLite

    return { "message": "Expense deleted successfully" }