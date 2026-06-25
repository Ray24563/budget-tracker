import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { DateFormatter, DateFormatterSelector } from "../utils/DateFormatter";

function SaveAsPDFModalExpense({ selectedMonth, setSelectedMonth, availableMonths, handleExportPDF, setSaveAsPDFModal }) {
  return (
    <>
      <div className='add-income-modal w-auto p-10 rounded-lg animate-modalIn'>
        <h1 
          className='syne-heading text-[#e2d9f3] font-bold text-3xl mb-10'
        ><FontAwesomeIcon className="text-red-500 me-3" icon={faFilePdf}/> Save AS PDF</h1>

        <p className="text-[#e2d9f3] syne-heading text-md mb-5">Please select the expense month to save.</p>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-[#0a0818] border border-[#2e2460] text-[#e2d9f3] rounded-lg px-3 py-2 text-md syne-heading cursor-pointer w-full"
          >
            <option value="all">All Time</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>{DateFormatterSelector(month)}</option>
            ))}
        </select>

        <div className="flex gap-x-5 justify-center mt-7">
          <button
            onClick={handleExportPDF}
            className="income-button-background px-7 py-1.5 rounded-lg font-semibold cursor-pointer text-sm syne-heading"
          >
            Save
          </button>

          <button 
            className="px-4 py-1.5 text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 rounded-sm cursor-pointer syne-heading"
            onClick={() => setSaveAsPDFModal(false)}
          >
              Close
          </button>
        </div>
      </div>
    </>
  )
}

export default SaveAsPDFModalExpense;