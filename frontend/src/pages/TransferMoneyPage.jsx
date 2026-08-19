import { useEffect, useState } from "react";
import { getAllTransfers } from "../api/transfer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faCalendar, faWallet, faM, faCreditCard, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { DateFormatter } from "../utils/DateFormatter";
import { saveAsPDFTransfer } from "../utils/saveAsPDFTransfer";
import SaveAsPDFModalTransfer from "../modals/SaveAsPDFModalTransfer";
import Loader from "../components/Loader";

function TransferMoneyPage () {
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState([]);
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(transferData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = transferData.slice(startIndex, startIndex + itemsPerPage);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [saveAsPDFModal, setSaveAsPDFModal] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, []);
  
  const fetchTransferMoney = async () => {
    setLoading(true);
    try {
      const data = await getAllTransfers();
      setTransferData(data)
    } catch (err) {
      console.error("Failed to fetch money transfer.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransferMoney();
  }, []);

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

  const availableMonths = [
    ...new Set(transferData.map((item) => item.date.slice(0, 7)))
  ].sort().reverse(); // latest month first

  const navigateToHomepage = () => {
    navigate('/')
  } 

  const handleExportPDF = () => {
    saveAsPDFTransfer(transferData, selectedMonth);
  };

  return(
    <>
      <header className="px-5 sm:px-20 pt-15 sm:pt-20">
        <div className="flex">
          <h1 
            className="text-[#e2d9f3] syne-heading text-[1.6em] sm:text-5xl font-bold cursor-pointer"
            onClick={navigateToHomepage}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="me-3 text-[#6b5f8a]"/> Money Transfer History
          </h1>
        </div>
      </header>

      <main className="px-5 sm:px-20 mt-10 sm:mt-15">
        { loading ? (
          <div className="h-screen flex justify-center mt-35">
            <Loader/>
          </div>
        ) : transferData.length === 0 ? (
          <p className="text-[#e2d9f3] syne-heading text-md">No History of Money Transfer</p>
        ) : !isMobile ? (
          <>
            <div className="animate-tableIn" key={currentPage}>
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
                                  className="flex items-center justify-between bg-white/[0.024] border border-[rgba(167,139,250,0.07)] opacity-100 transition-all duration-300 shadow-none w-full pt-4 pb-5 px-5 mb-7 rounded-xl"
                                >
                                <div className="flex items-center">
                                  <FontAwesomeIcon
                                    className={`p-2 text-sm me-3 rounded-lg border border-[#3b2d6a] bg-[#1c1640] ${(item.savings == "Main Wallet" || item.savings == "Secondary Wallet") ? "text-[#c084fc]" : (item.savings == "Maya Wallet" || item.savings == "Maya Savings") ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : item.savings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : item.savings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"}`}
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
                                    <p className="text-[#e2d9f3] syne-heading text-lg truncate w-70 lg:w-150 font-bold mt-1 mb-1">{item.description}</p>
                                    <p className={`inline-block py-0.5 font-bold px-2 rounded-md ${(item.from_savings == "Main Wallet" || item.from_savings == "Secondary Wallet") ? "bg-[rgba(139,92,246,0.12)] text-[rgb(196,181,253)] border w-auto border-[rgba(139,92,246,0.22)]" : (item.from_savings == "Maya Wallet" || item.from_savings == "Maya Savings") ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : item.from_savings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : item.from_savings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"} text-xs`}><span className={`text-sm ${(item.from_savings == "Main Wallet" || item.from_savings == "Secondary Wallet") ? "text-[#c084fc]" : (item.from_savings == "Maya Wallet" || item.from_savings == "Maya Savings") ? " text-[rgb(110,231,183)]" : item.from_savings === "BPI" ? "text-[rgb(248,113,113)]" : item.from_savings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}>&bull;</span> {item.from_savings}</p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-green-400 font-bold text-lg mb-1 mt-1.5">+ ₱ {item.amount.toLocaleString()}</p>
                                  <p className={`inline-block py-0.5 font-bold px-2 rounded-md ${(item.to_savings == "Main Wallet" || item.to_savings == "Secondary Wallet") ? "bg-[rgba(139,92,246,0.12)] text-[rgb(196,181,253)] border w-auto border-[rgba(139,92,246,0.22)]" : (item.to_savings == "Maya Wallet" || item.to_savings == "Maya Savings") ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : item.to_savings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : item.to_savings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"} text-xs`}><span className={`text-sm ${(item.to_savings == "Main Wallet" || item.to_savings == "Secondary Wallet") ? "text-[#c084fc]" : (item.to_savings == "Maya Wallet" || item.to_savings == "Maya Savings") ? " text-[rgb(110,231,183)]" : item.to_savings === "BPI" ? "text-[rgb(248,113,113)]" : item.to_savings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}>&bull;</span> {item.to_savings}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </> 
        ) : (
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
                    <div key={item.id} className="flex flex-col justify-between px-2">
                      <div>
                        <p className="text-[#e2d9f3] text-sm font-bold mb-1 syne-heading">{item.description}</p>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <p className="text-[#9b8ab8] text-xs syne-heading">{item.from_savings}</p>
                          <p className="text-red-400 text-xs font-bold">- ₱{item.amount.toLocaleString()}</p>
                        </div>

                        <div>
                          <p className="text-[#9b8ab8] text-right text-xs syne-heading">{item.to_savings}</p>
                          <p className="text-green-400 text-xs text-right font-bold">+ ₱{item.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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

          <div className="flex justify-center gap-x-5">
              <button 
                className="income-button-background rounded-lg px-4 py-2 sm:px-5 sm:py-2 cursor-pointer text-[0.8em] ms:text-md"
                onClick={() => setSaveAsPDFModal(true)}
              >
                Save as PDF
              </button>
              <button className="back-background rounded-lg px-3 py-2 sm:px-5 sm:py-2 cursor-pointer text-[0.8em] ms:text-md" onClick={navigateToHomepage}>Back</button>
          </div>
        </div>
      </main>

      {saveAsPDFModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
          <SaveAsPDFModalTransfer
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              availableMonths={availableMonths}
              handleExportPDF={handleExportPDF}
              setSaveAsPDFModal={setSaveAsPDFModal} 
          />
        </div>
      )}
    </>
  )
}

export default TransferMoneyPage
