import { useEffect, useState } from "react";
import { getAllTransfers } from "../api/transfer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { DateFormatter } from "../utils/DateFormatter";

function TransferMoneyPage () {
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState([]);
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(transferData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = transferData.slice(startIndex, startIndex + itemsPerPage);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

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

  const navigateToHomepage = () => {
    navigate('/')
  } 

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
          <p className="text-[#e2d9f3]">Loading...</p>
        ) : transferData.length === 0 ? (
          <p className="text-[#e2d9f3] syne-heading text-md">No History of Money Transfer</p>
        ) : !isMobile ? (
          <>
            <div className="animate-tableIn" key={currentPage}>
              <table className="w-full text-left border-collapse bg-[#1c1640] rounded-lg">
                <thead>
                  <tr className="border-b border-[#2e2460] syne-heading text-[#e2d9f3] font-bold text-xl bg-[#2e2460]">
                    <th className="py-5 px-10 rounded-tl-lg">Date</th>
                    <th className="py-5 px-10">Category</th>
                    <th className="py-5 px-10">From</th>
                    <th className="py-5 px-10">To</th>
                    <th className="py-5 px-10">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#2e2460] hover:bg-[#261d52] transition-colors duration-200"
                    >
                      <td className="text-[#e2d9f3] py-5 px-10">{DateFormatter(item.date)}</td>
                      <td className="text-[#e2d9f3] py-5 px-10">{item.description}</td>
                      <td className="text-[#e2d9f3] py-5 px-10">{item.from_savings}</td>
                      <td className="text-[#e2d9f3] py-5 px-10">{item.to_savings}</td>
                      <td className="text-green-400 font-bold p-5 px-10">+ ₱ {item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                          <p className="text-[#9b8ab8] text-xs syne-heading">{item.to_savings}</p>
                          <p className="text-green-400 text-xs font-bold">+ ₱{item.amount.toLocaleString()}</p>
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
              <button className="income-button-background rounded-lg px-4 py-2 sm:px-5 sm:py-2 cursor-pointer text-[0.8em] ms:text-md">Save as PDF</button>
              <button className="back-background rounded-lg px-3 py-2 sm:px-5 sm:py-2 cursor-pointer text-[0.8em] ms:text-md" onClick={navigateToHomepage}>Back</button>
          </div>
        </div>
      </main>
    </>
  )
}

export default TransferMoneyPage
