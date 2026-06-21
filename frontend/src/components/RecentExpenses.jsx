import { getAllExpenses } from "../api/expenses";
import { useState, useEffect } from "react";

function RecentExpenses () {
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [newExpenseList, setNewExpenseList] = useState([]);

  const fetchExpenses = async () => {
    setExpenseLoading(true);
      try {
        const data = await getAllExpenses();
        setNewExpenseList(data);
      } catch (err) {
        console.error("Failed to fetch expenses");
      } finally {
        setExpenseLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <>
      <table className="w-full text-left border-collapse bg-[#1c1640] rounded-lg">
        <thead>
          <tr className="border-b border-[#2e2460] syne-heading text-[#e2d9f3] font-bold text-md bg-[#2e2460]">
            <th className="py-3 px-5 rounded-tl-lg rounded-bl-lg">Date</th>
            <th className="py-3 px-5">Category</th>
            <th className="py-3 px-5">Savings</th>
            <th className="py-3 px-5 rounded-br-lg rounded-tr-lg">Amount</th>
          </tr>
        </thead>
        <tbody>
          {newExpenseList.slice(0,4).map((item) => ( 
            <tr
              key={item.id}
              className="border-b border-[#2e2460] hover:bg-[#261d52] transition-colors duration-200 text-sm"
            >
              <td className="text-[#e2d9f3] py-5 px-5">{item.date}</td>
              <td className="text-[#e2d9f3] py-5 px-5">{item.category}</td>
              <td className="text-[#e2d9f3] py-5 px-5">{item.savings}</td>
              <td className="text-[#c084fc] font-bold p-5 px-5">- ₱ {item.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default RecentExpenses;