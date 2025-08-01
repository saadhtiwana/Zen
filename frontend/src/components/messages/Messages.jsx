import Message from './Message'

const Messages = ({ messages, selectedChat, currentUser }) => {
  return (
    <div className="flex-1 p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 text-center">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start a conversation with {selectedChat?.name}</p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <Message 
            key={message._id} 
            message={{
              id: message._id,
              text: message.message,
              sender: message.senderId === currentUser._id ? 'me' : 'them',
              timestamp: new Date(message.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              avatar: message.senderId === currentUser._id ? currentUser.profilePic : selectedChat?.avatar
            }} 
          />
        ))
      )}
    </div>
  )
}

export default Messages
