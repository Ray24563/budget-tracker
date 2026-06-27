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
        ) : (
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
                      <td className="text-green-400 font-bold p-5 px-10">+ {item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between flex-row-reverse mt-8">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-[#3b2d6a] text-[#a78bca] disabled:opacity-30 hover:border-[#4c2f8f] hover:text-[#e2d9f3] transition-all duration-150 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150
                      ${currentPage === page
                        ? 'text-[#f0eaff]'
                        : 'border border-[#3b2d6a] text-[#a78bca] hover:border-[#4c2f8f] hover:text-[#e2d9f3]'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-[#3b2d6a] text-[#a78bca] disabled:opacity-30 hover:border-[#4c2f8f] hover:text-[#e2d9f3] transition-all duration-150 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next →
                </button>
              </div>

              <div className="flex justify-center gap-x-5">
                  <button className="pdf-background rounded-lg px-5 py-2 cursor-pointer">Save as PDF</button>
                  <button className="back-background rounded-lg px-5 py-2" onClick={navigateToHomepage}>Back</button>
              </div>
            </div>
          </> 
        )}
      </main>
    </>
  )
}

export default TransferMoneyPage
