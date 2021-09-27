import { Route } from "react-router-dom";
import AuthManagerRouter from "../../services/router-auth";

function ProtectedRoute({ location, children, ...rest }) {
  AuthManagerRouter().run();

  // if (status === Constants.IDLE && stale)
  //   return <Spinner>Authenticating...</Spinner>;

  return <Route {...rest}>{children}</Route>;
}

export default ProtectedRoute;
