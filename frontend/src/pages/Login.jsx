import { useEffect } from "react";
import { useState } from "react";
import { login } from "../api/auth";
import Logo from '../assets/images/logo.png'
import Loader from "../components/Loader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";

function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "WhyHub"
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
      sessionStorage.setItem("token", data.access_token);

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
      <div className="h-screen flex justify-center sm:items-center flex-col">

        {loading ? (
          <>
            <div className="items-center">
              <Loader/>
            </div>
          </>
        ) : (
          <>
             <div className="flex justify-center flex-col sm:items-center gap-y-3 sm:gap-y-5">
              <img src={Logo} className="w-20 mx-auto sm:w-25 py-6 px-4 login-logo"/>

              <div className="text-center sm:mb-0 mb-3">
                <h1 className="syne-heading text-[#f0eaff] font-bold text-3xl sm:text-4xl mb-2">WhyHub</h1>
                <p className="text-[#9b8ab8] font-[sans-serif] text-xs text-center sm:text-left font-medium">PERSONAL BUDGET TRACKER &middot; v1.0.5</p>
              </div>

              <div className="login-container mx-6 p-6 sm:p-7 rounded-2xl w-auto sm:w-100">
                <p className="text-[#9b8ab8] syne-heading font-bold mb-3 text-sm sm:text-md">Enter your access key.</p>

                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faLock}
                    className="absolute inset-y-0 left-3 top-3 text-[#9b8ab8]/50 text-xs sm:text-md"
                  />

                  <input 
                    className="bg-white/4 border border-violet-400/10 rounded-md ps-10 pe-3 w-full py-2 text-[#f0eaff] block mb-4 outline-none focus:bg-violet-700/7 focus:border-violet-400 transition-colors duration-400 text-sm sm:text-md"
                    placeholder="Access Key"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                  />

                  <FontAwesomeIcon 
                    icon={showPassword ? faEyeSlash : faEye}
                    className="absolute inset-y-0 right-4 top-3 text-xs sm:text-md text-[#9b8ab8] cursor-pointer"
                    onClick={() => setShowPassword(prev => !prev)}
                  />
                </div>

                <div className="flex justify-center">
                  <button 
                    className={`px-3 py-2 font-bold transition-colors duration-400 ${password.trim() ? "bg-linear-to-r from-[#4f46e5] to-[#7c3aed] text-[#f0eaff]" : "bg-white/4 border border-violet-400/10 text-[#9b8ab8]/60"} w-full rounded-lg cursor-pointer syne-heading disabled:pointer-events-none text-sm sm:text-md`}
                    onClick={handleSubmit}
                    disabled={loading || !password.trim()}
                    >
                      Unlock
                  </button>
                </div>
                
                
                {error && (
                  <p className="text-red-500 text-sm mb-4 mt-3">{error}</p>
                )}
              </div>

              <h1 className="syne-heading text-[#9b8ab8]/35 uppercase mt-2 sm:mt-0 text-xs sm:text-md text-center">Authorized Access Only</h1>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Login;