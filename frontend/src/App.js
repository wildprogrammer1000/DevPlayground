import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./utils/firebase";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Friend from "./components/friend/Friend";
import URL from "./constants/url";
import Main from "./pages/Main";
import Admin from "./pages/admin/Admin";
import AdminManageWaiting from "./pages/admin/AdminManageWaiting";
import Board from "./pages/board/Board";
import BoardCreate from "./pages/board/BoardCreate";
import BoardDetail from "./pages/board/BoardDetail";
import BoardEdit from "./pages/board/BoardEdit";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import RegisterWait from "./pages/login/RegisterWait";

import "./css/base.css";
import "./css/components.css";
import "./css/responsive.css";

import { requestGet } from "./api/fetch";
import CODE from "./constants/code";
import Mypage from "./pages/mypage/Mypage";
console.log("ENV: " + process.env.NODE_ENV);
function App() {
  const location = useLocation();

  const [user, setUser] = useState();
  const [socket, setSocket] = useState();

  const connectSocket = () => {
    const socket = io(process.env.REACT_APP_NODEJS);
    socket.on("connect", () => setSocket(socket));
    socket.on("disconnect", () => {
      // 연결 끊김 처리
    });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  useEffect(() => {
    requestGet(URL.REFRESH_SESSION, null, (res) => {
      if (res.status === CODE.SUCCESS && res.data) setUser(res.data);
    });
  }, [location]);

  return location.pathname.includes(URL.ADMIN) ? (
    <Routes>
      <Route path={URL.ADMIN} element={<Admin />} />
      <Route path={URL.ADMIN_MANAGE_WAITING} element={<AdminManageWaiting />} />
    </Routes>
  ) : (
    <div className="app_container">
      <Header user={user} setUser={setUser} />
      <div className="app_content">
        <Routes>
          <Route
            path={URL.MAIN}
            element={<Main user={user} socket={socket} />}
          />
          <Route path={URL.LOGIN} element={<Login setUser={setUser} />} />
          <Route path={URL.REGISTER} element={<Register setUser={setUser} />} />

          <Route path={URL.BOARD} element={<Board user={user} />} />
          <Route
            path={URL.BOARD_CREATE}
            element={<BoardCreate user={user} />}
          />
          <Route
            path={URL.BOARD_DETAIL}
            element={<BoardDetail user={user} />}
          />
          <Route path={URL.BOARD_EDIT} element={<BoardEdit user={user} />} />
          <Route path={URL.REGISTER_WAIT} element={<RegisterWait />} />

          <Route path={URL.MYPAGE_GET} element={<Mypage />}></Route>
        </Routes>
        {user && <Friend socket={socket} user={user} />}
      </div>

      <Footer />
    </div>
  );
}

export default App;
