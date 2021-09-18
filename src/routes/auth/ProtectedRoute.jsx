import { Route } from "react-router-dom";
import AuthManagerRouter from "../../services/router-auth";
import Spinner from "../home/pages/components/spinner";

function ProtectedRoute({ children, ...rest }) {
  const stale = AuthManagerRouter().run();

  if (stale) return <Spinner>Authenticating...</Spinner>;

  return <Route {...rest}>{children}</Route>;
}

export default ProtectedRoute;
