import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { requestGet, requestPost } from "../../api/fetch";
import { setSessionItem } from "../../utils/storage";
import URL from "../../constants/url";
import CODE from "../../constants/code";

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputs, setInputs] = useState({
    role: "user",
    nickname: "",
    agreement: false,
    policy: false,
  });
  const [nicknameVerified, setNicknameVerified] = useState(false);

  const onChangeRole = (e) =>
    setInputs((state) => ({ ...state, role: e.target.value }));

  const handleResponse = (res) => {
    switch (res.status) {
      case CODE.ACCOUNT_NICKNAME_DUPLICATED:
        alert("이미 사용중인 닉네임입니다.");
        break;
      default:
        const { userInfo, tokens } = res.data;
        if (userInfo.role === "user") {
          setUser(userInfo);
          setSessionItem("userTokens", tokens);
          navigate(URL.MAIN);
          alert("가입이 완료되었습니다.");
        } else navigate(URL.REGISTER_WAIT, { state: userInfo });
    }
  };
  const registerAccount = (e) => {
    e.preventDefault();
    if (!inputs.agreement || !inputs.policy) {
      alert("동의 항목을 체크해주세요.");
      return;
    }
    const tokens = location.state.tokens;
    requestPost(URL.REGISTER, { ...inputs, tokens }, handleResponse);
  };
  const verifyNickname = () => {
    if (inputs.nickname.length === 0) return;

    requestGet(URL.VERIFY_NICKNAME, { nickname: inputs.nickname }, (res) => {
      if (res.data) alert("사용가능한 닉네임입니다.");
      else alert("이미 사용중인 닉네임입니다.");
      setNicknameVerified(res.data);
    });
  };
  useEffect(() => {
    if (!location.state) {
      alert("계정 정보가 존재하지 않습니다. 메인페이지로 이동합니다.");
      navigate(URL.MAIN);
      return;
    }
    const userInfo = location.state.userInfo;
    setInputs((state) => ({
      ...state,
      email: userInfo.email,
      platform: userInfo.platform,
    }));
  }, []);
  return (
    <form className="center" onSubmit={registerAccount}>
      <div>
        <label>
          <input
            onChange={onChangeRole}
            type="radio"
            name="role"
            value="user"
            defaultChecked
          ></input>
          <span>사용자</span>
        </label>
        <label>
          <input
            onChange={onChangeRole}
            type="radio"
            name="role"
            value="manager"
          ></input>
          <span>관리자</span>
        </label>
      </div>
      <input
        placeholder="닉네임을 입력해주세요."
        value={inputs.nickname}
        onChange={(e) => {
          setInputs((state) => ({ ...state, nickname: e.target.value }));
          setNicknameVerified(false);
        }}
      ></input>
      <button type="button" onClick={verifyNickname}>
        중복확인
      </button>
      <div>
        <label>
          <input
            type="checkbox"
            value={inputs.agreement}
            onChange={() =>
              setInputs((state) => ({ ...state, agreement: !state.agreement }))
            }
          ></input>
          <span>약관 동의</span>
        </label>
        <label>
          <input
            type="checkbox"
            value={inputs.policy}
            onChange={() =>
              setInputs((state) => ({ ...state, policy: !state.policy }))
            }
          ></input>
          <span>개인정보처리방침</span>
        </label>
      </div>
      <button type="submit" disabled={!nicknameVerified}>
        가입하기
      </button>
    </form>
  );
};

export default Register;
