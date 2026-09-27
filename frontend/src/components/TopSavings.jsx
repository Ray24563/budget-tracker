import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getTopSavingsExpenses } from "../api/expenses";
import Loader from "./Loader";

const COLORS = [
  "#c084fc",
  "#a855f7",
  "#7c3aed",
  "#6d28d9",
  "#4c1d95"
];

// Generate month options
const generateMonthOptions = () => {
  const options = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      label: date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      }),
      year: date.getFullYear(),
      month: date.getMonth() + 1
    });
  }

  return options;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1640] border border-[#2e2460] rounded-lg px-4 py-3">
        <p className="text-[#6b5f8a] text-sm mb-1">{label}</p>
        <p className="text-[#e2d9f3] font-bold">
          ₱{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function TopSavings() {
  const currentDate = new Date();
  const monthOptions = generateMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getTopSavingsExpenses(
          selectedMonth.year,
          selectedMonth.month);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch top savings expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  // Calculate total for percentage
  const totalExpenses = data.reduce((sum, item) => sum + item.total, 0);

  const handleMonthChange = (e) => {
    const index = Number(e.target.value);
    setSelectedMonth(monthOptions[index]);
  };

  return (
    <div className="bg-[#1c1640] border border-[#2e2460] rounded-lg px-5 sm:px-8 py-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-[#e2d9f3] text-xl syne-heading font-bold mb-5 sm:mb-0">
          Top Savings in Expenses
        </h2>

        {/* Month + Year Selector */}
        <div className="flex gap-2">

             <select
                onChange={handleMonthChange}
                className="bg-[#0a0818] border border-[#2e2460] text-[#e2d9f3] rounded-lg px-2 py-2 text-[0.7em] sm:text-sm cursor-pointer"
              >
                {monthOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option.label}
                  </option>
                ))}
              </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mb-20 mt-10">
          <Loader/>
        </div>
      ) : data.length === 0 ? (
        <p className="text-[#6b5f8a] text-sm">
          No expense data for this month.
        </p>
      ) : (
        <>
          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 30 : 40, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2e2460"
                vertical={false}
              />
              <YAxis
                type="category"
                dataKey="savings"
                tick={{ fill: "#e2d9f3", fontSize: isMobile ? 10 : 11 }}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 55 : 75}
              />
              <XAxis
                type="number"
                tick={{ fill: "#6b5f8a", fontSize: isMobile ? 10 : 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₱ ${value.toLocaleString()}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#2e2460", opacity: 0.5 }}
              />
              <Bar
                dataKey="total"
                radius={[6, 6, 0, 0]}
                maxBarSize={35}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.savings}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Ranked List */}
          <div className="mt-6 flex flex-col gap-3">
            {data.map((item, index) => {
              const percentage = totalExpenses > 0
                ? ((item.total / totalExpenses) * 100).toFixed(1)
                : 0;

              return (
                <div key={item.savings} className="flex items-center gap-3">

                  {/* Rank */}
                  <span
                    className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {index + 1}
                  </span>

                  {/* Savings Name + Progress Bar */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="text-[#e2d9f3] text-sm">{item.savings}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <p className="text-red-400 font-bold text-sm w-24 text-right">
                    - ₱ {item.total.toLocaleString()}
                  </p>

                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}