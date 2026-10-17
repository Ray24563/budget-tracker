import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getInterestByYear } from "../api/income";
import Loader from "./Loader";
import useTickFormatter from "../constants/UseTickFormatter";
import useTickSize from "../constants/UseTickSize";

const SAVINGS_COLORS = {
  "Main Wallet":      "#c084fc",
  "Secondary Wallet": "#818cf8",
  "Maya Wallet":      "#00D3B8",
  "Maya Savings":     "#34d399",
  "BPI":              "#f87171",
  "GoTyme":           "#00D4C6",
  "MariBank":         "#EA580C"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1640] border border-[#2e2460] rounded-lg px-4 py-3">
        <p className="text-[#6b5f8a] text-sm mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex justify-between gap-4">
            <p className="text-xs" style={{ color: entry.color }}>
              {entry.name}
            </p>
            <p className="text-xs font-bold" style={{ color: entry.color }}>
              ₱{(entry.value)}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function InterestChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const responsiveTickFormatter = useTickFormatter();
  const responsiveTickSize = useTickSize();

  const yearOptions = Array.from(
    { length: 4 },
    (_, i) => currentYear - 3 + i
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getInterestByYear(selectedYear);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch interest data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Transform data for recharts
  // recharts needs: [{ month, savings1, savings2 }, ...]
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const chartData = monthNames.map((month) => {
    const entry = { month };
    data.forEach((savings) => {
      const monthData = savings.data.find((d) => d.month === month);
      entry[savings.savings] = monthData ? monthData.total : 0;
    });
    return entry;
  });

  return (
    <div className="bg-[#1c1640] border border-[#2e2460] rounded-lg px-8 py-6">

      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <div>
          <h2 className="text-[#e2d9f3] mb-3 sm:mb-0 text-xl syne-heading font-bold">
            Interest Accumulated
          </h2>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[#0a0818] border border-[#2e2460] text-[#e2d9f3] rounded-lg px-4 py-2 text-sm"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center mb-20 mt-10">
          <Loader/>
        </div>
      ) : data.length === 0 ? (
        <p className="text-[#6b5f8a] text-sm">
          No interest records found for {selectedYear}.
          Add income with "Interest" in the description.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto md:overflow-visible">
            <div className="min-w-150 md:min-w-0">
              <ResponsiveContainer width="100%" height={window.innerWidth >= 1280 ? 280 : window.innerWidth >= 768 ? 250 : 200}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2e2460"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6b5f8a", fontSize: responsiveTickSize }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fill: "#6b5f8a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                    tickFormatter={responsiveTickFormatter}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span style={{ color: "#6b5f8a", fontSize: "11px" }}>
                        {value}
                      </span>
                    )}
                  />
                  {data.map((savings) => (
                    <Line
                      key={savings.savings}
                      type="monotone"
                      dataKey={savings.savings}
                      stroke={SAVINGS_COLORS[savings.savings] || "#c084fc"}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2e2460]">
            <p className="text-[#6b5f8a] text-xs sm:text-sm mb-3">
              {selectedYear} Total Interest Per Savings
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {data.map((item) => (
                <div
                  key={item.savings}
                  className="bg-[#0a0818] border border-[#2e2460] rounded-lg px-4 py-3"
                >
                  <p
                    className="text-xs sm:text-sm font-bold mb-1 syne-heading"
                    style={{ color: SAVINGS_COLORS[item.savings] || "#c084fc" }}
                  >
                    {item.savings}
                  </p>
                  <p className="text-green-400 font-bold text-sm sm:text-md">
                    + ₱ {(item.total_year)}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </>
      )}

    </div>
  );
}

export default InterestChart;