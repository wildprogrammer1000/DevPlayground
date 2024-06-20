const { QUERY } = require("../constants/query");
const { pool } = require("../db/connection");

const getWaitingUsers = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.ADMIN_GET_WAITING_USERS);
    res.json({ waiting_users: rows });
  } catch (err) {
    console.error("Error - Get Waiting Users: ", err);
    res.status(500).send(err);
  } finally {
    if (conn) conn.release();
  }
};
const approveUser = async (req, res) => {
  let conn;
  try {
    const { user } = req.body;
    conn = await pool.getConnection();
    await conn.query(QUERY.ADMIN_APPROVE_USER, [
      user.role,
      user.platform,
      user.email,
      user.nickname,
    ]);
    await conn.query(QUERY.ADMIN_DELETE_WAITING_USER, [
      user.role,
      user.platform,
      user.email,
      user.nickname,
    ]);
    res.send();
  } catch (err) {
    console.error("Error - Approve User: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const rejectUser = async (req, res) => {
  let conn;
  try {
    const { user } = req.body;

    conn = await pool.getConnection();
    await conn.query(QUERY.ADMIN_DELETE_WAITING_USER, [
      user.role,
      user.platform,
      user.email,
      user.nickname,
    ]);
    res.send();
  } catch (err) {
    console.error("Error - Reject User: ", err);
  } finally {
    if (conn) conn.release();
  }
};
module.exports = {
  getWaitingUsers,
  approveUser,
  rejectUser,
};
