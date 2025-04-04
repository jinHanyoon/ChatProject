import React, { useRef, useEffect } from 'react'
import { useState } from 'react'
import useShowStore from '../../component/buttonStore/ShowStore'
import DateSelect from '../../component/GptComponent/DateSelect'
import DateChat from '../../component/GptComponent/DateChat'
import useMessageStore from '../MsgStore.js/messages'
import GptMain from './GptMain'
import GptData from '../../component/GptComponent/GptData.jsx'


export default function GptMessage() {
    const CloseModal = useShowStore(state=>state.OutGPT)
    const ClearDate = useMessageStore(state=>state.setDateDataClear)
    const scrollRef = useRef(null);
    
    // 메시지 변경될 때 스크롤 자동 이동
    const DateData = useMessageStore(state=>state.DateData)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [DateData]);

    const ClearModal =async ()=>{
        await ClearDate()
        await CloseModal()
    }

    return (
        <>
            <div className='fixed inset-0 bg-black/50 backdrop-blur-sm'></div>
            <div 
                ref={scrollRef}
                className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                    bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-xl 
                    w-[95%] max-w-2xl min-h-[400px] max-h-[90vh] 
                    p-6 overflow-auto text-gray-100
                    [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:bg-gray-500/20 [&::-webkit-scrollbar-thumb]:rounded-full 
                    hover:[&::-webkit-scrollbar-thumb]:bg-gray-500/40'
            >
                <div className='flex justify-end mb-4'>
                    <button 
                        onClick={ClearModal}
                        className='w-8 h-8 flex items-center justify-center rounded-full
                                  bg-gray-600 hover:bg-indigo-500 
                                  text-gray-300 hover:text-white
                                  transition-all duration-200
                                  shadow-md hover:shadow-lg'
                        aria-label="닫기"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <DateSelect/>
                <GptData/>
                <DateChat/>
                <GptMain/>
            </div>
        </>
    )
}
