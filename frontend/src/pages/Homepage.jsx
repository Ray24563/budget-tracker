import Logo from '../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCreditCard, faRightFromBracket, faArrowRightArrowLeft, faClipboardList, faChartLine, faArrowTrendUp, faArrowTrendDown, faWallet, faM, faCircleQuestion} from '@fortawesome/free-solid-svg-icons'
import FadeIn from '../components/FadeIn'
import DayTime from '../components/DayTime.jsx'
import { useState, useEffect } from 'react'
import LogOut from '../modals/LogOut.jsx'
import AddIncome from '../modals/AddIncome.jsx'
import AddExpense from '../modals/AddExpense.jsx'
import { getSummary } from '../api/summary.js'

const DEFAULT_SUMMARY = {
  savings_breakdown: [
    { savings: "Main Wallet", total_income: 0, total_expenses: 0, balance: 0 },
    { savings: "Secondary Wallet", total_income: 0, total_expenses: 0, balance: 0 },
    { savings: "Maya Wallet", total_income: 0, total_expenses: 0, balance: 0 },
    { savings: "Maya Savings", total_income: 0, total_expenses: 0, balance: 0 },
    { savings: "BPI", total_income: 0, total_expenses: 0, balance: 0 },
    { savings: "GoTyme", total_income: 0, total_expenses: 0, balance: 0 },
  ],
  overall_total_income: 0,
  overall_total_expenses: 0,
  overall_balance: 0
};

function Homepage ({handleLogout}){
  const [logoutModal, setLogoutModal] = useState(false);
  const [addIncomeModal, setAddIncomeModal] = useState(false);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const data = await getSummary();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  };

  fetchSummary();

  useEffect(() => {
    document.title = "Dashboard"
  }, []);

  const getSavings = (name) =>
    summary.savings_breakdown.find((item) => item.savings === name);

  // Get each savings individually
  const option1 = getSavings("Main Wallet");
  const option2 = getSavings("Secondary Wallet");
  const option3 = getSavings("Maya Wallet");
  const option4 = getSavings("Maya Savings");
  const option5 = getSavings("BPI");
  const option6 = getSavings("GoTyme");

  return(
    <>
    <header className='mx-10 mt-10 mb-7 flex justify-between'>
      <div className='flex gap-x-5'>
        <img src={Logo} className='w-20'/>
        <h1 className="text-white syne-heading font-bold mt-2 text-xl">WhyHub</h1>
      </div>

      <div className='flex gap-x-5'>
        <div className='bg-[#e2d9f3] font-medium rounded-full px-6 py-2 text-[#13102a]'>₱{summary.overall_balance.toLocaleString()}</div>
        <FontAwesomeIcon 
          className='text-3xl mt-1 text-[#e2d9f3] cursor-pointer hover:scale-110 transition-transform duration-500' 
          icon={faRightFromBracket} 
          onClick={()=> setLogoutModal(true)}
        />
      </div>
    </header>

    <main className='mx-10 mt-15'>
      <FadeIn>
        <section id='section_1' className="animate-fadeIn mb-20">
          <h1 className='text-white syne-heading font-bold text-3xl'>
            <DayTime/>
          </h1>

          <div>
            <h2 className='text-[#6b5f8a] syne-heading mt-7 mb-3'>Primary Actions</h2>
            <div id='primary_actions' className='flex gap-x-5 mb-10 '>
              <button 
                className='income-button-background py-5 ps-7 pe-40 rounded-xl'
                onClick={() => setAddIncomeModal(true)}
              >
                  <FontAwesomeIcon icon={faArrowTrendUp} className='me-3'/>Add Income
                </button>
              <button 
                className='expenses-button-background py-5 ps-7 pe-40 rounded-xl'
                onClick={() => setAddExpenseModal(true)}
              >
                <FontAwesomeIcon icon={faArrowTrendDown} className='me-3'/>Add Expense
              </button>
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

       <FadeIn>
        <h2 className='text-[#6b5f8a] syne-heading mt-7 mb-3'>Savings</h2>
        <section className='grid grid-cols-4 gap-x-3 mb-20'>

          <div className='savings-bg-color border-l-5 border-l-[#c084fc] rounded-lg px-10 py-5 text-[#6b5f8a]'>
            <h1 className='#a78bca mb-3'><FontAwesomeIcon icon={faWallet} className='me-3 text-[#c084fc]'/>Wallet</h1>

            <div>
              <div className='flex justify-between'>
                <p className='syne-heading'>Main</p>
                <p className='text-[#c4b8e0] font-bold text-xl'>₱ {option1?.balance.toLocaleString() ?? 0}</p>
              </div>
              <hr className='mt-3 mb-3'/>
              <div className='flex justify-between'>
                <p className='syne-heading'>Secondary</p>
                <p className='text-[#c4b8e0] font-bold text-xl'>₱ {option2?.balance.toLocaleString() ?? 0}</p>
              </div>
            </div>
          </div>

          <div className='savings-bg-color border-l-5 border-l-[#00D3B8] rounded-lg px-10 py-5 text-[#6b5f8a]'>
            <h1 className='#a78bca mb-3'><FontAwesomeIcon icon={faM} className='me-3 text-[#00D3B8]'/>Maya</h1>

            <div>
              <div className='flex justify-between'>
                <p className='syne-heading'>Wallet</p>
                <p className='text-[#c4b8e0] font-bold text-xl'>₱ {option3?.balance.toLocaleString() ?? 0}</p>
              </div>
              <hr className='mt-3 mb-3'/>
              <div className='flex justify-between'>
                <p className='syne-heading'>Savings</p>
                <p className='text-[#c4b8e0] font-bold text-xl'>₱ {option4?.balance.toLocaleString() ?? 0}</p>
              </div>
            </div>
          </div>

          <div className='savings-bg-color border-l-5 border-l-[#B11116] rounded-lg px-10 py-5 text-[#6b5f8a]'>
            <h1 className='#a78bca mb-3'><FontAwesomeIcon icon={faCreditCard} className='me-3 text-[#B11116]'/>BPI</h1>

            <h1 className='text-[#c4b8e0] font-bold text-xl'>₱ {option5?.balance.toLocaleString() ?? 0}</h1>
          </div>

          <div className='savings-bg-color border-l-5 border-l-[#00D4C6] rounded-lg px-10 py-5 text-[#6b5f8a]'>
            <h1 className='#a78bca mb-3'><FontAwesomeIcon icon={faCircleQuestion} className='me-3 text-[#00D4C6]'/>GoTyme</h1>

            <h1 className='text-[#c4b8e0] font-bold text-xl'>₱ {option6?.balance.toLocaleString() ?? 0}</h1>
          </div>

        </section>
      </FadeIn>

      <FadeIn>
        <h2 className='text-[#6b5f8a] syne-heading mt-7 mb-3'>Dashboard</h2>
        <section className='grid grid-cols-[1.8fr_1fr] gap-x-3 mb-20'>

          <div className='bg-[#1c1640] border border-[#2e2460] rounded-lg px-10 py-5 text-[#6b5f8a]'>
            Dito ang Expenses Bar Graph for the Month.
          </div>

          <div className='bg-[#1c1640] border border-[#2e2460] rounded-lg px-10 py-5 text-[#6b5f8a]'>
            Dito ang Expenses vs Income Total For Month
          </div>

        </section>
      </FadeIn>

      <FadeIn>
        <h2 className='text-[#6b5f8a] syne-heading mt-7 mb-3'>Recent Transaction</h2>
        <section className='grid grid-cols-2 gap-x-3'>

          <div className='bg-[#1c1640] border border-[#2e2460] rounded-lg px-10 py-5 text-[#6b5f8a]'>
            Recent Income
          </div>

          <div className='bg-[#1c1640] border border-[#2e2460] rounded-lg px-10 py-5 text-[#6b5f8a]'>
            Recent Expenses
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

    {addIncomeModal &&
      <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
        <AddIncome 
          setAddIncomeModal={setAddIncomeModal}
          onSuccess={fetchSummary}
        />
      </div>
    }

    {addExpenseModal &&
      <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
        <AddExpense 
          setAddExpenseModal={setAddExpenseModal}
          onSuccess={fetchSummary}
        />
      </div>
    }
    </>
  )
}

export default Homepage