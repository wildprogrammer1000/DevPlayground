import axios from "axios";
import { SERVER_URL } from "../config";
import {
  getSessionItem,
  removeSessionItem,
  setSessionItem,
} from "../utils/storage";

const refreshSession = async () => {
  // 세션이 있을 때만 처리
  const session = getSessionItem("userTokens");
  if (!session) return;

  if (Date.now() > session.expire_date) {
    // 만료 처리
    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    removeSessionItem("userTokens");
    window.location.pathname = "/";
  } else {
    // 세션 새로고침
    const response = await axios({
      method: "post",
      url: SERVER_URL + "/refresh_token/" + session.platform,
      data: session,
    });
    setSessionItem("userTokens", response.data);
    // console.log("Session Refresh Response: ", response);
  }
};

export const requestGet = async (url, params = {}, handler, errorHandler) => {
  try {
    await refreshSession();
    const response = await axios({
      url: SERVER_URL + url,
      method: "get",
      params,
    });
    // console.log("GET response: ", response);
    if (handler) handler(response);
  } catch (err) {
    if (errorHandler) errorHandler(err);
  }
};

export const requestPost = async (url, data = {}, handler, errorHandler) => {
  try {
    await refreshSession();
    const response = await axios({
      url: SERVER_URL + url,
      method: "post",
      data,
    });
    // console.log("POST response: ", response);
    if (handler) handler(response);
  } catch (err) {
    if (errorHandler) errorHandler(err);
  }
};