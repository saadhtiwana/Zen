import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../utils/api'
import SideBar from '../components/sidebar/sideBar'
import MessageContainer from '../components/messages/MessageContainer'

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await authAPI.logout()
        localStorage.removeItem('user')
        navigate('/login')
      } catch (error) {
        console.error('Logout error:', error)
        // Still navigate to login even if logout request fails
        localStorage.removeItem('user')
        navigate('/login')
      }
    }
  }

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <SideBar 
        selectedChat={selectedChat} 
        setSelectedChat={setSelectedChat}
        onLogout={handleLogout}
      />
      
      {/* Messages Container */}
      <MessageContainer 
        selectedChat={selectedChat} 
        setSelectedChat={setSelectedChat} 
      />
    </div>
  )
}

export default Chat 