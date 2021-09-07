import { useState } from "react";
import cookieMaster from "../cookie-master";

export default function useToken() {
  const { getCookie, appendCookie, deleteCookie, clearCookies } =
    cookieMaster();

  const getToken = (type) => {
    return getCookie(type || "token");
  };

  const appendToken = (type, val) => {
    appendCookie(type, val);
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    let expiry = new Date(userToken.exp * 1000).toUTCString();
    document.cookie = `token=${userToken.token}; expires= ${expiry}`;
    document.cookie = `userId=${userToken.userId}; expires= ${expiry}`;
    setToken(getToken());
  };

  const deleteToken = (type) => {
    deleteCookie(type);
    setToken(null);
  };

  const clearAll = () => {
    clearCookies();
    setToken(null);
  };

  return {
    setToken: saveToken,
    deleteToken: deleteToken,
    getToken: getToken,
    appendToken: appendToken,
    clearAll: clearAll,
    token,
  };
}
