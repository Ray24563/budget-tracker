from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, extract
from typing import List
from database import get_db
from models import Expense, Income, Transfer
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


@router.post("/expenses", response_model=ExpenseResponse)
def add_expense(request: ExpenseCreate, db: Session = Depends(get_db)):

    # Total income for this savings
    income_records = db.query(Income)\
                       .filter(Income.savings == request.savings)\
                       .all()
    total_income = sum(record.amount for record in income_records)

    # Total expenses for this savings
    expense_records = db.query(Expense)\
                        .filter(Expense.savings == request.savings)\
                        .all()
    total_expenses = sum(record.amount for record in expense_records)

    outgoing = db.query(Transfer)\
                 .filter(Transfer.from_savings == request.savings)\
                 .all()
    total_outgoing = sum(r.amount for r in outgoing)

    incoming = db.query(Transfer)\
                 .filter(Transfer.to_savings == request.savings)\
                 .all()
    total_incoming = sum(r.amount for r in incoming)

    current_balance = (
        total_income
        - total_expenses
        - total_outgoing
        + total_incoming
    )

    # Check if balance is sufficient
    if request.amount > current_balance:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient balance. Current balance for {request.savings} is ₱{current_balance:,.2f}"
        )

    # Save the expense
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

@router.get("/expenses/category/{category}")
def get_expenses_by_category(category: str, db: Session = Depends(get_db)):
    expenses = db.query(Expense)\
                 .filter(Expense.category == category)\
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

@router.get("/expenses/top-categories/{year}/{month}")
def get_top_categories(year: int, month: int, db: Session = Depends(get_db)):

    # Query expenses filtered by year and month
    expenses = db.query(Expense).filter(
        extract("year", Expense.date) == year,
        extract("month", Expense.date) == month
    ).all()

    # Group and sum by category
    category_totals = {}
    for expense in expenses:
        category = expense.category
        if category not in category_totals:
            category_totals[category] = 0
        category_totals[category] += expense.amount

    # Sort by amount descending and take top 5
    sorted_categories = sorted(
        category_totals.items(),
        key=lambda x: x[1],
        reverse=True
    )[:5]

    # Format for frontend
    return [
        {
            "category": category,
            "total": round(amount, 2)
        }
        for category, amount in sorted_categories
    ]