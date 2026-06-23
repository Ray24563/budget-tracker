from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from database import get_db
from models import Transfer, Income, Expense
from schemas import TransferCreate, TransferResponse

router = APIRouter()

@router.post("/transfer", response_model=TransferResponse)
def transfer_money(request: TransferCreate, db: Session = Depends(get_db)):

    # Validate — from and to savings must be different
    if request.from_savings == request.to_savings:
        raise HTTPException(
            status_code=400,
            detail="Cannot transfer to the same savings."
        )

    # Calculate current balance of source savings
    income_records = db.query(Income)\
                       .filter(Income.savings == request.from_savings)\
                       .all()
    total_income = sum(r.amount for r in income_records)

    expense_records = db.query(Expense)\
                        .filter(Expense.savings == request.from_savings)\
                        .all()
    total_expenses = sum(r.amount for r in expense_records)

    # Also account for previous outgoing transfers
    outgoing = db.query(Transfer)\
                 .filter(Transfer.from_savings == request.from_savings)\
                 .all()
    total_outgoing = sum(r.amount for r in outgoing)

    # Also account for previous incoming transfers
    incoming = db.query(Transfer)\
                 .filter(Transfer.to_savings == request.from_savings)\
                 .all()
    total_incoming = sum(r.amount for r in incoming)

    current_balance = total_income - total_expenses - total_outgoing + total_incoming

    # Step 3: Check if balance is sufficient
    if request.amount > current_balance:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient balance. Current balance for {request.from_savings} is ₱{current_balance:,.2f}"
        )

    # Record the transfer
    new_transfer = Transfer(
        date=request.date,
        from_savings=request.from_savings,
        to_savings=request.to_savings,
        amount=request.amount,
        description=request.description
    )

    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)

    return new_transfer

@router.get("/transfer", response_model=List[TransferResponse])
def get_all_transfers(db: Session = Depends(get_db)):

    transfers = db.query(Transfer)\
                  .order_by(desc(Transfer.date))\
                  .all()

    return transfers

@router.delete("/transfer/{transfer_id}")
def delete_transfer(transfer_id: int, db: Session = Depends(get_db)):

    transfer = db.query(Transfer)\
                 .filter(Transfer.id == transfer_id)\
                 .first()

    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    db.delete(transfer)
    db.commit()

    return { "message": "Transfer deleted successfully" }