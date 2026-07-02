const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  "Authorization": `Bearer ${sessionStorage.getItem("token")}`
});

// ─── Future Income ────────────────────────────────────────
export const addFutureIncome = async (data) => {
  const response = await fetch(`${API_URL}/future/income`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || response.status);
  }
  return response.json();
};

export const getAllFutureIncome = async () => {
  const response = await fetch(`${API_URL}/future/income`, {
    headers: authHeader()
  });
  if (!response.ok) throw new Error(response.status);
  return response.json();
};

export const deleteFutureIncome = async (id) => {
  const response = await fetch(`${API_URL}/future/income/${id}`, {
    method: "DELETE",
    headers: authHeader()
  });
  if (!response.ok) throw new Error(response.status);
  return response.json();
};

export const convertFutureIncome = async (id) => {
  const response = await fetch(`${API_URL}/future/income/${id}/convert`, {
    method: "POST",
    headers: authHeader()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || response.status);
  }
  return response.json();
};

// ─── Future Expense ───────────────────────────────────────
export const addFutureExpense = async (data) => {
  const response = await fetch(`${API_URL}/future/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || response.status);
  }
  return response.json();
};

export const getAllFutureExpenses = async () => {
  const response = await fetch(`${API_URL}/future/expenses`, {
    headers: authHeader()
  });
  if (!response.ok) throw new Error(response.status);
  return response.json();
};

export const deleteFutureExpense = async (id) => {
  const response = await fetch(`${API_URL}/future/expenses/${id}`, {
    method: "DELETE",
    headers: authHeader()
  });
  if (!response.ok) throw new Error(response.status);
  return response.json();
};

export const convertFutureExpense = async (id) => {
  const response = await fetch(`${API_URL}/future/expenses/${id}/convert`, {
    method: "POST",
    headers: authHeader()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || response.status);
  }
  return response.json();
};

// ─── Future Summary ───────────────────────────────────────
export const getFutureSummary = async () => {
  const response = await fetch(`${API_URL}/future/summary`, {
    headers: authHeader()
  });
  if (!response.ok) throw new Error(response.status);
  return response.json();
};