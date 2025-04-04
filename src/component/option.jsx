import React from 'react'
import { Link } from 'react-router-dom'

export default function Option() {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-600">
        <ul className="flex justify-around items-center py-3 px-4">
          <li>
            <Link
              to="/MyList"
              className="flex flex-col items-center text-gray-400 hover:text-indigo-400"
            >
              <span className="text-2xl mb-1">👥</span>
              <span className="text-xs">친구목록</span>
            </Link>
          </li>
          <li>
            <Link
              to="/Chat_list"
              className="flex flex-col items-center text-gray-400 hover:text-indigo-400"
            >
              <span className="text-2xl mb-1">💬</span>
              <span className="text-xs">채팅목록</span>
            </Link>
          </li>
          <li>
            <Link
              to="/MyPage"
              className="flex flex-col items-center text-gray-400 hover:text-indigo-400"
            >
              <span className="text-2xl mb-1">⚙️</span>
              <span className="text-xs">설정</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
