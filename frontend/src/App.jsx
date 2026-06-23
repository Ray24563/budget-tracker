import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from './pages/Login'
import Homepage from './pages/Homepage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensesPage';
import TransferMoneyPage from './pages/TransferMoneyPage';
import FuturePage from './pages/FuturePage';

function App() {
  // Check if a token already exists (user already logged in)
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Remove token and go back to login
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // If not logged in → show login page
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage handleLogout={handleLogout}/>}/>
          <Route path="/income" element={<IncomePage/>}/>
          <Route path="/expense" element={<ExpensePage/>}/>
          <Route path="/money_transfer_history" element={<TransferMoneyPage/>}/>
          <Route path="/future" element={<FuturePage/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
