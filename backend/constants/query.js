const QUERY = {
  // USERS
  USER_GET: "select * from users where platform=? and email=?",
  USER_REGISTER:
    "insert into users (platform, email, nickname) values (?, ?, ?) returning *",
  USER_CHECK_NICKNAME: "select * from users where nickname=?",

  // BOARD
  BOARD: "select * from board order by create_time desc",
  BOARD_CREATE:
    "insert into board (user_id, user_nickname, title, content) values(?, ?, ?, ?)",
  BOARD_DETAIL: "select * from board where id=?",
  BOARD_DELETE: "delete from board where id=?",
};

module.exports = { QUERY };
