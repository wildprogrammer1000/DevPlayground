// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log(
//         "Service Worker registration successful with scope: ",
//         registration.scope
//       );
//     })
//     .catch((err) => {
//       console.log("Service Worker registration failed: ", err);
//     });
// }
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);
// const messaging = getMessaging(app);
// let currentToken = null;
// export const getCurrentToken = () => currentToken;

// getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_WEB_PUSH_KEY })
//   .then((token) => {
//     if (token) {
//       currentToken = token;
//       // Send the token to your server and update the UI if necessary
//       // ...
//     } else {
//       // Show permission request UI
//       console.log(
//         "No registration token available. Request permission to generate one."
//       );
//       // ...
//     }
//   })
//   .catch((err) => {
//     console.log("An error occurred while retrieving token. ", err);
//     // ...
//   });

// onMessage(messaging, (payload) => {
//   console.log("Message received. ", payload);
//   // ...
// });
