function Homepage ({handleLogout}){
  return(
    <>
    <div className="text-white">Testing lang muna toh.</div>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:underline"
      >
        Logout
      </button>
    </>
  )
}

export default Homepage