import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = checking, true = authenticated, false = not authenticated
  
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user')
      if (user) {
        try {
          JSON.parse(user) // Validate if it's valid JSON
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem('user')
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [])
  
  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // Render protected content if authenticated
  return children
}

export default ProtectedRoute
