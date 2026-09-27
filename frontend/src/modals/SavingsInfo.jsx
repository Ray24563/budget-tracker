import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faM, faXmark, faWallet, faCreditCard, faBuildingColumns, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import Logo from '../assets/images/logo.png'
import { use, useState } from "react";
import Maya from '../assets/images/private-images/Maya_QR.png'


function SavingsInfo ({ type, selectedAmount, onClose }) {
  const [calculateDistribution, setCalculateDistribution] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const config = {

    Wallet: {
      title: "Wallet",
      icon: faWallet,
      description:import.meta.env.VITE_WALLET_PURPOSE,
      percentage:import.meta.env.VITE_WALLET_PERCENTAGE,
      icon_color: "#c084fc",
    },

    Maya: {
      title: "Maya",
      icon: faM,
      description:import.meta.env.VITE_MAYA_PURPOSE,
      percentage:import.meta.env.VITE_MAYA_PERCENTAGE,
      icon_color: "#00D3B8",
      image: import.meta.env.VITE_MAYA_IMAGE
    },

    BPI: {
      title: "BPI",
      icon: faCreditCard,
      description:import.meta.env.VITE_BPI_PURPOSE,
      percentage:import.meta.env.VITE_BPI_PERCENTAGE,
      icon_color: "#B11116",
    },

    BDO: {
      title: "BDO",
      icon: faCreditCard,
      description:import.meta.env.VITE_BDO_PURPOSE,
      percentage:import.meta.env.VITE_BDO_PERCENTAGE,
      icon_color: "#0A3D8F",
    },

    MariBank: {
      title: "MariBank",
      icon: faBuildingColumns,
      description:import.meta.env.VITE_MARIBANK_PURPOSE,
      percentage:import.meta.env.VITE_MARIBANK_PERCENTAGE,
      icon_color: "#EA580C",
      image: import.meta.env.VITE_MARIBANK_IMAGE
    },

    GoTyme: {
      title: "GoTyme",
      icon: faCircleQuestion,
      description:import.meta.env.VITE_GOTYME_PURPOSE,
      percentage:import.meta.env.VITE_GOTYME_PERCENTAGE,
      icon_color: "#00D4C6",
      image: import.meta.env.VITE_GOTYME_IMAGE
    },

  }

  const { title, icon, description, percentage, icon_color, image } = config[type]

  return (
    <div className="add-income-modal mx-3 w-75 sm:w-100 p-7 sm:p-8 rounded-lg animate-modalIn">
      <div className="flex justify-between items-center mb-0.5">
        <div className={`text-[${icon_color}] flex items-center gap-x-2`}>
          <FontAwesomeIcon className={`text-2xl sm:text-3xl`} icon={icon} />
          <h1 className="syne-heading text-2xl sm:text-3xl font-bold">{title}</h1>
        </div>
        <FontAwesomeIcon 
          className="text-xl sm:text-2xl text-[#c4b8e0] cursor-pointer" 
          icon={faXmark}
          onClick={onClose}
        />
      </div>

      {calculateDistribution ? (
        <>
          <div className="mt-7 text-[#c4b8e0]">
            <div className="flex justify-between mb-2">
              <p className="syne-heading font-bold">BPI</p>
              <p className="text-green-400 font-bold">+ ₱ {Number((import.meta.env.VITE_BPI_PERCENTAGE * selectedAmount) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
              <div className="w-full h-2 bg-[#2e2460] rounded-full mb-7">
                <div
                  className={`h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${import.meta.env.VITE_BPI_PERCENTAGE}%`, background: '#6d28d9' }}
                />
              </div>

              <div className="flex justify-between mb-2">
                <p className="syne-heading font-bold">MariBank</p>
                <p className="text-green-400 font-bold">+ ₱ {Number((import.meta.env.VITE_MARIBANK_PERCENTAGE * selectedAmount) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
                <div className="w-full h-2 bg-[#2e2460] rounded-full mb-7">
                  <div
                    className={`h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${import.meta.env.VITE_MARIBANK_PERCENTAGE}%`, background: '#6d28d9' }}
                  />
                </div>

              <div className="flex justify-between mb-2">
                <p className="syne-heading font-bold">Maya</p>
                <p className="text-green-400 font-bold">+ ₱ {Number((import.meta.env.VITE_MAYA_PERCENTAGE * selectedAmount) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
                <div className="w-full h-2 bg-[#2e2460] rounded-full mb-7">
                  <div
                    className={`h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${import.meta.env.VITE_MAYA_PERCENTAGE}%`, background: '#6d28d9' }}
                  />
                </div>

                <div className="flex justify-between mb-2">
                  <p className="syne-heading font-bold">GoTyme</p>
                  <p className="text-green-400 font-bold">+ ₱ {Number((import.meta.env.VITE_GOTYME_PERCENTAGE * selectedAmount) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="w-full h-2 bg-[#2e2460] rounded-full mb-7">
                  <div
                    className={`h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${import.meta.env.VITE_GOTYME_PERCENTAGE}%`, background: '#6d28d9' }}
                  />
                </div>
          </div>

          <div className="flex justify-center">
            <button 
              className="income-button-background rounded-md syne-heading py-1.5 px-5"
              onClick={()=> setCalculateDistribution(false)}
            >
              Back
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className="text-[#c4b8e0] text-xs sm:text-sm">{description}</p>
          </div>

          <hr className="text-white/15 mt-3"/>

          <div className="flex justify-between items-center mt-3">
            <p className="syne-heading font-bold text-sm sm:text-md text-[#c4b8e0]">Total Earnings</p>
            <p className="text-[#c084fc] font-bold text-md sm:text-lg">
              ₱ {selectedAmount.toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between items-center mt-3">
            <p className="syne-heading font-bold text-sm sm:text-md text-[#c4b8e0]">Salary Distribution</p>
            <p className="text-[#c084fc] font-bold text-md sm:text-lg">
              {percentage}{title === "Wallet" ? "" : "%"}
            </p>
          </div>

          <hr className="text-white/15 mt-3"/>

           {title === "BDO" ? (
              <>
                <div className="text-right">
                  <button
                  className="income-button-background text-sm syne-heading font-bold rounded-md py-2 px-3 mb-4 mt-4"
                  onClick={() => setCalculateDistribution(true)}
                  >
                    Calculate Distribution
                  </button>
                </div>
                <hr className="text-white/15"/>
              </>
            ) : title === "Maya" || title === "MariBank" || title == "GoTyme" ? (
              <>
                <div className="text-right">
                  <button
                    className="income-button-background text-sm syne-heading font-bold rounded-md py-2 px-3 mb-4 mt-4"
                    onClick={() => setShowQR(true)}
                  >
                    Show QR Code
                  </button>
                </div>
                <hr className="text-white/15"/>
              </>
            ) : (null)}

            <div className="mt-8">
              <img src={Logo} className="w-10 mx-auto mb-2"/>
              <p className='text-[#c4b8e0]/80 text-center font-bold text-[0.7em] syne-heading'>WhyHub &#169; 2026</p>
            </div>
        </>
      )}

      {showQR && (
        <>
          <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
            <div className="add-income-modal mx-3 w-75 sm:w-120 p-7 sm:p-13 rounded-lg animate-modalIn">
              <div className="text-right">
                <FontAwesomeIcon 
                  className="text-xl sm:text-2xl text-[#c4b8e0] cursor-pointer" 
                  icon={faXmark}
                  onClick={() => setShowQR(false)}
                />
              </div>
              <p className="text-center syne-heading text-xl sm:text-3xl font-bold mb-3 text-[#c084fc]">{title} QR Code</p>
              <img className="mx-auto w-70" src={image}/>
              <div className="flex justify-center my-5">
                <p className="syne-heading bg-[#c4b8e0]/20 text-center text-[#c4b8e0] w-40 sm:w-45 rounded-full py-1.5 text-xs sm:text-sm">Transfer fees may apply</p>
              </div>
              <hr className="text-white/15 mb-5"/>
              <div className="mt-5">
                <img src={Logo} className="w-10 mx-auto mb-2"/>
                <p className='text-[#c4b8e0]/80 text-center font-bold text-[0.7em] syne-heading'>WhyHub &#169; 2026</p>
              </div>
            </div>
          </div>
        </>
      )}
        
    </div>
  )
}

export default SavingsInfo;