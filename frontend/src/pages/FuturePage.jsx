import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllFutureIncome, getAllFutureExpenses, getFutureSummary, deleteFutureIncome, deleteFutureExpense } from "../api/future";
import { SAVINGS_OPTIONS, EXPENSE_CATEGORIES } from "../constants/savings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faWallet, faM, faCreditCard, faCircleQuestion, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../components/FadeIn";
import AddFutureIncome from "../modals/AddFutureIncome";
import AddFutureExpense from "../modals/AddFutureExpense";
import { useNavigate } from "react-router-dom";
import { DateFormatter } from "../utils/DateFormatter";

const DEFAULT_FUTURE_SUMMARY = {
  savings_breakdown: [
    { savings: "Main Wallet",      future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "Secondary Wallet", future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "Maya Wallet",      future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "Maya Savings",     future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "BPI",              future_income: 0, future_expenses: 0, projected_balance: 0 },
    { savings: "GoTyme",           future_income: 0, future_expenses: 0, projected_balance: 0 },
  ],
  overall_future_income: 0,
  overall_future_expenses: 0,
  overall_projected_balance: 0
};

function FuturePage() {
  const [futureIncome, setFutureIncome] = useState([]);
  const [futureExpenses, setFutureExpenses] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_FUTURE_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addFutureIncomeModal, setAddFutureIncomeModal] = useState(false);
  const [addFutureExpenseModal, setAddFutureExpenseModal] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [income, expenses, sum] = await Promise.all([
        getAllFutureIncome(),
        getAllFutureExpenses(),
        getFutureSummary()
      ]);
      setFutureIncome(income);
      setFutureExpenses(expenses);
      setSummary(sum);
    } catch (err) {
      console.error("Failed to fetch future data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Future";
    fetchAll();
  }, [fetchAll]);

  const handleDeleteIncome = async (id) => {
    try {
      await deleteFutureIncome(id);
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

   const handleDeleteExpense = async (id) => {
    try {
      await deleteFutureExpense(id);
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const getSavings = (name) =>
    summary.savings_breakdown.find((item) => item.savings === name);
  
  const navigateToHomepage = () => {
    navigate("/");
  }

  return(
    <>
      <header className="px-5 sm:px-20 pt-15 sm:pt-20">
        <div className="flex">
          <h1 
            className="text-[#e2d9f3] syne-heading text-5xl text-[1.8em] sm:text-5xl font-bold cursor-pointer"
            onClick={navigateToHomepage}
          >
            <FontAwesomeIcon icon={faChartLine} className="me-3 text-[#6b5f8a]"/> Future Income & Expenses
          </h1>
        </div>
      </header>

      <main className="px-5 sm:px-20 mt-10 sm:mt-15">
         <FadeIn>
          <div className='flex justify-between mb-5'>
            <h2 className='text-[#6b5f8a] syne-heading mt-0.5 sm:mt-2'>Savings</h2>
            <h1 className='text-[#c4b8e0] font-bold text-lg sm:text-xl'>₱ {summary.overall_projected_balance.toLocaleString()}</h1>
          </div>
          <section className='grid grid-cols-1 lg:grid-cols-4 gap-y-5 lg:gap-y-0 gap-x-0 lg:gap-x-3 mb-20'>

            <div className='savings-bg-color border-l-5 border-l-[#c084fc] rounded-lg px-7 sm:px-10 py-5 text-[#6b5f8a]'>
              <h1 className='#a78bca mb-5'><FontAwesomeIcon icon={faWallet} className='me-3 text-[#c084fc]'/>Wallet</h1>

              <div>
                <div className='flex justify-between'>
                  <p className='syne-heading mt-0.5 sm:mt-0'>Main</p>
                  <p className='text-[#c4b8e0] font-bold text-lg sm:text-xl'>₱ {getSavings("Main Wallet")?.projected_balance.toLocaleString() ?? 0}</p>
                </div>
                <hr className='mt-3 mb-3'/>
                <div className='flex justify-between'>
                  <p className='syne-heading mt-0.5 sm:mt-0'>Secondary</p>
                  <p className='text-[#c4b8e0] font-bold text-lg sm:text-xl'>₱ {getSavings("Secondary Wallet")?.projected_balance.toLocaleString() ?? 0}</p>
                </div>
              </div>
            </div>

            <div className='savings-bg-color border-l-5 border-l-[#00D3B8] rounded-lg px-7 sm:px-10 py-5 text-[#6b5f8a]'>
              <h1 className='#a78bca mb-5'><FontAwesomeIcon icon={faM} className='me-3 text-[#00D3B8]'/>Maya</h1>

              <div>
                <div className='flex justify-between'>
                  <p className='syne-heading mt-0.5 sm:mt-0'>Wallet</p>
                  <p className='text-[#c4b8e0] font-bold text-lg sm:text-xl'>₱ {getSavings("Maya Wallet")?.projected_balance.toLocaleString() ?? 0}</p>
                </div>
                <hr className='mt-3 mb-3'/>
                <div className='flex justify-between'>
                  <p className='syne-heading mt-0.5 sm:mt-0'>Savings</p>
                  <p className='text-[#c4b8e0] font-bold text-lg sm:text-xl'>₱ {getSavings("Maya Savings")?.projected_balance.toLocaleString() ?? 0}</p>
                </div>
              </div>
            </div>

            <div className='savings-bg-color border-l-5 border-l-[#B11116] rounded-lg px-7 sm:px-10 pt-5 pb-16 sm:py-5 sm:pb-0 text-[#6b5f8a]'>
              <h1 className='#a78bca mb-3'><FontAwesomeIcon icon={faCreditCard} className='me-3 text-[#B11116]'/>BPI</h1>

              <h1 className='text-[#c4b8e0] font-bold text-xl'>₱ {getSavings("BPI")?.projected_balance.toLocaleString() ?? 0}</h1>
            </div>

            <div className='savings-bg-color border-l-5 border-l-[#00D4C6] rounded-lg px-7 sm:px-10 pt-5 pb-16 sm:py-5 sm:pb-0 text-[#6b5f8a]'>
              <h1 className='#a78bca mb-3'><FontAwesomeIcon icon={faCircleQuestion} className='me-3 text-[#00D4C6]'/>GoTyme</h1>

              <h1 className='text-[#c4b8e0] font-bold text-xl'>₱ {getSavings("GoTyme")?.projected_balance.toLocaleString() ?? 0}</h1>
            </div>
        </section>
      </FadeIn>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-0 gap-y-10 sm:gap-y-0 sm:gap-x-10">
          <div>
            <div className="flex gap-x-5 mb-5">
              <FontAwesomeIcon 
                icon={faPlus} 
                className="income-button-background p-2.5 rounded-full"
                onClick={() => setAddFutureIncomeModal(true)}
              />
              <p className="text-[#e2d9f3] syne-heading text-xl mt-1 font-bold">Income</p>
            </div>
            {loading ? (
              <p className="text-[#6b5f8a] text-sm">Loading...</p>
            ) : futureIncome.length === 0 ? (
              <p className="text-[#6b5f8a] text-md syne-heading">No future incomes recorded.</p>
            ) : !isMobile ? (
              <>
                <table className="w-full text-left border-collapse animate-tableIn">
                  <thead>
                    <tr className="border-b border-[#2e2460]">
                      <th className="text-[#6b5f8a] text-sm pb-3 font-medium">Date</th>
                      <th className="text-[#6b5f8a] text-sm pb-3 font-medium">Source</th>
                      <th className="text-[#6b5f8a] text-sm pb-3 font-medium">Savings</th>
                      <th className="text-[#6b5f8a] text-sm pb-3 font-medium">Amount</th>
                      <th className="text-[#6b5f8a] text-sm pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {futureIncome.map((item) => (
                      <tr key={item.id} className="border-b border-[#2e2460] hover:bg-[#1c1640]">
                        <td className="text-[#e2d9f3] py-3 text-sm">{item.date}</td>
                        <td className="text-[#e2d9f3] py-3 text-sm">{item.source}</td>
                        <td className="text-[#e2d9f3] py-3 text-sm">{item.savings}</td>
                        <td className="text-green-400 py-3 text-sm font-bold">+ ₱ {item.amount.toLocaleString()}</td>
                        <td className="py-3">
                          <button
                            onClick={() => handleDeleteIncome(item.id)}
                            className="text-red-400 text-xs hover:underline cursor-pointer syne-heading"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="flex flex-col gap-6">
                {Object.entries(
                  futureIncome.reduce((groups, item) => {
                    const date = item.date
                    if (!groups[date]) groups[date] = []
                    groups[date].push(item)
                    return groups
                  }, {})
                ).map(([date, items]) => (
                  <div key={date}>
    
                    {/* Date divider */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-[#2e2460]" />
                      <span className="text-[#e2d9f3] text-sm bg-[#2e2460]/80 px-4 py-1 rounded-full syne-heading font-bold">{DateFormatter(date)}</span>
                      <div className="h-px flex-1 bg-[#2e2460]" />
                    </div>
    
                    {/* Rows under this date */}
                    <div className="flex flex-col gap-y-7">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center px-2">
                          <div>
                            <p className="text-[#9b8ab8] text-xs">{item.savings}</p>
                            <p className="text-[#e2d9f3] text-md font-medium mt-1">{item.source}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-green-400 font-bold text-md">+ ₱ {item.amount.toLocaleString()}</span>
                            <button 
                              onClick={() => (handleDeleteIncome(item.id))}>
                              <FontAwesomeIcon icon={faTrash} className="text-red-400 transition-colors text-xs px-1.5 py-1.5 rounded-full mt-1" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
    
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="block sm:hidden text-[#e2d9f3]"/>

          <div>
             <div className="flex gap-x-5 mb-5">
              <FontAwesomeIcon 
                icon={faPlus} 
                className="income-button-background p-2.5 rounded-full"
                onClick={() => setAddFutureExpenseModal(true)}
              />
              <p className="text-[#e2d9f3] syne-heading text-xl mt-1 font-bold">Expense</p>
            </div>
            {loading ? (
              <p className="text-[#6b5f8a] text-md syne-heading">Loading...</p>
            ) : futureExpenses.length === 0 ? (
              <p className="text-[#6b5f8a] text-md syne-heading">No future expenses recorded.</p>
            ) : !isMobile ? (
              <table className="w-full text-left border-collapse animate-tableIn">
                <thead>
                  <tr className="border-b border-[#2e2460]">
                    <th className="text-[#6b5f8a] text-sm pb-3 px-3 font-medium">Date</th>
                    <th className="text-[#6b5f8a] text-sm pb-3 px-3 font-medium">Category</th>
                    <th className="text-[#6b5f8a] text-sm pb-3 px-3 font-medium">Source</th>
                    <th className="text-[#6b5f8a] text-sm pb-3 px-3 font-medium">Savings</th>
                    <th className="text-[#6b5f8a] text-sm pb-3 px-3 font-medium">Amount</th>
                    <th className="text-[#6b5f8a] text-sm pb-3 px-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {futureExpenses.map((item) => (
                    <tr key={item.id} className="border-b border-[#2e2460] hover:bg-[#1c1640]">
                      <td className="text-[#e2d9f3] py-3 px-3 text-sm">{item.date}</td>
                      <td className="text-[#e2d9f3] py-3 px-3 text-sm">{item.category}</td>
                      <td className="text-[#e2d9f3] py-3 px-3 text-sm">{item.source}</td>
                      <td className="text-[#e2d9f3] py-3 px-3 text-sm">{item.savings}</td>
                      <td className="text-red-400 py-3 px-3 text-sm font-bold">- ₱ {item.amount.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleDeleteExpense(item.id)}
                          className="text-red-400 text-xs hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col gap-6">
                {Object.entries(
                  futureExpenses.reduce((groups, item) => {
                    const date = item.date
                    if (!groups[date]) groups[date] = []
                    groups[date].push(item)
                    return groups
                  }, {})
                ).map(([date, items]) => (
                  <div key={date}>
    
                    {/* Date divider */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-[#2e2460]" />
                      <span className="text-[#e2d9f3] text-sm bg-[#2e2460]/80 px-4 py-1 rounded-full syne-heading font-bold">{DateFormatter(date)}</span>
                      <div className="h-px flex-1 bg-[#2e2460]" />
                    </div>
    
                    {/* Rows under this date */}
                    <div className="flex flex-col gap-y-7">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center px-2">
                          <div>
                            <p className="text-[#9b8ab8] text-xs">{item.category}</p>
                            <p className="text-[#e2d9f3] text-md font-medium mt-1">{item.source}</p>
                            <p className="text-[#9b8ab8] text-xs">{item.savings}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-red-400 font-bold text-md">- ₱ {item.amount.toLocaleString()}</span>
                            <button 
                              onClick={() => (handleDeleteIncome(item.id))}>
                              <FontAwesomeIcon icon={faTrash} className="text-red-400 transition-colors text-xs px-1.5 py-1.5 rounded-full mt-1" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
    
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
         <button className="income-button-background rounded-lg px-5 py-2 mt-10 mb-10" onClick={navigateToHomepage}>Back</button>
      </main>

      {addFutureIncomeModal &&
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
          <AddFutureIncome 
            setAddFutureIncomeModal={setAddFutureIncomeModal}
          />
        </div>
      }

      {addFutureExpenseModal &&
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
          <AddFutureExpense 
            setAddFutureExpenseModal={setAddFutureExpenseModal}
          />
        </div>
      }
    </>
  )
}

export default FuturePage