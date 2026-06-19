import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from 'react'
import { addExpense } from "../api/expenses";
import { SAVINGS_OPTIONS, EXPENSE_CATEGORIES } from "../constants/savings";

function AddExpense({setAddExpenseModal, fetchSummary}) {
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [source, setSource] = useState("");
  const [savings, setSavings] = useState(SAVINGS_OPTIONS[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        date: date.toISOString().split("T")[0],
        category,
        source,
        savings,
        amount: Number(amount)
      });

      onSuccess();
      onClose();

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='add-income-modal w-auto p-10 rounded-lg animate-modalIn'>
         <h1 
          className='syne-heading text-[#e2d9f3] font-bold text-3xl mb-5'
          onClick={() => setAddExpenseModal(false)}>Add Expense</h1>

         <form>
          <div className='mb-5 flex gap-x-5'>

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
                className="border rounded-lg ps-3 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-60 mb-5"
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
            <label className='text-[#e2d9f3] syne-heading mb-2 block'>Value</label>
            <input 
              type="number" placeholder="Enter source of income" 
              className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full required"
              value={amount}
              onChange={(e) => setAmount(e.target.value)} 
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className='flex justify-center'>
            <button 
              className="px-3 py-2 income-button-background ms-3 rounded-sm cursor-pointer syne-heading mt-7"
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </button>
          </div>
         </form>
      </div>
    </>
  )
}

export default AddExpense;