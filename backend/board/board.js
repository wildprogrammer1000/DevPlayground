const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");
const { pool } = require("../db/connection");
const { jwtDecode } = require("jwt-decode");

const getBoard = async (req, res) => {
  let { page, rowsPerPage, category } = req.query;
  let conn;

  category = Number(category);
  rowsPerPage = Number(rowsPerPage);

  try {
    conn = await pool.getConnection();

    let rows_1, rows_2;

    if (category === -1) {
      rows_1 = await conn.query(QUERY.BOARD_COUNT);
      rows_2 = await conn
        .query(QUERY.BOARD, [rowsPerPage, page * rowsPerPage])
        .then((rows) =>
          rows.map((row) => {
            row.cmt_count = Number(row.cmt_count);
            return row;
          })
        );
    } else {
      rows_1 = await conn.query(QUERY.BOARD_CATEGORY_COUNT, [category]);
      rows_2 = await conn
        .query(QUERY.BOARD_CATEGORY, [
          category,
          rowsPerPage,
          page * rowsPerPage,
        ])
        .then((rows) =>
          rows.map((row) => {
            row.cmt_count = Number(row.cmt_count);
            return row;
          })
        );
    }
    const { count } = rows_1[0];
    const totalPage = Math.ceil(Number(count) / rowsPerPage);
    return res.json({ totalPage, board: rows_2 });
  } catch (err) {
    console.error("Error - Get Board: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const getPost = async (req, res) => {
  let conn;
  try {
    const { post_id } = req.query;
    conn = await pool.getConnection();

    let rows = await pool.query(QUERY.BOARD_DETAIL, [post_id]);
    res.json({ ...rows[0] });
  } catch (err) {
    console.error("Error - Get Post: ", err);
  } finally {
    if (conn) conn.release();
  }
};

const createPost = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { platform, id_token, title, content, category } = req.body;
    const userInfo = jwtDecode(id_token);
    const rows_1 = await conn.query(QUERY.USER_GET, [platform, userInfo.email]);

    await conn.query(QUERY.BOARD_CREATE, [
      rows_1[0].id,
      rows_1[0].nickname,
      title,
      content,
      category,
    ]);

    res.status(CODE.SUCCESS).send();
  } catch (err) {
    console.error("Error - Create Post: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const deletePost = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { post_id } = req.body;

    await conn.query(QUERY.BOARD_DELETE, [post_id]);
    res.send();
  } catch (err) {
    console.error("Error - Delete Post: ", err);
  } finally {
    if (conn) conn.release();
  }
};

const editPost = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { id, title, content } = req.body;

    await conn.query(QUERY.BOARD_EDIT, [title, content, id]);
    res.send();
  } catch (err) {
    console.error("Error - Edit Post: ", err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getBoard,
  getPost,
  createPost,
  deletePost,
  editPost,
};
