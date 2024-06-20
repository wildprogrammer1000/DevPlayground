const URL = {
  MAIN: "/",
  LOGIN: "/login",
  LOGIN_GOOGLE: "/login/google",
  REFRESH_TOKEN_GOOGLE: "/refresh_token/google",

  REGISTER: "/register",
  REGISTER_WAIT: "/register/wait",
  VERIFY_NICKNAME: "/register/verify",

  // 관리자
  ADMIN: "/admin",
  ADMIN_MANAGE_WAITING: "/admin/manage_waiting",
  ADMIN_GET_WATIING_USERS: "/admin/waiting_users",
  ADMIN_APPROVE_USER: "/admin/approve_user",
  ADMIN_REJECT_USER: "/admin/reject_user",

  // 게시판
  BOARD: "/board",
  BOARD_CREATE: "/board/create",
  BOARD_DETAIL: "/board/detail",
  BOARD_DELETE: "/board/delete",
  BOARD_EDIT: "/board/edit",
  BOARD_COMMENT: "/board/comment",
  BOARD_LIKE: "/board/like",
};

module.exports = { URL };
