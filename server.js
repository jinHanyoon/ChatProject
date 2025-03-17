import {Server} from "socket.io"
import express from "express";
import *as http from "http";

const app = express();
const server = http.createServer(app)

const io = new Server(server,{
//크로스 오리진
    cors:{
        origin:"*"
    }
});

// 최초 연결 시도 완료 시 
server.listen(3001, ()=>{
    console.log('서버에서 듣고 있습니다... 3001')
});

// 사용자가 들어왔을 때
//  client => server 로 메시지 전달 과정 

io.on('connection', (client)=>{

    // console.log(client.handshake.query)
// handshake.query 사용자 정보란에 username 을 추가 => 사용자가 서버에 연결 되었을 때 
    const connectedClientUsername = client.handshake.query.username;
// 파라미터로 받은 room 값을 가져 옴
    const room = client.handshake.query.room;
 

    client.join(room)

    // 채팅방에 참여한 유저 목록 가져오기
    const clients = io.sockets.adapter.rooms.get(room);
    if (clients) {
        const usersInRoom = new Set([connectedClientUsername]); // 현재 접속한 사용자를 먼저 추가
        // 랜더링 될 시 중복으로 본인닉네임 나오게 될 경우 배열에서 제외 
        // 최초 본인 닉네임만 포함 (중복방지)
        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);
            if (clientSocket && clientSocket.handshake.query.username !== connectedClientUsername) {
                usersInRoom.add(clientSocket.handshake.query.username);
            }
        }
        // 본인 포함 접속중인 유저 uniqueUsers 에 전송
        const uniqueUsers = Array.from(usersInRoom);
        io.to(room).emit('other_user', uniqueUsers);
        console.log(`${connectedClientUsername} 방 참여자:`, uniqueUsers);
    }
    console.log(`사용자 ${connectedClientUsername} 들어왔습니다.` )
    
    // User 전체메시지
    // 서버로 받는게 아닌 클라이언트로 emit 을 이용해 메시지를 보냄
 
    // ** 모든 방 전체에 공통메시지를 보냄
    // client.broadcast.emit('new message',{username:"관리자", message:`[${connectedClientUsername}] 님이 방에 들어왔습니다!`})
// ========================================
   
    client.to(room).emit('new message',{
        username:"관리자",
        message:`[${connectedClientUsername}] 님이 방에 들어왔습니다!`
    })



// new message 를 부르면 실행, 
// ==> message,username (msg) 로 받음 
// 방 1개 일때 전체 메시지
    // client.on('new message', (msg)=>{
    // console.log(`보낸 사용자 ${connectedClientUsername} 님` )
    //     console.log(msg,'서버 메시지')
    //     io.emit('new message', {username:msg.username, message:msg.message})


    // })
// ========================================

// 개인방 만들었을 경우
    client.on('new message',(msg)=> {
        console.log(`${room}방: ${connectedClientUsername}님의 메시지`, msg);
        io.to(room).emit('new message',{
            username:msg.username,
            message:msg.message
        })
    })
// ========================================


    // 사용자가 나갔을 때
    // 전체 채팅방 기준
    // client.on('disconnect', ()=>{
    //     console.log('사용자가 나갔습니다...')
    // io.emit('new message',{username:"관리자", message:`[${connectedClientUsername}] 님이 방에 나갔습니다..`})

    // })
// =======================
// 개인 채팅방 기준
// 

// 채팅방 나가게 될 시 메시지/채팅방 나가기
client.on('disconnect', ()=>{
    console.log(`${connectedClientUsername}님이 ${room}방에서 나갔습니다.`);
    io.to(room).emit('new message',{
        username:"관리자",
        message:`[${connectedClientUsername}] 님이 방에서 나갔습니다...`
    })
})


})

// app.get("/message",(_,res)=>res.send("hello from express!"))
// 주소창을 통해 들어왔을 경우
app.get("/api",(_, res)=>res.send("hello from api!"))