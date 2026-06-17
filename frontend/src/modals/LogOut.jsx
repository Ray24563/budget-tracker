function LogOut({handleLogout, setLogoutModal}) {
  return (
    <>
      <div className='bg-[#261d52] p-15 rounded-lg border border-[#e2d9f3] animate-modalIn'>
          <h1 className='text-2xl mb-10 text-[#e2d9f3] font-bold'>
            Are you sure you want to Logout?
          </h1>

          <div className='flex justify-center gap-x-7 syne-heading text-lg'>
            <button 
              className='bg-[#e2d9f3] px-8 py-1 rounded-full cursor-pointer hover:scale-105 transition-transform duration-500'
              onClick={handleLogout}
            >
              Yes
            </button>

            <button 
              className='bg-[#7c6e9c] px-3 rounded-full cursor-pointer hover:scale-105 transition-transform duration-500'
              onClick={() => setLogoutModal(false)}
            >
              No, Go Back
            </button>
          </div>
        </div>
    </>
  )
}

export default LogOut;