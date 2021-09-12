import { useState } from "react";
import HttpService from "../http";
import useLocalStorage from "./use-local-storage";
import useRouter from "./use-router";

function useAuth() {
  const http = HttpService();
  const router = useRouter();
  const [isLogging, setLogging] = useState(false);
  const [stale, setStale] = useState(false);
  const [user, setUser] = useLocalStorage("__uuid_", null);
  const [userInfo, setUserInfo] = useLocalStorage("userInfo");

  const signIn = async (credentials) => {
    return http
      .onAuthLoginRequest(credentials)
      .then((response) => {
        setUser({
          _id: response.data.userId,
          t_key: response.data.refToken,
        });
        if (
          !userInfo ||
          (userInfo && userInfo.firstname !== response.data.userData.firstname)
        ) {
          setUserInfo(response.data.userData);
        }
      })
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      });
  };

  const signOut = async () => {
    setLogging(true);
    return http
      .onAuthSignoffRequest(user._id, user.t_key)
      .then((response) => {
        if (response.data.signoff) {
          setUser(null);
          router.replace("/login", { reAuth: false });
        }
      })
      .catch((error) => {
        if (error.response) {
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      })
      .finally(() => setLogging(false));
  };

  const getAuthStatus = async () => {
    return http
      .onReAuthRequest(user._id, user.t_key)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          setUser(null);
          throw error.response.data;
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      })
      .finally(() => setStale(false));
  };

  const getDatabaseStatus = async () => {
    return http
      .onDatabasePing()
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          setStale(true);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      });
  };

  const fetchData = async () => {
    return http
      .onDataFetch()
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          setStale(true);
          throw error.response.data;
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      });
  };

  const pushData = async (data) => {
    return http
      .onDataPush(data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          setStale(true);
          throw new Error(error.response.data.message);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      });
  };

  const removeData = async (id) => {
    return http
      .onDataRemove(id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          setStale(true);
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      });
  };

  return {
    user,
    userInfo,
    isLogging,
    stale,
    signIn,
    signOut,
    getAuthStatus,
    getDatabaseStatus,
    fetchData,
    pushData,
    removeData,
  };
}

export default useAuth;
