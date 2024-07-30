// const admin = require("firebase-admin");
// const { getMessaging } = require("firebase-admin/messaging");

const registrationTokens = [];

const message = {
  data: {
    score: "850",
    time: "2:45",
  },
  // topic: "test",
  notification: {
    title: "hihi",
    body: "===========",
  },
  // webpush: {
  //   headers: { TTL: "86400" },
  //   data: {
  //     score: "850",
  //     time: "2:45",
  //   },
  // notification: {
  //   title: "hihi",
  //   body: "==========="
  // }
  // },
  // tokens: registrationTokens,
};
// const serviceAccount = require("./fcm_account.json");

// const fcmApp = admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
// });

// const messaging = admin.messaging();

// setInterval(() => {
//   registrationTokens.length > 0 && console.log("===");
//   registrationTokens.length > 0 &&
//     messaging
//       .sendToTopic("test", message)
//       .then((response) => console.log("result: ", response))
//       .catch((err) => console.log("=============== Error send message: ", err));
// }, 1000);

// const addToken = (token) => registrationTokens.push(token);
const addToken = (token) => registrationTokens.push(token);
const subscribeTopic = (token, topic) => {
  registrationTokens.push(token);
  // messaging.subscribeToTopic(token, topic);
};
module.exports = {
  addToken,
  subscribeTopic,
};
