const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");
const { pool } = require("../db/connection");
const { addSysLog } = require("../utils");

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
    rows[0].likes = Number(rows[0].likes);
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
    const { title, content, category } = req.body;
    const userInfo = req.userInfo;

    await conn.query(QUERY.BOARD_CREATE, [
      userInfo.id,
      title,
      content,
      category,
    ]);

    // 시스템 로그 추가
    await addSysLog("post_create", { title, content, category }, req.userInfo);

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

    res.sendStatus(CODE.SUCCESS);
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
    const { id, category, title, content } = req.body;

    await conn.query(QUERY.BOARD_EDIT, [category, title, content, id]);

    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Edit Post: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const getComment = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { post_id } = req.query;
    const rows = await conn.query(QUERY.BOARD_GET_COMMENT, [post_id]);
    res.json({ comments: rows });
  } catch (err) {
    console.error("Error - Get Comment: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const addComment = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { post_id, user_id, content } = req.body;
    await conn.query(QUERY.BOARD_ADD_COMMENT, [post_id, user_id, content]);

    // 시스템 로그 추가
    await addSysLog(
      "comment_create",
      { post_id, user_id, content },
      req.userInfo
    );
    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Add Comment: ", err);
  } finally {
    if (conn) conn.release();
  }
};

const deleteComment = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { comment_id } = req.body;
    await conn.query(QUERY.BOARD_DELETE_COMMENT, [comment_id]);

    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Delete Comment: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const getLikes = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { post_id } = req.query;

    const rows = await conn.query(QUERY.BOARD_GET_LIKES, [post_id]);
    res.json({ likes: rows });
  } catch (err) {
    console.error("Error - Get Likes: ", err);
  } finally {
    if (conn) conn.release();
  }
};
const toggleLike = async (req, res) => {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    const { post_id, user_id } = req.body;

    rows = await conn.query(QUERY.BOARD_CHECK_LIKE, [post_id, user_id]);
    if (rows.length > 0)
      await conn.query(QUERY.BOARD_REMOVE_LIKE, [post_id, user_id]);
    else await conn.query(QUERY.BOARD_ADD_LIKE, [post_id, user_id]);

    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Toggle Like: ", err);
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
  getComment,
  addComment,
  deleteComment,
  getLikes,
  toggleLike,
};
