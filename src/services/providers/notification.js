import { createContext, useContext } from "react";

export const NotificationContext = createContext();

function useNotifyService() {
  return useContext(NotificationContext);
}

export default useNotifyService;
