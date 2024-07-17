import Login from "pages/login/Login";
import Mypage from "pages/mypage/Mypage";
import { useContext } from "react";
import { Context } from "utils/context";

const User = () => {
  const context = useContext(Context);
  const [user] = context.user;
  return user ? <Mypage /> : <Login />;
};
export default User;
