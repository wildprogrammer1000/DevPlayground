import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
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
import PwaModule from "./components/pwa/PwaObserver";
import Assistant from "components/Assistant";

import "./css/base.css";
import "./css/components.css";

import { requestGet } from "./api/fetch";
import CODE from "./constants/code";
import Mypage from "./pages/mypage/Mypage";
import Gallery from "pages/gallery/Gallery";
import GalleryCreate from "pages/gallery/GalleryCreate";
import GalleryPiece from "pages/gallery/GalleryPiece";
import Shop from "shop/pages/Shop";

import { registerServiceWorker } from "utils/sw-adapter";
import ShopAdmin from "shop/pages/ShopAdmin";

console.log("ENV: " + process.env.NODE_ENV);
function App() {
  const location = useLocation();

  const { PwaObserver, enabled } = PwaModule();

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
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  useEffect(() => {
    requestGet(URL.REFRESH_SESSION, null, (res) => {
      if (res.status === CODE.SUCCESS && res.data) setUser(res.data);
    });
  }, [location]);

  return (
    <div className="app_container">
      <div className="app_wrapper">
        <Header user={user} setUser={setUser} />
        <div className="app_content">
          <Routes>
            <Route
              path={URL.MAIN}
              element={<Main user={user} socket={socket} />}
            />
            <Route path={URL.LOGIN} element={<Login setUser={setUser} />} />
            <Route
              path={URL.REGISTER}
              element={<Register setUser={setUser} />}
            />

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

            <Route path={URL.MYPAGE_GET} element={<Mypage />} />

            {/* Shop */}
            <Route path={URL.SHOP} element={<Shop />} />
            <Route path={URL.SHOP_ADMIN} element={<ShopAdmin />} />

            {/* <Route path={URL.GALLERY} element={<Gallery />} />
            <Route path={URL.GALLERY_CREATE} element={<GalleryCreate />} />
            <Route path={URL.GALLERY_PIECE} element={<GalleryPiece />} /> */}
          </Routes>
          {/* {user && <Friend socket={socket} user={user} />} */}
        </div>

        <Footer />

        <Assistant />
        {/* <Toaster position="top-center" /> */}
        {/* {PwaObserver} */}
      </div>
    </div>
  );
  // );
}

export default App;
