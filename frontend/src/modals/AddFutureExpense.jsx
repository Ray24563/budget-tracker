import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react'
import { addFutureExpense } from "../api/future";
import { SAVINGS_OPTIONS } from "../constants/savings";
import { EXPENSE_CATEGORIES } from "../constants/savings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";

function AddFutureExpense({ setAddFutureExpenseModal }) {
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [expenseCategory, setExpenseCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [expenseSource, setExpenseSource] = useState("");
  const [expenseSavings, setExpenseSavings] = useState(SAVINGS_OPTIONS[0]);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [error, setError] = useState("")

  const handleAddExpense = async () => {
    if (!expenseSource || !expenseAmount) return;
    setExpenseLoading(true);
    try {
      await addFutureExpense({
        date: expenseDate.toISOString().split("T")[0],
        category: expenseCategory,
        source: expenseSource,
        savings: expenseSavings,
        amount: Number(expenseAmount)
      });
      setExpenseSource("");
      setExpenseAmount("");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setExpenseLoading(false);
    }
  };

  const isExpenseFormEmpty = !expenseDate || !expenseSource.trim() || !expenseAmount;

  return (
    <>
      <div className='add-income-modal w-auto p-10 rounded-lg animate-modalIn'>
        <h1 
        className='syne-heading text-[#e2d9f3] font-bold text-3xl mb-7'
        onClick={() => setAddExpenseModal(false)}
        >
          <FontAwesomeIcon icon={faArrowTrendDown} className='me-3'/> Add Future Expense
        </h1>

        <form>
        <div className='mb-5 flex gap-x-5'>

          <div>
            <label className='text-[#e2d9f3] syne-heading mb-2 block'>Date</label>
              <DatePicker
                selected={expenseDate}
                onChange={(expenseDate) => setExpenseDate(expenseDate)}
                className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460]"
              />
          </div>

            <div>
            <label className='text-[#e2d9f3] syne-heading mb-2 block'>Category</label>
            <select 
              className="border rounded-lg ps-3 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-60 mb-5"
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
              <label className='text-[#e2d9f3] syne-heading mb-2 block'>Description</label>
              <input 
                type="text" 
                placeholder="Enter description" 
                className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full" 
                value={expenseSource}
                onChange={(e) => setExpenseSource(e.target.value)}
              />
          </div>
        </div>

        <div>
          <label className='text-[#e2d9f3] syne-heading mb-2 block'>Savings</label>
          <select 
            className="border rounded-lg ps-3 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full mb-5"
            value={expenseSavings}
            onChange={(e) => setExpenseSavings(e.target.value)}
          >
            {SAVINGS_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className='text-[#e2d9f3] syne-heading mb-2 block'>Amount</label>
          <input 
            type="number" placeholder="Enter source of income" 
            className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)} 
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-3 syne-heading">{error}</p>}

        <div className='flex justify-center gap-x-3'>
          <button 
            className="px-3 py-2 income-button-background rounded-sm cursor-pointer syne-heading mt-7 disabled:pointer-events-none disabled:opacity-50"
            onClick={handleAddExpense}
            disabled={expenseLoading || isExpenseFormEmpty}
          >
            Submit
          </button>

          <button 
            className="px-4 py-2 text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 rounded-sm cursor-pointer syne-heading mt-7"
            onClick={() => setAddFutureExpenseModal(false)}
          >
              Close
          </button>
        </div>
        </form>
    </div>
    </>
  )
}

export default AddFutureExpense;