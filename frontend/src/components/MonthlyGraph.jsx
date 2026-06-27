import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import { getMonthlyExpenses } from "../api/charts.js";
import { useState, useEffect } from "react";
import useBarSize from "../constants/UseBarSize";
import useTickFormatter from "../constants/UseTickFormatter";
import useTickSize from "../constants/UseTickSize";

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

function MonthlyGraph() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const responsiveBarSize = useBarSize();
  const responsiveTickFormatter = useTickFormatter();
  const responsiveTickSize = useTickSize();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const yearOptions = Array.from(
    { length: 4 },
    (_, i) => currentYear - 3 + i
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading2(true);
      try {
        const result = await getMonthlyExpenses(selectedYear);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch monthly expenses");
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  return(
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#e2d9f3] syne-heading font-bold text-lg sm:text-xl">
          Monthly Expenses
        </h2>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[#0a0818] border border-[#2e2460] text-[#e2d9f3] rounded-lg ps-3 pe-5 py-2 text-sm cursor-pointer"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {loading2 ? (
        <p className="text-[#6b5f8a] text-sm">Loading...</p>
      ) : (
         <div className="overflow-x-auto md:overflow-visible">
          <div className="min-w-150 md:min-w-0">
            <ResponsiveContainer width="100%" height={window.innerWidth >= 1280 ? 280 : window.innerWidth >= 768 ? 250 : 200}>
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2460" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b5f8a", fontSize: responsiveTickSize }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b5f8a", fontSize: responsiveTickSize }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={responsiveTickFormatter}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#2e2460", opacity: 0.5 }} />
                <Bar
                  dataKey="total"
                  fill="#c084fc"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={responsiveBarSize}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  )
}

export default MonthlyGraph;