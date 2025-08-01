import { useState, useEffect, useRef } from 'react'
import { messageAPI } from '../../utils/api'
import { useSocketMessages, useTypingIndicator } from '../../socket/useSocket'
import { useSocket } from '../../socket/socketContext'
import NoChatSelected from './NoChatSelected'
import Messages from './Messages'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'

const MessageContainer = ({ selectedChat, setSelectedChat }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const messagesEndRef = useRef(null)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  
  // Socket.IO context and hooks
  const { sendMessage } = useSocket()
  const { startTyping, stopTyping, typingUsers } = useTypingIndicator(selectedChat?._id)
  
  // Handle real-time messages
  useSocketMessages(selectedChat?._id, (newMessage) => {
    console.log('Adding new message to state:', newMessage)
    setMessages(prev => {
      // Avoid duplicates by checking if message already exists
      const messageExists = prev.some(msg => 
        msg._id === newMessage._id || 
        (msg.senderId === newMessage.senderId && 
         msg.message === newMessage.message && 
         Math.abs(new Date(msg.createdAt) - new Date(newMessage.createdAt)) < 1000)
      )
      if (messageExists) return prev
      return [...prev, newMessage]
    })
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages(selectedChat._id)
    }
  }, [selectedChat])

  const fetchMessages = async (userId) => {
    setLoading(true)
    setError('')
    try {
      const response = await messageAPI.getMessages(userId)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      const errorMessage = error.response?.data?.message || 'Failed to fetch messages'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (newMessage) => {
    if (!selectedChat?._id || !newMessage.trim()) return
    
    // Stop typing when sending message
    stopTyping()
    
    try {
      // Try to send via Socket.IO first for real-time delivery
      const socketSent = sendMessage(selectedChat._id, newMessage)
      
      if (socketSent) {
        // Also send via API to save to database
        const response = await messageAPI.sendMessage(selectedChat._id, newMessage)
        
        // Add message to local state immediately for sender
        const messageData = {
          _id: response.data._id || Date.now().toString(),
          senderId: currentUser._id,
          receiverId: selectedChat._id,
          message: newMessage,
          createdAt: new Date().toISOString()
        }
        
        setMessages(prev => {
          // Avoid duplicates
          const exists = prev.some(msg => 
            msg.message === newMessage && 
            msg.senderId === currentUser._id &&
            Math.abs(new Date(msg.createdAt) - new Date()) < 2000
          )
          if (exists) return prev
          return [...prev, messageData]
        })
      } else {
        // Fallback to API only if socket is not connected
        const response = await messageAPI.sendMessage(selectedChat._id, newMessage)
        setMessages(prev => [...prev, response.data])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send message'
      setError(errorMessage)
    }
  }
  
  const handleTyping = () => {
    startTyping()
  }

  return (
    <div className="flex-1 flex flex-col glass">
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 bg-white/50">
            <div className="flex items-center space-x-4">
              <img 
                src={selectedChat.avatar} 
                alt={selectedChat.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{selectedChat.name}</h2>
                <p className="text-sm text-gray-600">Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500 text-sm">{error}</div>
              </div>
            ) : (
              <Messages 
                messages={messages} 
                selectedChat={selectedChat} 
                currentUser={currentUser}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <TypingIndicator typingUsers={typingUsers} selectedChat={selectedChat} />
          )}
          
          {/* Message Input */}
          <div className="p-6 border-t border-gray-200">
            <MessageInput 
              onSendMessage={handleSendMessage} 
              onTyping={handleTyping}
              onStopTyping={stopTyping}
            />
          </div>
        </>
      ) : (
        <NoChatSelected />
      )}
    </div>
  )
}

export default MessageContainer 
