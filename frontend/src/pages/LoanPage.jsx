import { useState, useEffect, useCallback } from "react";
import { getExpensesByCategory, deleteExpense } from "../api/expenses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function LoanPage() {
  const [loanList, setLoanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExpensesByCategory("Loan");
      setLoanList(data);
    } catch (err) {
      console.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Loans";
    fetchLoans();
  }, [fetchLoans]);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchLoans();
    } catch (err) {
      console.error("Failed to delete loan");
    }
  };

  // Calculate total loan amount
  const totalLoans = loanList.reduce((sum, item) => sum + item.amount, 0);

  const navigateToHomepage = () => {
    navigate("/");
  }

  return (
    <>
      <header className="px-20 pt-20">
        <h1 className="text-[#e2d9f3] syne-heading text-5xl font-bold"><FontAwesomeIcon icon={faClipboardList} className="me-3 text-[#6b5f8a]"/> List of Debts</h1>
      </header>

      <main className="px-20 pt-20">
        {loading ? (
          <p className="text-[#6b5f8a]">Loading...</p>
        ) : loanList.length === 0 ? (
          <p className="text-[#6b5f8a] syne-heading text-md">No loan records yet.</p>
        ) : (
          <table className="w-full text-left border-collapse bg-[#1c1640] rounded-lg animate-tableIn">
            <thead>
              <tr className="border-b border-[#2e2460] syne-heading text-[#e2d9f3] font-bold text-xl bg-[#2e2460]">
                <th className="py-5 px-10 rounded-tl-lg rounded-bl-lg">Date</th>
                <th className="py-5 px-10">Source</th>
                <th className="py-5 px-10">Savings</th>
                <th className="py-5 px-10">Amount</th>
                <th className="py-5 px-10 rounded-tr-lg rounded-br-lg">Action</th>
              </tr>
            </thead>

            <tbody>
              {loanList.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#2e2460] hover:bg-[#261d52] transition-colors duration-200"
                >
                  <td className="text-[#e2d9f3] py-3 px-10">{item.date}</td>
                  <td className="text-[#e2d9f3] py-e px-10">{item.source}</td>
                  <td className="text-[#e2d9f3] py-e px-10">{item.savings}</td>
                  <td className="text-[#c084fc] font-bold py-e px-10">
                    -₱{item.amount.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 text-sm hover:underline py-3 px-10"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
        <div className="flex justify-between mt-10">
          <button className="income-button-background rounded-lg px-5 py-2" onClick={navigateToHomepage}>Back</button>

          <button className="text-[#c084fc] rounded-lg font-bold text-lg back-background px-5 py-2">
            ₱ {totalLoans.toLocaleString()}
          </button>
        </div>
      </main>
    </>
  );
}

export default LoanPage;