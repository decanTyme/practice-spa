import { useLayoutEffect } from "react";
import useAuth from "./use-auth";
import useRouter from "./use-router";

function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();
  const state = auth.state;

  useLayoutEffect(() => {
    if (state.stale || (state.isLoggedIn && router.pathname === "/login")) {
      auth
        .requestAuthToken()
        .then(() => {
          if (state.stale) return router.history.go(0);
          router.replace(router.query.callback || "/dashboard");
        })
        .catch((error) => {
          if (error instanceof TypeError) {
            error.message = "Invalid session.";
          }

          router.replace(
            "/login?" + new URLSearchParams({ callback: router.pathname }),
            {
              reAuth: true,
              message: error.message,
            }
          );
        });
    } else if (
      router.pathname !== "/login" &&
      router.pathname !== "/" &&
      !state.isLoggedIn
    ) {
      router.replace(
        "/login?" + new URLSearchParams({ callback: router.pathname }),
        {
          reAuth: true,
          message: "Please log in.",
        }
      );
    }
    // eslint-disable-next-line
  }, [state]);

  return state;
}

export default useRequireAuth;
