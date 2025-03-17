import './App.css';
import supabase from './api/supabase.js';
import {io} from "socket.io-client";
import  { useState,useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Main from './pages/main/ChatList.jsx'
import ChatPage from './pages/about/ChatPage.jsx'
import Login from './auth/login/login.jsx';
import Header from './component/Header.jsx';
// import { response } from 'express'; 


//데이터베이스에서 유저 정보 불러오기 
// socket 으로 유저정보 보내기 
// 채팅 내용 불러오기
// 현재페이지 -> 채팅 목록 페이지 && 메시지 보내는 페이지

function App() {
  
  const [socket, setSocket] = useState(null)
  const [userName, setUserName] =useState()
  const [UserInput, setUserInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
// 서버에서 받은 데이터 저장할 공간
  const [Messages, setMessages] = useState([])
// userData 받기
  // const [UserData , setUserData] = useState([])




  // SupaBase user data Fetch 
  // useEffect(()=>{
  //   const UserFetch = async () =>{
  //     const {data, error} = await supabase.from('profiles').select('username, id')
  //       if(data){
  //         setUserData(data)
  //       }else{
  //         console.log(error)
  //       }
  //   }
  //   UserFetch()
  // },[])




    // 서버 연결 (client )
 

 const sendMessageServer =() =>{
  console.log(`메시지를 보냈어요 내용:${UserInput}`)

  //emit 서버에 보내기 ==> new message(server.js 에 설정한 이름)
  // {userInput, userName} json 형식으로 보내기
  socket?.emit("new message", {username:userName,message:UserInput },  (response)=>{
    console.log(response,"response ")

  })
  setUserInput('')

 }
 const onConnected =() => {
    console.log('프론트 onConnected')
    setIsConnected(true)
 }
 const onDisConnected =() => {
  console.log('프론트 onDisConnected')
  setIsConnected(false)

}
// on에서 받은 new message 내용 msg 매개변수로 받음=
const onMessageReceived =(msg) =>{
  console.log(msg,"front msg")

  // 객체 상태로 받아 옴 prevMessages 받아 온 값을 저장 할 공간
  // 저장 해주는 이유 ==> 바로 바꾸게 되면 이전 메시지들이 지워지고 
  // 새로운 메시지만 남기때문에 이전 메시지 뒤에 계속 추가가 될 수 있게
  setMessages(prevMessages => [...prevMessages, msg])
  

}

// 서버와 연결 감지 
 useEffect(()=>{
  console.log('useEffect called!')
  socket?.on('connect', onConnected)
  socket?.on('disconnect',onDisConnected)
  // on을 통해 서버에서 보낸 emit => new message 를 받고
  // onMessageReceived 함수에 데이터 전달
  socket?.on('new message',onMessageReceived)

  return() =>{
    // console.log('useEffect clean up function called')
    socket?.off('connect', onConnected)
    socket?.off('disconnect',onDisConnected)
    socket?.off('new message',onMessageReceived)

  }
 },[socket])

//  새로운 메시지가 생성될때 스크롤이 자동으로 내려가게 만들기
// 의존성 배열 Message 를 받아 새로운 메시지가 추가 될 때 자동으로 조정
useEffect(()=>{
  window.scrollTo({
  top:document.body.scrollHeight,
  left:0,
  behavior:"smooth"
  }) 
},[Messages])

//  메시지 만들어서 사용 
 const MessagesList = Messages.map((aMsg,index) => 
    <li key={index} >
       <p className='text-white'>{aMsg.username}</p> 
      <p> {aMsg.message}</p>
    
    </li>  
 )


  return (

    <div className="text-center flex-col items-center content-center ">
      <Header>
      </Header>
    <Routes>
    
     <Route path="/" element={<Main/>} />
     <Route path="/about/:ChatNumber" element={<ChatPage />} />
     <Route path="/login" element={<Login />} />
     
     
      {/* <div className="App-header">
       


        <div >
          <h1>현재유저: {userName}</h1>
          <h2>접속상태: {isConnected ? "접속": "미접속"}</h2>
        <input value={userName} onChange={ e=>setUserName(e.target.value)}
        className='text-black'/>
          <button onClick={()=>connectChatServer()}>
            접속
          </button>
          <button onClick={()=>disconnectChatServer()}>
            접속종료
          </button>
         
          <div>
            <p>메시지</p>
            <input value={UserInput} onChange={ e =>setUserInput(e.target.value)}
            className='text-black'      
            />
          <button onClick={sendMessageServer}>
            보내기
          </button>
         
          </div>

          <div>
            <h3>메시지내용</h3>
          
        <ul >
          {MessagesList}
        </ul>

          </div>

          </div>



      </div> */}
   </Routes> 

    </div>

  );
}

export default App;
