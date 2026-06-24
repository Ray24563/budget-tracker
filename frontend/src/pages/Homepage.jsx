import Logo from '../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCreditCard, faRightFromBracket, faArrowRightArrowLeft, faClipboardList, faChartLine, faArrowTrendUp, faArrowTrendDown, faWallet, faM, faCircleQuestion, faListCheck, faListOl, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import FadeIn from '../components/FadeIn'
import DayTime from '../components/DayTime.jsx'
import { useState, useEffect, useCallback } from 'react'
import LogOut from '../modals/LogOut.jsx'
import AddIncome from '../modals/AddIncome.jsx'
import AddExpense from '../modals/AddExpense.jsx'
import { getSummary } from '../api/summary.js'
import { useNavigate } from 'react-router-dom'
import MonthlyGraph from '../components/MonthlyGraph.jsx'
import IncomeVsExpenses from '../components/IncomeVsExpenses.jsx'
import RecentIncome from '../components/RecentIncome.jsx'
import RecentExpenses from '../components/RecentExpenses.jsx'
import TransferMoney from '../modals/TransferMoney.jsx'
import FuturePage from './FuturePage.jsx'
import LoanPage from './LoanPage.jsx'

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
  const [transMoneyModal, setTransMoneyModal] = useState(false);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await getSummary();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Dashboard";
    fetchSummary();
  }, [fetchSummary]);

  const getSavings = (name) =>
    summary.savings_breakdown.find((item) => item.savings === name);

  // Get each savings individually
  const option1 = getSavings("Main Wallet");
  const option2 = getSavings("Secondary Wallet");
  const option3 = getSavings("Maya Wallet");
  const option4 = getSavings("Maya Savings");
  const option5 = getSavings("BPI");
  const option6 = getSavings("GoTyme");

  const navigate = useNavigate();

  const navigateToIncomePage = () => {
    navigate('/income')
  };
  
  const navigateToExpensePage = () => {
    navigate('/expense')
  };

  const navigateToTransferMoneyPage = () => {
    navigate('/money_transfer_history')
  }

  const navigateToFuturePage = () => {
    navigate('/future')
  }

  const navigateToLoanPage = () => {
    navigate("/loans")
  }

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  }

  return(
    <>
    <header className='mx-10 mt-10 mb-7 flex justify-between'>
      <div className='flex gap-x-5'>
        <button onClick={togglePanel} className='toggle-button hover:scale-120 transition-transform duration-500'>☰</button>
        <img src={Logo} className='w-20'/>
        <h1 className="text-white syne-heading font-bold mt-2 text-xl">WhyHub</h1>
      </div>
    </header>

    <div className={`side-panel ${isPanelOpen ? "open" : ""}`}>
      <div className="text-right">
        <button onClick={togglePanel} className="text-[#c4b8e0] font-bold text-2xl cursor-pointer hover:scale-120 transition-transform duration-500">
          ✕
        </button>
      </div>

      <div>
        <h2 className='text-[#6b5f8a] text-sm syne-heading mt-5 mb-3'>Primary Actions</h2>
          <div id='primary_actions'>
            <button 
              className='income-button-background py-3 ps-5 w-full text-left rounded-md mb-5'
              onClick={() => (setAddIncomeModal(true), setIsPanelOpen(false))}
            >
                <FontAwesomeIcon icon={faArrowTrendUp} className='me-3'/>Add Income
              </button>
            <button 
              className='expenses-button-background py-3 ps-5 w-full text-left rounded-md'
              onClick={() => (setAddExpenseModal(true), setIsPanelOpen(false))}
            >
              <FontAwesomeIcon icon={faArrowTrendDown} className='me-3'/>Add Expense
            </button>
          </div>
        </div>

        <div className='mt-10'>
          <h2 className='text-[#6b5f8a] syne-heading mb-3 text-sm'>Navigations</h2>
            <div id='other_actions'>
              <button 
                className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-3 ps-5 w-full rounded-md mb-5 hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500 text-left'
                onClick={navigateToIncomePage}
              >
                <FontAwesomeIcon icon={faListCheck} className='me-3'/>Income List
              </button>

              <button 
                className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-3 ps-5 w-full text-left rounded-md mb-5 hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'
                onClick={navigateToExpensePage}
              >
                <FontAwesomeIcon icon={faListOl} className='me-3'/>Expenses List
              </button>

              <button 
                className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-3 ps-5 w-full text-left rounded-md mb-5 hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'
                onClick={navigateToTransferMoneyPage}
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} className='me-3'/>Money Transfer History
              </button>
              
              <button 
                className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-3 ps-5 w-full text-left rounded-md mb-5 hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'
                onClick={() => (setLogoutModal(true), setIsPanelOpen(false))}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className='me-3'/>Logout
              </button>
            </div>
          </div>

        <div className='mt-5'>
          <h2 className='text-[#6b5f8a] syne-heading mb-3 text-sm'>Other Actions</h2>
            <div id='other_actions'>
              <button className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-3 ps-5 w-full text-left rounded-md mb-5 hover:bg-[rgb(28,22,64)] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'
              onClick={() => (setTransMoneyModal(true), setIsPanelOpen(false))}
              >
                <FontAwesomeIcon icon={faArrowRightArrowLeft} className='me-3'/>Transfer Money
              </button>

              <button 
                className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-3 ps-5 w-full text-left rounded-md mb-5 hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'
                onClick={navigateToFuturePage}
              >
                  <FontAwesomeIcon icon={faChartLine} className='me-3'/>Future
                </button>

              <button 
                className='bg-transparent border border-[#3b2d6a] text-[#c4b8e0] py-3 ps-5 w-full text-left rounded-md mb-5 hover:bg-[#1c1640] hover:border-[#4c2f8f] cursor-pointer transition-all duration-500'
                onClick={navigateToLoanPage}
              >
                <FontAwesomeIcon icon={faClipboardList} className='me-2'/> Debt
              </button>
            </div>
          </div>
      </div>

    <main className='mx-10 mt-15'>
      <FadeIn>
        <section id='section_1' className="animate-fadeIn mb-10">
          <h1 className='text-white syne-heading font-bold text-3xl'>
            <DayTime/>
          </h1>
        </section>
      </FadeIn>

       <FadeIn>
        <div className='flex justify-between mb-5'>
          <h2 className='text-[#6b5f8a] syne-heading mt-2'>Savings</h2>
          <h1 className='text-[#c4b8e0] font-bold text-xl'>₱ {summary.overall_balance.toLocaleString()}</h1>
        </div>
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
        <section className='grid grid-cols-[1.8fr_1fr] gap-x-5 mb-20'>

          <div className='bg-[#1c1640] border border-[#2e2460] rounded-lg px-7 pt-10 text-[#6b5f8a]'>
            <MonthlyGraph/>

            <p 
              className='text-sm text-right mt-5 underline cursor-pointer hover:text-[#c4b8e0] transition-colors duration-500'
              onClick={navigateToExpensePage}
            >
                See All →
            </p>
          </div>

          <div className='bg-[#1c1640] border border-[#2e2460] rounded-lg text-[#6b5f8a] pt-7 pb-5 px-10'>
            <IncomeVsExpenses/>
          </div>

        </section>
      </FadeIn>

      <FadeIn>
        <h2 className='text-[#6b5f8a] syne-heading mt-7 mb-3'>Recent Transaction</h2>
        <section className='grid grid-cols-2 gap-x-5'>

          <div className='bg-[#1c1640] border border-[#2e2460] rounded-lg px-10 py-7 text-[#6b5f8a]'>
            <div className='flex justify-between'>
              <p className='text-[#c4b8e0] mb-5 font-bold text-xl syne-heading'>Recent Incomes</p>
              <p 
                className='text-sm underline cursor-pointer hover:text-[#c4b8e0] transition-colors duration-500'
                onClick={navigateToIncomePage}
              >
                  See All →
              </p>
            </div>
            <RecentIncome/>
          </div>

          <div className='bg-[#1c1640] border border-[#2e2460] rounded-lg px-10 py-7 text-[#6b5f8a]'>
            <div className='flex justify-between'>
              <p className='text-[#c4b8e0] mb-5 font-bold text-xl syne-heading'>Recent Expenses</p>
              <p 
                className='text-sm underline cursor-pointer hover:text-[#c4b8e0] transition-colors duration-500'
                onClick={navigateToExpensePage}
              >
                  See All →
              </p>
            </div>
            <RecentExpenses/>
          </div>

        </section>
      </FadeIn>
     
    </main>

    <footer className='mt-20 px-10 py-4 text-[#6b5f8a] syne-heading border-t border-t-[#2e2460] text-sm text-center'>
      <p className='opacity-60'>Built for personal use by Bari. --- <span className='text-[#c4b8e0] font-bold'>WhyHub &#169; 2026</span></p>
    </footer>

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

    {transMoneyModal &&
      <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
        <TransferMoney 
          setTransMoneyModal={setTransMoneyModal}
          onSuccess={fetchSummary}
        />
      </div>
    }
    </>
  )
}

export default Homepage