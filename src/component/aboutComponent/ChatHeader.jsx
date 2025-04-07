import React from 'react'
import { useRef, useEffect } from 'react';
function ChatHeader ({userInFo, socket,saveChatMessages}) {
  


    const disconnectChatServer = async()=>{
        // console.log('저장되는 요소',
        //   otherUser,
        //   messages
        // )
      await saveChatMessages()
       socket?.disconnect()
      }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm shadow-lg p-4 flex items-center justify-between relative border-b border-gray-700">
    <button
      onClick={disconnectChatServer}
      className="px-3 py-2 text-gray-300 hover:text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
      <h1 className="text-lg font-medium text-gray-200">
        {userInFo?.username}
      </h1>
      <span className="text-sm text-gray-400">
      </span>
    </div>
    <div className="w-10"></div> 
  </div>
  )
}
export default React.memo(ChatHeader)
