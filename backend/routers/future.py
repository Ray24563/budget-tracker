from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from database import get_db
from models import FutureIncome, FutureExpense, Income, Expense, Transfer
from schemas import (
    FutureIncomeCreate, FutureIncomeResponse,
    FutureExpenseCreate, FutureExpenseResponse,
    FutureSummaryResponse, FutureSavingsBalance,
    IncomeCreate, ExpenseCreate
)

router = APIRouter()

SAVINGS_OPTIONS = [
    "Main Wallet",
    "Secondary Wallet",
    "Maya Wallet",
    "Maya Savings",
    "BPI",
    "GoTyme"
]

# ─── Future Income ────────────────────────────────────────

@router.post("/future/income", response_model=FutureIncomeResponse)
def add_future_income(request: FutureIncomeCreate, db: Session = Depends(get_db)):
    new_future_income = FutureIncome(
        date=request.date,
        source=request.source,
        savings=request.savings,
        amount=request.amount
    )
    db.add(new_future_income)
    db.commit()
    db.refresh(new_future_income)
    return new_future_income

@router.get("/future/income", response_model=List[FutureIncomeResponse])
def get_all_future_income(db: Session = Depends(get_db)):
    return db.query(FutureIncome)\
             .order_by(desc(FutureIncome.date))\
             .all()

@router.delete("/future/income/{id}")
def delete_future_income(id: int, db: Session = Depends(get_db)):
    record = db.query(FutureIncome).filter(FutureIncome.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return { "message": "Deleted successfully" }

# ─── Convert Future Income to Actual Income ───────────────

@router.post("/future/income/{id}/convert")
def convert_future_income(id: int, db: Session = Depends(get_db)):

    # Find the future income record
    record = db.query(FutureIncome).filter(FutureIncome.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Create actual income from it
    actual_income = Income(
        date=record.date,
        source=record.source,
        savings=record.savings,
        amount=record.amount
    )
    db.add(actual_income)

    # Remove from future income
    db.delete(record)
    db.commit()

    return { "message": "Converted to actual income successfully" }

# ─── Future Expense ───────────────────────────────────────

@router.post("/future/expenses", response_model=FutureExpenseResponse)
def add_future_expense(request: FutureExpenseCreate, db: Session = Depends(get_db)):
    new_future_expense = FutureExpense(
        date=request.date,
        category=request.category,
        source=request.source,
        savings=request.savings,
        amount=request.amount
    )
    db.add(new_future_expense)
    db.commit()
    db.refresh(new_future_expense)
    return new_future_expense

@router.get("/future/expenses", response_model=List[FutureExpenseResponse])
def get_all_future_expenses(db: Session = Depends(get_db)):
    return db.query(FutureExpense)\
             .order_by(desc(FutureExpense.date))\
             .all()

@router.delete("/future/expenses/{id}")
def delete_future_expense(id: int, db: Session = Depends(get_db)):
    record = db.query(FutureExpense).filter(FutureExpense.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return { "message": "Deleted successfully" }

# ─── Convert Future Expense to Actual Expense ─────────────

@router.post("/future/expenses/{id}/convert")
def convert_future_expense(id: int, db: Session = Depends(get_db)):

    # Find the future expense record
    record = db.query(FutureExpense).filter(FutureExpense.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Check balance before converting
    income_records = db.query(Income)\
                       .filter(Income.savings == record.savings)\
                       .all()
    total_income = sum(r.amount for r in income_records)

    expense_records = db.query(Expense)\
                        .filter(Expense.savings == record.savings)\
                        .all()
    total_expenses = sum(r.amount for r in expense_records)

    current_balance = total_income - total_expenses

    if record.amount > current_balance:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient balance. Current balance for {record.savings} is ₱{current_balance:,.2f}"
        )

    # Create actual expense from it
    actual_expense = Expense(
        date=record.date,
        category=record.category,
        source=record.source,
        savings=record.savings,
        amount=record.amount
    )
    db.add(actual_expense)

    # Remove from future expenses
    db.delete(record)
    db.commit()

    return { "message": "Converted to actual expense successfully" }

# ─── Future Summary ───────────────────────────────────────

@router.get("/future/summary", response_model=FutureSummaryResponse)
def get_future_summary(db: Session = Depends(get_db)):

    savings_breakdown = []
    overall_future_income = 0
    overall_future_expenses = 0
    overall_actual_balance = 0

    for savings in SAVINGS_OPTIONS:

        # ─── Actual Balance From Main Tables ─────────────
        actual_income = db.query(Income)\
                          .filter(Income.savings == savings)\
                          .all()
        total_actual_income = sum(r.amount for r in actual_income)

        actual_expenses = db.query(Expense)\
                            .filter(Expense.savings == savings)\
                            .all()
        total_actual_expenses = sum(r.amount for r in actual_expenses)

        # Account for transfers
        outgoing = db.query(Transfer)\
                     .filter(Transfer.from_savings == savings)\
                     .all()
        total_outgoing = sum(r.amount for r in outgoing)

        incoming = db.query(Transfer)\
                     .filter(Transfer.to_savings == savings)\
                     .all()
        total_incoming = sum(r.amount for r in incoming)

        actual_balance = (
            total_actual_income
            - total_actual_expenses
            - total_outgoing
            + total_incoming
        )

        # ─── Future Planned Transactions ─────────────────
        future_income_records = db.query(FutureIncome)\
                                  .filter(FutureIncome.savings == savings)\
                                  .all()
        future_income = sum(r.amount for r in future_income_records)

        future_expense_records = db.query(FutureExpense)\
                                   .filter(FutureExpense.savings == savings)\
                                   .all()
        future_expenses = sum(r.amount for r in future_expense_records)

        # ─── Projected Balance ────────────────────────────
        # Actual balance + future plans
        projected_balance = actual_balance + future_income - future_expenses

        savings_breakdown.append(FutureSavingsBalance(
            savings=savings,
            future_income=future_income,
            future_expenses=future_expenses,
            projected_balance=projected_balance
        ))

        overall_future_income += future_income
        overall_future_expenses += future_expenses
        overall_actual_balance += actual_balance

    return FutureSummaryResponse(
        savings_breakdown=savings_breakdown,
        overall_future_income=overall_future_income,
        overall_future_expenses=overall_future_expenses,
        overall_projected_balance=overall_actual_balance + overall_future_income - overall_future_expenses
    )