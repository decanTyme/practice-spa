import useAuth from "../../services/hooks/use-auth";
import { AuthContext } from "../../services/providers/auth";

function AuthManager({ children }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default AuthManager;
