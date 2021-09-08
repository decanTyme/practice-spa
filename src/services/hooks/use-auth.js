import { useEffect } from "react";
import HttpService from "../http";
import useLocalStorage from "./use-local-storage";
import useRouter from "./use-router";

function useAuth() {
  const http = HttpService();
  const router = useRouter();
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

        router.replace("/dashboard");
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
    return http
      .onAuthSignoffRequest(user)
      .then((response) => {
        if (response.data.signoff) {
          setUser(null);
          router.replace("/login");
        }
      })
      .catch((error) => {
        if (error.response) {
          router.replace("/authenticate");
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      });
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

  const fetchUserData = async () => {
    return http
      .onReAuthRequest(user)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          router.replace("/authenticate");
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
          router.replace("/authenticate");
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
          router.replace("/authenticate");
          throw new Error(error.response.data);
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
            router.replace("/authenticate");
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
          router.replace("/authenticate");
          throw new Error(error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      });
  };

  useEffect(() => {
    if (
      (router.pathname !== "/login" &&
        router.pathname !== "/authenticate" &&
        user === null) ||
      (user !== null && router.pathname === "/login")
    ) {
      router.replace("/authenticate");
    }

    return () => {};
    // eslint-disable-next-line
  }, [router]);

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
    userInfo,
    signIn,
    signOut,
    getAuthStatus,
    fetchUserData,
    getDatabaseStatus,
    fetchData,
    pushData,
    removeData,
  };
}

export default useAuth;
