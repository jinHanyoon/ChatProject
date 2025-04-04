import React from 'react'
import supabase from '../../api/supabase'
import { useState,useEffect } from 'react'
import useRoomIdStore from '../../pages/RoomStore/RoomStore'
// import useMessageStore from '../../pages/MsgStore.js/messages'
export default function DateChat() {
    const useRoomId = useRoomIdStore(state=>state.TargetRoomID)
    const SelectedDate = useRoomIdStore(state=>state.selectedDate)
    const [GPTChat, setGPTChat]= useState()

useEffect(()=>{
          // SelectedDate가 없으면 함수 종료
          if(!SelectedDate ) {
            console.log('_')
            setGPTChat([]);
            return;
        }
    const Fetch  = async() =>{
        try{
            
            const {data,error} = await supabase
                .from('Chat_history')
                .select('GptChat')
                .eq('roomName', useRoomId)

                
            if(data && data[0]?.GptChat) {
                // data에 있는 값 필터링
                const filteredChats = data[0].GptChat.filter(chat => 
                    chat.Create_Time.includes(SelectedDate)
                );
            
                setGPTChat(filteredChats)
                // 여기서 필터링된 데이터 사용
            }
            if(error) {
                console.log(error)
            }
        }catch(error){
            console.log(error)
        }
    }
    Fetch()
},[SelectedDate])

useEffect(()=>{
    console.log(GPTChat,'filter data')
},[GPTChat])

  return (<>
   
   <div className='space-y-2 text-left'>
    {GPTChat?.map((item) => (
      <div 
        key={item.id} 
        className=" text-white p-3 rounded-md"
      >
        {item.summary}
      </div>
    ))}
  </div>
    </>
  )
}
