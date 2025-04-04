import React from 'react'
import dayjs from "../../util/day.js";
import { useState } from 'react';

export default function ChatValue({socket,userName}) {
    const messageTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const [UserInput, setUserInput] = useState("");

    const sendMessageServer= () =>{
        console.log(`메시지를 보냈어요 내용:${UserInput}`)
         socket?.emit("new message", {username:userName,message:UserInput,
          time: messageTime
    
          }, (response)=>{
        
        })
        console.log(messageTime)
        setUserInput('')
       }
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-4 border-t border-gray-700">
    <div className="flex gap-3 max-w-4xl mx-auto">
      <input
        value={UserInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 px-4 py-3 bg-gray-800/50 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
        onKeyDown={(e) => e.key === 'Enter' && sendMessageServer()}
      />
      <button
        onClick={sendMessageServer}
        className="px-6 py-3 bg-indigo-500/80 hover:bg-indigo-600/90 text-white rounded-xl transition-colors duration-200 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
        전송
      </button>
    </div>
  </div>
  )
}
