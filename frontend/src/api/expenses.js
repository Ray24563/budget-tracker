const API_URL = import.meta.env.VITE_API_URL;

// Add new expense
export const addExpense = async (data) => {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });

  // If failed, extract FastAPI's error message
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || response.status);
  }

  return response.json();
};

// Get all expenses
export const getAllExpenses = async () => {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};

// Delete expense
export const deleteExpense = async (id) => {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};

export const getExpensesByCategory = async (category) => {
  const response = await fetch(`${API_URL}/expenses/category/${category}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};