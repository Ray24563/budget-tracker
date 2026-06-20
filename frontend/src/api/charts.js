const API_URL = import.meta.env.VITE_API_URL;

export const getMonthlyExpenses = async (year) => {
  const response = await fetch(`${API_URL}/expenses/monthly/${year}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};

export const getMonthlyComparison = async () => {
  const response = await fetch(`${API_URL}/summary/monthly`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};