import React from 'react'
import useSession from '../../auth/session'
import { useState, useEffect } from 'react'
import supabase from '../../api/supabase'
export default function ProfileInfo() {
    const {userName,userUUID, checkSession}= useSession()
    const [newName, setNewName]= useState('')
   
    useEffect(() => {
      if (userName) {
        setNewName(userName)
      }
    }, [userName])

  const NameMake = async()=>{
    try{ 
    const {error} = await supabase.from('profiles').update({ username: newName }).eq('id',userUUID)
      if(error)
      {
        console.log(error, '변경실패')

  }
  }catch{}
  await checkSession()
  alert(`프로필 이름 변경완료' + ${newName}`)

  }



  return (
    <div className='w-full md:w-1/2 p-6 pt-10 ml-auto mr-auto'>
      <div className='rounded-2xl  p-6 transition-all '>
        <div className='flex flex-col items-center'>
          <h2 className='text-2xl font-bold text-gray-300 mb-6'>
            닉네임 변경하기 
          </h2>
          
          <div className='relative w-full mb-6 '>
            <input 
              onChange={(e)=> setNewName(e.target.value)} 
              className='w-full text-center px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-gray-700 focus:border-gray-600 outline-none text-gray-100 placeholder-gray-400 transition duration-200'
              placeholder={userName}

            />
          </div>

          <button 
            onClick={NameMake}
            className='w-full px-4 mt-12 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200 shadow-md'
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  )
}
