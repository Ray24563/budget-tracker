from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, extract
from typing import List
from database import get_db
from models import Expense, Income
from schemas import ExpenseCreate, ExpenseResponse

router = APIRouter()

@router.get("/expenses/monthly/{year}")
def get_monthly_expenses(year: int, db: Session = Depends(get_db)):

    # All 12 months template — ensures missing months show as 0
    monthly_data = {month: 0 for month in range(1, 13)}

    # Query expenses filtered by year
    expenses = db.query(Expense)\
                 .filter(extract("year", Expense.date) == year)\
                 .all()

    # Sum expenses per month
    for expense in expenses:
        month = expense.date.month
        monthly_data[month] += expense.amount

    # Format into a list recharts can read
    month_names = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return [
        {
            "month": month_names[month - 1],
            "total": round(monthly_data[month], 2)
        }
        for month in range(1, 13)
    ]


# ─── Add Expense ──────────────────────────────────────────
@router.post("/expenses", response_model=ExpenseResponse)
def add_expense(request: ExpenseCreate, db: Session = Depends(get_db)):

    # Step 1: Calculate current balance for the chosen savings
    income_records = db.query(Income)\
                       .filter(Income.savings == request.savings)\
                       .all()
    total_income = sum(record.amount for record in income_records)

    expense_records = db.query(Expense)\
                        .filter(Expense.savings == request.savings)\
                        .all()
    total_expenses = sum(record.amount for record in expense_records)

    current_balance = total_income - total_expenses

    # Step 2: Check if balance is sufficient
    if request.amount > current_balance:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient balance. Current balance for {request.savings} is ₱{current_balance:,.2f}"
        )

    # Step 3: Balance is sufficient — save the expense
    new_expense = Expense(
        date=request.date,
        category=request.category,
        source=request.source,
        savings=request.savings,
        amount=request.amount
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

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