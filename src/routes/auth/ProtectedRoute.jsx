import { Route } from "react-router-dom";
import useRequireAuth from "../../services/hooks/use-require-auth";
import Spinner from "../home/pages/components/spinner";

function ProtectedRoute({ children, ...rest }) {
  const auth = useRequireAuth();

  if (!auth) return <Spinner>Authenticating...</Spinner>;

  return <Route {...rest}>{children}</Route>;
}

export default ProtectedRoute;
