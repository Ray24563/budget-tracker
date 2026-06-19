const API_URL = import.meta.env.VITE_API_URL;

// Get summary
export const getSummary = async () => {
  const response = await fetch(`${API_URL}/summary`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!response.ok) throw new Error(response.status);
  return response.json();
};