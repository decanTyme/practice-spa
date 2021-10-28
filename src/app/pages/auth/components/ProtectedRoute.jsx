import { Route } from "react-router-dom";
import useAuthManagerRouter from "../../../../services/router-auth";
import Spinner from "../../common/Spinner";

function ProtectedRoute({ children, ...rest }) {
  const stale = useAuthManagerRouter();

  if (stale)
    return (
      <Spinner type="grow" color="text-secondary">
        Refreshing some infromation...
      </Spinner>
    );

  return <Route {...rest}>{children}</Route>;
}

export default ProtectedRoute;
