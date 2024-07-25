require("dotenv").config();
const { subscribeTopic } = require("./utils/fcm");
const { setSocketIO, onConnection } = require("./utils/socketio");
const { redis } = require("./utils/redis");
const cookieParser = require("cookie-parser");
const express = require("express");
const { URL } = require("./constants/url");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
  getFriend,
  requestFriend,
  cancelFriend,
  acceptFriend,
  deleteFriend,
  refuseFriend,
  getFriendMessages,
  sendFriendMessage,
} = require("./friend");
const { getNotifications } = require("./notification");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: process.env.CORS.split(","),
});
redis.io = io;
setSocketIO(io);
io.on("connection", onConnection);

const {
  logOut,
  validateSession,
  getGoogleUser,
  refreshGoogleSession,
  registerUser,
  deleteWaitingUser,
  verifyNickname,
  refreshSession,
} = require("./auth/auth");
const {
  getBoard,
  getPost,
  createPost,
  deletePost,
  editPost,
  getComment,
  addComment,
  deleteComment,
  getLikes,
  toggleLike,
} = require("./board/board");
const { getMypage, deleteUser } = require("./mypage/mypage");

// Temp
const { pool } = require("./db/connection");
const { getWaitingUsers, approveUser, rejectUser } = require("./admin");

app.use(cookieParser());
app.use(
  cors({
    cors: process.env.CORS.split(","),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Login
app.get(URL.LOGIN_GOOGLE, getGoogleUser);
app.post(URL.REFRESH_TOKEN_GOOGLE, refreshGoogleSession);
app.get(URL.REFRESH_SESSION, refreshSession);
app.get(URL.LOGOUT, logOut);

// Register
app.get(URL.VERIFY_NICKNAME, verifyNickname);
app.post(URL.REGISTER, registerUser);
app.delete(URL.REGISTER_WAIT, deleteWaitingUser);

// Board
app.get(URL.BOARD, getBoard);
app.get(URL.BOARD_DETAIL, getPost);
app.post(URL.BOARD_CREATE, validateSession, createPost);
app.post(URL.BOARD_DELETE, validateSession, deletePost);
app.post(URL.BOARD_EDIT, validateSession, editPost);
app.get(URL.BOARD_COMMENT, getComment);
app.post(URL.BOARD_COMMENT, validateSession, addComment);
app.delete(URL.BOARD_COMMENT, validateSession, deleteComment);
app.get(URL.BOARD_LIKE, getLikes);
app.post(URL.BOARD_LIKE, validateSession, toggleLike);

// Admin
app.get(URL.ADMIN_GET_WATIING_USERS, validateSession, getWaitingUsers);
app.post(URL.ADMIN_APPROVE_USER, validateSession, approveUser);
app.post(URL.ADMIN_REJECT_USER, validateSession, rejectUser);

// Friend
app.get(URL.FRIEND_GET, validateSession, getFriend);
app.post(URL.FRIEND_REQUEST, validateSession, requestFriend);
app.post(URL.FRIEND_CANCEL, validateSession, cancelFriend);
app.post(URL.FRIEND_ACCEPT, validateSession, acceptFriend);
app.post(URL.FRIEND_DELETE, validateSession, deleteFriend);
app.post(URL.FRIEND_REFUSE, validateSession, refuseFriend);
app.get(URL.FRIEND_MESSAGE, validateSession, getFriendMessages);
app.post(URL.FRIEND_MESSAGE, validateSession, sendFriendMessage);

// Notification
app.get(URL.NOTIFICATION_GET, validateSession, getNotifications);

// Mypage
app.get(URL.MYPAGE_GET, validateSession, getMypage);

// Temp
app.get("/db", async (req, res) => {
  const conn = await pool.getConnection();
  if (conn) {
    conn.release();
  }
  res.send("OK");
});

app.get("/", (req, res) => res.send("Healthy"));
app.get("/subscribe_test", (req, res) => {
  const { token, topic } = req.query;
  subscribeTopic(token, topic);

  res.send("ok");
});

httpServer.listen(process.env.EXPRESS_PORT, () => {
  console.log("server started");
});
