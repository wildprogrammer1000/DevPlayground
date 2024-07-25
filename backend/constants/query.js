const QUERY = {
  // ADMIN
  ADMIN_GET_WAITING_USERS: "select * from waiting_users",
  ADMIN_DELETE_WAITING_USER:
    "delete from waiting_users where role=? and platform=? and email=? and nickname=?",
  ADMIN_APPROVE_USER:
    "insert into users (role, platform, email, nickname) values(?, ?, ?, ?)",

  // USERS
  USER_GET: "select * from users where platform=? and email=?",
  USER_GET_WAITING: "select * from waiting_users where platform=? and email=?",
  USER_REGISTER:
    "insert into users (role, platform, email, nickname) values (?, ?, ?, ?) returning *",
  USER_CHECK_NICKNAME: "select * from users where nickname=?",

  // WAITING USERS
  USER_WAIT:
    "insert into waiting_users (role, platform, email, nickname) values (?, ?, ?, ?) returning *",
  USER_WAIT_DELETE: "delete from waiting_users where nickname=?",

  // BOARD
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
    "insert into board (user_id, title, content, category) values(?, ?, ?, ?)",
  BOARD_DETAIL: `
    select u.nickname, b.id, b.user_id, b.title, b.content, b.category, b.create_time
    from board b
    left join (users as u) on (b.user_id = u.id)
    where b.id=?`,
  BOARD_DELETE: "delete from board where id=?",
  BOARD_EDIT:
    "update board set category=?, title=?, content=?, update_time=current_timestamp() where id=?",

  BOARD_CATEGORY: `select u.nickname, Count(c.id) as cmt_count, b.id, b.user_id, b.title, b.content, b.category, b.create_time
    from board b 
    left join (comment as c) on (b.id = c.post_id)
    left join (users as u) on (b.user_id = u.id)
    where b.category=? 
    group by b.id
    order by b.create_time desc 
    limit ? offset ?`,
  BOARD_CATEGORY_COUNT: "select Count(*) as count from board where category=?",
  BOARD_GET_COMMENT: `
  select c.id, c.content, c.create_time, c.user_id, u.nickname 
  from comment c
  left join (users as u) on (c.user_id = u.id)
  where c.post_id=?
  order by c.create_time desc
  `,
  BOARD_ADD_COMMENT:
    "insert into comment (post_id, user_id, content) values (?, ?, ?)",
  BOARD_DELETE_COMMENT: "delete from comment where id=?",
  BOARD_GET_LIKES: "select * from likes where post_id=?",
  BOARD_CHECK_LIKE: "select * from likes where post_id=? and user_id=?",
  BOARD_ADD_LIKE: "insert into likes (post_id, user_id) values (?, ?)",
  BOARD_REMOVE_LIKE: "delete from likes where post_id=? and user_id=?",

  // SYSTEM LOG
  SYS_LOG_ADD: `insert into sys_log (action, content, role, user_id, nickname) values (?, ?, ?, ?, ?)`,

  // Friend
  FRIEND_GET: `
  select u.nickname, f.state, u.id 
  from friends f
  left join (users u) on (f.user2_id = u.id)
  where f.user1_id=?
  `,
  FRIEND_REQUEST: `insert into friends (user1_id, user2_id, state) values (?, ?, ?)`,
  FRIEND_CANCEL: "delete from friends where user1_id=? and user2_id=?",
  FRIEND_CHECK_REQUEST:
    "select * from friends where user1_id=? and user2_id=? and state=?",
  // FRIEND_ACCEPT: "update friends set state=? where user1_id=? and user2_id=?",
  FRIEND_ACCEPT: `
  insert into friends 
  (user1_id, user2_id, state) values (?, ?, ?)
  on duplicate key update state=?
  `,
  FRIEND_DELETE:
    "delete from friends where (user1_id=? and user2_id=?) or (user1_id=? and user2_id=?)",
  FRIEND_CHECK:
    "select * from friends where (user1_id=? and user2_id=?) or (user1_id=? and user2_id=?)",

  // Notification
  NOTIFICATION_SEND: `insert into notifications (type, sender_id, receiver_id, content) values (?, ?, ?, ?)`,
  NOTIFICATION_GET: `select * from notifications where receiver_id=? or sender_id=?`,
  NOTIFICATION_GET_BY_TYPE: `select * from notifications where (receiver_id=? or sender_id=?) and type=?`,
  NOTIFICATION_DELETE: `delete from notifications where type=? and sender_id=? and receiver_id=?`,

  // Message
  MESSAGE_GET: `
  select u.nickname, m.sender_id as id, m.content, m.create_time
  from messages m
  left join (users u) on (m.sender_id = u.id)
  where m.sender_id=? and m.receiver_id=?
  limit 100
  `,
  MESSAGE_SEND:
    "insert into messages (sender_id, receiver_id, content) values (?, ?, ?)",

  // Mypage
  MYPAGE_GET: `select * from users where id = ?`,
  MYPAGE_GET_BOARD: `select count(*) as count from board where user_id = ?`,
  MYPAGE_GET_COMMENT: `select count(*) as count from comment where user_id = ?`,
  MYPAGE_GET_ACTIVETIME: `
  select nickname, create_time, datediff(current_date, create_time) + 1 as active_time
  from users where id = ?
  `, // 가입 당일이 0 이어서 + 1 추가
  MYPAGE_DELETE_USER: `delete from users where id = ?`,

  // Web Push
  WEBPUSH_SUBSCRIBE:
    "insert into webpush_subscriptions (endpoint, p256dh, auth) values(?, ?, ?) on duplicate key update p256dh = values(p256dh), auth = values(auth), create_time = current_timestamp()",
  WEBPUSH_UNSUBSCRIBE: "delete from webpush_subscriptions where endpoint=?",
};

module.exports = { QUERY };
