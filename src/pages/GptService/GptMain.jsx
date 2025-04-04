import React, { useState,useEffect } from 'react';
import useMessageStore from '../MsgStore.js/messages';
import { useFetcher } from 'react-router-dom';
import supabase from '../../api/supabase';
import useRoomIdStore from '../RoomStore/RoomStore';
// import GptMessage from './GptMessage';

// gpt 연결 => 데이터베이스에 메시지 gpt에 전달 => 전달받은 메시지 화면에 출력
// 데이터베이스 메시지 날짜별로 gpt에 보내기 
// 날짜별로 데이터베이스 정렬
// 불러오기 => 톱니바퀴 클릭 -> roomConditions 전달
// roomID 으로 방 찾기 => 이 후 날짜별로 채팅 찾기


export default function GptMain() {
  const [GetMessages, setGetMessages] = useState([]);
  const DateData = useMessageStore(state=>state.DateData);
  const TargetRoomID=useRoomIdStore(state=>state.TargetRoomID)
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 추가

  useEffect(() => {
    console.log('현재 DateData:', DateData);
  }, [DateData]);


  const sendMessage = async () => {
    if (!DateData) {
        console.error('유효한 데이터가 없습니다.');
        return;
    }
    setIsLoading(true);
    try {
        const response = await fetch('http://localhost:3002/send-gpt', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                message: JSON.stringify(DateData)
            })
        });
        const data = await response.json();
        
        const newMessage = { role: '요약', content: data.response };
        setGetMessages([newMessage]);
        
        // 직접 GptSave에 새 메시지를 전달
        await GptSave(newMessage);
    } catch (error) {
        console.error('메시지 전송 중 오류:', error);
    }finally {
      setIsLoading(false);  // 로딩 종료
  }
};

// 요약 메시지 저장
const GptSave = async (newMessage) => {
    try {
        if (newMessage && DateData && DateData.length > 0) {
            const { data: existingData } = await supabase
                .from('Chat_history')
                .select('GptChat')
                .eq('roomName', TargetRoomID)
                .single();

            const date = DateData[0].Create_Time.split(' ')[0];

            const newSummary = {
                summary: newMessage.content,
                Create_Time: date
            };

            const existingGptChat = Array.isArray(existingData?.GptChat) ? existingData.GptChat : [];
            const updatedGptChat = [...existingGptChat, newSummary];

            const { error } = await supabase
                .from('Chat_history')
                .update({ 
                    GptChat: updatedGptChat
                })
                .eq('roomName', TargetRoomID)
                .select();

            if (error) {
                console.error('저장 중 오류:', error);
            }
        }
    } catch (error) {
        console.error('오류:', error);
    }
};






  return (
    <div className="space-y-4">
      <div className='bg-gray-700 rounded-md p-3 text-white'>
      {isLoading ? (
          <div className="flex justify-center items-center py-4 ">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <div className='ml-4'>대화 내용을 요약 하고 있어요!</div>
          </div>
        ) : (
          <>
            {Array.isArray(GetMessages) && GetMessages?.map((item, index) =>
              <div key={index} className="mb-2 last:mb-0">{item?.content}</div>
            )}
            {(!Array.isArray(GetMessages) || GetMessages.length === 0) && 
              <div className="text-gray-400 italic">요약을 생성하면 여기에 표시됩니다</div>
            }
          </>
        )}
      </div>
      
      <button 
        onClick={sendMessage}
        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 
                  text-white rounded-md shadow-md 
                  hover:shadow-lg transition-all duration-200
                  font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        요약하기
      </button>
    </div>
  );
}
