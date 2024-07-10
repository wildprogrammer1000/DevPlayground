import { useEffect, useRef, useState } from "react";
import { requestGet, requestPost } from "../../api/fetch";
import CODE from "../../constants/code";
import URL from "../../constants/url";
import style from "../../css/module/Friend.module.css";
import FriendChat from "../chat/FriendChat";
import { getNotificationByType } from "../Notification";

const Menu = {
  LIST: 0,
  REQUEST_RECEIVE: 1,
  REQUEST_SEND: 2,
  BLOCK: 3,
};

const Friend = ({ socket, user }) => {
  const isOpen = useRef(false);
  const [open, setOpen] = useState(false);
  const [badge, setBadge] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(Menu.LIST);
  const [menuId, setMenuId] = useState();
  const [recentMessage, setRecentMessage] = useState({});

  const [notifications, setNotifications] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentDialog, setCurrentDialog] = useState();

  const friendList = friends.filter(
    (friend) => friend.state === CODE.FRIEND_ACCEPTED
  );
  const receiveRequests = notifications.filter(
    (noti) => noti.receiver_id === user.id && noti.type === CODE.FRIEND_PENDING
  );
  const sendRequests = notifications.filter(
    (noti) => noti.sender_id === user.id && noti.type === CODE.FRIEND_PENDING
  );

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
        setFriends(friends)
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

  const deleteFriend = (friend) => {
    if (window.confirm(`${friend.nickname}님을 친구목록에서 삭제할까요?`)) {
      // 삭제 요청
      requestPost(URL.FRIEND_DELETE, { user_id: friend.id }, (res) => {
        if (res.status === CODE.SUCCESS) {
          setMenuId(null);
          getFriends();
          alert(`${friend.nickname}님을 친구목록에서 삭제했어요.`);
        }
      });
    }
  };

  const onFriendMessage = (data) => {
    if (!isOpen.current) setBadge(true);
    setRecentMessage((state) => ({ ...state, [data.user.id]: data.message }));
  };

  useEffect(() => {
    getFriendNotification();
    getFriends();
    isOpen.current = open;
    if (open) {
      setBadge(false);
    } else {
      if (!open) setCurrentDialog(null);
    }
  }, [open]);

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

  useEffect(() => {
    getFriends();
    getFriendNotification();
  }, [currentMenu]);

  return (
    <>
      {open && (
        <div className={style.friend}>
          <div className={style.header}>
            <h2>
              {currentDialog ? (
                <>
                  <button onClick={() => setCurrentDialog(null)}>&lt;</button>
                  <span>{currentDialog.nickname}</span>
                </>
              ) : (
                "친구"
              )}
            </h2>
            <button
              onClick={() => {
                setOpen(false);
              }}
            >
              닫기
            </button>
          </div>
          {!currentDialog && (
            <div className={style.nav}>
              <div
                className={`${style.nav_item} ${
                  currentMenu === Menu.LIST ? style.active : style.inactive
                }`}
                onClick={() => setCurrentMenu(Menu.LIST)}
              >
                친구 목록
              </div>
              <div
                className={`${style.nav_item} ${
                  currentMenu === Menu.REQUEST_RECEIVE
                    ? style.active
                    : style.inactive
                }`}
                onClick={() => setCurrentMenu(Menu.REQUEST_RECEIVE)}
              >
                받은 요청
              </div>
              <div
                className={`${style.nav_item} ${
                  currentMenu === Menu.REQUEST_SEND
                    ? style.active
                    : style.inactive
                }`}
                onClick={() => setCurrentMenu(Menu.REQUEST_SEND)}
              >
                보낸 요청
              </div>
              <div
                className={`${style.nav_item} ${
                  currentMenu === Menu.BLOCK ? style.active : style.inactive
                }`}
                onClick={() => setCurrentMenu(Menu.BLOCK)}
              >
                차단 목록
              </div>
            </div>
          )}

          {currentDialog ? (
            <FriendChat socket={socket} friend={currentDialog} user={user} />
          ) : (
            <div className={style.list_wrapper}>
              {currentMenu === Menu.LIST && (
                <ul>
                  {friendList.length > 0 ? (
                    friendList.map((friend, index) => (
                      <li
                        key={`friend_${index}`}
                        className={style.list_item}
                        onClick={() => {
                          setCurrentDialog(friend);
                          setRecentMessage((state) => {
                            const temp = { ...state };
                            delete temp[friend.id];
                            return temp;
                          });
                        }}
                      >
                        <span>{friend.nickname}</span>
                        <span className={style.message_preview}>
                          {recentMessage[friend.id] && (
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {recentMessage[friend.id]}
                            </div>
                          )}
                        </span>
                        {menuId === friend.id ? (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              className={style.btn_red}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFriend(friend);
                              }}
                            >
                              삭제
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuId(null);
                              }}
                            >
                              닫기
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuId(friend.id);
                            }}
                          >
                            :
                          </button>
                        )}
                      </li>
                    ))
                  ) : (
                    <>친구가 없어요..</>
                  )}
                </ul>
              )}
              {currentMenu === Menu.REQUEST_RECEIVE && (
                <ul>
                  {receiveRequests.length > 0 &&
                    receiveRequests.map((noti, index) => {
                      const content = JSON.parse(noti.content);
                      const user = content.user;
                      return (
                        <div
                          key={`noti_received_${index}`}
                          className={style.list_item}
                        >
                          <div>{user.nickname}님이 친구요청을 보냈습니다.</div>
                          <div className={style.buttons}>
                            <button
                              onClick={() => acceptFriend(user.id)}
                              className={style.btn_green}
                            >
                              수락
                            </button>
                            <button
                              onClick={() => refuseFriend(user.id)}
                              className={style.btn_red}
                            >
                              거절
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </ul>
              )}
              {currentMenu === Menu.REQUEST_SEND && (
                <div>
                  {sendRequests.length > 0 &&
                    sendRequests.map((noti, index) => {
                      const content = JSON.parse(noti.content);
                      const user = content.user;
                      return (
                        <div
                          key={`noti_received_${index}`}
                          className={style.list_item}
                        >
                          <div>{user.nickname}</div>
                          <div>
                            <button
                              className={style.btn_red}
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
                </div>
              )}
              {currentMenu === Menu.BLOCK && <div></div>}
            </div>
          )}
        </div>
      )}
      <button className={style.btn_friend} onClick={() => setOpen(true)}>
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
        친구
      </button>
    </>
  );
};

export default Friend;
