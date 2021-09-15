import { useLayoutEffect } from "react";
import useAuth from "./use-auth";
import useRouter from "./use-router";

/**
 * A hook that handles all authentication routing.
 *
 * Pages that require authentication should either have this hook present in the
 * topmost parent component, or have it nested inside the ProtectedRoute component.
 *
 * Note:
 * The Auth Manager signout function handles its own redirection. This way, it
 * will immediately redirect to the Login page without having to wait for the auth
 * router to detect the change, redirect it, and flag it as a "not logged in" error,
 * which it is obviously not.
 *
 * @version 0.2.6
 * @since 0.1.6
 */
function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();
  const state = auth.state;

  const callback = "?" + new URLSearchParams({ callback: router.pathname });
  const isOnProtectedPage = router.pathname !== "/login";

  // Always run this effect when the auth state changes
  useLayoutEffect(() => {
    if (router.pathname === "/") {
      return router.replace(state.isLoggedIn ? "/dashboard" : "/login");
    }

    if (state.isLoggedIn) {
      // Redirect the user to the dashboard or callback query if they are
      // already logged in.
      if (!isOnProtectedPage)
        return router.replace(router.query.callback || "/dashboard");

      if (state.stale) {
        // If the user didn't check 'remember me', do not request for
        // a new token and signout immediately.
        if (!state.rememberUser) {
          auth.signOut("Session expired. Please login again.");
          return;
        }

        // Otherwise, request a new auth token
        auth
          .requestAuthToken()
          .then(() => {
            router.history.go(0);
          })
          .catch(() => {});
      }

      return;
    }

    // If the user is currently not authenticated, prevent the user from
    // getting into the protected pages.
    if (isOnProtectedPage) {
      return router.replace("/login" + callback, {
        reAuth: true,
        message: "Please log in.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return state;
}

export default useRequireAuth;
