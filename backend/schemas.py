from pydantic import BaseModel
from datetime import date as date_type
from datetime import time as time_type
from typing import List, Optional

# ─── Auth ────────────────────────────────────────────────
class LoginRequest(BaseModel):
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# ─── Income ──────────────────────────────────────────────
class IncomeCreate(BaseModel):
    date: date_type      
    source: str
    savings: str
    amount: float

class IncomeResponse(BaseModel):
    id: int
    date: date_type
    time: Optional[time_type] = None
    source: str
    savings: str
    amount: float

    class Config:
        from_attributes = True

# ─── Expense ─────────────────────────────────────────────
class ExpenseCreate(BaseModel):
    date: date_type
    category: str
    source: str
    savings: str
    amount: float

class ExpenseResponse(BaseModel):
    id: int
    date: date_type
    time: Optional[time_type] = None
    category: str
    source: str
    savings: str
    amount: float

    class Config:
        from_attributes = True

# ─── Transfer ────────────────────────────────────────────
class TransferCreate(BaseModel):
    date: date_type
    from_savings: str
    to_savings: str
    amount: float
    description: Optional[str] = None

class TransferResponse(BaseModel):
    id: int
    date: date_type
    time: Optional[time_type] = None
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

# ─── Future Income ────────────────────────────────────────
class FutureIncomeCreate(BaseModel):
    date: date_type
    source: str
    savings: str
    amount: float

class FutureIncomeResponse(BaseModel):
    id: int
    date: date_type
    source: str
    savings: str
    amount: float

    class Config:
        from_attributes = True

# ─── Future Expense ───────────────────────────────────────
class FutureExpenseCreate(BaseModel):
    date: date_type
    category: str
    source: str
    savings: str
    amount: float

class FutureExpenseResponse(BaseModel):
    id: int
    date: date_type
    category: str
    source: str
    savings: str
    amount: float

    class Config:
        from_attributes = True

# ─── Future Summary ───────────────────────────────────────
class FutureSavingsBalance(BaseModel):
    savings: str
    future_income: float
    future_expenses: float
    projected_balance: float

class FutureSummaryResponse(BaseModel):
    savings_breakdown: List[FutureSavingsBalance]
    overall_future_income: float
    overall_future_expenses: float
    overall_projected_balance: float