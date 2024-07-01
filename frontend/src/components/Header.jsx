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
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Link
          to={URL.MAIN}
          style={{ fontSize: 24, fontFamily: "Aggro B", letterSpacing: -0.5 }}
        >
          PLAYGROUNDDEV
        </Link>
        <Link to={URL.BOARD}>게시판</Link>
      </div>
      {user ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to={URL.MYPAGE_GET}>마이페이지</Link>
          <div>{user.nickname}님 환영합니다.</div>
          <button
            style={{ border: "2px solid #000", padding: 4 }}
            onClick={logOut}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <Link to={URL.LOGIN}>로그인</Link>
      )}
    </header>
  );
};
export default Header;
