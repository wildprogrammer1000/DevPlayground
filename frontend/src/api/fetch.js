import axios from "axios";
import { SERVER_URL, SPRINGBOOT_SERVER_URL } from "../config";
import CODE from "../constants/code";

export const requestGet = async (url, params = {}, handler, errorHandler) => {
  try {
    const response = await axios({
      url: SERVER_URL + url,
      withCredentials: true,
      method: "get",
      params,
    });
    if (response.status === CODE.SESSION_EXPIRED) {
      window.location.pathname = "/";
      return alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
    }
    // console.log("GET response: ", response);
    if (handler) handler(response);
    return response;
  } catch (err) {
    if (errorHandler) errorHandler(err);
  }
};

export const requestPost = async (url, data = {}, handler, errorHandler) => {
  try {
    const response = await axios({
      url: SERVER_URL + url,
      withCredentials: true,
      method: "post",
      data,
    });
    if (response.status === CODE.SESSION_EXPIRED) {
      alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
      window.location.pathname = "/";
      return;
    }
    // console.log("POST response: ", response);
    if (handler) handler(response);
    return response;
  } catch (err) {
    if (errorHandler) errorHandler(err);
  }
};
export const requestDelete = async (url, data = {}, handler, errorHandler) => {
  try {
    const response = await axios({
      url: SERVER_URL + url,
      withCredentials: true,
      method: "delete",
      data,
    });
    if (response.status === CODE.SESSION_EXPIRED) {
      alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
      window.location.pathname = "/";
      return;
    }
    // console.log("DELETE response: ", response);
    if (handler) handler(response);
    return response;
  } catch (err) {
    if (errorHandler) errorHandler(err);
  }
};

export const requestFetch = async (
  url,
  requestOptions,
  handler,
  errorHandler
) => {
  try {
    const response = await axios({
      url: SPRINGBOOT_SERVER_URL + url,
      ...requestOptions,
    });
    if (handler) handler(response);
    return response;
  } catch (err) {
    if (errorHandler) errorHandler(err);
  }
};
