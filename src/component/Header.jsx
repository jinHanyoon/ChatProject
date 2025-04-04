import React from 'react'
import { Link } from 'react-router-dom'
import useSession from '../auth/session.js'
export default function Header() {
    const {userName,isLogin} = useSession()
    const logout = useSession.getState().logout;  
    
  return (
    <div className="flex justify-between items-center bg-gray-700 px-6 py-4 border-b border-gray-600">
        <div className="text-xl font-bold text-gray-100">
            Chat App
        </div>
        {!isLogin ? (
            <Link to="/login" className="px-5 py-2 rounded-md bg-indigo-500 text-gray-100 text-sm font-medium hover:bg-indigo-600 transition-all">
                로그인
            </Link>
        ) : (
            <div className="flex items-center gap-6">
                <p className="text-gray-300 text-sm">{userName} 님</p>
                <button 
                    onClick={logout} 
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                    로그아웃
                </button>
            </div>
        )}
    </div>
  )
}
