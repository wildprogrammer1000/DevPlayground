const URL = {
  MAIN: "/",

  // Login
  LOGIN: "/login",
  LOGOUT: "/logout",
  LOGIN_GOOGLE: "/login/google",
  REFRESH_TOKEN_GOOGLE: "/refresh_token/google",
  REFRESH_SESSION: "/refresh_session",
  REGISTER: "/register",
  REGISTER_WAIT: "/register/wait",
  VERIFY_NICKNAME: "/register/verify",

  // Admin
  ADMIN: "/admin",
  ADMIN_MANAGE_WAITING: "/admin/manage_waiting",
  ADMIN_GET_WATIING_USERS: "/admin/waiting_users",
  ADMIN_APPROVE_USER: "/admin/approve_user",
  ADMIN_REJECT_USER: "/admin/reject_user",

  // Community
  BOARD: "/board",
  BOARD_CREATE: "/board/create",
  BOARD_DETAIL: "/board/detail",
  BOARD_DELETE: "/board/delete",
  BOARD_EDIT: "/board/edit",
  BOARD_COMMENT: "/board/comment",
  BOARD_LIKE: "/board/like",

  // Friend
  FRIEND_GET: "/friend",
  FRIEND_REQUEST: "/friend/request",
  FRIEND_CANCEL: "/friend/cancel",
  FRIEND_ACCEPT: "/friend/accept",
  FRIEND_DELETE: "/friend/delete",
  FRIEND_REFUSE: "/friend/refuse",
  FRIEND_MESSAGE: "/friend/message",

  // Notification
  NOTIFICATION_GET: "/notification",

  // Mypage
  MYPAGE_GET: "/mypage",

  // Web Push
  WEBPUSH_VAPID_PUBLIC_KEY: "/webpush/vapid_public_key",
  WEBPUSH_SUBSCRIBE: "/webpush/subscribe",
  WEBPUSH_UNSUBSCRIBE: "/webpush/unsubscribe",
};

module.exports = { URL };
