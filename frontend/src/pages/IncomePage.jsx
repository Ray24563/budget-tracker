import { useState, useEffect } from "react";
import { getAllIncome, deleteIncome } from "../api/income";
import AddIncome from "../modals/AddIncome.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import FadeIn from "../components/FadeIn.jsx";
import { saveAsPDFIncome } from "../utils/saveAsPDFIncome.js";
import SaveAsPDFModal from "../modals/SaveAsPDFModal.jsx";
import { DateFormatter, DateFormatterSelector } from "../utils/DateFormatter.js";

function IncomePage() {
  const [incomeList, setIncomeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [saveAsPDFModal, setSaveAsPDFModal] = useState(false);
  const [selectedMonthForTable, setSelectedMonthForTable] = useState("all");

  // Fetch all income on page load
  const fetchIncome = async () => {
    setLoading(true);
    try {
      const data = await getAllIncome();
      setIncomeList(data);
    } catch (err) {
      console.error("Failed to fetch income");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteIncome(id);
      fetchIncome();
    } catch (err) {
      console.error("Failed to delete income");
    }
  };

  const availableMonths = [
    ...new Set(incomeList.map((item) => item.date.slice(0, 7)))
  ].sort().reverse(); // latest month first

  const filteredIncome = selectedMonthForTable === "all"
    ? incomeList
    : incomeList.filter((item) => item.date.slice(0, 7) === selectedMonthForTable);
  
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredIncome.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredIncome.slice(startIndex, startIndex + itemsPerPage);

  const handleExportPDF = () => {
    saveAsPDFIncome(incomeList, selectedMonth);
  };

  const navigateToHomepage = () => {
    navigate('/')
  }

  return (
    <>
      <header className="px-20 pt-20">
        <h1 className="text-[#e2d9f3] syne-heading text-5xl font-bold"><FontAwesomeIcon icon={faArrowTrendUp} className="me-3 text-[#6b5f8a]"/> List of Incomes</h1>
      </header>

      <FadeIn>
        <main className="px-20 mt-15">
          {loading ? (
            <p className="text-[#e2d9f3]">Loading...</p>
          ) : filteredIncome.length === 0 ? (
            <p className="text-[#e2d9f3]">No income records yet.</p>
          ) : (
            <>
              <div className="text-right mb-7">
                <label className="text-[#e2d9f3] syne-heading me-5">Filter Table: </label>
                  <select
                    value={selectedMonthForTable}
                    onChange={(e) => setSelectedMonthForTable(e.target.value)}
                    className="bg-[#0a0818] border border-[#2e2460] text-[#e2d9f3] rounded-lg px-3 py-2 text-md syne-heading cursor-pointer"
                    >
                      <option value="all">All Time</option>
                      {availableMonths.map((month) => (
                        <option key={month} value={month}>{DateFormatterSelector(month)}</option>
                      ))}
                  </select>
              </div>
              <div className="animate-tableIn" key={currentPage}>
                <table className="w-full text-left border-collapse bg-[#1c1640] rounded-lg">
                  <thead>
                    <tr className="border-b border-[#2e2460] syne-heading text-[#e2d9f3] font-bold text-xl bg-[#2e2460]">
                      <th className="py-5 px-10 rounded-tl-lg">Date</th>
                      <th className="py-5 px-10">Source</th>
                      <th className="py-5 px-10">Savings</th>
                      <th className="py-5 px-10">Amount</th>
                      <th className="py-5 px-10 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#2e2460] hover:bg-[#261d52] transition-colors duration-200"
                      >
                        <td className="text-[#e2d9f3] py-5 px-10">{DateFormatter(item.date)}</td>
                        <td className="text-[#e2d9f3] py-5 px-10">{item.source}</td>
                        <td className="text-[#e2d9f3] py-5 px-10">{item.savings}</td>
                        <td className="text-green-400 font-bold p-5 px-10">+ ₱ {item.amount.toLocaleString()}</td>
                        <td className="p-5">
                          <button onClick={() => handleDelete(item.id)} className="cursor-pointer ms-4">
                            <FontAwesomeIcon icon={faTrash} className="text-red-400 ms-5" />
                          </button>
                        </td>
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
                    <button 
                      className="income-button-background rounded-lg px-5 py-2 cursor-pointer"
                      onClick={ () => setSaveAsPDFModal(true) }
                    >
                        Save as PDF
                    </button>
                    <button className="back-background rounded-lg px-5 py-2" onClick={navigateToHomepage}>Back</button>
                </div>
              </div>
            </>
          )}
        </main>
      </FadeIn>

      {saveAsPDFModal &&
      <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center animate-backdropIn">
        <SaveAsPDFModal
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          availableMonths={availableMonths}
          handleExportPDF={handleExportPDF}
          setSaveAsPDFModal={setSaveAsPDFModal} 
        />
      </div>
    }
    </>
  );
}

export default IncomePage;