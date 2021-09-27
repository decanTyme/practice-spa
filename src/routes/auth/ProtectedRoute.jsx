import { Route } from "react-router-dom";
import AuthManagerRouter from "../../services/router-auth";

function ProtectedRoute({ location, children, ...rest }) {
  AuthManagerRouter().run();

  //! Need some fix: Doesn't really do much anymore ever since
  //! Notify Service was implemented
  // if (status === Constants.IDLE && stale)
  //   return <Spinner>Authenticating...</Spinner>;

  return <Route {...rest}>{children}</Route>;
}

export default ProtectedRoute;
