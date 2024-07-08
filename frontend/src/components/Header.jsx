import { Link, useLocation, useNavigate } from "react-router-dom";
import URL from "../constants/url";
import { requestGet } from "../api/fetch";
import CODE from "../constants/code";
import { useEffect, useState } from "react";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuActive, setMenuActive] = useState(false);
  const logOut = () => {
    requestGet(URL.LOGOUT, null, (res) => {
      if (res.status === CODE.SUCCESS) {
        alert("로그아웃 되었습니다.");
        setUser(null);
        navigate(URL.MAIN);
      }
    });
  };
  useEffect(() => {
    setMenuActive(false);
  }, [location]);
  return (
    <header className="header">
      <Link
        to={URL.MAIN}
        style={{ fontSize: 24, fontFamily: "Aggro B", letterSpacing: -0.5 }}
      >
        PLAYGROUNDDEV
      </Link>
      <div className={`menu ${menuActive ? "on" : "off"}`}>
        <nav className="nav">
          <Link to={URL.BOARD}>커뮤니티</Link>
        </nav>
        <div className="m_header">
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
          <button className="btn_close" onClick={() => setMenuActive(false)}>
            닫기
          </button>
        </div>
      </div>
      <button
        className="menu_mobile"
        onClick={() => setMenuActive((state) => !state)}
      >
        메뉴
      </button>
    </header>
  );
};
export default Header;
