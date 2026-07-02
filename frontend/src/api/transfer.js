const API_URL = import.meta.env.VITE_API_URL;

export const addTransfer = async (data) => {
  const response = await fetch(`${API_URL}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || response.status);
  }

  return response.json();
};

export const getAllTransfers = async () => {
  const response = await fetch(`${API_URL}/transfer`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};