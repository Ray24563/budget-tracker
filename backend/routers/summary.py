from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract
from database import get_db
from models import Income, Expense, Transfer
from schemas import SummaryResponse, SavingsBalance
from datetime import datetime

router = APIRouter()

# The six savings options
SAVINGS_OPTIONS = [
    "Main Wallet",
    "Secondary Wallet",
    "Maya Wallet",
    "Maya Savings",
    "BPI",
    "GoTyme"
]

@router.get("/summary", response_model=SummaryResponse)
def get_summary(db: Session = Depends(get_db)):

    savings_breakdown = []
    overall_total_income = 0
    overall_total_expenses = 0
    overall_balance = 0

    for savings in SAVINGS_OPTIONS:

        # Total income
        income_records = db.query(Income)\
                           .filter(Income.savings == savings)\
                           .all()
        total_income = sum(r.amount for r in income_records)

        # Total expenses
        expense_records = db.query(Expense)\
                            .filter(Expense.savings == savings)\
                            .all()
        total_expenses = sum(r.amount for r in expense_records)

        # Outgoing transfers (deduct from balance)
        outgoing = db.query(Transfer)\
                     .filter(Transfer.from_savings == savings)\
                     .all()
        total_outgoing = sum(r.amount for r in outgoing)

        # Incoming transfers (add to balance)
        incoming = db.query(Transfer)\
                     .filter(Transfer.to_savings == savings)\
                     .all()
        total_incoming = sum(r.amount for r in incoming)

        # Final balance
        balance = (total_income - total_expenses - total_outgoing + total_incoming)

        savings_breakdown.append(SavingsBalance(
            savings=savings,
            total_income=total_income,
            total_expenses=total_expenses,
            balance=balance,
        ))

        overall_total_income += total_income
        overall_total_expenses += total_expenses
        overall_balance += balance

    return SummaryResponse(
        savings_breakdown=savings_breakdown,
        overall_total_income=overall_total_income,
        overall_total_expenses=overall_total_expenses,
        overall_balance=overall_balance
    )

@router.get("/summary/monthly")
def get_monthly_comparison(db: Session = Depends(get_db)):

    # Get current month and year
    now = datetime.now()
    current_month = now.month
    current_year = now.year

    # Query income for this month
    income_records = db.query(Income).filter(
        extract("year", Income.date) == current_year,
        extract("month", Income.date) == current_month
    ).all()
    total_income = sum(record.amount for record in income_records)

    # Query expenses for this month
    expense_records = db.query(Expense).filter(
        extract("year", Expense.date) == current_year,
        extract("month", Expense.date) == current_month
    ).all()
    total_expenses = sum(record.amount for record in expense_records)

    return {
        "month": now.strftime("%B %Y"),  # e.g. "June 2025"
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
    }