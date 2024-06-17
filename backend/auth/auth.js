const { pool } = require("../db/connection");
const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");
const axios = require("axios");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);
const getGoogleUser = async (req, res) => {
  let conn;
  try {
    const { codeResponse } = req.query;
    console.log("codeResponse: ", codeResponse);
    const { tokens } = await oAuth2Client.getToken(codeResponse.code);

    console.log("=== Token === ");
    console.log(tokens);
    console.log("====== ");

    const { data } = await axios({
      method: "get",
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });

    conn = await pool.getConnection();

    const rows = await conn.query(QUERY.USER_GET, ["google", data.email]);

    conn.release();
    if (rows.length > 0) {
      res.json({ userInfo: rows[0], tokens });
    } else {
      res
        .status(CODE.ACCOUNT_NOT_REGISTERED)
        .json({ userInfo: { platform: "google", email: data.email }, tokens });
    }
  } catch (err) {
    console.error("Error - Get Google User: ", err);
    if (conn) conn.release();
    res.status(500).send(err);
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
  }
};

const registerUser = async (req, res) => {
  let conn;

  try {
    const { platform, email, nickname, tokens } = req.body;
    conn = await pool.getConnection();

    // 닉네임 중복 체크
    const rows_1 = await pool.query(QUERY.USER_CHECK_NICKNAME, [nickname]);

    if (rows_1.length > 0) {
      // 닉네임 중복
      res.status(CODE.ACCOUNT_NICKNAME_DUPLICATED);
    } else {
      // 등록
      const rows = await pool.query(QUERY.USER_REGISTER, [
        platform,
        email,
        nickname,
      ]);
      tokens.platform = platform;
      res.json({ userInfo: rows[0], tokens });
    }

    conn.release();
  } catch (err) {
    console.error("Error - Register User: ", err);
    if (conn) conn.release();
    res.status(500).send(err);
  }
};
const verifyNickname = async (req, res) => {
  let conn;
  try {
    const { nickname } = req.query;
    conn = await pool.getConnection();

    const rows = await pool.query(QUERY.USER_CHECK_NICKNAME, [nickname]);
    res.send(rows.length === 0);

    conn.release();
  } catch (err) {
    console.error("Error - Verify Nickname: ", err);
    if (conn) conn.release();
    res.status(500).send(err);
  }
};

module.exports = {
  getGoogleUser,
  refreshGoogleSession,
  registerUser,
  verifyNickname,
};
