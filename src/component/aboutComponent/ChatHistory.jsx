import React from 'react'
import dayjs from '../../util/day.js';

export default function ChatHistory({_chatData, userName}) {
  return (
    <>
      {_chatData.length > 0 && _chatData[0]?.ChatTalk ? 
        _chatData[0].ChatTalk.map((chatMsg, index) => (
          <li 
            key={index} 
            className={`flex flex-col ${chatMsg?.username === userName ? 'items-end' : 'items-start'} mb-4`}
          >
            <span className={`text-sm mb-1 ${chatMsg?.username === userName ? 'mr-2' : 'ml-2'} text-gray-400`}>
              {chatMsg?.username}
            </span>
            <div className={`max-w-[70%] break-words rounded-lg p-3 
              ${chatMsg?.username === userName 
                ? 'bg-indigo-600/90 text-white' 
                : 'bg-gray-700/80 text-gray-100'}`}
            >
              <p>{chatMsg?.message}</p>
            </div>
            <p className='text-sm mb-1 mr-2 text-gray-400'>
              {dayjs(chatMsg?.Create_Time).format('HH:mm')}
            </p>
          </li>
        )) : null
      }
    </>
  );
}
