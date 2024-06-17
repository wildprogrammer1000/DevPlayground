import { Link, useNavigate } from "react-router-dom";
import URL from "../constants/url";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const logOut = () => {
    alert("로그아웃 되었습니다.");
    setUser(null);
    navigate(URL.MAIN);
  };
  return (
    <header className="header">
      <div>
        <Link to={URL.MAIN}>페이지 제목</Link>
        <Link to={URL.BOARD}>게시판</Link>
      </div>
      {user ? (
        <div>
          <div>{user.nickname}님 환영해유</div>
          <div onClick={logOut}>로그아웃</div>
        </div>
      ) : (
        <Link to={URL.LOGIN}>로그인</Link>
      )}
    </header>
  );
};
export default Header;
