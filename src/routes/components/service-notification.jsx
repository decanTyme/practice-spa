import useNotification from "../../services/hooks/use-norifications";
import { NotificationContext } from "../../services/providers/notification";

function NotificationService({ children }) {
  const notifier = useNotification();
  return (
    <NotificationContext.Provider value={notifier}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationService;
