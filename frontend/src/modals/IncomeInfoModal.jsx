import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DateFormatter } from "../utils/DateFormatter"
import { faWallet, faM, faCreditCard, faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import Logo from '../assets/images/logo.png'

function IncomeInfoModal ({selectedDate, selectedSource, selectedSavings, selectedAmount, selectedID, setConfirmationModal, setInfoModal}) {
  return(
    <>
      <div className='add-income-modal mx-3 w-auto p-7 sm:p-10 rounded-lg animate-modalIn'>
        <div className="flex justify-between gap-x-25 items-center">
          <div>
            <p className="font-bold text-green-400 text-2xl">+ ₱ {selectedAmount.toLocaleString()}</p>
          </div>

          <FontAwesomeIcon
            className={`text-2xl ${(selectedSavings == "Main Wallet" || selectedSavings == "Secondary Wallet") ? "text-[#c084fc]" : (selectedSavings == "Maya Wallet" || selectedSavings == "Maya Savings") ? "text-[#00D3B8]" : selectedSavings === "BPI" ? "text-[#B11116]" : selectedSavings === "BDO" ? "text-[rgb(96,165,250)]" : selectedSavings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}
            icon={
              (selectedSavings == "Main Wallet" || selectedSavings == "Secondary Wallet") 
                ? faWallet
              : (selectedSavings == "Maya Wallet" || selectedSavings == "Maya Savings")
                ? faM
              : (selectedSavings === "BPI" || selectedSavings === "BDO")
                ? faCreditCard
              : selectedSavings === "GoTyme"
                ? faCircleQuestion
                : faWallet}
          />
        </div>
        <p className="syne-heading mb-3 wrap-break-word w-65 text-lg text-[#e2d9f3]">{selectedSource}</p>

        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold text-[#c084fc]">{selectedSavings}</p>
          <p className="text-xs text-[#c4b8e0]">{DateFormatter(selectedDate)}</p>
        </div>

        <div className="flex gap-x-3 mb-4">
          <button 
            className="bbg-white/4 border border-white/8 text-[#9d8ec4] rounded-full cursor-pointer hover:bg-white/12 hover:border-white/16 transition-colors duration-500 w-full py-1 text-sm"
            onClick={() => setInfoModal(false)}
          >
            Close
          </button>

          <button 
            className="bg-red-400/8 border border-red-400/18 text-red-400 rounded-full cursor-pointer hover:bg-red-400/20 hover:border-red-400/30 transition-colors duration-500 w-full py-1 text-sm"
            onClick={() => (setConfirmationModal(true), setInfoModal(false))}
          >
            Delete
          </button>
        </div>

        <hr className="text-white/15 mb-3"/>

        <div className="flex justify-between items-center mb-3">
          <p className="text-[#c4b8e0] text-xs syne-heading">Transaction ID</p>
          <p className="text-[#c084fc] text-sm font-bold">{selectedID}</p>
        </div>

        <hr className="text-white/15 mb-7"/>

        <img src={Logo} className="w-10 mx-auto mb-2"/>
        <p className='text-[#c4b8e0]/80 text-center font-bold text-[0.7em] syne-heading'>WhyHub &#169; 2026</p>
      </div>
    </>
  )
}

export default IncomeInfoModal