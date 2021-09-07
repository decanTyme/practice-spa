import { useEffect, useState } from "react";
import HttpService from "../http";
import cookieMaster from "./use-cookie";

function useAuth() {
  const http = HttpService();
  const cookieJar = cookieMaster();
  const [user, setUser] = useState(cookieJar.getCookie("userId"));

  const signIn = async (credentials) => {
    return http.login(credentials).then((user) => {
      if (!user?.error) {
        cookieJar.giveCookie("userId", user.userId, { expiresIn: user.exp });
        setUser(user);
      }
      return user;
    });
  };

  const signOut = async (userId) => {
    cookieJar.clearCookies();
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = () => {
      http
        .authenticate(user.userId)
        .then((response) => {})
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
  };
}

export default useAuth;
