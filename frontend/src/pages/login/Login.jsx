import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { requestGet } from "../../api/fetch";
import URL from "../../constants/url";
import CODE from "../../constants/code";
import { useContext } from "react";
import { Context } from "utils/context";

const Login = () => {
  const context = useContext(Context);
  const [_, setUser] = context.user;

  const navigate = useNavigate();
  const onSuccessLogin = (res) => {
    switch (res.status) {
      case CODE.ACCOUNT_NOT_REGISTERED:
        navigate(URL.REGISTER, { state: res.data });
        break;
      case CODE.ACCOUNT_WAITING:
        navigate(URL.REGISTER_WAIT, { state: { userInfo: res.data.userInfo } });
        break;
      default:
        const { userInfo } = res.data;
        setUser(userInfo);
        navigate(URL.MAIN);
    }
  };
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (codeResponse) => {
      requestGet(URL.LOGIN_GOOGLE, { codeResponse }, onSuccessLogin);
    },
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
        height: "100%",
        alignItems: "center",
        padding: 16,
      }}
    >
      <div style={{ fontSize: 24 }}>로그인</div>
      <button style={{ padding: "12px 16px" }} onClick={googleLogin}>
        구글 로그인
      </button>
    </div>
  );
};

export default Login;
