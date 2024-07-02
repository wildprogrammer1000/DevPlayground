const { pool } = require("../db/connection");
const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");
const { sendMessage } = require("../utils/socketio");

const getFriend = async (req, res) => {
  let conn;
  try {
    const userInfo = req.userInfo;
    conn = await pool.getConnection();

    const rows = await conn.query(QUERY.FRIEND_GET, [userInfo.id, userInfo.id]);

    res.json({ friends: rows });
  } catch (err) {
    console.error("Error - Request Friend: ", err);
  } finally {
    if (conn) conn.release();
  }
};

const requestFriend = async (req, res) => {
  let conn;
  try {
    const { receiver_id } = req.body;
    const userInfo = req.userInfo;
    conn = await pool.getConnection();

    const rows = await conn.query(QUERY.FRIEND_CHECK, [
      userInfo.id,
      receiver_id,
      receiver_id,
      userInfo.id,
    ]);
    if (rows.length > 0)
      return res.status(CODE.FRIEND_DUPLICATED).json(rows[0]);

    // 알림 전송 후
    await conn.query(QUERY.NOTIFICATION_SEND, [
      CODE.NOTIFICATION_FRIEND,
      userInfo.id,
      receiver_id,
      JSON.stringify({
        type: CODE.FRIEND_PENDING,
        user: userInfo,
      }),
    ]);
    await conn.query(QUERY.FRIEND_REQUEST, [
      userInfo.id,
      receiver_id,
      CODE.FRIEND_PENDING,
    ]);

    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Request Friend: ", err);
  } finally {
    if (conn) conn.release();
  }
};

const cancelFriend = async (req, res) => {
  let conn;
  try {
    const { user_id } = req.body;
    const userInfo = req.userInfo;
    conn = await pool.getConnection();

    // 알림 전송 후
    await conn.query(QUERY.NOTIFICATION_DELETE, [
      CODE.NOTIFICATION_FRIEND,
      userInfo.id,
      user_id,
    ]);
    await conn.query(QUERY.FRIEND_CANCEL, [userInfo.id, user_id]);

    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Request Friend: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const acceptFriend = async (req, res) => {
  let conn;
  try {
    const { user_id } = req.body;
    const userInfo = req.userInfo;
    conn = await pool.getConnection();

    await conn.query(QUERY.NOTIFICATION_DELETE, [
      CODE.NOTIFICATION_FRIEND,
      user_id,
      userInfo.id,
    ]);
    const rows = await conn.query(QUERY.FRIEND_CHECK_REQUEST, [
      user_id,
      userInfo.id,
      CODE.FRIEND_PENDING,
    ]);
    if (rows.length > 0) {
      await conn.query(QUERY.FRIEND_ACCEPT, [
        user_id,
        userInfo.id,
        CODE.FRIEND_ACCEPTED,
        CODE.FRIEND_ACCEPTED,
      ]);
      await conn.query(QUERY.FRIEND_ACCEPT, [
        userInfo.id,
        user_id,
        CODE.FRIEND_ACCEPTED,
        CODE.FRIEND_ACCEPTED,
      ]);

      res.sendStatus(CODE.SUCCESS);
    } else res.sendStatus(CODE.FRIEND_CANCELED);
  } catch (err) {
    console.error("Error - Accept Friend: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const refuseFriend = async (req, res) => {
  let conn;
  try {
    const { user_id } = req.body;
    const userInfo = req.userInfo;
    conn = await pool.getConnection();

    await conn.query(QUERY.NOTIFICATION_DELETE, [
      CODE.NOTIFICATION_FRIEND,
      user_id,
      userInfo.id,
    ]);
    const rows = await conn.query(QUERY.FRIEND_CHECK_REQUEST, [
      user_id,
      userInfo.id,
      CODE.FRIEND_PENDING,
    ]);
    if (rows.length > 0) {
      await conn.query(QUERY.FRIEND_CANCEL, [user_id, userInfo.id]);

      res.sendStatus(CODE.SUCCESS);
    } else res.sendStatus(CODE.FRIEND_CANCELED);
  } catch (err) {
    console.error("Error - Refuse Friend: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const getFriendMessages = async (req, res) => {
  let conn, rows;
  try {
    const { user_id } = req.query;
    const userInfo = req.userInfo;
    conn = await pool.getConnection();
    let messages = [];

    rows = await conn.query(QUERY.MESSAGE_GET, [userInfo.id, user_id]);
    messages = [...messages, ...rows];

    rows = await conn.query(QUERY.MESSAGE_GET, [user_id, userInfo.id]);
    messages = [...messages, ...rows];

    if (messages.length > 0) {
      messages = messages.map((message) => ({
        user: {
          nickname: message.nickname,
          id: message.id,
        },
        create_time: message.create_time,
        message: message.content,
      }));
    }

    res.json({ messages });
  } catch (err) {
    console.error("Error - Get Friend Message: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const sendFriendMessage = async (req, res) => {
  let conn;
  try {
    const { message, user_id } = req.body;
    const userInfo = req.userInfo;

    conn = await pool.getConnection();
    await conn.query(QUERY.MESSAGE_SEND, [userInfo.id, user_id, message]);
    sendMessage({ receiver_id: user_id, sender: userInfo, message });
    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Send Friend Message: ", err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getFriend,
  requestFriend,
  cancelFriend,
  acceptFriend,
  refuseFriend,
  getFriendMessages,
  sendFriendMessage,
};
