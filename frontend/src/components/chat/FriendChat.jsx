import { useState, useRef, useEffect } from "react";
import { requestGet, requestPost } from "../../api/fetch";
import CODE from "../../constants/code";
import URL from "../../constants/url";

const FriendChat = ({ socket, friend, user }) => {
  const initialized = useRef(false);
  const messageContainer = useRef();
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendChat = (e) => {
    e.preventDefault();
    if (chatMessage.length === 0) return;
    if (!user) return alert("로그인이 필요해요");
    requestPost(
      URL.FRIEND_MESSAGE,
      { message: chatMessage, user_id: friend.id },
      (res) => {
        if (res.status === CODE.SUCCESS) {
          setMessages((state) => [
            ...state,
            { user, message: chatMessage, create_time: Date.now() },
          ]);
          setChatMessage("");
        }
      }
    );
  };
  const getChatLog = () => {
    requestGet(URL.FRIEND_MESSAGE, { user_id: friend.id }, (res) => {
      const messages = res.data.messages.sort(
        (a, b) => new Date(a.create_time) - new Date(b.create_time)
      );
      if (res.status === CODE.SUCCESS) setMessages(messages);
    });
  };
  const onFriendMessage = (data) => {
    setMessages((state) => [...state, data]);
  };
  useEffect(() => {
    getChatLog();
  }, []);

  useEffect(() => {
    if (!messageContainer.current) return;
    const { scrollHeight, scrollTop, clientHeight } = messageContainer.current;
    const scrollAmount = 50;

    if (messages.length > 0 && !initialized.current) {
      initialized.current = true;
      messageContainer.current.scrollTo({ top: scrollHeight });
    }

    // 스크롤을 올려서 위 내용을 보고 있는 경우 자동스크롤 방지
    if (
      scrollHeight > clientHeight &&
      scrollHeight - scrollTop - clientHeight < scrollAmount
    )
      messageContainer.current.scrollTo({
        top: messageContainer.current.scrollHeight,
      });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("onFriendMessage", onFriendMessage);
    }
    return () => {
      if (socket) {
        socket.off("onFriendMessage", onFriendMessage);
      }
    };
  }, [socket]);
  return (
    <div>
      <ul
        ref={messageContainer}
        style={{
          border: "2px solid #000",
          padding: 8,
          height: 200,
          overflowY: "auto",
        }}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li
              key={`chat_${friend.id}_${index}`}
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
              {/* <span style={{ fontSize: 8 }}>{message.create_time}</span> */}
            </li>
          ))
        ) : (
          <div></div>
        )}
      </ul>
      <form
        style={{ display: "flex", alignItems: "center" }}
        onSubmit={sendChat}
      >
        <input
          style={{ flex: 1 }}
          placeholder="메시지를 입력해주세요."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        ></input>
        <button>보내기</button>
      </form>
    </div>
  );
};
export default FriendChat;
