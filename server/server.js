import {Server} from "socket.io"
import express from "express";
import *as http from "http";

const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT || 10000;
const io = new Server(server,{
//크로스 오리진
    cors:{
        origin:"*"
    }
});

server.listen(PORT, ()=>{
    console.log('서버에서 듣고 있습니다... 3001')
});


io.on('connection', (client)=>{

    const connectedClientUsername = client.handshake.query.username;
    const room = client.handshake.query.room;
    // console.log(client.handshake.headers.time, "time stamp")

    client.join(room)
    const clients = io.sockets.adapter.rooms.get(room);
    if (clients) {
        const usersInRoom = new Set(); 
        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);
            if (clientSocket) {
                usersInRoom.add(clientSocket.handshake.query.username);
            }
        }
        const uniqueUsers = Array.from(usersInRoom);
        io.to(room).emit('other_user', uniqueUsers);
        console.log(`${connectedClientUsername} 방 참여자:`, uniqueUsers);
    }


    console.log(`사용자 ${connectedClientUsername} 들어왔습니다.` )

// 개인방 만들었을 경우
    client.on('new message',(msg)=> {
        io.to(room).emit('new message',{
            username:msg.username,
            message:msg.message,
            Create_Time:msg.time
            
        })
        console.log(msg.time,'messageTime')
    })


client.on('disconnect', () => {
    console.log(`${connectedClientUsername}님이 ${room}방에서 나갔습니다.`);
    
  
    //  연결 끊긴 사용자를 제외한 사용자 목록 전송
    const clients = io.sockets.adapter.rooms.get(room);
    if (clients) {
        const usersInRoom = new Set();
        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);
            if (clientSocket) {
                usersInRoom.add(clientSocket.handshake.query.username);
            }
        }
        const uniqueUsers = Array.from(usersInRoom);
        console.log(`연결 끊김 후 방 참여자:`, uniqueUsers);
        io.to(room).emit('other_user', uniqueUsers);
    } else {
        // 방이 비어있는 경우
        io.to(room).emit('other_user', []);
    }
});

})

// 주소창을 통해 들어왔을 경우
app.get("/api",(_, res)=>res.send("hello from api!"))