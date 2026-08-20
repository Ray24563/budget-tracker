import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DateFormatter } from "../utils/DateFormatter"
import { faWallet, faM, faCreditCard, faCircleQuestion, faBuildingColumns } from "@fortawesome/free-solid-svg-icons"
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
            className={`text-2xl ${(selectedSavings == "Main Wallet" || selectedSavings == "Secondary Wallet") ? "text-[#c084fc]" : (selectedSavings == "Maya Wallet" || selectedSavings == "Maya Savings") ? "text-[#00D3B8]" : selectedSavings === "BPI" ? "text-[#B11116]" : selectedSavings === "BDO" ? "text-[rgb(96,165,250)]" : selectedSavings === "MariBank" ? "text-[rgb(253,186,116)]" : selectedSavings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}
            icon={
              (selectedSavings == "Main Wallet" || selectedSavings == "Secondary Wallet") 
                ? faWallet
              : (selectedSavings == "Maya Wallet" || selectedSavings == "Maya Savings")
                ? faM
              : (selectedSavings === "BPI" || selectedSavings === "BDO")
                ? faCreditCard
              : selectedSavings === "MariBank"
                ? faBuildingColumns
              : selectedSavings === "GoTyme"
                ? faCircleQuestion
                : faWallet}
          />
        </div>
        <p className="syne-heading mb-3 wrap-break-word w-65 text-lg text-[#e2d9f3]">{selectedSource}</p>

        <div className="flex justify-between items-center mb-3">
          <p className={`pt-0.5 pb-1 text-xs font-bold px-2 rounded-md ${(selectedSavings == "Main Wallet" || selectedSavings == "Secondary Wallet") ? "bg-[rgba(139,92,246,0.12)] text-[rgb(196,181,253)] border w-auto border-[rgba(139,92,246,0.22)]" : (selectedSavings == "Maya Wallet" || selectedSavings == "Maya Savings") ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : selectedSavings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : selectedSavings === "BDO" ? "bg-[rgba(10,61,143,0.1)] text-[rgb(96,165,250)] border border-[rgba(10,61,143,0.25)]" : selectedSavings === "MariBank" ? "bg-[rgba(234,88,12,0.1)] text-[rgb(253,186,116)] border border-[rgba(234,88,12,0.25)]" : selectedSavings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"} text-xs`}><span className={`text-sm ${(selectedSavings == "Main Wallet" || selectedSavings == "Secondary Wallet") ? "text-[#c084fc]" : (selectedSavings == "Maya Wallet" || selectedSavings == "Maya Savings") ? " text-[rgb(110,231,183)]" : selectedSavings === "BPI" ? "text-[rgb(248,113,113)]" : selectedSavings === "BDO" ? "text-[rgb(96,165,250)]" : selectedSavings === "MariBank" ? "text-[rgb(253,186,116)]" : selectedSavings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}>&bull;</span> {selectedSavings}</p>
          <p className="text-xs font-bold text-[#c4b8e0]">{DateFormatter(selectedDate)}</p>
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