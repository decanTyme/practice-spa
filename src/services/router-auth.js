import { useLayoutEffect } from "react";
import useRouter from "./hooks/use-router";
import { useDispatch, useSelector } from "react-redux";
import { requestAuthToken, setAuthError } from "../app/state/slices/auth";
import { selectAuthCurrentState } from "../app/state/slices/auth/selectors";
import Constants from "../app/state/slices/constants";

/**
 * A hook that checks and handles all authentication routing.
 *
 * Pages that require authentication should either have this hook present
 * in the topmost common parent component, or have it nested inside the
 * ProtectedRoute component and enable it through the returned run function.
 *
 * @version 0.2.7
 * @since 0.1.6
 */
function AuthManagerRouter() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isLoggedIn, status, stale, error } = useSelector(
    selectAuthCurrentState
  );

  const isOnProtectedPage = router.pathname !== "/login";

  let isRunning = false;

  // Always run this effect when the auth state changes
  useLayoutEffect(() => {
    if (isRunning) {
      if (router.pathname === "/") {
        return router.replace(isLoggedIn ? "/dashboard" : "/login");
      }

      if (isLoggedIn) {
        // Redirect the user to the dashboard or callback query if they are
        // already logged in.
        if (!isOnProtectedPage) {
          const callback =
            router.query.callback &&
            decodeURIComponent(escape(window.atob(router.query.callback)));

          return router.replace(callback || "/dashboard");
        }

        // Only run when the auth token is stale and check first if it was not
        // deliberate by making sure the user didn't do it themselves!
        // (e.g. by signing off)
        if (stale && status === Constants.IDLE) {
          dispatch(requestAuthToken());
        }

        return;
      }

      // If the user is currently not authenticated, prevent the user from
      // getting into the protected pages.
      if (isOnProtectedPage) {
        let callback = "";

        // Before we add any callback query so that the user can log back in to
        // the same page (in case the session expired), check again to see if it
        // was not deliberate by making sure the user didn't do it themselves!
        // (e.g. by signing off)
        if (
          error ||
          status === Constants.AuthManager.Sign.SIGNED_OFF_WITH_ERROR
        ) {
          callback =
            "?" +
            new URLSearchParams({
              callback: window.btoa(
                unescape(encodeURIComponent(router.pathname))
              ),
            });
        }

        // If there was no error already, this means that the user have not
        // tried to sign in recently, therefore notify the user to sign in first.
        // Also check to see if this was not deliberate by making sure the
        // user didn't do it themselves! (e.g. by signing off)
        if (!error && status !== Constants.AuthManager.Sign.SIGNING_OFF) {
          callback =
            "?" +
            new URLSearchParams({
              callback: window.btoa(
                unescape(encodeURIComponent(router.pathname))
              ),
            });
          dispatch(setAuthError("Please log in."));
        }

        return router.replace("/login" + callback);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoggedIn, stale, status, error, isOnProtectedPage, router]);

  return {
    run: () => {
      isRunning = true;

      return stale;
    },
  };
}

export default AuthManagerRouter;
