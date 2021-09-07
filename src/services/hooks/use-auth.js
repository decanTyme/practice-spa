import { useEffect, useState } from "react";
import HttpService from "../http";
import cookieMaster from "./use-cookie";

function useAuth() {
  const http = HttpService();
  const cookieJar = cookieMaster();
  const [user, setUser] = useState(cookieJar.getCookie("userId"));

  const signIn = async (credentials) => {
    return http.login(credentials).then((response) => {
      if (!response?.error) {
        cookieJar.giveCookie("userId", response.userId, {
          expiresIn: response.exp,
        });
        setUser(response.userId);
      }
      return response;
    });
  };

  const signOut = async () => {
    http.onAuthSignoffRequest(user).then((response) => {
      if (response?.signoff) {
        cookieJar.clearCookies();
        setUser(null);
      }
    });
  };

  const fetchUserData = () => {
    return http.fetchUserData(user);
  };

  const getDatabaseStatus = () => {
    return http.ping();
  };

  const fetchData = () => {
    return http.fetchData();
  };

  const pushData = (data) => {
    return http.pushData(data);
  };

  const removeData = (id) => {
    return http.removeData(id);
  };

  useEffect(() => {
    const unsubscribe = () => {
      http
        .onReAuthRequest(user)
        .then((response) => {
          if (response) {
            setUser(response);
          } else {
            setUser(null);
          }
        })
        .catch(() => {
          setUser(null);
        });
    };

    return () => unsubscribe();

    // eslint-disable-next-line
  }, []);

  return {
    user,
    signIn,
    signOut,
    fetchUserData,
    getDatabaseStatus,
    fetchData,
    pushData,
    removeData,
  };
}

export default useAuth;
