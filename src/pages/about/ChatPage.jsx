import React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useSession from "../../auth/session.js";
import { useState, useEffect, useRef } from "react";
import supabase from "../../api/supabase.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useMessageStore from "../MsgStore.js/messages.js";
import ChatValue from "../../component/aboutComponent/ChatValue.jsx";
import ChatHeader from "../../component/aboutComponent/ChatHeader.jsx";
import ChatHistory from "../../component/aboutComponent/ChatHistory.jsx";
import ChatLive from "../../component/aboutComponent/ChatLive.jsx";

export default function ChatPage() {
  const { userName } = useSession();
  const [socket, setSocket] = useState(null);
  const { messages, addMessage,clearMessages } = useMessageStore();
  const [otherUser, setOtherUser] = useState([]);
  const [_chatData, _setChatData] = useState([]);
  const navigate = useNavigate();
  const messageEndRef = useRef(null);
  const { ChatNumber } = useParams();
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://chatproject-eak9.onrender.com';


  // Link prop data
  const location = useLocation();
  const userInFo = location.state;

  useEffect(() => {
    const connectChatServer = () => {
      const _socket = io(SOCKET_URL, {
        autoConnect: false,
         path: '/socket.io/',
        query: {
          username: userName,
          room: ChatNumber,
        },
      });
      _socket.connect();
      setSocket(_socket);
    };
    clearMessages();
    connectChatServer();
    ChatDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ChatDataFetch = async () => {
    const { data: ChatData } = await supabase
      .from("Chat_history")
      .select("*")
      .eq("roomName", ChatNumber);
    if (ChatData) {
      _setChatData(ChatData);
      // console.table(userInFo);
    } else {
      console.log("불러오지못했습니다");
    }
  };

  const saveChatMessages = async () => {
    const { data: PrevChat } = await supabase
      .from("Chat_history")
      .select("*")
      .filter("roomName", "eq", ChatNumber);

    if (PrevChat && PrevChat.length > 0) {
      let existingMessages = [];
      // 데이터 베이스 테이블 형식을 josnd 형식으로 바꾸어주어 파싱 x
      if (_chatData.length > 0 && _chatData[0]?.ChatTalk) {
        existingMessages = _chatData[0].ChatTalk;
      } else {
        console.log("저장실패 else");
      }
      const combinedMessages = [...existingMessages, ...messages];
      await supabase
        .from("Chat_history")
        .update({ ChatTalk: combinedMessages })
        .filter("roomName", "eq", ChatNumber);
      console.log("저장완료", combinedMessages);
    } else {
      await supabase.from("Chat_history").insert({
        roomName: ChatNumber,
        ChatTalk: messages,
      });
      console.log("저장완료");
    }
  };

  const onConnected = () => {
    // console.log("상대방 정보:", otherUser, "front");
  };
  const onDisConnected = async () => {
    // console.log("프론트 onDisConnected");
    navigate("/Chat_list");
  };
  const onMessageReceived = (msg) => {
    // console.log(msg, "front msg");
    addMessage(msg);
  };

  const handleOtherUser = (IngUser) => {
    console.log("받은 other_user:", IngUser); // 디버깅용
    const sortedUser = [...IngUser].sort((a, b) => a.localeCompare(b));
    setOtherUser(sortedUser);
  };
  const PickMessage = async () => {
    try {
      // 먼저 유저 수 체크
      if (otherUser.length === 1 && messages.length > 0) {
        console.log("유저가 1명일 때 메시지를 저장합니다.");
        await saveChatMessages();
      } else {
        console.log("메시지 저장 조건이 충족되지 않음:", {
          // 에러가 아닌 정보성 로그로 변경
          유저수: otherUser.length,
          메시지수: messages.length,
        });
      }
    } catch (error) {
      // 에러 처리 추가
      console.error("메시지 저장 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    setOtherUser(otherUser);
  }, [otherUser]);

  useEffect(() => {
    socket?.on("connect", onConnected);
    socket?.on("disconnect", onDisConnected);
    socket?.on("new message", onMessageReceived);
    socket?.on("other_user", handleOtherUser);
    return () => {
      socket?.off("connect", onConnected);
      socket?.off("disconnect", onDisConnected);
      socket?.off("new message", onMessageReceived);
      socket?.off("other_user", handleOtherUser);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [_chatData]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    PickMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);
 
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      {/* 채팅방 헤더 */}
      <ChatHeader
        userInFo={userInFo}
        socket={socket}
        saveChatMessages={saveChatMessages}
      />
      {/* 채팅 메시지 영역 - 스크롤바 스타일링 */}
      <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-500/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500/40">
        <ul className="space-y-4">
          {/* 이전채팅 불러오기 */}
          <ChatHistory _chatData={_chatData} userName={userName} />
          {/* 현재 채팅중인 내용 */}
          <ChatLive messages={messages} userName={userName} />
          {/* 채팅창 스크롤 자동제어 */}
          <div ref={messageEndRef} />
        </ul>
      </div>

      {/* 메시지 입력 영역 */}
      <ChatValue
        socket={socket}
        userName={userName}
      />
    </div>
  );
}
