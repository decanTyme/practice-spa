import { Route } from "react-router-dom";
import useAuthManagerRouter from "../../../../services/router-auth";
import Spinner from "../../common/Spinner";

function ProtectedRoute({ children, ...rest }) {
  const { stale, rememberUser } = useAuthManagerRouter();

  if (stale && !rememberUser)
    return (
      <Spinner type="grow" color="text-secondary">
        Authenticating...
      </Spinner>
    );

  return <Route {...rest}>{children}</Route>;
}

export default ProtectedRoute;
