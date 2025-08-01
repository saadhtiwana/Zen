const NoChatSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 p-8 glass rounded-2xl max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Select a Chat</h2>
          <p className="text-gray-600">
            Choose a conversation from the sidebar to start messaging
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default NoChatSelected
