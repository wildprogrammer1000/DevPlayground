import { useState, useEffect, useRef } from "react";
import { requestPost } from "../api/fetch";
import URL from "../constants/url";
import CODE from "../constants/code";

const Chat = ({ socket, channel, user }) => {
  const joined = useRef(false);
  const socketRef = useRef();
  const messageContainer = useRef();

  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState();

  const joinChannel = () => socket && socket.emit("join", { channel, user });
  const onJoin = () => {
    if (joined.current) return;
    joined.current = true;
  };

  const onMessage = (data) => {
    const parsedData = JSON.parse(data);
    setMessages((state) => [...state, parsedData]);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (chatMessage.length === 0) return;
    if (!user) {
      alert("로그인 ㄱㄱ");
      return;
    }
    try {
      const data = {
        channel,
        user,
        message: chatMessage,
      };
      socket.emit("message", data);
      setChatMessage("");
    } catch (err) {
      console.error("Error - Send Chat: ", `channel: ${channel} | `, err);
    }
  };
  const requestFriend = () => {
    if (window.confirm(`${userInfo.nickname}님께 친구요청을 보낼까요?`)) {
      requestPost(URL.FRIEND_REQUEST, { receiver_id: userInfo.id }, (res) => {
        if (res.status === CODE.SUCCESS) {
          alert(userInfo.nickname + "님께  친구 요청을 보냈습니다.");
          setUserInfo(null);
        }
      });
    }
  };
  useEffect(() => {
    joinChannel();
    return () => {
      socketRef.current && socketRef.current.off("join", onJoin);
      socketRef.current && socketRef.current.off("message", onMessage);
    };
  }, []);

  useEffect(() => {
    if (!socket || joined.current) return;
    socketRef.current = socket;
    socket.on("joined", onJoin);

    if (channel === "all") {
      socket.on("all", onMessage);
    } else {
      socket.on(`room_${user.id}`, onMessage);
      socket.on(`room_${channel}`, onMessage);
    }
    joinChannel();
  }, [socket]);

  useEffect(() => {
    if (!messageContainer.current) return;

    const { scrollHeight, scrollTop, clientHeight } = messageContainer.current;
    const scrollAmount = 50;

    // 스크롤을 올려서 위 내용을 보고 있는 경우 자동스크롤 방지
    if (
      scrollHeight > clientHeight &&
      scrollHeight - scrollTop - clientHeight < scrollAmount
    )
      messageContainer.current.scrollTo({
        top: messageContainer.current.scrollHeight,
      });
  }, [messages]);

  return socket && socket.connected ? (
    <>
      <ul
        style={{
          border: "2px solid #000",
          padding: 8,
          height: 200,
          overflowY: "auto",
        }}
        ref={messageContainer}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li
              key={`chat_${channel}_${index}`}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent:
                  user && user.id === message.user.id
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              {(!user || user?.id !== message.user.id) && (
                <span onClick={() => setUserInfo(message.user)}>
                  {message.user.nickname}
                </span>
              )}
              <span style={{ padding: 8, border: "1px solid #000" }}>
                {message.message}
              </span>
            </li>
          ))
        ) : (
          <div></div>
        )}
      </ul>
      <form
        onSubmit={sendChat}
        style={{ display: "flex", alignItems: "center" }}
      >
        <input
          style={{ flex: 1 }}
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        ></input>
        <button type="submit">전송</button>
      </form>
      {userInfo && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <button onClick={() => setUserInfo(null)}>닫기</button>
          <div>이름: {user.nickname}</div>
          {/* 이미 나의 친구인지 체크필요 */}
          <button onClick={requestFriend}>친구신청</button>
        </div>
      )}
    </>
  ) : (
    <div>연결 안됨</div>
  );
};
export default Chat;
