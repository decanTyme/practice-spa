import HttpService from "../http";
import { useSelector, useDispatch } from "react-redux";
import {
  signin,
  signout,
  setStale,
  authState,
} from "../../app/state/reducers/auth";
import useRouter from "./use-router";

function useAuth() {
  const http = HttpService();
  const router = useRouter();
  const state = useSelector(authState);
  const dispatch = useDispatch();

  const signIn = async (credentials) => {
    return http
      .onAuthLoginRequest(credentials)
      .then((response) => {
        dispatch(
          signin({
            _id: response.data.userId,
            t_key: response.data.refToken,
            userData: response.data.userData,
            rememberUser: credentials.rememberUser,
          })
        );
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
      .onAuthSignoffRequest(state._id, state.t_key)
      .then((response) => {
        if (response.data.signoff) {
          router.replace("/login");
          dispatch(signout());
        }
      })
      .catch((error) => {
        if (error.response) {
          dispatch(signout());
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("Please check your connection.");
        } else {
          console.error("Request wrapping error:", error.message);
        }
      });
  };

  const requestAuthToken = async () => {
    if (
      router.pathname !== "/login" &&
      router.pathname !== "/" &&
      state.isLoggedIn &&
      !state.rememberUser
    ) {
      setTimeout(() => {
        signOut();
      }, 100);
      throw new Error("Session expired. Please login again.");
    } else {
      return http
        .onReAuthRequest(state.userId, state.t_key)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            dispatch(signout());
            throw error.response.data;
          } else if (error.request) {
            console.error("No response received:", error.request);
            throw new Error("Please check your connection.");
          } else {
            console.error("Request wrapping error:", error.message);
          }
        })
        .finally(() => dispatch(setStale(false)));
    }
  };

  const getDatabaseStatus = async () => {
    return http
      .onDatabasePing()
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          dispatch(setStale(true));
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
          dispatch(setStale(true));
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
          dispatch(setStale(true));
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
          dispatch(setStale(true));
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
    state,
    signIn,
    signOut,
    requestAuthToken,
    getDatabaseStatus,
    fetchData,
    pushData,
    removeData,
  };
}

export default useAuth;
