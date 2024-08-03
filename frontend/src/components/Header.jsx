import { Link, NavLink, useLocation } from "react-router-dom";
import URL from "../constants/url";
import { useEffect, useState } from "react";
import style from "css/module/Header.module.css";

const Header = ({ user }) => {
  const location = useLocation();
  const [menuActive, setMenuActive] = useState(false);

  useEffect(() => {
    setMenuActive(false);
  }, [location]);
  return (
    <header className={style.header}>
      <div>
        <Link
          to={URL.MAIN}
          style={{ fontSize: 24, fontFamily: "NN Heavy", letterSpacing: -0.5 }}
        >
          PLAYGROUNDDEV
        </Link>
      </div>
      <nav>
        <NavLink
          to={URL.BOARD}
          className={({ isActive }) => (isActive ? style.on : style.off)}
        >
          커뮤니티
        </NavLink>
        <NavLink
          to={URL.SHOP}
          className={({ isActive }) => (isActive ? style.on : style.off)}
        >
          상점
        </NavLink>
      </nav>
    </header>
  );
};
export default Header;
