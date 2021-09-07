import { createContext, useContext } from "react";

export const AuthContext = createContext();

function useAuthManager() {
  return useContext(AuthContext);
}

export default useAuthManager;
