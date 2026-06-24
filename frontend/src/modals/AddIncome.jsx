import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from 'react'
import { addIncome } from "../api/income";
import { SAVINGS_OPTIONS } from "../constants/savings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

function AddIncome({ setAddIncomeModal, onSuccess }) {
  const [date, setDate] = useState(new Date());
  const [source, setSource] = useState("");
  const [savings, setSavings] = useState(SAVINGS_OPTIONS[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    // Basic validation
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
      await addIncome({
        // Format date to YYYY-MM-DD for FastAPI
        date: date.toISOString().split("T")[0],
        source,
        savings,
        amount: Number(amount)
      });

      window.location.reload();
      setAddIncomeModal(false)

    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormEmpty = !source.trim() || !amount;

  return (
    <>
      <div className='add-income-modal w-auto p-10 rounded-lg animate-modalIn'>
         <h1 
          className='syne-heading text-[#e2d9f3] font-bold text-3xl mb-5'
          ><FontAwesomeIcon icon={faArrowTrendUp} className='me-3'/> Add Income</h1>

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
              <label className='text-[#e2d9f3] syne-heading mb-2 block'>Source</label>
              <input 
                type="text" 
                placeholder="Enter source of income" 
                className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460]"
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
              type="number" 
              placeholder="Enter source of income" 
              className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

           {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className='flex justify-center gap-x-3'>
            <button 
              className="px-3 py-2 income-button-background rounded-sm cursor-pointer syne-heading mt-7 disabled:pointer-events-none disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading || isFormEmpty}
            >
                Submit
            </button>

            <button 
              className="px-4 py-2 text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 rounded-sm cursor-pointer syne-heading mt-7"
              onClick={() => setAddIncomeModal(false)}
            >
                Close
            </button>
          </div>
         </form>
      </div>
    </>
  )
}

export default AddIncome;