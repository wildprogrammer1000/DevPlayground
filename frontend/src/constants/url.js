const URL = {
  MAIN: "/",

  // 로그인
  LOGIN: "/login",
  LOGOUT: "/logout",
  LOGIN_GOOGLE: "/login/google",
  REFRESH_TOKEN_GOOGLE: "/refresh_token/google",
  REFRESH_SESSION: "/refresh_session",
  REGISTER: "/register",
  REGISTER_WAIT: "/register/wait",
  VERIFY_NICKNAME: "/register/verify",

  // 관리자
  ADMIN: "/admin",
  ADMIN_MANAGE_WAITING: "/admin/manage_waiting",
  ADMIN_GET_WATIING_USERS: "/admin/waiting_users",
  ADMIN_APPROVE_USER: "/admin/approve_user",
  ADMIN_REJECT_USER: "/admin/reject_user",

  // 커뮤니티
  BOARD: "/board",
  BOARD_CREATE: "/board/create",
  BOARD_DETAIL: "/board/detail",
  BOARD_DELETE: "/board/delete",
  BOARD_EDIT: "/board/edit",
  BOARD_COMMENT: "/board/comment",
  BOARD_LIKE: "/board/like",

  // 친구
  FRIEND_GET: "/friend",
  FRIEND_REQUEST: "/friend/request",
  FRIEND_CANCEL: "/friend/cancel",
  FRIEND_ACCEPT: "/friend/accept",
  FRIEND_DELETE: "/friend/delete",
  FRIEND_REFUSE: "/friend/refuse",
  FRIEND_MESSAGE: "/friend/message",

  // 쇼핑몰
  SHOP: "/shop",
  SHOP_ADMIN: "/shop/admin",

  // 알림
  NOTIFICATION_GET: "/notification",

  // 마이페이지
  MYPAGE_GET: "/mypage",

  // 갤러리
  GALLERY: "/gallery",
  GALLERY_CREATE: "/gallery/create",
  GALLERY_PIECE: "/gallery/piece",

  // Web Push
  WEBPUSH_VAPID_PUBLIC_KEY: "/webpush/vapid_public_key",
  WEBPUSH_SUBSCRIBE: "/webpush/subscribe",
  WEBPUSH_UNSUBSCRIBE: "/webpush/unsubscribe",
};

export default URL;
