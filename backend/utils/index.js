const { QUERY } = require("../constants/query");
const { pool } = require("../db/connection");

const addSysLogCreateUser = async (action, content, user) => {
  let conn;
  try {
    conn = await pool.getConnection();

    await conn.query(QUERY.SYS_LOG_ADD, [
      action,
      content,
      user.role,
      user.id,
      user.nickname,
    ]);
  } catch (err) {
    console.error("Error - Add Sys Log Create User: ", err);
  } finally {
    if (conn) conn.release();
  }
};

const addSysLog = async (action, content, userInfo) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { role, id, nickname } = userInfo;

    await conn.query(QUERY.SYS_LOG_ADD, [
      action,
      JSON.stringify(content),
      role,
      id,
      nickname,
    ]);
  } catch (err) {
    console.error("Error - Add Sys Log: ", err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  addSysLog,
  addSysLogCreateUser,
};
