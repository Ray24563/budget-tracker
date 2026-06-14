import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (password) => {
  // Send password to your FastAPI /login endpoint
  const response = await axios.post(`${API_URL}/login`, {
    password: password,
  });

  // Returns { access_token, token_type }
  return response.data;
};