import { getAllExpenses } from "../api/expenses";
import { useState, useEffect } from "react";
import { DateFormatter } from "../utils/DateFormatter";

function RecentExpenses ({isMobile}) {
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
      {!isMobile && (
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
                  <td className="text-red-400 font-bold p-5 px-5">- ₱ {item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {isMobile && (
        <div className="flex flex-col gap-6">
          {Object.entries(
            newExpenseList.slice(0,4).reduce((groups, item) => {
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
                  <div key={item.id} className="flex justify-between items-center px-2">
                    <div>
                      <p className="text-[#9b8ab8] text-xs">{item.savings}</p>
                      <p className="text-[#e2d9f3] text-md font-medium mt-1">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 font-bold text-md mt-4">+ ₱ {item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
     
    </>
  )
}

export default RecentExpenses;