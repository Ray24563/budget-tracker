import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getMonthlyComparison } from "../api/charts";

const COLORS = {
  income: "#e2d9f3",    
  expenses: "#c084fc",  
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1640] border border-[#2e2460] rounded-lg px-4 py-3">
        <p className="text-[#6b5f8a] text-sm mb-1">{payload[0].name}</p>
        <p className="text-[#e2d9f3] font-bold">
          ₱{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ income, expenses }) => (
  <div className="flex justify-center gap-6 mt-4">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#e2d9f3]" />
      <span className="text-[#6b5f8a] text-sm">Income</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#c084fc]" />
      <span className="text-[#6b5f8a] text-sm">Expenses</span>
    </div>
  </div>
);

function IncomeVsExpenses() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMonthlyComparison();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch monthly comparison");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = data ? [
    { name: "Income",   value: data.total_income },
    { name: "Expenses", value: data.total_expenses },
  ] : [];

  // Calculate percentage
  const total = data ? data.total_income + data.total_expenses : 0;
  const incomePercent = total > 0
    ? Math.round((data.total_income / total) * 100)
    : 0;
  const expensesPercent = total > 0
    ? Math.round((data.total_expenses / total) * 100)
    : 0;

  return (
    <>
       {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#e2d9f3] text-xl font-bold">
          {data?.month ?? "Loading..."}
        </span>
      </div>

      {loading ? (
        <p className="text-[#6b5f8a] text-sm">Loading...</p>

      ) : total === 0 ? (
        <p className="text-[#6b5f8a] text-sm">No data for this month yet.</p>

      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill={COLORS.income} />
                <Cell fill={COLORS.expenses} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <CustomLegend />

          <div className="flex justify-between mt-5 pt-4 border-t border-[#2e2460]">

            <div className="text-center">
              <p className="text-[#6b5f8a] text-xs mb-1">Income</p>
              <p className="text-[#e2d9f3] font-bold">
                ₱{data.total_income.toLocaleString()}
              </p>
              <p className="text-[#6b5f8a] text-xs mt-1">{incomePercent}%</p>
            </div>

            <div className="text-center">
              <p className="text-[#6b5f8a] text-xs mb-1">Expenses</p>
              <p className="text-[#c084fc] font-bold">
                ₱{data.total_expenses.toLocaleString()}
              </p>
              <p className="text-[#6b5f8a] text-xs mt-1">{expensesPercent}%</p>
            </div>

          </div>
        </>
      )}
    </>
     
  );
}

export default IncomeVsExpenses;