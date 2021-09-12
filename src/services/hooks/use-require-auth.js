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
        !auth.isLogging) ||
      auth.stale ||
      (auth.user !== null && router.pathname === "/login")
    ) {
      auth
        .getAuthStatus()
        .then(() => {
          if (auth.stale) return router.history.go(0);
          router.replace("/dashboard");
        })
        .catch((error) => {
          if (error instanceof TypeError) error.message = "Invalid session.";

          router.replace(redirectUrl, {
            reAuth: true,
            message: error.message,
          });
        });
    }

    // eslint-disable-next-line
  }, [router.pathname, auth.user, auth.stale]);

  return auth;
}

export default useRequireAuth;
