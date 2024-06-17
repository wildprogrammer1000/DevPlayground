require("dotenv").config();
const express = require("express");
const { CONFIG } = require("./config/config");
const { URL } = require("./constants/url");
const cors = require("cors");
const {
  getGoogleUser,
  refreshGoogleSession,
  registerUser,
  verifyNickname,
} = require("./auth/auth");
const { getBoard, getPost, createPost, deletePost } = require("./board/board");

// Temp
const { pool } = require("./db/connection");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Login
app.get(URL.LOGIN_GOOGLE, getGoogleUser);
app.post(URL.REFRESH_TOKEN_GOOGLE, refreshGoogleSession);

// Register
app.get(URL.VERIFY_NICKNAME, verifyNickname);
app.post(URL.REGISTER, registerUser);

// Board
app.get(URL.BOARD, getBoard);
app.get(URL.BOARD_DETAIL, getPost);
app.post(URL.BOARD_CREATE, createPost);
app.post(URL.BOARD_DELETE, deletePost);

// Temp
app.get("/db", async (req, res) => {
  const conn = await pool.getConnection();

  if (conn) {
    conn.release();
  }
  res.send("OK");
});

app.get("/test", (req, res) => {
  console.log("Request Info: ", req);
  res.send("ok");
});

app.listen(CONFIG.PORT, () => {
  console.log("server started");
});
