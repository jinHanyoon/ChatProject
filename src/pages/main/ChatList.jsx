import React from "react";
import supabase from "../../api/supabase.js";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useSession from "../../auth/session.js";
import useMessageStore from '../MsgStore.js/messages.js';
import GptButton from "../../component/button/Gptbutton.jsx";
import dayjs from "../../util/day.js";  
import useShowStore from "../../component/buttonStore/ShowStore.jsx";
import GptMessage from "../GptService/GptMessage.jsx";
import useRoomIdStore from "../RoomStore/RoomStore.jsx";
export default function ChatList() {
  const [UserListComplete, setUserList] = useState([]);
  const { userUUID } = useSession();
  const [previewMsg, setPreviewMsg] = useState([]);
  const { messages } = useMessageStore()  
  // const [UserRoomId, setUserRoomId] = useState()
  const Modal = useShowStore(state=>state.ShowGPT)
  const setTargetRoom=useRoomIdStore(state=>state.setTargetRoom)

// useEffect(()=>{
  // console.log( UserRoomId, 'roomid')
// },[UserRoomId])

  useEffect(() => {
    const UserFetch = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, id,avatar_url");
      if (data) {
        setUserList(data);
      } else {
        console.log(error);
      }
    };
    UserFetch();
  }, []);


  useEffect(()=>{
  },[messages])


  useEffect(() => {
    if (!userUUID || !UserListComplete.length) return;

    const fetchChatHistory = async () => {
      const roomConditions = UserListComplete.map(
        (user) => `roomName.eq.${createRoomId(userUUID, user.id)}`
      ).join(",");

      const { data, error } = await supabase
        .from("Chat_history")
        .select("*")
        .or(roomConditions);

      if (error) {
        console.error("채팅 기록 불러오기 실패:", error);
        return;
      }

      if (data) {
        setPreviewMsg(data);
      }
    };

    const channel = supabase
      .channel("Chat_history_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Chat_history",
        },
        (payload) => {
          fetchChatHistory();
        }
      )
      .subscribe((status) => {});

    fetchChatHistory();

    return () => {
      console.log("구독 해제");
      channel.unsubscribe();
    };
  }, [userUUID, UserListComplete]);

  // 항상 알파벳 순서로 정렬
  const createRoomId = (id01, id02) => {
    return [id01, id02].sort().join("-");
  };


  // 마지막 메시지//시간 업데이트
  // Chat page 넘겨주기 ==> [href ==> userName] ==> ChatPage[id]
  const UserList = UserListComplete.filter((item) => item.id !== userUUID).map(
    (item) => {
      // createRoomId 로 정렬한것을 가져 옴
      const roomId = createRoomId(userUUID, item.id);
      // 해당 채팅방의 마지막 메시지 찾기
      const roomChat = previewMsg.find((msg) => msg.roomName === roomId);
      let lastMessage = "";
      let lastTime = "";
      if (roomChat?.ChatTalk) {
        // ChatTalk가 배열인 경우
        if (Array.isArray(roomChat.ChatTalk) && roomChat.ChatTalk.length > 0) {
          const lastChat = roomChat.ChatTalk[roomChat.ChatTalk.length - 1];
          lastMessage = lastChat?.message || "";
          lastTime = lastChat?.Create_Time || "";
        }
        // ChatTalk가 단일 메시지 객체인 경우
        else if (typeof roomChat.ChatTalk === "object") {
          lastMessage = roomChat.ChatTalk?.message || "";
          lastTime = roomChat.ChatTalk?.Create_Time || "";

        }
      

      }

      return (
        <div className="w-full relative" key={item.id}>   
            <div className="absolute top-0 right-1"
            onClick={() => {
              setTargetRoom(roomId);
          }}
            >
            <GptButton />
            </div>
         <Link to={`/about/${roomId}`} 
        state={item} 
        >
          <li className="h-20 px-4 py-2 border-b border-gray-600 flex items-center gap-4 hover:bg-gray-600 cursor-pointer">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-500">
              {item?.avatar_url ? (
                <img
                  src={item.avatar_url}
                  alt={`${item.username}의 프로필`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-gray-100 text-xl">
                  {item?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-100">{item.username}</p>
              <p className="text-sm text-gray-400 truncate">
  {lastMessage && lastMessage.length > 20 
    ? lastMessage.substring(0, 20) + '...' 
    : lastMessage}
</p>
            </div>
            <div className="text-xs text-gray-400 text-right flex-col">
            {lastTime && dayjs(lastTime).fromNow()}
        
            </div>
          
          </li>

        </Link>
        </div>

      );
    }
  );

  return (
    <div className="relative">
  
      <ul className="overflow-auto bg-gray-700">
        {UserList}

      </ul>
      {Modal ? <GptMessage/> : null}


    </div>
  );
}
