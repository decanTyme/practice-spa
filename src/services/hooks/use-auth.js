import { useEffect, useState } from "react";
import HttpService from "../http";
import cookieMaster from "./use-cookie";

function useAuth() {
  const http = HttpService();
  const cookieJar = cookieMaster();
  const [user, setUser] = useState(cookieJar.getCookie("userId"));

  console.log("User:", user);
  const signIn = async (credentials) => {
    return http
      .onLoginRequest(credentials)
      .then((response) => {
        console.log(response.data.userId);
        cookieJar.giveCookie("userId", response.data.userId, {
          expiresIn: response.data.exp,
        });
        setUser(response);
      })
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.log("Request wrapping error:", error.message);
        }
      });
  };

  const signOut = async () => {
    return http
      .onAuthSignoffRequest(user)
      .then((response) => {
        if (response.data.signoff) {
          cookieJar.clearCookies();
          setUser(null);
        }
      })
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.log("Request wrapping error:", error.message);
        }
      });
  };

  const fetchUserData = async () => {
    return http
      .onFetchUserData(user)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.log("Request wrapping error:", error.message);
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
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.log("Request wrapping error:", error.message);
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
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.log("Request wrapping error:", error.message);
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
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.log("Request wrapping error:", error.message);
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
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.log("Request wrapping error:", error.message);
        }
      });
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
