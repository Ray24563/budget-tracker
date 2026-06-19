import { useState, useEffect } from "react";
import { getAllExpenses, deleteExpense } from "../api/expenses";
import AddExpense from "../modals/AddExpense";

export default function ExpensePage() {
  const [expenseList, setExpenseList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#e2d9f3]">Expenses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#e2d9f3] text-[#261d52] px-4 py-2 rounded-lg font-semibold"
        >
          + Add Expense
        </button>
      </div>

      {/* Expense List */}
      {loading ? (
        <p className="text-[#e2d9f3]">Loading...</p>
      ) : expenseList.length === 0 ? (
        <p className="text-[#e2d9f3]">No expense records yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {expenseList.map((item) => (
            <div
              key={item.id}
              className="bg-[#261d52] rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <p className="text-[#e2d9f3] font-semibold">{item.source}</p>
                <p className="text-[#e2d9f3] text-sm">
                  {item.date} · {item.category} · {item.savings}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-red-400 font-bold">-₱{item.amount.toLocaleString()}</p>
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
        <AddExpense
          onClose={() => setShowModal(false)}
          onSuccess={fetchExpenses}
        />
      )}

    </div>
  );
}