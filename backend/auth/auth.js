const { pool } = require("../db/connection");
const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");
const axios = require("axios");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const { addSysLogCreateUser } = require("../utils");
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);
const logOut = (req, res) => {
  req.session = null;
  req.userInfo = null;
  res.clearCookie("session");
  res.sendStatus(CODE.SUCCESS);
};
const validateSession = (req, res, next) => {
  const { session } = req.cookies;
  if (!session) return res.send(null);

  req.session = JSON.parse(session);
  req.userInfo = JSON.parse(session).userInfo;
  const expired = req.session.tokens.expiry_date < Date.now();
  if (expired) return res.sendStatus(CODE.SESSION_EXPIRED);

  return next();
};
const getGoogleUser = async (req, res) => {
  let conn, rows;
  try {
    const { codeResponse } = req.query;
    const { tokens } = await oAuth2Client.getToken(codeResponse.code);

    const { data } = await axios({
      method: "get",
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });

    conn = await pool.getConnection();

    rows = await conn.query(QUERY.USER_GET, ["google", data.email]);

    if (rows.length > 0) {
      // 로그인 성공
      const session = { userInfo: rows[0], tokens };

      res.cookie("session", JSON.stringify(session), {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(session);
    } else {
      rows = await conn.query(QUERY.USER_GET_WAITING, ["google", data.email]);
      if (rows.length) {
        // 가입승인 대기
        res.status(CODE.ACCOUNT_WAITING).json({
          userInfo: rows[0],
          tokens,
        });
      } else {
        // 닉네임 설정
        res.status(CODE.ACCOUNT_NOT_REGISTERED).json({
          userInfo: { platform: "google", email: data.email },
          tokens,
        });
      }
    }
  } catch (err) {
    console.error("Error - Get Google User: ", err);
    res.status(500).send(err);
  } finally {
    if (conn) conn.release();
  }
};

const refreshGoogleSession = async (req, res) => {
  try {
    const session = req.body;
    const user = new UserRefreshClient(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      session.refresh_token
    );
    const { credentials } = await user.refreshAccessToken();
    credentials.platform = session.platform;

    res.json(credentials);
  } catch (err) {
    console.error("Error - Refresh Google Session: ", err);
    res.status(500).send(err);
  } finally {
    if (conn) conn.release();
  }
};

const registerUser = async (req, res) => {
  let conn, rows;

  try {
    const { role, platform, email, nickname, tokens } = req.body;
    conn = await pool.getConnection();

    // 닉네임 중복 체크
    rows = await conn.query(QUERY.USER_CHECK_NICKNAME, [nickname]);

    if (rows.length > 0) {
      // 닉네임 중복
      res.status(CODE.ACCOUNT_NICKNAME_DUPLICATED);
    } else {
      let query;
      if (role == "user") query = QUERY.USER_REGISTER;
      else query = QUERY.USER_WAIT;

      rows = await conn.query(query, [role, platform, email, nickname]);

      // 시스템 로그 추가
      await addSysLogCreateUser(
        "user_create",
        { role, platform, email, nickname },
        { id: rows[0].id, role, nickname }
      );

      tokens.platform = platform;
      res.json({ userInfo: rows[0], tokens });
    }
  } catch (err) {
    console.error("Error - Register User: ", err);
    res.status(500).send(err);
  } finally {
    if (conn) conn.release();
  }
};
const deleteWaitingUser = async (req, res) => {
  let conn;
  try {
    const { nickname } = req.body;
    conn = await pool.getConnection();
    await conn.query(QUERY.USER_WAIT_DELETE, [nickname]);
    res.send();
  } catch (err) {
    console.error("Error - Delete Waiting User: ", err);
    res.status(500).send(err);
  } finally {
    if (conn) conn.release();
  }
};
const verifyNickname = async (req, res) => {
  let conn;
  try {
    const { nickname } = req.query;
    conn = await pool.getConnection();

    const rows = await pool.query(QUERY.USER_CHECK_NICKNAME, [nickname]);
    res.send(rows.length === 0);
  } catch (err) {
    console.error("Error - Verify Nickname: ", err);
    res.status(500).send(err);
  } finally {
    if (conn) conn.release();
  }
};

const refreshSession = (req, res) => {
  const { session } = req.cookies;
  if (!session) return res.send(null);

  req.session = JSON.parse(session);
  req.userInfo = JSON.parse(session).userInfo;
  // 플랫폼별 처리 ( 현재는 구글만 )
  const expired = req.session.tokens.expiry_date < Date.now();
  if (expired) return res.sendStatus(CODE.SESSION_EXPIRED);
  res.json(req.userInfo);
};

module.exports = {
  logOut,
  validateSession,
  getGoogleUser,
  refreshGoogleSession,
  registerUser,
  deleteWaitingUser,
  verifyNickname,
  refreshSession,
};
