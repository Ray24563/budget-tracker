import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from 'react'
import { addIncome } from "../api/income";
import { SAVINGS_OPTIONS } from "../constants/savings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp, faGaugeSimpleHigh, faXmark } from "@fortawesome/free-solid-svg-icons";
import QuickAddIncome from "./QuickAddIncome";
import { formatDateLocal } from "../utils/DateFormatter";

function AddIncome({ setAddIncomeModal, onSuccess, preset }) {
  const [date, setDate] = useState(new Date());
  const [source, setSource] = useState("");
  const [savings, setSavings] = useState(SAVINGS_OPTIONS[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quickAddModal, setQuickAddModal] = useState(false);
  const [incomePreset, setIncomePreset] = useState(null);

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
        date: formatDateLocal(date),
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

  useEffect(() => {
    if (incomePreset) {
      setSource(incomePreset.source);
      setSavings(incomePreset.savings);
      setAmount(incomePreset.amount.toString());
    }
  }, [incomePreset]);

  const handleSelectIncomePreset = (incomePreset) => {
    setIncomePreset(incomePreset);    // pass preset to AddIncome modal
    setQuickAddModal(false);    // close QuickAdd modal
    setAddIncomeModal(true);    // open AddIncome modal
  };

  return (
    <>
      <div className='add-income-modal w-auto p-10 rounded-lg animate-modalIn'>
        <div className="flex justify-between items-center mb-7 sm:mb-5">
          <div>
            <h1 
              className='syne-heading text-[#e2d9f3] font-bold text-2xl sm:text-3xl'><FontAwesomeIcon icon={faArrowTrendUp} className='me-2 sm:me-3'/> Add Income</h1>
          </div>

          <FontAwesomeIcon 
            icon={faXmark}
            className="text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 text-lg sm:text-2xl cursor-pointer"
            onClick={() => setAddIncomeModal(false)}
          />
        </div>

         <form>
          <div className='mb-5 flex flex-col sm:flex-row gap-x-0 gap-y-5 sm:gap-y-0 sm:gap-x-5'>

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
            <QuickAddIncome
              onClose={() => setQuickAddModal(false)}
              onSelectIncomePreset={handleSelectIncomePreset}
            />
          </div>
        )}
    </>
  )
}

export default AddIncome;