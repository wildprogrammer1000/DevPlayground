const webPush = require("web-push");
const { pool } = require("../db/connection");
const { QUERY } = require("../constants/query");
const { CODE } = require("../constants/code");

webPush.setVapidDetails(
  "mailto:" + process.env.ADMIN_EMAIL,
  process.env.WEBPUSH_PUBLIC_KEY,
  process.env.WEBPUSH_PRIVATE_KEY
);

const getVapidPublicKey = (req, res) => {
  res.json({ vapidKey: process.env.WEBPUSH_PUBLIC_KEY });
};

const sendNotification = async (subscription, data) => {
  try {
    const response = await webPush.sendNotification(
      subscription,
      JSON.stringify(data)
    );
    if (response) console.log("Sent notification");
  } catch (err) {
    console.error("Error sending notification: ", err);
  }
};

const subscribe = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { endpoint, keys } = req.body;
    await conn.query(QUERY.WEBPUSH_SUBSCRIBE, [
      endpoint,
      keys.p256dh,
      keys.auth,
    ]);
    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Web Push subscribe: ", err);
  } finally {
    if (conn) conn.release();
  }
};

const unsubscribe = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { endpoint } = req.body;
    await conn.query(QUERY.WEBPUSH_UNSUBSCRIBE, [endpoint]);
    res.sendStatus(CODE.SUCCESS);
  } catch (err) {
    console.error("Error - Web Push unsubscribe: ", err);
  } finally {
    if (conn) conn.release();
  }
};
// Push Template
// const sendNotification = async (req, res) => {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const rows = await conn.query("select * from webpush_subscriptions");
//     const payload = JSON.stringify({
//       title: "hello",
//       body: "this is a push notificaiton message",
//     });
//     rows.forEach(async (row) => {
//       try {
//         const response = await webPush.sendNotification(target, payload);
//         if (response) {
//           console.log("push notification send successfully");
//         }
//       } catch (err) {
//         await conn.query(QUERY.WEBPUSH_UNSUBSCRIBE, [row.endpoint]);
//         console.error("error sending push notification: ", err);
//       }
//     });
//     res.send("ok");
//   } catch (err) {
//     console.error("Error - Web Push unsubscribe: ", err);
//   } finally {
//     if (conn) conn.release();
//   }
// };

module.exports = {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  sendNotification,
};
