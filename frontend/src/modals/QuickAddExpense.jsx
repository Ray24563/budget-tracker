import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";
import { getExpensePresets } from "../api/expenses";

function QuickAddExpense({onClose, onSelectExpensePreset}) {
  const [expensePresets, setExpensePresets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const [expense] = await Promise.all([
          getExpensePresets(),
        ]);
        setExpensePresets(expense);
      } catch (err) {
        console.error("Failed to fetch presets");
      } finally {
        setLoading(false);
      }
    };

    fetchPresets();
  }, []);

  return (
    <div className={` ${loading ? "h-50" : "h-auto"} bg-[#0a0818] border border-[#2e2460] rounded-xl p-8 w-85 sm:w-170`}>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#e2d9f3] syne-heading">
          <FontAwesomeIcon icon={faArrowTrendDown} className="me-3" /> Quick Add Expense
        </h2>
      </div>

      {loading ? (
        <Loader/>
      ) : (
          <div>
            {expensePresets.length === 0 ? (
              <p className="text-[#6b5f8a] text-sm">
                No presets yet. Add more expense records first.
              </p>
            ) : (
              <>
              <div className="grid sm:grid-cols-2 gap-5">
                {expensePresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectExpensePreset(preset)}
                    className="bg-[#1c1640] border border-[#2e2460] rounded-lg px-4 py-3 text-left cursor-pointer hover:bg-[#2e2460] hover:scale-105 transition-all duration-500"
                  >
                    <p className="text-[#e2d9f3] w-50 truncate font-bold sm:text-lg syne-heading">
                      {preset.source}
                    </p>
                    <p className={`inline-block pb-0.5 px-2 rounded-md ${(preset.savings == "Main Wallet" || preset.savings == "Secondary Wallet") ? "bg-[rgba(139,92,246,0.12)] text-[rgb(196,181,253)] border w-auto border-[rgba(139,92,246,0.22)]" : (preset.savings == "Maya Wallet" || preset.savings == "Maya Savings") ? "bg-[rgba(52,211,153,0.1)] text-[rgb(110,231,183)] border border-[rgba(52,211,153,0.25)]" : preset.savings === "BPI" ? "bg-[rgba(178,34,34,0.1)] text-[rgb(248,113,113)] border border-[rgba(178,34,34,0.25)]" : preset.savings === "BDO" ? "bg-[rgba(10,61,143,0.1)] text-[rgb(96,165,250)] border border-[rgba(10,61,143,0.25)]" : preset.savings === "MariBank" ? "bg-[rgba(234,88,12,0.1)] text-[rgb(253,186,116)] border border-[rgba(234,88,12,0.25)]" : preset.savings === "GoTyme" ? "bg-[rgba(0,212,198,0.1)] text-[#00D4C6] border border-[rgba(0,212,198,0.25)]" : "text-[#e2d9f3]"} text-xs`}><span className={`text-sm ${(preset.savings == "Main Wallet" || preset.savings == "Secondary Wallet") ? "text-[#c084fc]" : (preset.savings == "Maya Wallet" || preset.savings == "Maya Savings") ? " text-[rgb(110,231,183)]" : preset.savings === "BPI" ? "text-[rgb(248,113,113)]" : preset.savings === "BDO" ? "text-[rgb(96,165,250)]" : preset.savings === "MariBank" ? "text-[rgb(253,186,116)]" : preset.savings === "GoTyme" ? "text-[#00D4C6]" : "text-[#e2d9f3]"}`}>&bull;</span> {preset.savings}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-red-400 font-bold text-xs sm:text-sm">
                        - ₱ {preset.amount.toLocaleString()}
                      </p>
                      <p className="text-[#6b5f8a] text-xs">
                        used {preset.count}x
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-center mt-7">
                <button 
                  className="px-3 py-2 income-button-background syne-heading  transition-colors duration-500 rounded-sm cursor-pointer"
                  type="button"
                  onClick={onClose}
                >
                    Close
                </button>
              </div>
            </>
            )}
          </div>
      )}
    </div>
  );
}

export default QuickAddExpense;