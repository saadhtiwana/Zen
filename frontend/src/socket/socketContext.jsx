import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState({}) // { userId: { username, timestamp } }
  const [isConnected, setIsConnected] = useState(false)
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (user?._id) {
      console.log('Connecting to Socket.IO with userId:', user._id)
      
      const socketConnection = io('http://localhost:5000', {
        query: {
          userId: user._id,
        },
        withCredentials: true,
        transports: ['websocket', 'polling']
      })

      setSocket(socketConnection)

      // Connection event handlers
      socketConnection.on('connect', () => {
        console.log('Socket.IO connected:', socketConnection.id)
        setIsConnected(true)
      })

      socketConnection.on('disconnect', () => {
        console.log('Socket.IO disconnected')
        setIsConnected(false)
        setOnlineUsers([])
      })

      socketConnection.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error)
        setIsConnected(false)
      })

      // Listen for online users
      socketConnection.on('getOnlineUsers', (users) => {
        console.log('Online users updated:', users)
        setOnlineUsers(users || [])
      })

      // Listen for typing events
      socketConnection.on('userTyping', ({ userId, username, isTyping }) => {
        console.log('Typing event:', { userId, username, isTyping })
        setTypingUsers(prev => {
          if (isTyping) {
            return {
              ...prev,
              [userId]: { username, timestamp: Date.now() }
            }
          } else {
            const newTypingUsers = { ...prev }
            delete newTypingUsers[userId]
            return newTypingUsers
          }
        })
      })

      // Listen for new messages
      socketConnection.on('newMessage', (message) => {
        console.log('New message received:', message)
      })

      // Listen for message confirmations
      socketConnection.on('messageConfirmed', (message) => {
        console.log('Message confirmed:', message)
      })

      // Listen for message errors
      socketConnection.on('messageError', (error) => {
        console.error('Message error:', error)
      })

      // Clean up typing indicators after 3 seconds of inactivity
      const typingCleanup = setInterval(() => {
        const now = Date.now()
        setTypingUsers(prev => {
          const updated = { ...prev }
          let hasChanges = false
          
          Object.keys(updated).forEach(userId => {
            if (now - updated[userId].timestamp > 3000) {
              delete updated[userId]
              hasChanges = true
            }
          })
          
          return hasChanges ? updated : prev
        })
      }, 1000)

      return () => {
        clearInterval(typingCleanup)
        console.log('Cleaning up socket connection')
        socketConnection.disconnect()
        setSocket(null)
        setIsConnected(false)
        setOnlineUsers([])
      }
    } else {
      if (socket) {
        console.log('User not found, disconnecting socket')
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
        setOnlineUsers([])
        setTypingUsers({})
      }
    }
  }, [])

  // Socket helper functions
  const emitTyping = (receiverId, isTyping) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (socket && socket.connected) {
      socket.emit('typing', {
        receiverId,
        isTyping,
        username: user.fullName
      })
    }
  }

  const sendMessage = (receiverId, message) => {
    if (socket && socket.connected) {
      console.log('Sending message via socket:', { receiverId, message })
      socket.emit('sendMessage', {
        receiverId,
        message
      })
      return true
    }
    return false
  }

  const value = {
    socket,
    onlineUsers,
    typingUsers,
    isConnected,
    emitTyping,
    sendMessage
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
