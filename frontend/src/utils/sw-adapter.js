import { requestGet, requestPost } from "api/fetch";
import CODE from "constants/code";
import URL from "constants/url";

export const registerServiceWorker = async () => {
  console.log("Start to register ServiceWorker");
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const prevRegistration = await navigator.serviceWorker.getRegistration();
      if (
        prevRegistration &&
        !prevRegistration.active.scriptURL.includes("/sw.js")
      ) {
        await prevRegistration.unregister();
      }
      const registration = await navigator.serviceWorker.register("/sw.js");

      const permission = await Notification.requestPermission();
      let response;
      if (permission === "granted") {
        console.log("Notification permission granted.");
        const subscriptionInfo =
          await registration.pushManager.getSubscription();
        if (subscriptionInfo) return console.log("subscription already exists");

        response = await requestGet(URL.WEBPUSH_VAPID_PUBLIC_KEY);
        const { vapidKey } = response.data;
        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
        response = await requestPost(
          URL.WEBPUSH_SUBSCRIBE,
          subscription.toJSON()
        );
        if (response.status === CODE.SUCCESS)
          console.log("subscription succeeded");
      } else {
        console.warn("Notification permission denied.");
      }
    } catch (err) {
      console.error("Error - ServiceWorker Registration: ", err);
    }
  } else {
    console.warn("No ServiceWorker Exists");
  }
};

const urlBase64ToUint8Array = (string) => {
  const padding = "=".repeat((4 - (string.length % 4)) % 4);
  const base64 = (string + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
