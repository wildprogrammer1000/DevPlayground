import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./pages/Main";
import URL from "./constants/url";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Board from "./pages/board/Board";

import "./css/base.css";
import "./css/components.css";
import BoardCreate from "./pages/board/BoardCreate";
import BoardDetail from "./pages/board/BoardDetail";

function App() {
  // 임시 유저 State
  const [user, setUser] = useState();

  return (
    <div className="app_container">
      <Header user={user} setUser={setUser} />
      <div className="app_content">
        <Routes>
          <Route path={URL.MAIN} element={<Main />} />
          <Route path={URL.LOGIN} element={<Login setUser={setUser} />} />
          <Route path={URL.REGISTER} element={<Register setUser={setUser} />} />

          <Route path={URL.BOARD} element={<Board />} />
          <Route path={URL.BOARD_CREATE} element={<BoardCreate />} />
          <Route
            path={URL.BOARD_DETAIL}
            element={<BoardDetail user={user} />}
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
