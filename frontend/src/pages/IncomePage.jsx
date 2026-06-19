import { useState, useEffect } from "react";
import { getAllIncome, deleteIncome } from "../api/income";
import AddIncome from "../modals/AddIncome.jsx";

export default function IncomePage() {
  const [incomeList, setIncomeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
      fetchIncome(); // refresh list after delete
    } catch (err) {
      console.error("Failed to delete income");
    }
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#e2d9f3]">Income</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#e2d9f3] text-[#261d52] px-4 py-2 rounded-lg font-semibold"
        >
          + Add Income
        </button>
      </div>

      {/* Income List */}
      {loading ? (
        <p className="text-[#e2d9f3]">Loading...</p>
      ) : incomeList.length === 0 ? (
        <p className="text-[#e2d9f3]">No income records yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {incomeList.map((item) => (
            <div
              key={item.id}
              className="bg-[#261d52] rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <p className="text-[#e2d9f3] font-semibold">{item.source}</p>
                <p className="text-[#e2d9f3] text-sm">{item.date} · {item.savings}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-green-400 font-bold">+₱{item.amount.toLocaleString()}</p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddIncomeModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchIncome}
        />
      )}

    </div>
  );
}