import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from 'react'
import { addExpense } from "../api/expenses";
import { SAVINGS_OPTIONS, EXPENSE_CATEGORIES } from "../constants/savings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import QuickAddExpense from "./QuickAddExpense";
import { formatDateLocal } from "../utils/DateFormatter";

function AddExpense({setAddExpenseModal, onSuccess}) {
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [source, setSource] = useState("");
  const [savings, setSavings] = useState(SAVINGS_OPTIONS[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quickAddModal, setQuickAddModal] = useState(false);
  const [expensePreset, setExpensePreset] = useState(null);

  const handleSubmit = async () => {
  setError("");

  if (!source || !amount) {
    setError("Please fill in all fields.");
    return;
  }

  if (isNaN(amount) || Number(amount) <= 0) {
    setError("Please enter a valid amount.");
    return;
  }

  setLoading(true);

  try {
    await addExpense({
      date: formatDateLocal(date),
      category,
      source,
      savings,
      amount: Number(amount)
    });

    window.location.reload();
    setAddExpenseModal(false)

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const isFormEmpty = !amount || !source.trim() || !amount;

useEffect(() => {
  if (expensePreset) {
    setCategory(expensePreset.category);
    setSource(expensePreset.source);
    setSavings(expensePreset.savings);
    setAmount(expensePreset.amount.toString());
  }
}, [expensePreset]);

const handleSelectExpensePreset = (expensePreset) => {
    setExpensePreset(expensePreset);    // pass preset to AddIncome modal
    setQuickAddModal(false);    // close QuickAdd modal
    setAddExpenseModal(true);    // open AddIncome modal
  };


  return (
    <>
      <div className='add-income-modal w-auto p-10 rounded-lg animate-modalIn'>
        <div className="flex justify-between items-center mb-7 sm:mb-5">
          <div>
            <h1 
              className='syne-heading text-[#e2d9f3] font-bold text-2xl sm:text-3xl'><FontAwesomeIcon icon={faArrowTrendDown} className='me-2 sm:me-3'/> Add Expense</h1>
          </div>

          <FontAwesomeIcon 
            icon={faXmark}
            className="text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 text-lg sm:text-2xl cursor-pointer"
            onClick={() => setAddExpenseModal(false)}
          />
        </div>

         <form>
          <div className='mb-5 flex flex-col sm:flex-row gap-x-0 gap-y-4 sm:gap-y-0 sm:gap-x-5'>

            <div>
              <label className='text-[#e2d9f3] syne-heading mb-2 block'>Date</label>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460]"
                />
            </div>

             <div>
              <label className='text-[#e2d9f3] syne-heading mb-2 block'>Category</label>
              <select 
                className="border rounded-lg ps-3 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full sm:w-60 mb-0 sm:mb-5"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
            </div>
          </div>

          <div>
            <label className='text-[#e2d9f3] syne-heading mb-2 block'>Savings</label>
            <select 
              className="border rounded-lg ps-3 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full mb-5"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)} 
            />
          </div>

          {error && <p className="text-red-400 text-sm mt-3 syne-heading">{error}</p>}

          <div className='flex justify-center gap-x-3 mt-7'>
            <button 
              className="px-3 py-2 income-button-background rounded-sm cursor-pointer syne-heading disabled:pointer-events-none disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading || isFormEmpty}
            >
              Submit
            </button>

            <button 
              className="px-4 py-2 text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 rounded-sm cursor-pointer syne-heading"
              type="button"
              onClick={() => setQuickAddModal(true)}
            >
                Quick Add
            </button>
          </div>
         </form>
      </div>

      {quickAddModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex items-center justify-center animate-backdropIn">
          <QuickAddExpense
            onClose={() => setQuickAddModal(false)}
            onSelectExpensePreset={handleSelectExpensePreset}
          />
        </div>
      )}
    </>
  )
}

export default AddExpense;