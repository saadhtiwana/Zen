import React from 'react'

const TypingIndicator = ({ typingUsers, selectedChat }) => {
  if (!typingUsers || typingUsers.length === 0) {
    return null
  }

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} is typing`
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing`
    } else {
      return `${typingUsers.length} people are typing`
    }
  }

  return (
    <div className="px-6 py-2 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <img 
            src={selectedChat?.avatar} 
            alt="Avatar"
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{getTypingText()}</span>
        </div>
        
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
