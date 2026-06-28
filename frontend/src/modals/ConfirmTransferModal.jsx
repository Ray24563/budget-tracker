import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightLeft } from "@fortawesome/free-solid-svg-icons"
import { DateFormatter } from "../utils/DateFormatter"
import { useState, useEffect } from "react"

function ConfirmTransferModal ({handleSubmit, selectedDate, selectedDescription, selectedToSavings, selectedFromSavings, selectedAmount, setConfirmTransferModal}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <>
      <div className='add-income-modal w-auto p-8 sm:p-10 rounded-lg animate-modalIn'>
        <div className="flex justify-center flex-col items-center">
          <FontAwesomeIcon 
            icon={faRightLeft} 
            className="text-white px-6 py-7.5 rounded-full text-4xl sm:text-5xl mb-5 bg-red-500"
          />
          <p className="text-[#e2d9f3] mb-5 syne-heading text-md sm:text-xl text-center sm:text-left">Are you sure you want to continue? <br/> <strong>This transaction cannot be undone.</strong></p>
        </div>
      
      {!isMobile && (
         <table className="w-full text-left border-collapse bg-[#1c1640] rounded-lg animate-tableIn mb-7">
          <thead>
            <tr className="border-b border-[#2e2460] syne-heading text-[#e2d9f3] font-bold text-md bg-[#2e2460]">
              <th className="py-3 px-10 rounded-tl-lg rounded-bl-lg">Date</th>
              <th className="py-3 px-10">Description</th>
              <th className="py-3 px-10">From</th>
              <th className="py-3 px-10">To</th>
              <th className="py-3 px-10 rounded-tr-lg rounded-br-lg">Amount</th>
            </tr>
          </thead>

          <tbody>
              <tr
                className="border-b border-[#2e2460] hover:bg-[#261d52] transition-colors duration-200"
              >
                <td className="text-[#e2d9f3] py-3 px-10">{DateFormatter(selectedDate)}</td>
                <td className="text-[#e2d9f3] py-3 px-10">{selectedDescription}</td>
                <td className="text-[#e2d9f3] py-3 px-10">{selectedFromSavings}</td>
                <td className="text-[#e2d9f3] py-3 px-10">{selectedToSavings}</td>
                <td className="text-green-400 font-bold py-3 px-10">
                  + ₱ {selectedAmount}
                </td>
              </tr>
          </tbody>
        </table>
      )}

      {isMobile && (
        <>
          <div className="text-[#e2d9f3] bg-[#2e2460]/50 px-7 py-3 rounded-full mb-10">
            <p className="text-center text-md syne-heading">Money Transfer:  <strong>{DateFormatter(selectedDate)}</strong></p>
          </div>
          
          <div className="flex justify-between mb-2">
            <p className="text-[#6b5f8a] mt-1 syne-heading text-sm">From</p>
            <p className="text-[#e2d9f3] font-bold">{selectedFromSavings}</p>
          </div>

          <div className="flex justify-between mb-2">
            <p className="text-[#6b5f8a] mt-1 syne-heading text-sm">To</p>
            <p className="text-[#e2d9f3] font-bold">{selectedToSavings}</p>
          </div>

          <div className="flex justify-between mb-2">
            <p className="text-[#6b5f8a] mt-1 syne-heading text-sm">Amount</p>
            <p className="text-green-400 font-bold">+ ₱ {selectedAmount}</p>
          </div>

          <div className="flex justify-between mb-10">
            <p className="text-[#6b5f8a] mt-1 syne-heading text-sm">Description</p>
            <p className="text-[#e2d9f3] font-bold">{selectedDescription}</p>
          </div>
        </>
      )}
        <div className="flex gap-x-3 justify-center mt-7">
          <button
            onClick={handleSubmit}
            className="income-button-background px-6 sm:px-5.5 py-1.5 rounded-lg font-semibold cursor-pointer sm:text-md text-sm syne-heading"
          >
            Yes
          </button>

          <button 
            className="px-4 py-1.5 text-[#7c6e9c] hover:text-[#a78bca] transition-colors duration-500 rounded-sm cursor-pointer syne-heading sm:text-md text-sm"
            onClick={() => setConfirmTransferModal(false)}
          >
              Close
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmTransferModal