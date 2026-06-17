import Logo from '../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import FadeIn from '../components/FadeIn'
import DayTime from '../components/DayTime.jsx'
import { useState, useEffect } from 'react'
import LogOut from '../modals/LogOut.jsx'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons'
import { faArrowTrendDown } from '@fortawesome/free-solid-svg-icons'

function Homepage ({handleLogout}){
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    document.title = "Dashboard"
  },[])

  return(
    <>
    <header className='mx-10 mt-10 mb-7 flex justify-between'>
      <div className='flex gap-x-5'>
        <img src={Logo} className='w-20'/>
        <h1 className="text-white syne-heading font-bold mt-2 text-xl">WhyHub</h1>
      </div>

      <div className='flex gap-x-5'>
        <div className='bg-[#e2d9f3] font-medium rounded-full px-6 py-2 text-[#13102a]'>P 1,000</div>
        <FontAwesomeIcon 
          className='text-3xl mt-1 text-[#e2d9f3] cursor-pointer hover:scale-110 transition-transform duration-500' 
          icon={faArrowRightFromBracket} 
          onClick={()=> setLogoutModal(true)}
        />
      </div>
    </header>

    <main className='mx-10 mt-15'>
      <FadeIn>
        <section id='section_1' className="animate-fadeIn">
          <h1 className='text-white syne-heading font-bold text-3xl'>
            <DayTime/>
          </h1>

          <div>
            <h2 className='text-[#6b5f8a] syne-heading mt-7 mb-3'>Primary Actions</h2>
            <div id='primary_actions' className='flex gap-x-5 mb-10 '>
              <button className='income-button-background py-5 ps-7 pe-40 rounded-xl'><FontAwesomeIcon icon={faArrowTrendUp} className='me-3'/>Add Income</button>
              <button className='expenses-button-background py-5 ps-7 pe-40 rounded-xl'><FontAwesomeIcon icon={faArrowTrendDown} className='me-3'/>Add Expense</button>
            </div>

            <h2 className='text-[#6b5f8a] syne-heading mb-3'>Other Actions</h2>
            <div id='other_actions' className='flex gap-x-5'>
              <button className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-5 ps-7 pe-40 rounded-xl hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'><FontAwesomeIcon icon={faArrowRightArrowLeft} className='me-3'/>Transfer Money</button>
              <button className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-5 ps-7 pe-25 rounded-xl hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'><FontAwesomeIcon icon={faChartLine} className='me-3'/>Future Income & Expenses</button>
              <button className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-5 ps-7 pe-40 rounded-xl hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'><FontAwesomeIcon icon={faClipboardList} className='me-2'/> Utang Jazz</button>
            </div>
          </div>
        </section>
      </FadeIn>
     
    </main>

    {logoutModal &&
      <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn"
          onClick={() => setLogoutModal(false)}
      >
        <LogOut 
          handleLogout={handleLogout}  
          setLogoutModal={setLogoutModal}
        />
      </div>
    }
    </>
  )
}

export default Homepage