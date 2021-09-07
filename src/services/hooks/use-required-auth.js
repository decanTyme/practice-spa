import { useEffect } from "react";
import useAuthManager from "../providers/auth";
import useRouter from "./use-router";

function useRequireAuth(redirectUrl = "/login") {
  const auth = useAuthManager();
  const router = useRouter();

  useEffect(() => {
    if (auth.user === null) {
      router.replace(redirectUrl);
    }
    // eslint-disable-next-line
  }, [auth.user, router.pathname]);

  return auth;
}

export default useRequireAuth;
