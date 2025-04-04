import React from 'react'
import { useState, useEffect } from 'react';
import supabase from '../../api/supabase';
import dayjs from 'dayjs'
import useRoomIdStore from '../../pages/RoomStore/RoomStore';

export default function DateSelect() {
    const [ChatDate, setChatDate] = useState([])
    // const [selectedDate, setSelectedDate] =useState()
    const useRoomId = useRoomIdStore(state=>state.TargetRoomID)
    const SelectedDate = useRoomIdStore(state=>state.selectedDate)
    const setSelectedDate = useRoomIdStore(state=>state.setSelectedDate)

    useEffect(()=>{
    const Fetch = async () =>{
        try{
        const {data,error} = await supabase.from('Chat_history')
        .select('ChatTalk')
        .eq('roomName',useRoomId );
        if(data){
            console.log(data)
            // day.js를 사용하여 날짜 포맷팅 후 중복 제거
            const times = [...new Set(data[0].ChatTalk.map(chat => 
                dayjs(chat.Create_Time).format('YYYY-MM-DD')
            ))];
            setChatDate(times);
        }
        else{
            throw error
        }
    }
    catch(error){
        console.log(error)
    }
    }
    Fetch()
},[])

useEffect(()=>{
    console.log(SelectedDate,'날짜정보')
},[SelectedDate])

useEffect(()=>{
    console.log(useRoomId,'select 룸 넘버 ')
},[useRoomId])

  return (
    <select
      className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 
      text-white rounded-lg shadow-lg border-0 
      font-medium appearance-none cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-purple-400 
      hover:shadow-xl transition-all duration-200
      pr-10 relative"
      onChange={(e) => setSelectedDate(e.target.value)}
    value={SelectedDate || []}
    >
      <option value="" className="bg-indigo-700 text-white">날짜를 입력해주세요</option>
    
    {ChatDate.map((date, index) => (
      <option key={index} value={date} className="bg-indigo-700 text-white">
        {date}
      </option>
    ))}
</select>
  )
}
