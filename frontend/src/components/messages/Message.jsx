const Message = ({ message }) => {
  const isMe = message.sender === "me"

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} px-6`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar for received messages */}
        {!isMe && message.avatar && (
          <img 
            src={message.avatar} 
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        )}

        {/* Message bubble */}
        <div className={`px-4 py-2 rounded-2xl ${
          isMe 
            ? 'bg-blue-500 text-white' 
            : 'bg-white border border-gray-200 text-gray-800'
        }`}>
          <p className="text-sm">{message.text}</p>
          <p className={`text-xs mt-1 ${
            isMe ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Message 