const API_URL = import.meta.env.VITE_API_URL;

// Add new income
export const addIncome = async (data) => {
  const response = await fetch(`${API_URL}/income`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};

// Get all income
export const getAllIncome = async () => {
  const response = await fetch(`${API_URL}/income`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};

// Delete income
export const deleteIncome = async (id) => {
  const response = await fetch(`${API_URL}/income/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};