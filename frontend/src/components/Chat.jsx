import { useState, useEffect, useRef } from "react";

const Chat = ({ socket, channel, user }) => {
  const joined = useRef(false);
  const socketRef = useRef();
  const messageContainer = useRef();

  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const joinChannel = () => socket.emit("join", { channel });
  const onJoin = () => (joined.current = true);

  const onMessage = (data) => {
    if (data.channel !== channel) return;
    setMessages((state) => [...state, data]);
  };

  const sendChat = (e) => {
    e.preventDefault();
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
  useEffect(() => {
    return () => {
      socketRef.current && socketRef.current.off("join", onJoin);
      socketRef.current && socketRef.current.off("message", onMessage);
    };
  }, []);

  useEffect(() => {
    if (!socket || joined.current) return;
    socketRef.current = socket;
    socket.on("join", onJoin);
    socket.on("message", onMessage);
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
                <span>{message.user.nickname}</span>
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
      <form onSubmit={sendChat}>
        <input
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        ></input>
        <button type="submit">전송</button>
      </form>
    </>
  ) : (
    <div>연결 안됨</div>
  );
};
export default Chat;
