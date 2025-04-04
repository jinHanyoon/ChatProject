import React from 'react'
import dayjs from '../../util/day.js'

export default function ChatLive({messages, userName}) {

  return (
    <>
    {messages.map((aMsg,index) =>
 <li 
 key={index} 
 className={`flex flex-col ${aMsg.username === userName ? 'items-end' : 'items-start'} mb-4`}
>
 <span className={`text-sm mb-1 ${aMsg.username === userName ? 'mr-2' : 'ml-2'} text-gray-400`}>
   {aMsg.username}
 </span>
 <div className={`max-w-[70%] break-words rounded-lg p-3 
   ${aMsg.username === userName 
     ? 'bg-indigo-600/90 text-white' 
     : 'bg-gray-700/80 text-gray-100'}`}
 >
   <p>{aMsg.message}</p>
 </div>
 <span className="text-xs text-gray-400 mt-1">
 {dayjs(aMsg.Create_Time).format('HH:mm')} 
   </span>

</li>
    )}
    </>
  )
}
