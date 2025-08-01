const LogOutButton = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 flex items-center justify-center space-x-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Logout</span>
    </button>
  )
}

export default LogOutButton 