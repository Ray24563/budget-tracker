import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllFutureIncome, getAllFutureExpenses, getFutureSummary,
  deleteFutureIncome, deleteFutureExpense,
  convertFutureIncome, convertFutureExpense,
  addFutureIncome, addFutureExpense
} from "../api/future";
import { SAVINGS_OPTIONS, EXPENSE_CATEGORIES } from "../constants/savings";

const DEFAULT_FUTURE_SUMMARY = {
  savings_breakdown: [
    { savings: "Main Wallet",      future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "Secondary Wallet", future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "Maya Wallet",      future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "Maya Savings",     future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "BPI",              future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "GoTyme",           future_income: 0, future_expenses: 0, projected_balance: 0 },
  ],
  overall_future_income: 0,
  overall_future_expenses: 0,
  overall_projected_balance: 0
};

function FuturePage() {
  return(
    <>
      <p>Pogi ako</p>
    </>
  )
}

export default FuturePage