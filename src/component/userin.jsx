import React from 'react'
import useSession from '../auth/session';
import { Link } from 'react-router-dom';

export default function UserIn({userValue, setUserComplete}) {
  const {userUUID} = useSession()

  const createRoomId = (id01, id02) => {
    return [id01, id02].sort().join('-');
  }
  const roomId = createRoomId(userUUID, userValue.id);

  return (
    <>
      <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'></div>
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[500px] p-8 rounded-xl shadow-lg'>
        <button 
          onClick={() => setUserComplete(false)}
          className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all'
        >
          ✕
        </button>
        <div className='flex items-center justify-center gap-8'>
          {/* 프로필 이미지 */}
          <div className='w-28 h-28 rounded-full bg-gray-200 overflow-hidden shadow-md'>
            {userValue?.profileImage ? (
              <img 
                src={userValue.profileImage} 
                alt={userValue.username} 
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center bg-indigo-500 text-white text-3xl font-medium'>
                {userValue?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* 유저 정보 */}
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <h1 className='font-semibold text-gray-800 text-2xl'>{userValue?.username}</h1>
              <Link 
                to={`/about/${roomId}`} 
                state={userValue}
                key={userValue.id}
                className='px-6 py-3 text-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-all'
              >
                채팅하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
