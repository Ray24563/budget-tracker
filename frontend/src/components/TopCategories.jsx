import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { getTopCategories } from "../api/charts";

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1640] border border-[#2e2460] rounded-lg px-4 py-3">
        <p className="text-[#6b5f8a] text-sm mb-1">{payload[0].payload.category}</p>
        <p className="text-[#e2d9f3] font-bold">
          ₱{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// Bar colors — purple shades
const COLORS = [
  "#c084fc",
  "#a855f7",
  "#9333ea",
  "#7c3aed",
  "#6d28d9"
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

function TopCategories() {
  const now = new Date();
  const monthOptions = generateMonthOptions();

  const [selectedOption, setSelectedOption] = useState(monthOptions[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getTopCategories(
          selectedOption.year,
          selectedOption.month
        );
        setData(result);
      } catch (err) {
        console.error("Failed to fetch top categories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOption]);

  const handleMonthChange = (e) => {
    const index = Number(e.target.value);
    setSelectedOption(monthOptions[index]);
  };

  return (
    <div className="bg-[#1c1640] border border-[#2e2460] rounded-lg px-8 py-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#e2d9f3] syne-heading font-bold text-xl">
          Top 5 Expense Categories
        </h2>

        {/* Month Selector */}
        <select
          onChange={handleMonthChange}
          className="bg-[#0a0818] border border-[#2e2460] text-[#e2d9f3] rounded-lg px-2 py-2 text-sm cursor-pointer"
        >
          {monthOptions.map((option, index) => (
            <option key={index} value={index}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {loading ? (
        <p className="text-[#6b5f8a] text-sm">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-[#6b5f8a] text-sm">
          No expenses for this.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            layout="vertical"  // ← makes it horizontal
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2e2460"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#6b5f8a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₱${value.toLocaleString()}`}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: "#e2d9f3", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={75}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#2e2460", opacity: 0.5 }}
            />
            <Bar
              dataKey="total"
              radius={[0, 6, 6, 0]}
              maxBarSize={35}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {!loading && data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#2e2460] flex flex-col gap-2">
          {data.map((item, index) => (
            <div key={item.category} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS[index], color: "#0a0818" }}
                >
                  {index + 1}
                </span>
                <span className="text-[#e2d9f3] text-sm">{item.category}</span>
              </div>
              <span className="text-[#c084fc] font-bold text-sm">
                ₱{item.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default TopCategories;