import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function LogOut({handleLogout, setLogoutModal}) {
  return (
    <>
      <div className='bg-linear-to-br from-[#13102a] to-[#0d0b14] border border-violet-400/12 shadow-2xl p-7 sm:p-10 rounded-lg animate-modalIn mx-5 sm:mx-0'>
        <FontAwesomeIcon 
          icon={faRightFromBracket}
          className="text-md sm:text-xl rounded-2xl bg-red-400/8 border border-red-400/18 p-4 text-red-400 mb-2 sm:mb-5"
        />

        <div className="mb-5 sm:mb-7">
          <h1 className='text-xl sm:text-2xl syne-heading text-[#e2d9f3] font-bold mb-1'>
            Sign out of WhyHub?
          </h1>
          <p className="text-[#7c6e9c] text-xs sm:text-sm">You'll need your access key to get back in. Any unsaved changes will be lost.</p>
        </div>

        <hr className="text-white/10 mb-5 sm:mb-7"/>

          <div className='flex flex-row-reverse justify-center gap-x-3 syne-heading text-lg'>
            <button 
              className='w-full bg-red-400/8 border border-red-400/18 text-red-400 rounded-full cursor-pointer hover:bg-red-400/20 hover:border-red-400/30 transition-colors duration-500 py-2 text-sm sm:text-md'
              onClick={handleLogout}
            >
              Sign Out
            </button>

            <button 
              className='w-full bg-white/4 border border-white/8 text-[#9d8ec4] rounded-full cursor-pointer hover:bg-white/12 hover:border-white/16 transition-colors duration-500 text-sm sm:text-md'
              onClick={() => setLogoutModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
    </>
  )
}

export default LogOut;