import { useState, useEffect } from "react";
import { getAllExpenses, deleteExpense } from "../api/expenses";
import AddExpense from "../modals/AddExpense";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendDown, faCalendar, faWallet, faM, faCreditCard, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../components/FadeIn";
import { useNavigate } from "react-router-dom";
import { DateFormatter, DateFormatterSelector } from "../utils/DateFormatter";
import SaveAsPDFModalExpense from "../modals/SaveAsPDFModalExpense";
import { saveAsPDFExpense } from "../utils/saveAsPDFExpense";
import ConfirmDeleteExpense from "../modals/ConfirmDeleteExpense";
import Loader from "../components/Loader";
import ExpenseInfoModal from "../modals/ExpenseInfoModal";

export default function ExpensePage() {
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonthForTable, setSelectedMonthForTable] = useState("all");
  const filteredExpense = selectedMonthForTable === "all"
    ? expenseList
    : expenseList.filter((item) => item.date.slice(0, 7) === selectedMonthForTable);
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredExpense.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredExpense.slice(startIndex, startIndex + itemsPerPage);
  const navigate = useNavigate()
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [saveAsPDFModal, setSaveAsPDFModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedSavings, setSelectedSavings] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [infoModal, setInfoModal] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getAllExpenses();
      setExpenseList(data);
    } catch (err) {
      console.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Expenses"
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense");
    }
  };

  const availableMonths = [
    ...new Set(expenseList.map((item) => item.date.slice(0, 7)))
  ].sort().reverse(); // latest month first
  
  const handleExportPDF = () => {
    saveAsPDFExpense(expenseList, selectedMonth);
  };

   const getVisiblePages = (currentPage, totalPages) => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = currentPage - 1;
    let end = currentPage + 1;

    if (start < 1) {
      start = 1;
      end = 3;
    }

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - 2;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const navigateToHomepage = () =>{
    navigate('/')
  }

  return (
    <>
      <header className="px-5 sm:px-20 pt-15 sm:pt-20">
        <div className="flex">
          <h1 
          className="text-[#e2d9f3] syne-heading text-5xl text-[1.8em] sm:text-5xl font-bold cursor-pointer"
          onClick={navigateToHomepage}
          >
            <FontAwesomeIcon icon={faArrowTrendDown} className="me-3 text-[#6b5f8a]"/> List of Expenses
          </h1>
          </div>
      </header>

      <FadeIn>
        <main className="px-5 sm:px-20 mt-10 sm:mt-15">
          {loading ? (
            <div className="h-screen flex justify-center mt-35">
              <Loader/>
            </div>
          ) : expenseList.length === 0 ? (
            <p className="text-[#e2d9f3]">No expense records yet.</p>
          ) : (
            <>
              <div className="text-right mb-7">
                <label className="text-[#e2d9f3] syne-heading me-3 sm:me-5 text-sm sm:text-[0.9em]">Filter Table: </label>
                  <select
                    value={selectedMonthForTable}
                    onChange={(e) => setSelectedMonthForTable(e.target.value)}
                    className="bg-[#0a0818] border border-[#2e2460] text-[#e2d9f3] rounded-lg px-3 py-2 text-xs sm:text-[0.9em] syne-heading cursor-pointer"
                    >
                      <option value="all">All Time</option>
                      {availableMonths.map((month) => (
                        <option key={month} value={month}>{DateFormatterSelector(month)}</option>
                      ))}
                  </select>
              </div>
              <div className="animate-tableIn" key={currentPage}>
                {!isMobile && (
                  <div className="flex flex-col">
                    {Object.entries(
                      currentItems.reduce((groups, item) => {
                        const date = item.date
                        if (!groups[date]) groups[date] = []
                        groups[date].push(item)
                        return groups
                      }, {})
                    ).map(([date, items], index, arr) => (
                      <div key={date}>

                        {/* Date divider */}
                        <div className="flex flex-col">
                          <div className="flex gap-x-5">

                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full border border-[#3b2d6a] bg-[#1c1640] flex items-center justify-center">
                                <FontAwesomeIcon icon={faCalendar} className="text-[#6d28d9] text-sm" />
                              </div>
                              {/* hide line on last item */}
                              {index < arr.length - 1 && (
                                <div className="w-px h-full bg-[#3b2d6a]" />
                              )}
                            </div>

                            <div className="mt-0.5 grow">
                              <p className="text-[#e2d9f3] text-lg syne-heading mb-5 font-bold">{DateFormatter(date)}</p>
                                {items.map((item) => (
                                    <div 
                                      key={item.id}
                                        onClick={() => (
                                        setConfirmationModal(true),
                                        setSelectedDate(item.date),
                                        setSelectedID(item.id),
                                        setSelectedAmount(item.amount),
                                        setSelectedCategory(item.category),
                                        setSelectedSource(item.source),
                                        setSelectedSavings(item.savings)
                                      )}  
                                      className="flex items-center justify-between bg-white/[0.024] border border-[rgba(167,139,250,0.07)] opacity-100 transition-all duration-300 shadow-none w-full pt-4 pb-5 px-5 mb-7 rounded-xl cursor-pointer"
                                    >
                                    <div className="flex items-center">
                                      <FontAwesomeIcon
                                        className={`p-2 text-sm me-3 rounded-lg border border-[#3b2d6a] bg-[#1c1640] ${(item.savings == "Main Wallet" || item.savings == "Secondary Wallet") ? "text-[#c084fc]" : (item.savings == "Maya Wallet" || item.savings == "Maya Savings") ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : item.savings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : item.savings === "BDO" ? "bg-[rgba(10,61,143,0.1)] text-[rgb(96,165,250)] border border-[rgba(10,61,143,0.25)]" : item.savings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"}`}
                                        icon={
                                          (item.savings == "Main Wallet" || item.savings == "Secondary Wallet") 
                                            ? faWallet
                                          : (item.savings == "Maya Wallet" || item.savings == "Maya Savings")
                                            ? faM
                                          : item.savings === "BPI"
                                            ? faCreditCard
                                          : item.savings === "GoTyme"
                                            ? faCircleQuestion
                                            : faWallet}
                                      />
                                      <div>
                                        <p className="text-[#e2d9f3] syne-heading text-lg truncate w-70 lg:w-150 font-bold mt-1 mb-1">{item.source}</p>
                                        <p className={`inline-block pt-0.5 pb-1 font-bold px-2 rounded-md ${(item.savings == "Main Wallet" || item.savings == "Secondary Wallet") ? "bg-[rgba(139,92,246,0.12)] text-[rgb(196,181,253)] border w-auto border-[rgba(139,92,246,0.22)]" : (item.savings == "Maya Wallet" || item.savings == "Maya Savings") ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : item.savings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : item.savings === "BDO" ? "bg-[rgba(10,61,143,0.1)] text-[rgb(96,165,250)] border border-[rgba(10,61,143,0.25)]" : item.savings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"} text-xs`}><span className={`text-sm ${(item.savings == "Main Wallet" || item.savings == "Secondary Wallet") ? "text-[#c084fc]" : (item.savings == "Maya Wallet" || item.savings == "Maya Savings") ? " text-[rgb(110,231,183)]" : item.savings === "BPI" ? "text-[rgb(248,113,113)]" : item.savings === "BDO" ? "text-[rgb(96,165,250)]" : item.savings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}>&bull;</span> {item.savings}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col text-right">
                                      <span className="text-red-400 font-bold text-lg mt-1.5">- ₱ {item.amount.toLocaleString()}</span>
                                      <p className="text-[#9b8ab8] text-sm">{item.category}</p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {isMobile && (
                  <div className="flex flex-col gap-6">
                    {Object.entries(
                      currentItems.reduce((groups, item) => {
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
                            <div 
                              key={item.id} 
                              className="flex justify-between items-center px-2"
                              onClick={() => (
                                              setInfoModal(true),
                                              setSelectedDate(item.date),
                                              setSelectedID(item.id),
                                              setSelectedAmount(item.amount),
                                              setSelectedSource(item.source),
                                              setSelectedSavings(item.savings),
                                              setSelectedCategory(item.category)
                                      )}
                            >
                              <div>
                                <p className="text-[#e2d9f3] truncate w-45 text-md syne-heading font-bold mt-1">{item.source}</p>
                                <p className="text-[#9b8ab8] text-xs">{item.category}</p>
                              </div>
                              <div className="flex flex-col text-right">
                                <span className="text-red-400 font-bold text-sm">- ₱ {item.amount.toLocaleString()}</span>
                                <p className="text-[#9b8ab8] text-xs">{item.savings}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between flex-col gap-y-10 sm:gap-y-0 sm:flex-row-reverse mt-8 mb-15">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}
                    className="rounded-full sm:rounded-lg sm:border sm:border-[#3b2d6a] text-[#a78bca] disabled:opacity-30 hover:border-[#4c2f8f] hover:text-[#e2d9f3] transition-all duration-150 disabled:cursor-not-allowed cursor-pointer sm:px-4 sm:py-2 px-2.5 pb-1 pt-0.5 sm:p-0 text-sm sm:text-md font-bold"
                  >
                    {isMobile? "<" : "← Prev"}
                  </button>

                  {getVisiblePages(currentPage, totalPages)[0] > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="w-9 h-9 rounded-full sm:rounded-lg text-sm font-medium transition-all duration-150 border border-[#3b2d6a] text-[#a78bca] hover:border-[#4c2f8f] hover:text-[#e2d9f3]"
                      >
                        1
                      </button>
                      {getVisiblePages(currentPage, totalPages)[0] > 2 && (
                        <span className="text-[#6b5f8a]">...</span>
                      )}
                    </>
                  )}

                  {/* Visible Pages */}
                  {getVisiblePages(currentPage, totalPages).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-full sm:rounded-lg text-sm font-medium transition-all duration-150
                        ${currentPage === page
                          ? 'text-[#f0eaff]'
                          : 'border border-[#3b2d6a] text-[#a78bca] hover:border-[#4c2f8f] hover:text-[#e2d9f3]'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Last page + ellipsis */}
                  {getVisiblePages(currentPage, totalPages)[getVisiblePages(currentPage, totalPages).length - 1] < totalPages && (
                    <>
                      {getVisiblePages(currentPage, totalPages)[getVisiblePages(currentPage, totalPages).length - 1] < totalPages - 1 && (
                        <span className="text-[#6b5f8a]">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-9 h-9 rounded-full sm:rounded-lg text-sm font-medium transition-all duration-150 border border-[#3b2d6a] text-[#a78bca] hover:border-[#4c2f8f] hover:text-[#e2d9f3]"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-full sm:rounded-lg sm:border sm:border-[#3b2d6a] text-[#a78bca] disabled:opacity-30 hover:border-[#4c2f8f] hover:text-[#e2d9f3] transition-all duration-150 disabled:cursor-not-allowed cursor-pointer sm:px-4 sm:py-2 px-2.5 pb-1 pt-0.5 sm:p-0 text-sm sm:text-md font-bold"
                  >
                     {isMobile ? ">" : "Next →"}
                  </button>
                </div>

                <div className="flex justify-center gap-x-4 sm:gap-x-5">
                    <button 
                      className="income-button-background rounded-lg px-4 py-2 sm:px-5 sm:py-2 cursor-pointer text-[0.8em] sm:text-md"
                      onClick={ () => setSaveAsPDFModal(true) }
                    >
                        Save as PDF
                    </button>

                    <button 
                      className="back-background rounded-lg px-3 py-2 sm:px-5 sm:py-2 cursor-pointer text-[0.8em] sm:text-md" 
                      onClick={navigateToHomepage}
                    >
                      Back
                    </button>
                </div>
              </div>
            </>
          )}
        </main>
      </FadeIn>

       {saveAsPDFModal &&
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
          <SaveAsPDFModalExpense
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            availableMonths={availableMonths}
            handleExportPDF={handleExportPDF}
            setSaveAsPDFModal={setSaveAsPDFModal} 
          />
        </div>
      }

      {confirmationModal &&
      <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
        <ConfirmDeleteExpense
          isMobile={isMobile}
          handleDelete={handleDelete}
          selectedAmount={selectedAmount}
          selectedDate={selectedDate}
          selectedSource={selectedSource}
          selectedSavings={selectedSavings}
          setConfirmationModal={setConfirmationModal}
          selectedID={selectedID}
          selectedCategory={selectedCategory}
        />
      </div> 
    }

    {infoModal &&
      <div 
        className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn"
        onClick={() => setInfoModal(false)}
      >
        <ExpenseInfoModal
          selectedAmount={selectedAmount}
          selectedDate={selectedDate}
          selectedSource={selectedSource}
          selectedSavings={selectedSavings}
          setConfirmationModal={setConfirmationModal}
          selectedID={selectedID}
          selectedCategory={selectedCategory}
          setInfoModal={setInfoModal}
        />
      </div> 
    }
    </>
    
  );
}