import { useEffect, useState } from "react";
import { getNotificationByType } from "./Notification";
import { requestGet, requestPost } from "../api/fetch";
import CODE from "../constants/code";
import URL from "../constants/url";
import Chat from "./Chat";

const Friend = ({ socket, user }) => {
  const [open, setOpen] = useState(false);
  const [badge, setBadge] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [friends, setFriends] = useState([]);
  const [dialogId, setDialogId] = useState();

  const getFriendNotification = () => {
    getNotificationByType(CODE.NOTIFICATION_FRIEND, (res) => {
      if (res.status === CODE.SUCCESS) {
        const { notifications } = res.data;
        setNotifications(notifications);
      }
    });
  };
  const getFriends = () => {
    requestGet(URL.FRIEND_GET, null, (res) => {
      if (res.status === CODE.SUCCESS) {
        const { friends } = res.data;
        setFriends(friends);
      }
    });
  };
  const acceptFriend = (user_id) => {
    requestPost(URL.FRIEND_ACCEPT, { user_id }, (res) => {
      if (res.status === CODE.SUCCESS) alert("요청을 수락했어요.");
      else if (res.status === CODE.FRIEND_CANCELED)
        alert("이미 취소된 요청이에요.");

      getFriendNotification();
      getFriends();
    });
  };
  const refuseFriend = (user_id) => {
    requestPost(URL.FRIEND_REFUSE, { user_id }, (res) => {
      if (res.status === CODE.SUCCESS) alert("요청을 거절했어요.");
      else if (res.status === CODE.FRIEND_CANCELED)
        alert("이미 취소된 요청이에요.");
      getFriendNotification();
      getFriends();
    });
  };
  const cancelRequestFriend = (user_id) => {
    if (window.confirm("친구 요청을 취소할까요?")) {
      requestPost(URL.FRIEND_CANCEL, { user_id }, (res) => {
        if (res.status === CODE.SUCCESS) {
          alert("친구 요청을 취소했어요.");
          getFriendNotification();
        }
      });
    }
  };
  const onMessage = (data) => {
    !open && setBadge(true);
    const { user, message } = JSON.parse(data);
    if (open) {
      setFriends((state) => {
        const temp = [...state];
        temp.map((friend) => {
          if (friend.id === user.id) friend.last_message = message;
          return friend;
        });
        return temp;
      });
    } else setBadge(true);
  };
  const joinChannel = () => socket.emit("join", { user });

  useEffect(() => {
    if (open) {
      getFriendNotification();
      getFriends();
      setBadge(false);
    } else {
      setDialogId(null);
    }
    socket.on(`room_${user.id}`, onMessage);
    return () => {
      socket.off(`room_${user.id}`, onMessage);
    };
  }, [open]);

  useEffect(() => {
    joinChannel();
  }, []);

  return (
    <>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 16,
            border: "2px solid #000",
            backgroundColor: "#fff",
            minWidth: 200,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>친구</h2>
            <button onClick={() => setOpen(false)}>닫기</button>
          </div>

          {dialogId ? (
            <Chat socket={socket} channel={dialogId} user={user} />
          ) : (
            <div>
              <div>받은 요청</div>
              <ul>
                {notifications.length > 0 &&
                  notifications
                    .filter(
                      (noti) =>
                        noti.receiver_id === user.id &&
                        noti.type === CODE.FRIEND_PENDING
                    )
                    .map((noti, index) => {
                      const content = JSON.parse(noti.content);
                      const user = content.user;
                      return (
                        <div key={`noti_received_${index}`}>
                          <div>{user.nickname}님이 친구요청을 보냈습니다.</div>
                          <div>
                            <button onClick={() => acceptFriend(user.id)}>
                              수락
                            </button>
                            <button onClick={() => refuseFriend(user.id)}>
                              거절
                            </button>
                          </div>
                        </div>
                      );
                    })}
              </ul>
              <hr />
              <div>보낸 요청</div>
              <ul>
                {notifications.length > 0 &&
                  notifications
                    .filter(
                      (noti) =>
                        noti.sender_id === user.id &&
                        noti.type === CODE.FRIEND_PENDING
                    )
                    .map((noti, index) => {
                      const content = JSON.parse(noti.content);
                      const user = content.user;
                      return (
                        <div key={`noti_received_${index}`}>
                          <div>{user.nickname}</div>
                          <div>
                            <button
                              onClick={() =>
                                cancelRequestFriend(noti.receiver_id)
                              }
                            >
                              요청 취소
                            </button>
                          </div>
                        </div>
                      );
                    })}
              </ul>
              <hr />
              <div>차단 목록</div>
              <hr />
              <div>친구 목록</div>
              <ul>
                {friends.length > 0 ? (
                  friends.map((friend, index) => (
                    <li key={`friend_${index}`}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <span>{friend.nickname}</span>
                        <div>
                          <button onClick={() => setDialogId(friend.id)}>
                            채팅
                          </button>
                          <button>:</button>
                        </div>
                      </div>
                      {friend.last_message && (
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {friend.last_message}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <div></div>
                )}
              </ul>
              <hr />
            </div>
          )}
        </div>
      )}
      <button
        style={{ position: "absolute", right: 20, bottom: 20, padding: 8 }}
        onClick={() => setOpen(true)}
      >
        {badge && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#f00",
              transform: "translate(50%, -50%)",
            }}
          ></div>
        )}
        Friend
      </button>
    </>
  );
};

export default Friend;
