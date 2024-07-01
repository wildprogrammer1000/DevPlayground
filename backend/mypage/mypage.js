const { QUERY } = require("../constants/query");
const { pool } = require("../db/connection");
const { addSysLog } = require("../utils");

const getMypage = async (req, res) => {
  let conn;
  try {
    const userInfo = req.userInfo;
    console.log('userinfo: ', userInfo);
    conn = await pool.getConnection();
    const rows_1 = await conn.query(QUERY.MYPAGE_GET, [userInfo.id]);
    const rows_2 = await conn.query(QUERY.MYPAGE_GET_BOARD, [userInfo.id]);
    const rows_3 = await conn.query(QUERY.MYPAGE_GET_COMMENT, [userInfo.id]);
    const rows_4 = await conn.query(QUERY.MYPAGE_GET_ACTIVETIME, [userInfo.id]);
    const formattedRows_2 = rows_2.map(row => ({
      ...row,
      count: Number(row.count)
    }));
    const formattedRows_3 = rows_3.map(row => ({
      ...row,
      count: Number(row.count)
    }));
    const formattedRows_4 = rows_4.map(row => ({
      ...row,
      count: Number(row.count)
    }));
    res.json({ mydata: rows_1, board: formattedRows_2, comment: formattedRows_3, active: formattedRows_4 });
  } catch (err) {
    console.error("Error - Get Mypage: ", err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getMypage,
};
