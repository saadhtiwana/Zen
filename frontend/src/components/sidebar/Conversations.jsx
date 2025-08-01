import { useState, useEffect } from 'react'
import { userAPI } from '../../utils/api'
import { useSocket } from '../../socket/socketContext'
import Conversation from './Conversation'

const Conversations = ({ searchQuery, selectedChat, setSelectedChat }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { onlineUsers, isConnected } = useSocket()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getUsers()
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
        const errorMessage = error.response?.data?.message || 'Failed to fetch users'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-1 p-2">
        <div className="flex items-center justify-center py-4">
          <div className="text-gray-500">Loading users...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-1 p-2">
        <div className="flex items-center justify-center py-4">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    )
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="space-y-1 p-2">
        <div className="flex items-center justify-center py-4">
          <div className="text-gray-500 text-sm">
            {searchQuery ? 'No users found' : 'No users available'}
          </div>
        </div>
      </div>
    )
  }

  // Show connection status
  if (!isConnected) {
    return (
      <div className="space-y-1 p-2">
        <div className="flex items-center justify-center py-4">
          <div className="text-yellow-500 text-sm">
            Connecting to chat...
          </div>
        </div>
        {filteredUsers.map((user) => (
          <Conversation 
            key={user._id} 
            conversation={{
              _id: user._id,
              id: user._id,
              name: user.fullName,
              lastMessage: '',
              timestamp: '',
              unread: 0,
              avatar: user.profilePic,
              isOnline: false
            }}
            isSelected={selectedChat?._id === user._id}
            onClick={() => setSelectedChat({
              _id: user._id,
              id: user._id,
              name: user.fullName,
              avatar: user.profilePic,
              username: user.username
            })}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1 p-2">
      {filteredUsers.map((user) => {
        const isOnline = onlineUsers.includes(user._id)
        return (
          <Conversation 
            key={user._id} 
            conversation={{
              _id: user._id,
              id: user._id,
              name: user.fullName,
              lastMessage: '',
              timestamp: '',
              unread: 0,
              avatar: user.profilePic,
              isOnline: isOnline
            }}
            isSelected={selectedChat?._id === user._id}
            onClick={() => setSelectedChat({
              _id: user._id,
              id: user._id,
              name: user.fullName,
              avatar: user.profilePic,
              username: user.username
            })}
          /> 
        )
      })}
    </div>
  )
}

export default Conversations