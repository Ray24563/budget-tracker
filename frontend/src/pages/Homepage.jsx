import Logo from '../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import FadeIn from '../components/FadeIn'
import DayTime from '../components/DayTime.jsx'
import { useState } from 'react'

function Homepage ({handleLogout}){
  const [logoutModal, setLogoutModal] = useState(false);

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
          <h1 className='text-white syne-heading font-bold text-3xl'><DayTime/></h1>
        </section>
      </FadeIn>
     
    </main>

    {logoutModal &&
      <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn"
          onClick={() => setLogoutModal(false)}
      >
        <div className='bg-[#261d52] p-15 rounded-lg border border-[#e2d9f3] animate-modalIn'>
          <h1 className='text-2xl mb-10 text-[#e2d9f3] font-bold'>
            Are you sure you want to Logout?
          </h1>

          <div className='flex justify-center gap-x-7 syne-heading text-lg'>
            <button 
              className='bg-[#e2d9f3] px-8 py-1 rounded-full cursor-pointer hover:scale-105 transition-transform duration-500'
              onClick={handleLogout}
            >
              Yes
            </button>

            <button 
              className='bg-[#7c6e9c] px-3 rounded-full cursor-pointer hover:scale-105 transition-transform duration-500'
              onClick={() => setLogoutModal(false)}
            >
              No, Go Back
            </button>
          </div>
        </div>
      </div>
    }
    </>
  )
}

export default Homepage