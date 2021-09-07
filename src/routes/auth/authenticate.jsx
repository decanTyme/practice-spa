import { useEffect } from "react";
import useRouter from "../../services/hooks/use-router";
import useAuthManager from "../../services/providers/auth";
import Spinner from "../home/pages/components/spinner";

function AuthenticationPage(props) {
  const auth = useAuthManager();
  const router = useRouter();

  useEffect(() => {
    auth
      .getAuthStatus()
      .then(() => {
        router.replace("/dashboard");
      })
      .catch(() => {
        router.replace("/login", {
          reAuth: true,
          message: "Session expired. Please log in again.",
        });
      });
  });

  return <Spinner>Authenticating...</Spinner>;
}

export default AuthenticationPage;
