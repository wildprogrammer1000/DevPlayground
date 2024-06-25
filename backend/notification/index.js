const { pool } = require("../db/connection");
const { QUERY } = require("../constants/query");

const getNotifications = async (req, res) => {
  let conn, rows;
  try {
    const { type } = req.query;
    conn = await pool.getConnection();
    if (isNaN(Number(type)))
      rows = await conn.query(QUERY.NOTIFICATION_GET, [
        req.userInfo.id,
        req.userInfo.id,
      ]);
    else
      rows = await conn.query(QUERY.NOTIFICATION_GET_BY_TYPE, [
        req.userInfo.id,
        req.userInfo.id,
        type,
      ]);

    res.json({ notifications: rows });
  } catch (err) {
    console.error("Error - Get Notification: ", err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getNotifications,
};
