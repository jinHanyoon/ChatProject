import React from 'react'
import { useParams } from 'react-router-dom'
import {io} from "socket.io-client";
import useSession from '../../auth/session.js';
import  { useState,useEffect } from 'react';
import supabase from '../../api/supabase.js';
import { useNavigate } from 'react-router-dom';


export default function ChatPage() {
  const {userName} =useSession()
  const [socket, setSocket] = useState(null)
  const [UserInput, setUserInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
// 서버에서 받은 데이터 저장할 공간

// 실시간 메시지 + 추가 된 메시지
  const [Messages, setMessages] = useState([])
  const [otherUser, setOtherUser] =useState([])
  // db에서 받은 이전 채팅내용
  const [_chatData, _setChatData] = useState([])
  const navigate = useNavigate()
  

//  Params 사용시 {} 넣어주면 파라미터 id 값만 추출
// {} 안 넣을 시 파라미터 모든값을 추출
// Params 이름 바꿀때 app.js 에 라우터 확인

  const {ChatNumber} =useParams()
useEffect(()=>{
   // 채팅 시작지점
  //  채팅 페이지 진입 시 자동으로 socket 연결
   const connectChatServer = ()=>{
    const _socket = io(`http://localhost:3001/`,{
      autoConnect:false,
      query:{
        username:userName,
        room:ChatNumber
      }
    });
    _socket.connect()
    setSocket(_socket)
  }
  connectChatServer()

},[])

const ChatDataFetch = async () =>{
    const {data:ChatData} = await supabase.from('Chat_history').select('*').eq('roomName',ChatNumber)
    if(ChatData){
      _setChatData(ChatData)
      console.log('채팅을 불러오셨습니다.',ChatData)
    }else{
    }
}


// 진행 로직 ==> 방에 입장한 userName 기준으로 데이터베이스 이름 정함
// ==> 저장 시 이전에 먼저 저장 된 db 조회 후 다시 저장 
//  이름 하나로 통합 완료
// => server.js uniqueUsers 이름으로 채팅방에 참여한 유저 이름 기준으로 저장
//

// Params item.id 넘겨주는중  o
// chatLIst Params 기준으로 링크 연결 o
// query로 닉네임도 같이 넘겨줌 o
// DB 이름 참여한 사람 이름으로 저장 가능  o => 파람스로 변경
// 채팅 진입 시 이전 채팅 불러오기 => 최초 1번만 불러오기 => o
// ==> userUUID 이용해 데이터베잇 일치하는 id로 가져오기

// 서로 서버 연결이 안 된 상태에서 메시지를 보냈을 경우 이전에 보낸 메시지가 보이지 않음 
// 저장 서버종료를 했을 경우만 되기때문

  // 채팅 저장 서버에서 불러온 닉네임에서 
  // use params 이용해서 가져 온 유저 uuid로 저장
  // 서버 연결 끊기 (client )
  // 연결 끊을 때 추가되는 메시지 업데이트 해주기
  
  // 현재 -> 추가 된 메시지가 이전 메시지를 업데이트 
  // 저장 방식 불러온 메시지 + 추가된 메시지 같이 저장하기
  // ==> 전체메시지를 담을 변수선언?


  const saveChatMessages = async () => {
    const { data: PrevChat } = await supabase
      .from('Chat_history')
      .select('*')
      .filter('roomName', 'eq', ChatNumber);
      
    if (PrevChat && PrevChat.length > 0) {
      let existingMessages = []
      
      if (_chatData.length > 0 && _chatData[0]?.ChatTalk) {
        existingMessages = typeof _chatData[0].ChatTalk === 'string' 
          ? JSON.parse(_chatData[0].ChatTalk) 
          : _chatData[0].ChatTalk;
      }
      
      const combinedMessages = [...existingMessages, ...Messages];
      
      await supabase
        .from('Chat_history')
        .update({ ChatTalk: combinedMessages })
        .filter('roomName', 'eq', ChatNumber);
    } else {
      await supabase
        .from('Chat_history')
        .insert({
          roomName: ChatNumber,
          ChatTalk: Messages,
        });
    }
  }


// 서버 연결 종료 될 시
  const disconnectChatServer = async()=>{
    console.log('저장되는 요소',
      otherUser,
      Messages
    )
    await saveChatMessages()
    socket?.disconnect()
  }


  const sendMessageServer =() =>{
    console.log(`메시지를 보냈어요 내용:${UserInput}`)
    //emit 서버에 보내기 ==> new message(server.js 에 설정한 이름)
    // {userInput, userName} json 형식으로 보내기
    socket?.emit("new message", {username:userName,message:UserInput },  (response)=>{
      console.log(response,"response ")
    })
    if(otherUser.length < 1){
      saveChatMessages()
    }
    setUserInput('')

   }



   const onConnected =() => {
      console.log('프론트 onConnected')
      setIsConnected(true)
      console.log('상대방 정보:',otherUser,"front")
      ChatDataFetch()

   }
// 서버 연결이 끊어진 후 사용 됌
// 서버 연결이 해제 된 후 사용 할 행동
  const onDisConnected =  async() => {
    console.log('프론트 onDisConnected')
    setIsConnected(false)
    navigate('/')
  }
  // on에서 받은 new message 내용 msg 매개변수로 받음=
  const onMessageReceived =(msg) =>{
    console.log(msg,"front msg")
    // 객체 상태로 받아 옴 prevMessages 받아 온 값을 저장 할 공간
    // 저장 해주는 이유 ==> 바로 바꾸게 되면 이전 메시지들이 지워지고 
    // 새로운 메시지만 남기때문에 이전 메시지 뒤에 계속 추가가 될 수 있게
    setMessages(prevMessages => [...prevMessages, msg])
  }
  // 현재 참여중인  유저 IngUser => 방 참여중인 인원 받는 중
  const handleOtherUser = (IngUser) => {
    console.log('받은 other_user:', IngUser)  // 디버깅용
    // 알바펫 순으로 정렬
    const sortedUser = [...IngUser].sort((a, b) => a.localeCompare(b));
    setOtherUser(sortedUser)
    console.log(otherUser)
  }
// 서버와 연결 감지 =
useEffect(()=>{
  // console.log('useEffect called!')
  socket?.on('connect', onConnected)
  socket?.on('disconnect',onDisConnected)
  // on을 통해 서버에서 보낸 emit => new message 를 받고
  // onMessageReceived 함수에 데이터 전달
  socket?.on('new message',onMessageReceived)
  socket?.on('other_user',handleOtherUser)
  return() =>{
    // console.log('useEffect clean up function called')
    socket?.off('connect', onConnected)
    socket?.off('disconnect',onDisConnected)
    socket?.off('new message',onMessageReceived)
    socket?.off('other_user',handleOtherUser)

  }
 },[socket])
//  채팅방 밑으로 자동으로 내려가기
// 채팅방 내려가는거 추후에 수정 예정
  useEffect(()=>{
    window.scrollTo({
    top:document.body.scrollHeight,
    left:0,
    behavior:"smooth"
    }) 
  },[Messages])


//  메시지 만들어서 사용 
const MessagesList = Messages.map((aMsg,index) => 
  <li 
key={index} 
className={`flex ${aMsg.username === userName ? 'justify-end' : 'justify-start'}`}
>
<div className={`max-w-[70%] break-words rounded-lg p-3 
  ${aMsg.username === userName 
    ? 'bg-blue-500 text-white' 
    : 'bg-white text-gray-800'}`}
>
  <p className="text-sm mb-1">{aMsg.username}</p>
  <p>{aMsg.message}</p>
</div>
</li>
)

// 이전채팅 불러오기
const Chat_at = _chatData.length > 0 && _chatData[0]?.ChatTalk ? 
  JSON.parse(_chatData[0].ChatTalk).map((chatMsg, index) => (
    <li key={index} className={`flex ${chatMsg.username === userName ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] break-words rounded-lg p-3 
        ${chatMsg.username === userName ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
        <p className="text-sm mb-1">{chatMsg.username}</p>
        <p>{chatMsg.message}</p>
      </div>
    </li>
  )) : [];

    
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 채팅방 헤더 */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{otherUser}</h1>
        <button 
          onClick={disconnectChatServer}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          나가기
        </button>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-3">
          {Chat_at}
       {MessagesList}
        </ul>
      </div>

      {/* 메시지 입력 영역 */}
      <div className="bg-white p-4 border-t">
        <div className="flex gap-2">
          <input
            value={UserInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
            onKeyDown={e => e.key === 'Enter' && sendMessageServer()}
          />
          <button 
            onClick={sendMessageServer}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  )
}
