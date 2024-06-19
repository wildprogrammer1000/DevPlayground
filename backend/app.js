require("dotenv").config();
const express = require("express");
const { URL } = require("./constants/url");
const cors = require("cors");
const {
  getGoogleUser,
  refreshGoogleSession,
  registerUser,
  verifyNickname,
} = require("./auth/auth");
const {
  getBoard,
  getPost,
  createPost,
  deletePost,
  editPost,
} = require("./board/board");

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
app.post(URL.BOARD_EDIT, editPost);

// Temp
app.get("/db", async (req, res) => {
  const conn = await pool.getConnection();

  if (conn) {
    conn.release();
  }
  res.send("OK");
});

// app.get("/test", (req, res) => {
//   console.log("Request Info: ", req);
//   res.send("ok");
// });

app.listen(process.env.EXPRESS_PORT, () => {
  console.log("server started");
});
