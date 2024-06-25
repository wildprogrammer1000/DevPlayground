const { pool } = require("../db/connection");
const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");

const getFriend = async (req, res) => {
  let conn;
  try {
    const userInfo = req.userInfo;
    conn = await pool.getConnection();

    const rows = await conn.query(QUERY.FRIEND_GET, [userInfo.id]);

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

module.exports = {
  getFriend,
  requestFriend,
  cancelFriend,
  acceptFriend,
  refuseFriend,
};
