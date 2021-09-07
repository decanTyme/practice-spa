import { Route } from "react-router-dom";
import Spinner from "../home/pages/components/spinner";
import useRequireAuth from "../../services/hooks/use-required-auth";

function ProtectedRoute({ children, ...rest }) {
  const auth = useRequireAuth();
  if (!auth.user) return <Spinner>Authenticating...</Spinner>;

  return <Route {...rest}>{children}</Route>;
}

export default ProtectedRoute;
