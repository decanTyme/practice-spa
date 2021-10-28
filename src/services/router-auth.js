import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestAuthToken, setAuthError } from "../app/state/slices/auth";
import { selectAuthCurrentState } from "../app/state/slices/auth/selectors";
import Constants from "../app/state/slices/constants";
import useRouter from "./hooks/use-router";

const encodeURL = (str) => window.btoa(unescape(encodeURIComponent(str)));
const decodeURL = (url) => decodeURIComponent(escape(window.atob(url)));

/**
 * A hook that checks and handles all authentication routing and token refresh.
 *
 * Pages that require authentication should either have this hook present
 * in the topmost common parent component, or have it nested inside the
 * ProtectedRoute component and enable it through the returned run function.
 *
 * @version 0.2.8
 * @since 0.1.6
 */
function useAuthManagerRouter() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isLoggedIn, status, stale, error } = useSelector(
    selectAuthCurrentState
  );

  const isOnProtectedRoute = router.pathname !== "/login";

  // Always run this effect when the auth state changes
  useLayoutEffect(() => {
    if (router.pathname === "/")
      return router.replace(isLoggedIn ? "/dashboard" : "/login");

    if (isLoggedIn) {
      // Redirect the user to the dashboard or next query if they are
      // already logged in.
      if (!isOnProtectedRoute)
        return router.replace(
          (router.query.next && decodeURL(router.query.next)) || "/dashboard"
        );

      // Should only request a new auth token if the current auth token
      // is stale and Auth Manager state is on standby
      if (stale && status === Constants.IDLE) dispatch(requestAuthToken());

      return;
    }

    // If the user is currently not authenticated, prevent the user from
    // getting into the protected pages.
    if (isOnProtectedRoute) {
      let nextCallback = "";

      // Before we add any next query so that the user can log back in to
      // the same page (in case the session expired), check to see if it
      // was not deliberate by making sure the user didn't do it themselves!
      // (e.g. by signing off)
      if (error || status === Constants.AuthManager.Sign.SIGNED_OFF_WITH_ERROR)
        nextCallback = `?${new URLSearchParams({
          next: encodeURL(router.pathname),
        })}`;

      // If there was no error already, this means that the user have not
      // tried to sign in recently, therefore notify the user to sign in first.
      // Also check to see if this was not deliberate by making sure the
      // user didn't do it themselves! (e.g. by signing off)
      if (!error && status !== Constants.AuthManager.Sign.SIGNING_OFF) {
        nextCallback = `?${new URLSearchParams({
          next: encodeURL(router.pathname),
        })}`;

        dispatch(setAuthError("Please log in."));
      }

      return router.replace("/login" + nextCallback);
    }
  }, [dispatch, error, isLoggedIn, isOnProtectedRoute, router, stale, status]);

  return stale;
}

export default useAuthManagerRouter;
