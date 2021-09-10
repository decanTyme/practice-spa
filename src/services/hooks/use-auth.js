import { useState } from "react";
import HttpService from "../http";
import useLocalStorage from "./use-local-storage";
import useRouter from "./use-router";

function useAuth() {
  const http = HttpService();
  const router = useRouter();
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useLocalStorage("userId", null);
  const [userInfo, setUserInfo] = useLocalStorage("userData");

  const signIn = async (credentials) => {
    return http
      .onLoginRequest(credentials)
      .then((response) => {
        setUser(response.data.userId);

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
    setLoggingOut(true);
    return http
      .onAuthSignoffRequest(user)
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
      .finally(() => setLoggingOut(false));
  };

  const getAuthStatus = async () => {
    return http
      .onReAuthRequest(user)
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
      });
  };

  const getDatabaseStatus = async () => {
    return http
      .onDatabasePing()
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          setUser(null);
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
      .onFetchData()
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
      });
  };

  const pushData = async (data) => {
    return http
      .onPushData(data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          setTimeout(() => {
            setUser(null);
          }, 1500);
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
      .onRemoveData(id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 418) {
            setUser(null);
          }
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
    isLoggingOut,
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
