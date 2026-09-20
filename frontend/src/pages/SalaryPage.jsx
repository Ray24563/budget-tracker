import { useState, useEffect, useCallback } from "react";
import { getSalaryIncome } from "../api/income";
import { SALARY_DISTRIBUTION } from "../constants/salaryDistibrutions";
import { DateFormatter } from "../utils/DateFormatter.js";
import { formatTime } from "../utils/formatTime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBill, faCalendar, faCreditCard, faWallet } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

export default function SalaryPage() {
  const [salaryList, setSalaryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [distributionModal, setDistributionModal] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const itemsPerPage = (isMobile) ? 7 : 3;
  const totalPages = Math.ceil(salaryList.length / itemsPerPage); // ← fixed
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = salaryList.slice(startIndex, startIndex + itemsPerPage);

  const navigateToHomepage = () => {
    navigate('/')
  };

  const fetchSalary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSalaryIncome();
      setSalaryList(data);
    } catch (err) {
      console.error("Failed to fetch salary records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Salary";
    fetchSalary();
  }, [fetchSalary]);

  // Calculate distribution for selected salary
  const calculateDistribution = (amount) => {
    return SALARY_DISTRIBUTION.map((item) => ({
      savings: item.savings,
      percentage: item.percentage,
      amount: (amount * item.percentage) / 100
    }));
  };

  const distribution = selectedSalary
    ? calculateDistribution(selectedSalary.amount)
    : [];

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

  return (
    <>
      <header className="px-5 sm:px-15 pt-15 sm:pt-20">
        <div className="flex">
          <h1 
            className="text-[#e2d9f3] syne-heading text-[1.8em] sm:text-5xl font-bold cursor-pointer"
            onClick={navigateToHomepage}
          >
            <FontAwesomeIcon icon={faMoneyBill} className="me-3 text-[#6b5f8a]"/> List of Salary</h1>
        </div>
      </header>

      <main className="px-5 sm:px-15 pt-15 sm:pt-20">
        <div className="block sm:grid grid-cols-2 gap-x-20">

          {/* ─── Salary List ─────────────────────────── */}
          <div>
            {loading ? (
              <Loader/>
            ) : salaryList.length === 0 ? (
              <p className="text-[#6b5f8a] text-sm">
                No salary records found.
              </p>
            ) : (
              <>
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
                                {[...items].reverse().map((item) => (
                                    <div 
                                      key={item.id}
                                      onClick={() => setSelectedSalary(item)}
                                      className="flex items-center justify-between bg-white/[0.024] border border-[rgba(167,139,250,0.07)] opacity-100 transition-all duration-300 shadow-none w-auto pt-4 pb-5 px-5 mb-7 rounded-xl cursor-pointer"
                                    >
                                    <div className="flex items-center">
                                      <FontAwesomeIcon
                                        className={`p-2 text-sm me-3 rounded-lg border border-[#3b2d6a] bg-[#1c1640] ${item.savings === "BDO" ? "bg-[rgba(10,61,143,0.1)] text-[rgb(96,165,250)] border border-[rgba(10,61,143,0.25)]" : "text-[#e2d9f3]"}`}
                                        icon={item.savings === "BDO" ? faCreditCard : faWallet}
                                      />
                                      <div>
                                        <p className="text-[#e2d9f3] syne-heading text-lg font-bold mt-1 mb-1">{item.source}</p>
                                        <p className={`inline-block pt-0.5 pb-1 font-bold px-2 rounded-md ${item.savings === "BDO" ? "bg-[rgba(10,61,143,0.1)] text-[rgb(96,165,250)] border border-[rgba(10,61,143,0.25)]" : "text-[#e2d9f3]"} text-xs`}><span className={`text-sm ${item.savings === "BDO" ? "text-[rgb(96,165,250)]" : "text-[#e2d9f3]"}`}>&bull;</span> {item.savings}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col text-right">
                                      <span className="text-green-400 font-bold text-lg mt-1.5">+ ₱ {item.amount.toLocaleString()}</span>
                                      <p className="text-[#9b8ab8] text-xs">{formatTime(item.time)} &bull; received</p>
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
                        <div className="flex flex-col-reverse gap-y-7">
                          {items.map((item) => (
                            <div 
                              key={item.id} 
                              className="flex justify-between items-center px-2"
                              onClick={() => (setSelectedSalary(item), setDistributionModal(true))}
                            >
                              <div>
                                <p className="text-[#9b8ab8] text-xs">{item.savings}</p>
                                <p className="text-[#e2d9f3] syne-heading text-md truncate w-45 font-bold mt-1">{item.source}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-green-400 font-bold text-md mt-3">+ ₱ {item.amount.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
              </>
            )}
             <div className="flex justify-between flex-col gap-y-10 sm:gap-y-0 sm:flex-row-reverse mb-15">
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
            </div>
          </div>

          {/* ─── Distribution Breakdown ───────────────── */}
          <div className="hidden sm:block">
            <h2 className="text-[#6b5f8a] syne-heading mb-3">
              Salary Distribution Breakdown
            </h2>

            {!selectedSalary ? (
              <div className="bg-white/[0.024] border border-[rgba(167,139,250,0.07)] opacity-100 transition-all duration-300 shadow-none rounded-lg px-6 py-10 text-center">
                <p className="text-[#6b5f8a] text-sm">
                  Select a salary record to see the breakdown
                </p>
              </div>
            ) : (
              <div className="bg-white/[0.024] border border-[rgba(167,139,250,0.07)] opacity-100 transition-all duration-300 shadow-none rounded-lg px-6 py-5">

                {/* Selected Salary Info */}
                <div className="mb-5 pb-4 border-b border-[#2e2460] flex justify-between items-center">
                  <div className="flex items-center gap-x-3">
                    <div className="w-9 h-9 rounded-full border border-[#3b2d6a] bg-[#1c1640] flex items-center justify-center">
                      <FontAwesomeIcon icon={faCalendar} className="text-[#6d28d9] text-sm" />
                    </div>
                    <div>
                     <p className="syne-heading font-bold text-[#e2d9f3] text-xl">{DateFormatter(selectedSalary.date)}</p>
                     <p className="text-xs text-[#6b5f8a]">{formatTime(selectedSalary.time)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-green-400 font-bold text-lg">
                      + ₱{Number(selectedSalary.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-[#6b5f8a]">net pay</p>
                  </div>
                </div>

                  {distribution.map((item) => (
                    <>
                      <div>
                        <div className="flex justify-between items-center">
                          <p className={`inline-block pt-0.5 pb-1 font-bold px-2 rounded-md ${(item.savings == "Main Wallet" || item.savings == "Secondary Wallet") ? "bg-[rgba(139,92,246,0.12)] text-[rgb(196,181,253)] border w-auto border-[rgba(139,92,246,0.22)]" : item.savings === "Maya" ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : item.savings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : item.savings === "BDO" ? "bg-[rgba(10,61,143,0.1)] text-[rgb(96,165,250)] border border-[rgba(10,61,143,0.25)]" : item.savings === "MariBank" ? "bg-[rgba(234,88,12,0.1)] text-[rgb(253,186,116)] border border-[rgba(234,88,12,0.25)]" : item.savings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"} text-xs`}><span className={`text-sm ${(item.savings == "Main Wallet" || item.savings == "Secondary Wallet") ? "text-[#c084fc]" : item.savings == "Maya" ? " text-[rgb(110,231,183)]" : item.savings === "BPI" ? "text-[rgb(248,113,113)]" : item.savings === "BDO" ? "text-[rgb(96,165,250)]" : item.savings === "MariBank" ? "text-[rgb(253,186,116)]" : item.savings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}>&bull;</span> {item.savings}</p>

                          <p className="text-green-400 font-bold text-sm text-right">
                            + ₱ {Number(item.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <p className="text-[#9b8ab8] text-xs text-right mb-3">{item.percentage}%</p>
                        <div className="w-full h-2 bg-[#2e2460] rounded-full mb-5">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 w-[${item.percentage}]`}
                            style={{ width: `${item.percentage}%`, background: '#6d28d9' }}
                          />
                        </div>
                      </div>
                    </>
                  ))}

                {/* Total */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2e2460]">
                  <p className="text-[#9b8ab8] font-bold syne-heading">Total</p>
                  <p className="text-green-400 font-bold">
                    + ₱{Number(selectedSalary.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>

      {(distributionModal && isMobile) && (
        <>
          <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/70 flex flex-col items-center justify-center animate-backdropIn">
            <div className="add-income-modal mx-3 w-80 sm:w-100 p-7 sm:p-8 rounded-lg animate-modalIn">
              <div className="mb-5 pb-4 border-b border-[#2e2460]">

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-green-400 font-bold text-xl">
                      + ₱{Number(selectedSalary.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-[#6b5f8a]">net pay</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="syne-heading text-[#e2d9f3] text-sm">{DateFormatter(selectedSalary.date)}</p>
                    <p className="text-xs text-[#6b5f8a]">{formatTime(selectedSalary.time)}</p>
                  </div>

              </div>

                {distribution.map((item) => (
                  <>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <p className={`inline-block py-0.5 font-bold px-1 rounded-md ${(item.savings == "Main Wallet" || item.savings == "Secondary Wallet") ? "bg-[rgba(139,92,246,0.12)] text-[rgb(196,181,253)] border w-auto border-[rgba(139,92,246,0.22)]" : item.savings === "Maya" ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : item.savings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : item.savings === "BDO" ? "bg-[rgba(10,61,143,0.1)] text-[rgb(96,165,250)] border border-[rgba(10,61,143,0.25)]" : item.savings === "MariBank" ? "bg-[rgba(234,88,12,0.1)] text-[rgb(253,186,116)] border border-[rgba(234,88,12,0.25)]" : item.savings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"} text-xs`}><span className={`text-xs ${(item.savings == "Main Wallet" || item.savings == "Secondary Wallet") ? "text-[#c084fc]" : item.savings == "Maya" ? " text-[rgb(110,231,183)]" : item.savings === "BPI" ? "text-[rgb(248,113,113)]" : item.savings === "BDO" ? "text-[rgb(96,165,250)]" : item.savings === "MariBank" ? "text-[rgb(253,186,116)]" : item.savings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}>&bull;</span> {item.savings}</p>

                        <p className="text-green-400 font-bold text-sm text-right">
                          + ₱ {Number(item.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="w-full h-2 bg-[#2e2460] rounded-full mb-1">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 w-[${item.percentage}]`}
                          style={{ width: `${item.percentage}%`, background: '#6d28d9' }}
                        />
                      </div>
                      <p className="text-[#9b8ab8] text-xs text-right mb-3">{item.percentage}%</p>

                    </div>
                  </>
                ))}

              {/* Total */}
              <div className="flex justify-between items-center mb-4 mt-4 pt-4 pb-4 border-b border-t border-[#2e2460]">
                <p className="text-[#9b8ab8] text-sm font-bold syne-heading">Total</p>
                <p className="text-green-400 text-sm font-bold">
                  + ₱{Number(selectedSalary.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

               <div className="flex justify-center mb-4">
                <button 
                  className="income-button-background syne-heading rounded-md py-1 px-4"
                  onClick={()=> setDistributionModal(false)}
                >
                  Close
                </button>
              </div>
              <p className="text-[#6b5f8a] text-xs italic text-center syne-heading"><span className="text-[#e2d9f3]">Note:</span> Salary distribution may be inaccurate as fixed expenses are sometimes deducted first.</p>
          </div>
      </div>
    </>
  )}
    </>
  );
}