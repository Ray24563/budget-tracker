import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faM, faXmark, faWallet, faCreditCard, faBuildingColumns, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import Logo from '../assets/images/logo.png'


function SavingsInfo ({ type, selectedAmount, onClose }) {
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
    },

    GoTyme: {
      title: "GoTyme",
      icon: faCircleQuestion,
      description:import.meta.env.VITE_GOTYME_PURPOSE,
      percentage:import.meta.env.VITE_GOTYME_PERCENTAGE,
      icon_color: "#00D4C6",
    },

  }

  const { title, icon, description, percentage, icon_color } = config[type]

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
          {percentage}
        </p>
      </div>

      <hr className="text-white/15 mt-3"/>

        <div className="mt-8">
          <img src={Logo} className="w-10 mx-auto mb-2"/>
          <p className='text-[#c4b8e0]/80 text-center font-bold text-[0.7em] syne-heading'>WhyHub &#169; 2026</p>
        </div>
        
    </div>
  )
}

export default SavingsInfo;