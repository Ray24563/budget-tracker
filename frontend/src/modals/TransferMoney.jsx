import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react'
import { addTransfer } from "../api/transfer";
import { SAVINGS_OPTIONS } from "../constants/savings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

function TransferMoney({ setTransMoneyModal, onSuccess }) {
  const [date, setDate] = useState(new Date());
  const [fromSavings, setFromSavings] = useState(SAVINGS_OPTIONS[0]);
  const [toSavings, setToSavings] = useState(SAVINGS_OPTIONS[1]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (fromSavings === toSavings) {
      setError("Cannot transfer to the same savings.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      await addTransfer({
        date: date.toISOString().split("T")[0],
        from_savings: fromSavings,
        to_savings: toSavings,
        amount: Number(amount),
        description: description || null
      });

      onSuccess();
      setTransMoneyModal(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormEmpty = !fromSavings || !toSavings || !amount;

  return (
    <>
      <div className='add-income-modal w-auto p-10 rounded-lg animate-modalIn'>
         <h1 
          className='syne-heading text-[#e2d9f3] font-bold text-3xl mb-5'
          ><FontAwesomeIcon icon={faArrowRightArrowLeft} className='me-3'/> Transfer Money</h1>

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
              <label className='text-[#e2d9f3] syne-heading mb-2 block'>Description</label>
              <input 
                type="text" 
                placeholder="Enter Description" 
                className="border rounded-lg ps-5 pe-10 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460]"
                value={description}
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className='text-[#e2d9f3] syne-heading mb-2 block'>From</label>
            <select 
              className="border rounded-lg ps-3 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full mb-5"
              value={fromSavings}
              onChange={(e) => setFromSavings(e.target.value)}
            >
              {SAVINGS_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <label className='text-[#e2d9f3] syne-heading mb-2 block'>To</label>
            <select 
              className="border rounded-lg ps-3 py-2.5 text-[#e2d9f3] bg-[#0a0818] border-[#2e2460] w-full mb-5"
              value={toSavings}
              onChange={(e) => setToSavings(e.target.value)}
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
              disabled={loading || isFormEmpty}
              onClick={handleSubmit}
            >
                Submit
            </button>

            <button 
              className="px-4 py-2 text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 rounded-sm cursor-pointer syne-heading mt-7"
              onClick={() => setTransMoneyModal(false)}
            >
                Close
            </button>
          </div>
         </form>
      </div>
    </>
  )
}

export default TransferMoney;