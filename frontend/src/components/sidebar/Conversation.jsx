const Conversation = ({ conversation, isSelected, onClick }) => {
  return (
    <div 
      className={`flex items-center p-4 rounded-lg transition-all duration-200 cursor-pointer group ${
        isSelected 
          ? 'bg-blue-50 border border-blue-200' 
          : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative mr-4">
        <img 
          src={conversation.avatar} 
          alt={conversation.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        />
        {/* Online status indicator - only show if user is online */}
        {conversation.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* Conversation details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium truncate ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
            {conversation.name}
          </h3>
          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
          {conversation.unread > 0 && (
            <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {conversation.unread}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Conversation
