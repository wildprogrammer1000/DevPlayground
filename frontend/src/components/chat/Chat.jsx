import { useEffect, useRef, useState } from "react";
import { requestPost } from "../../api/fetch";
import CODE from "../../constants/code";
import URL from "../../constants/url";

const Chat = ({ socket, channel, user }) => {
  const initialized = useRef(false);
  const messageContainer = useRef();

  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [channelInfo, setChannelInfo] = useState({
    joined: false,
    channel: null,
    userCount: 0,
  });

  const sendChat = (e) => {
    e.preventDefault();
    if (chatMessage.length === 0) return;
    if (!user) return alert("로그인 ㄱㄱ");

    try {
      const data = {
        channel,
        user,
        message: chatMessage,
      };
      socket.emit("sendMessage", data);
    } catch (err) {
      console.error("Error - Send Chat: ", `channel: ${channel} | `, err);
    } finally {
      setChatMessage("");
    }
  };
  const onJoinChat = (data) => {
    setChannelInfo((state) => ({
      ...state,
      joined: true,
      channel: data.channel,
      userCount: data.user_count,
    }));
  };

  const onMessage = (data) => {
    const currentChannel = data.channel;
    if (currentChannel !== channel) return;
    const { user, message } = data;
    setMessages((state) => [...state, { user, message }]);
  };
  const onUpdateUserCount = ({ count, user }) => {
    console.log("data: ", count, user);
    if (user) {
      const newMessage = {
        user,
        message: `${user.nickname}님이 참여했습니다`,
      };
      setMessages((state) => [...state, newMessage]);
    }
    setChannelInfo((state) => ({ ...state, userCount: count }));
  };
  const requestFriend = () => {
    if (window.confirm(`${userInfo.nickname}님께 친구요청을 보낼까요?`)) {
      if (!user) {
        setUserInfo(null);
        return alert("로그인이 필요해요.");
      }
      requestPost(URL.FRIEND_REQUEST, { receiver_id: userInfo.id }, (res) => {
        if (res.status === CODE.SUCCESS) {
          alert(userInfo.nickname + "님께  친구 요청을 보냈어요.");
          setUserInfo(null);
        } else if (res.status === CODE.FRIEND_DUPLICATED) {
          console.log("FRIEND REQUEST RESULT: ", res.data);
          const { state, user1_id } = res.data;
          switch (state) {
            case CODE.FRIEND_ACCEPTED:
              alert("이미 등록된 친구예요.");
              break;
            case CODE.FRIEND_PENDING:
              if (user1_id === user.id) alert("이미 요청을 보냈어요.");
              else alert("이미 받은 요청이 있어요.");
              setUserInfo(null);
              break;
            case CODE.FRIEND_BLOCKED:
              break;
            default:
          }
        }
      });
    }
  };

  useEffect(() => {
    if (socket && !initialized.current) {
      initialized.current = true;
      socket.emit("joinChat", { channel, user });
      socket.on("onJoinChat", onJoinChat);
      socket.on("onMessage", onMessage);
      socket.on("updateUserCount", onUpdateUserCount);
    }
    return () => {
      if (initialized.current && socket) {
        socket.off("onJoinChat", onJoinChat);
        socket.off("onMessage", onMessage);
        socket.off("updateUserCount", onUpdateUserCount);
      }
    };
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
  return channelInfo.joined ? (
    <div>
      {channel === "all" && <div>{channelInfo.userCount}명 참여중</div>}
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
          <div>이름: {userInfo.nickname}</div>
          {/* 이미 나의 친구인지 체크필요 */}
          <button onClick={requestFriend}>친구신청</button>
        </div>
      )}
    </div>
  ) : (
    <div>연결중...</div>
  );
};

export default Chat;
