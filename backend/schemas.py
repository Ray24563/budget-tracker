from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# frontend SENDS to backend when logging in
class LoginRequest(BaseModel):
    password: str   # Must be a string (plain text, only lives briefly)

# backend SENDS BACK after a successful login
class TokenResponse(BaseModel):
    access_token: str   # The JWT badge
    token_type: str     # Always "bearer" by convention

# What frontend sends when adding income
class IncomeCreate(BaseModel):
    date: date
    source: str
    savings: str
    amount: float

# What backend sends back per income record
class IncomeResponse(BaseModel):
    id: int
    date: date
    source: str
    savings: str
    amount: float

    class Config:
        from_attributes = True

# ─── Expense ─────────────────────────────────────────────

# What frontend sends when adding expense
class ExpenseCreate(BaseModel):
    date: date
    category: str
    source: str
    savings: str
    amount: float

# What backend sends back per expense record
class ExpenseResponse(BaseModel):
    id: int
    date: date
    category: str
    source: str
    savings: str
    amount: float

    class Config:
        from_attributes = True

# ─── Transfer ────────────────────────────────────────────
class TransferCreate(BaseModel):
    date: date
    from_savings: str
    to_savings: str
    amount: float
    description: Optional[str] = None  # optional field

class TransferResponse(BaseModel):
    id: int
    date: date
    from_savings: str
    to_savings: str
    amount: float
    description: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Summary ─────────────────────────────────────────────

# Balance per savings account
class SavingsBalance(BaseModel):
    savings: str
    total_income: float
    total_expenses: float
    balance: float

# Overall summary
class SummaryResponse(BaseModel):
    savings_breakdown: List[SavingsBalance]
    overall_total_income: float
    overall_total_expenses: float
    overall_balance: float