import { useEffect, useState } from 'react'
import { useSocket } from './socketContext'

export const useSocketMessages = (selectedChatId, onNewMessage) => {
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket || !socket.connected) return

    const handleNewMessage = (message) => {
      console.log('Received new message:', message)
      if (onNewMessage) {
        onNewMessage(message)
      }
    }

    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newMessage', handleNewMessage)
    }
  }, [socket, onNewMessage, selectedChatId])
}

export const useTypingIndicator = (selectedChatId) => {
  const { socket, typingUsers, emitTyping } = useSocket()
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null)

  const startTyping = () => {
    if (!selectedChatId || isTyping) return

    setIsTyping(true)
    emitTyping(selectedChatId, true)

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      stopTyping()
    }, 2000)

    setTypingTimeout(timeout)
  }

  const stopTyping = () => {
    if (!selectedChatId || !isTyping) return

    setIsTyping(false)
    emitTyping(selectedChatId, false)

    if (typingTimeout) {
      clearTimeout(typingTimeout)
      setTypingTimeout(null)
    }
  }

  // Get typing users for the current chat (excluding current user)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const currentChatTypingUsers = Object.entries(typingUsers)
    .filter(([userId]) => userId !== currentUser._id)
    .map(([userId, data]) => data)

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
      if (isTyping && selectedChatId) {
        emitTyping(selectedChatId, false)
      }
    }
  }, [selectedChatId])

  return {
    startTyping,
    stopTyping,
    isTyping,
    typingUsers: currentChatTypingUsers
  }
}
