import { getAllIncome } from '../api/income.js'
import { useState, useEffect } from 'react'

function RecentIncome(){
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [newIncomeList, setNewIncomeList] = useState([]);

  const fetchIncome = async () => {
    setIncomeLoading(true);
    try {
      const data = await getAllIncome();
      setNewIncomeList(data);
    } catch (err) {
      console.error("Failed to fetch income");
    } finally {
      setIncomeLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [])

  return(
    <>
      <table className="w-full text-left border-collapse bg-[#1c1640] rounded-lg">
        <thead>
          <tr className="border-b border-[#2e2460] syne-heading text-[#e2d9f3] font-bold text-md bg-[#2e2460]">
            <th className="py-3 px-5 rounded-tl-lg rounded-bl-lg">Date</th>
            <th className="py-3 px-5">Source</th>
            <th className="py-3 px-5">Savings</th>
            <th className="py-3 px-5 rounded-tr-lg rounded-br-lg">Amount</th>
          </tr>
        </thead>
        <tbody>
          {newIncomeList.slice(0,4).map((item) => (
            <tr
              key={item.id}
              className="border-b border-[#2e2460] hover:bg-[#261d52] transition-colors duration-200 text-sm"
            >
              <td className="text-[#e2d9f3] py-5 px-5">{item.date}</td>
              <td className="text-[#e2d9f3] py-5 px-5">{item.source}</td>
              <td className="text-[#e2d9f3] py-5 px-5">{item.savings}</td>
              <td className="text-[#c084fc] font-bold py-5 px-5">+ ₱ {item.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default RecentIncome;