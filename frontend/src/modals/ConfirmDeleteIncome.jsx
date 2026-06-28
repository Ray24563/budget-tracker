import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { DateFormatter } from "../utils/DateFormatter"

function ConfirmDeleteIncome ({isMobile, handleDelete, selectedDate, selectedSource, selectedSavings, selectedAmount, selectedID, setConfirmationModal}) {
  return (
    <>
      <div className='add-income-modal w-auto sm:mx-0 mx-5 p-8 sm:p-10 rounded-lg animate-modalIn'>

        <div className="flex justify-center flex-col items-center">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500 text-6xl sm:text-7xl mb-5"/>
          <p className="text-[#e2d9f3] mb-5 syne-heading font-bold text-lg sm:text-xl text-center sm:text-left">Are you sure you want to delete this Income?</p>
        </div>
        

        {!isMobile && (
          <table className="w-full text-left border-collapse bg-[#1c1640] rounded-lg animate-tableIn mb-7">
            <thead>
              <tr className="border-b border-[#2e2460] syne-heading text-[#e2d9f3] font-bold text-md bg-[#2e2460]">
                <th className="py-3 px-10 rounded-tl-lg rounded-bl-lg">Transaction ID</th>
                <th className="py-3 px-10">Date</th>
                <th className="py-3 px-10">Source</th>
                <th className="py-3 px-10">Savings</th>
                <th className="py-3 px-10 rounded-tr-lg rounded-br-lg">Amount</th>
              </tr>
            </thead>

            <tbody>
                <tr
                  className="border-b border-[#2e2460] hover:bg-[#261d52] transition-colors duration-200"
                >
                  <td className="text-[#e2d9f3] py-3 px-10">{selectedID}</td>
                  <td className="text-[#e2d9f3] py-3 px-10">{DateFormatter(selectedDate)}</td>
                  <td className="text-[#e2d9f3] py-3 px-10">{selectedSource}</td>
                  <td className="text-[#e2d9f3] py-3 px-10">{selectedSavings}</td>
                  <td className="text-green-400 font-bold py-3 px-10">
                    + ₱ {selectedAmount}
                  </td>
                </tr>
            </tbody>
          </table>
        )}

        {isMobile && (
          <>
            <div className="text-[#e2d9f3] bg-[#2e2460]/50 py-2 rounded-full mb-5">
              <p className="text-center text-sm syne-heading">Added to <strong>{selectedSavings}</strong></p>
            </div>
            
            <div className="flex justify-between mb-1">
              <p className="text-[#6b5f8a] syne-heading text-sm">Transaction ID</p>
              <p className="text-[#e2d9f3] font-bold">{selectedID}</p>
            </div>

            <div className="flex justify-between mb-1">
              <p className="text-[#6b5f8a] syne-heading text-sm">Source</p>
              <p className="text-[#e2d9f3] font-bold">{selectedSource}</p>
            </div>

            <div className="flex justify-between mb-1">
              <p className="text-[#6b5f8a] syne-heading text-sm">Amount</p>
              <p className="text-green-400 font-bold">+ ₱ {selectedAmount.toLocaleString()}</p>
            </div>

            <div className="flex justify-between mb-10">
              <p className="text-[#6b5f8a] syne-heading text-sm">Paid on</p>
              <p className="text-[#e2d9f3] font-bold">{DateFormatter(selectedDate)}</p>
            </div>
          </>
        )}
        
        <div className="flex justify-center gap-x-3">
          <button 
            className="income-button-background rounded-lg text-sm sm:text-md px-4 sm:px-5 py-2" 
            onClick={() => (handleDelete(selectedID), setConfirmationModal(false))}
          >
            Delete
          </button>
          <button 
            className="text-sm sm:text-md px-4 sm:px-5 py-2 text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 rounded-sm cursor-pointer syne-heading"
            onClick={() => setConfirmationModal(false)}
          >
              Close
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmDeleteIncome