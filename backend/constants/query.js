const QUERY = {
  // USERS
  USER_GET: "select * from users where platform=? and email=?",
  USER_REGISTER:
    "insert into users (platform, email, nickname) values (?, ?, ?) returning *",
  USER_CHECK_NICKNAME: "select * from users where nickname=?",
  BOARD: `
    select u.nickname, Count(c.id) as cmt_count, b.id, b.user_id, b.title, b.content, b.category, b.create_time
    from board b
    left join (comment as c) on (b.id = c.post_id)
    left join (users as u) on (b.user_id = u.id)
    group by b.id
    order by b.create_time desc
    limit ? offset ?
  `,
  BOARD_COUNT: "select convert(Count(*), int) as count from board",
  BOARD_CREATE:
    "insert into board (user_id, user_nickname, title, content, category) values(?, ?, ?, ?, ?)",
  BOARD_DETAIL: "select * from board where id=?",
  BOARD_DELETE: "delete from board where id=?",
  BOARD_EDIT:
    "update board set title=?, content=?, update_time=current_timestamp() where id=?",

  BOARD_CATEGORY:
    "select * from board where category=? order by create_time desc limit ? offset ?",
  BOARD_CATEGORY_COUNT: "select Count(*) as count from board where category=?",
};

module.exports = { QUERY };
