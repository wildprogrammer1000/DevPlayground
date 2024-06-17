const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");
const { pool } = require("../db/connection");
const { jwtDecode } = require("jwt-decode");

const getBoard = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const { page, rowsPerPage } = req.query;

    const rows_1 = await conn.query(QUERY.BOARD_COUNT);
    const { count } = rows_1[0];
    const totalPage = Math.ceil(Number(count) / rowsPerPage);

    const rows_2 = await conn.query(QUERY.BOARD, [
      Number(rowsPerPage),
      page * rowsPerPage,
    ]);

    res.json({ totalPage, board: rows_2 });
    conn.release();
  } catch (err) {
    if (conn) conn.release();
    console.error("Error - Get Board: ", err);
  }
};
const getPost = async (req, res) => {
  let conn;
  try {
    const { post_id } = req.query;
    conn = await pool.getConnection();

    let rows = await pool.query(QUERY.BOARD_DETAIL, [post_id]);
    res.json({ ...rows[0] });

    conn.release();
  } catch (err) {
    if (conn) conn.release();
    console.error("Error - Get Post: ", err);
  }
};

const createPost = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { platform, id_token, title, content } = req.body;
    const userInfo = jwtDecode(id_token);
    const rows_1 = await conn.query(QUERY.USER_GET, [platform, userInfo.email]);

    await conn.query(QUERY.BOARD_CREATE, [
      rows_1[0].id,
      rows_1[0].nickname,
      title,
      content,
    ]);

    res.status(CODE.SUCCESS).send();

    conn.release();
  } catch (err) {
    if (conn) conn.release();
    console.error("Error - Create Post: ", err);
  }
};
const deletePost = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { post_id } = req.body;

    await conn.query(QUERY.BOARD_DELETE, [post_id]);
    res.send();

    conn.release();
  } catch (err) {
    if (conn) conn.release();
    console.error("Error - Delete Post: ", err);
  }
};

const editPost = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id, title, content } = req.body;

    await conn.query(QUERY.BOARD_EDIT, [title, content, id]);
    res.send();

    conn.release();
  } catch (err) {
    if (conn) conn.release();
    console.error("Error - Edit Post: ", err);
  }
};

module.exports = {
  getBoard,
  getPost,
  createPost,
  deletePost,
  editPost,
};
