import { useSelector } from "react-redux";
import Themes from "../../../../../../../themes";
import ModalMenu from "../../../../../common/menus/ModalMenu";
import useThemeProvider from "../../../../../../../services/providers/theme";
import {
  selectNotifyRead,
  selectNotifyUnread,
} from "../../../../../../../app/state/slices/notification/selectors";
import UnreadNotification from "./components/UnreadNotification";
import OldNotification from "./components/OldNotification";

function NotificationsMenu() {
  const { theme } = useThemeProvider();

  const notifyUnread = useSelector(selectNotifyUnread);
  const notifyRead = useSelector(selectNotifyRead);

  const hasUnread = notifyUnread.length !== 0;
  const hasHistory = notifyRead.length !== 0;

  return (
    <ModalMenu
      id="notificationsMenu"
      fade={true}
      scrollable={true}
      title="Recent Notifications"
      themeMode={Themes[theme]}
      body={
        hasUnread || hasHistory ? (
          <>
            <h6>Unread</h6>
            {hasUnread ? (
              notifyUnread.map((data, i) => (
                <UnreadNotification
                  key={data.id}
                  unfilteredLength={notifyUnread.length + notifyRead.length}
                  data={data}
                  index={i}
                />
              ))
            ) : (
              <p className="text-center text-muted m-2">
                No new notifications for now.
              </p>
            )}

            <h6 className="mt-3">History</h6>
            {hasHistory ? (
              notifyRead.map((data, i) => (
                <OldNotification
                  key={data.id}
                  unfilteredLength={notifyUnread.length + notifyRead.length}
                  data={data}
                  index={i}
                />
              ))
            ) : (
              <p className="text-center text-muted m-2">That's all there is.</p>
            )}
          </>
        ) : (
          <p className="text-center text-muted m-2">Nothing to show here...</p>
        )
      }
      dismissBtn={
        <button
          type="button"
          className="btn btn-primary"
          data-bs-dismiss="modal"
        >
          Dismiss
        </button>
      }
    />
  );
}

export default NotificationsMenu;
