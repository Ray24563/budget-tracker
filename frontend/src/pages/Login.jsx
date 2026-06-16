import { useEffect } from "react";
import { useState } from "react";
import { login } from "../api/auth";
import Logo from '../assets/images/logo.png'

function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login"
  },[])

   const handleSubmit = async () => {
    // Clear previous errors
    setError("");

    // Basic check — don't send empty password
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // Call the API
      const data = await login(password);

      // Save the token in localStorage
      // This persists even if you refresh the page
      localStorage.setItem("token", data.access_token);

      // Tell the parent component login was successful
      onLoginSuccess();

    } catch (err) {
      // 401 means wrong password
      if (err.response?.status === 401) {
        setError("Invalid password. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      // Always stop loading regardless of result
      setLoading(false);
    }
  };

  return(
    <>
      <div className="h-screen flex justify-center items-center flex-col">

        <div className="flex justify-center flex-col items-center gap-y-5">
          <img src={Logo} className="w-70"/>
          <p className="text-[#9b8ab8] -[sans-serif] text-lg">Welcome to <span className="syne-heading font-bold text-[#f0eaff]">WhyHub!</span> Please input your credential to proceed.</p>
          <div>
          <input 
            className="bg-[#13102a] border border-[#3b2d6a] rounded-md px-3 w-70 py-2 text-[#f0eaff]"
            placeholder="Enter Password"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
          />
          <button 
            className="px-3 py-2 bg-[#7c3aed] ms-3 rounded-sm cursor-pointer syne-heading hover:opacity-70 transition-opacity duration-500"
            onClick={handleSubmit}
            disabled={loading}
            >
              Submit
            </button>
            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm mb-4 mt-3">{error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;