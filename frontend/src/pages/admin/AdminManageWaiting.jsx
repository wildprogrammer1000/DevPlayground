import { useState, useEffect } from "react";
import { requestGet, requestPost } from "../../api/fetch";
import URL from "../../constants/url";
import CODE from "../../constants/code";

const AdminManageWaiting = () => {
  const [waitingUsers, setWaitingUsers] = useState([]);
  const getWaitingUsers = () => {
    requestGet(URL.ADMIN_GET_WATIING_USERS, null, (res) => {
      if (res.status === CODE.SUCCESS) {
        const { waiting_users } = res.data;
        setWaitingUsers(waiting_users);
      }
    });
  };
  const approve = (user) => {
    requestPost(URL.ADMIN_APPROVE_USER, { user }, (res) => {
      if (res.status === CODE.SUCCESS) {
        alert("가입을 승인했습니다.");
        getWaitingUsers();
      }
    });
  };
  const reject = (user) => {
    requestPost(URL.ADMIN_REJECT_USER, { user }, (res) => {
      if (res.status === CODE.SUCCESS) {
        alert("가입을 거절했습니다.");
        getWaitingUsers();
      }
    });
  };
  useEffect(() => {
    getWaitingUsers();
  }, []);
  return (
    <div>
      <div>가입 승인 대기 사용자</div>
      {waitingUsers.length > 0 ? (
        <ul>
          {waitingUsers.map((user, index) => (
            <li key={`waiting_user_${index}`}>
              <div>
                <span>{user.email}</span>
                <span>{user.nickname}</span>
                <span>{user.platform}</span>
              </div>
              <div>
                <button onClick={() => approve(user)}>승인</button>
                <button onClick={() => reject(user)}>거절</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default AdminManageWaiting;
