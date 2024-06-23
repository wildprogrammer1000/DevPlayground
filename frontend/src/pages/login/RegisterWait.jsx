import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { requestDelete } from "../../api/fetch";
import URL from "../../constants/url";
import CODE from "../../constants/code";

const RegisterWait = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();

  const cancelRegister = () => {
    if (!userInfo) {
      alert("유저 정보가 존재하지 않습니다.");
      navigate(URL.LOGIN);
      return;
    }
    if (window.confirm("관리자 계정 가입 신청을 취소할까요?")) {
      requestDelete(URL.REGISTER_WAIT, userInfo, (res) => {
        if (res.status === CODE.SUCCESS) {
          alert("가입 신청이 취소되었습니다.");
          navigate(URL.MAIN);
        }
      });
    }
  };
  useEffect(() => {
    if (!location.state) {
      alert("비정상적인 접근입니다.");
      return;
    }
    setUserInfo(location.state.userInfo);
  }, []);

  return (
    <div>
      <div>가입 승인 대기중입니다.</div>
      <button onClick={cancelRegister}>신청 취소</button>
    </div>
  );
};
export default RegisterWait;
