import { useEffect } from "react";
import Logo from '../assets/images/logo.png'

function Login() {
  useEffect(() => {
    document.title = "Login"
  },[]
)

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
          />
          <button className="px-3 py-2 bg-[#7c3aed] ms-3 rounded-sm cursor-pointer">Submit</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;