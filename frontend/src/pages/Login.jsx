import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { requestGet } from "../api/fetch";
import { setSessionItem } from "../utils/storage";
import URL from "../constants/url";
import CODE from "../constants/code";

const Login = ({ setUser }) => {
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
        const { userInfo, tokens } = res.data;
        setUser(userInfo);
        tokens.platform = "google";
        setSessionItem("userTokens", tokens);
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
    <div>
      <div onClick={googleLogin}>구글 로그인</div>
    </div>
  );
};

export default Login;
