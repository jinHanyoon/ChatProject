import React from 'react'
import supabase from '../../api/supabase'
import { useState,useEffect } from 'react'
import useRoomIdStore from '../../pages/RoomStore/RoomStore'
import useMessageStore from '../../pages/MsgStore.js/messages'
export default function DateChat() {
    const useRoomId = useRoomIdStore(state=>state.TargetRoomID)
    const SelectedDate = useRoomIdStore(state=>state.selectedDate)
    const DateData = useMessageStore (state=>state.DateData)
    const setDateData = useMessageStore (state=>state.setDateData)

useEffect(()=>{
          // SelectedDate가 없으면 함수 종료
          if(!SelectedDate ) {
            console.log('_')
            setDateData([]);
            return;
        }
    const Fetch  = async() =>{
        try{
            
            const {data,error} = await supabase
                .from('Chat_history')
                .select('ChatTalk')
                .eq('roomName', useRoomId)

                
            if(data && data[0]?.ChatTalk) {
                // data에 있는 값 필터링
                const filteredChats = data[0].ChatTalk.filter(chat => 
                    chat.Create_Time.includes(SelectedDate)
                );
            
               setDateData(filteredChats)
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
    console.log(DateData,'filter data')
},[DateData])

  return (<>

    </>
  )
}
