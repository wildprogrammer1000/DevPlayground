import { useState, useEffect } from "react";
import { requestGet } from "../api/fetch";
import URL from "../constants/url";
import CODE from "../constants/code";
export const getNotificationByType = (type, handler) => {
  requestGet(URL.NOTIFICATION_GET, { type }, handler);
};
const Notification = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  const getNotification = () => {
    requestGet(URL.NOTIFICATION_GET, { user }, (res) => {
      if (res.status === CODE.SUCCESS) {
        console.log("Response - Get Notification: ", res.data);
      }
    });
  };

  useEffect(() => {
    getNotification();
  }, []);
  return <div>Notification</div>;
};

export default Notification;
