import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react'
import { addFutureIncome } from "../api/future";
import { SAVINGS_OPTIONS } from "../constants/savings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

function AddFutureIncome({ setAddFutureIncomeModal }) {
  const [incomeDate, setIncomeDate] = useState(new Date());
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeSavings, setIncomeSavings] = useState(SAVINGS_OPTIONS[0]);
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [error, setError] = useState("")

   const handleAddIncome = async () => {
    if (!incomeSource || !incomeAmount) return;
    setIncomeLoading(true);
    try {
      await addFutureIncome({
        date: incomeDate.toISOString().split("T")[0],
        source: incomeSource,
        savings: incomeSavings,
        amount: Number(incomeAmount)
      });
      setIncomeSource("");
      setIncomeAmount("");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIncomeLoading(false);
    }
  };

  const isIncomeFormEmpty = !incomeDate || !incomeSource.trim() || !incomeAmount;

  return (
    <>
      <div className='add-income-modal mx-5 w-auto p-8 sm:p-10 rounded-lg animate-modalIn'>
         <h1 
          className='syne-heading text-[#e2d9f3] font-bold text-2xl sm:text-3xl mb-5'
          ><FontAwesomeIcon icon={faArrowTrendUp} className='me-3'/> Add Future Income</h1>

         <form>
          <div className='mb-5 flex flex-col sm:flex-row gap-x-0 gap-y-5 sm:gap-y-0 sm:gap-x-5'>

            <div>
              <label className='text-[#e2d9f3] syne-heading mb-2 block'>Date</label>
                <DatePicker
                  selected={incomeDate}
                  onChange={(incomeDate) => setIncomeDate(incomeDate)}
                  className="border rounded-lg ps-5 pe-19 sm:pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460]"
                />
            </div>

             <div>
              <label className='text-[#e2d9f3] syne-heading mb-2 block'>Source</label>
              <input 
                type="text" 
                placeholder="Enter source of income" 
                className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full"
                value={incomeSource}
                onChange={(e) => setIncomeSource(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className='text-[#e2d9f3] syne-heading mb-2 block'>Savings</label>
            <select 
              className="border rounded-lg ps-3 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full mb-5"
              value={incomeSavings}
              onChange={(e) => setIncomeSavings(e.target.value)}
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
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
            />
          </div>

           {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className='flex justify-center gap-x-3'>
            <button 
              className="px-3 py-2 income-button-background rounded-sm cursor-pointer syne-heading mt-7 disabled:pointer-events-none disabled:opacity-50"
              onClick={handleAddIncome}
              disabled={incomeLoading || isIncomeFormEmpty}
            >
                Submit
            </button>

            <button 
              className="px-4 py-2 text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 rounded-sm cursor-pointer syne-heading mt-7"
              onClick={() => setAddFutureIncomeModal(false)}
            >
                Close
            </button>
          </div>
         </form>
      </div>
    </>
  )
}

export default AddFutureIncome;