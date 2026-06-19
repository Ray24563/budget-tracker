from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Income, Expense
from schemas import SummaryResponse, SavingsBalance

router = APIRouter()

# The six savings options
SAVINGS_OPTIONS = [
    "Option1",
    "Option2",
    "Option3",
    "Option4",
    "Option5",
    "Option6"
]

@router.get("/summary", response_model=SummaryResponse)
def get_summary(db: Session = Depends(get_db)):

    savings_breakdown = []
    overall_total_income = 0
    overall_total_expenses = 0

    # Loop through each savings option
    for savings in SAVINGS_OPTIONS:

        # Total income for this savings
        income_records = db.query(Income)\
                           .filter(Income.savings == savings)\
                           .all()
        total_income = sum(record.amount for record in income_records)

        # Total expenses for this savings
        expense_records = db.query(Expense)\
                            .filter(Expense.savings == savings)\
                            .all()
        total_expenses = sum(record.amount for record in expense_records)

        # Balance = income - expenses
        balance = total_income - total_expenses

        # Add to breakdown list
        savings_breakdown.append(SavingsBalance(
            savings=savings,
            total_income=total_income,
            total_expenses=total_expenses,
            balance=balance
        ))

        # Add to overall totals
        overall_total_income += total_income
        overall_total_expenses += total_expenses

    return SummaryResponse(
        savings_breakdown=savings_breakdown,
        overall_total_income=overall_total_income,
        overall_total_expenses=overall_total_expenses,
        overall_balance=overall_total_income - overall_total_expenses
    )