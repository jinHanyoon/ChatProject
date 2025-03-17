import React from 'react'
import supabase from '../../api/supabase.js';
import { Link } from 'react-router-dom';
import  { useState,useEffect } from 'react';
import useSession from '../../auth/session.js';
export default function ChatList() {
const [UserListComplete, setUserList]= useState([])
const defaultImg = '/profiles.png' 
const {userUUID} = useSession()


// 모든 프로필을 불러오는 중
// ==> 대화중인 프로필만 불러오기 
// ===> 채팅 시작시 다른방으로 바껴야함
// 현재 방 구조 A에 대해 B가 채팅을 진행중일시 c 가 참여하면
// 함께 참여가 됌
// 채팅 참여시 Params로 본인 id 도 같이 보내주기
useEffect(()=>{
    const UserFetch = async () =>{
        const {data, error} = await supabase.from('profiles').select('username, id,avatar_url')
    if(data){
        setUserList(data)
    }else{
        console.log(error)
    }
    }
    UserFetch()
},[])


// 현재 접속중인 유저 + 클릭한 유저 uuid 값을 합쳐놓기 
// 항상 알파벳 순서로 정렬
const createRoomId = (id01, id02) => {
    console.log('ID1:', id01);
    console.log('ID2:', id02);
    return [id01, id02].sort().join('-');
}


// Chat page 넘겨주기 ==> [href ==> userName] ==> ChatPage[id] 
    const UserList = UserListComplete.map((item) =>
      item.id !== userUUID && (
        <Link to={`/about/${createRoomId(userUUID, item.id)}`} key={item.id}>
          <li key={item.id} className='h-20 px-4 py-2 border-b border-gray-200 flex items-center gap-4 hover:bg-gray-100 cursor-pointer'>
            <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-300'>
              <img className='w-full h-full object-cover' src={item.avatar_url || defaultImg} alt={`${item.username}의 프로필`} />
            </div>
            <div className='flex-1 text-left'>
              <p className='font-semibold text-gray-800'>{item.username}</p>
              <p className='text-sm text-gray-500 truncate'>UUID: {item.id}</p>
            </div>
            <div className='text-xs text-gray-400'>오후 0:00</div>
          </li>
        </Link>
      )
    );





    return (
        <>
    <div className='h-16 bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md'>
      Chat List
    </div>
    <ul className='overflow-auto'>
    {UserList}
    </ul>


    </>
  )
}
