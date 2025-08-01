import { useState } from 'react'
import SearchInput from './searchInput'
import Conversations from './Conversations'
import LogOutButton from './logOutButton'

const SideBar = ({ selectedChat, setSelectedChat, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <div className="mr-3">
            <span className="text-2xl font-light text-black">p</span>
            <span className="text-2xl font-light text-black relative">
              i
              <span className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-purple-500 rounded-full"></span>
            </span>
            <span className="text-2xl font-light text-black">ng</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Connect with friends</p>
      </div>

      {/* Search */}
      <div className="p-4">
        <SearchInput 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        <Conversations 
          searchQuery={searchQuery} 
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <LogOutButton onLogout={onLogout} />
      </div>
    </div>
  )
}

export default SideBar