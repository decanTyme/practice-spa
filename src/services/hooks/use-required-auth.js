import { useEffect } from "react";
import useAuthManager from "../providers/auth";
import useRouter from "./use-router";

function useRequireAuth(redirectUrl = "/login") {
  const auth = useAuthManager();
  const router = useRouter();

  useEffect(() => {
    if (
      (router.pathname !== "/login" &&
        router.pathname !== "/" &&
        auth.user === null &&
        !auth.isLoggingOut) ||
      (auth.user !== null && router.pathname === "/login")
    ) {
      auth
        .getAuthStatus()
        .then(() => {
          router.replace("/dashboard");
        })
        .catch((error) => {
          let message;
          if (error.hasToken) message = "Session expired. Please log in again.";
          else if (!error.hasToken) message = "Please log in.";

          router.replace(redirectUrl, {
            reAuth: true,
            message,
          });
        });
    }

    // eslint-disable-next-line
  }, [router.pathname, auth.user]);

  return auth;
}

export default useRequireAuth;
