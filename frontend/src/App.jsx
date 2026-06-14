import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Homepage from './pages/Homepage';

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
      <Homepage handleLogout={handleLogout}/>
    </>
  )
}

export default App
