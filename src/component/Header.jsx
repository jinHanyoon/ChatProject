import React from 'react'
import { Link } from 'react-router-dom'
import useSession from '../auth/session.js'
export default function Header() {
    const {userName,isLogin} = useSession()
    const logout = useSession.getState().logout;  
    
  return (
    <div  className='flex justify-end'>
   
        {!isLogin ? (
            <Link to="/login" className="px-6 py-2 rounded-lg bg-blue-600  text-white font-medium hover:opacity-90 transition-opacity">
                로그인
            </Link>
        ) : (
            <div className='flex justify-end'>
            <p>{userName} 님 반갑습니다</p>
            <button onClick={logout} className="px-6 rounded-lg text-red-500 hover:text-white transition-colors">
                로그아웃
            </button>
            </div>
        )}


</div>
  )
}
