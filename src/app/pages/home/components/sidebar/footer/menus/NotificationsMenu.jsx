import { useDispatch, useSelector } from "react-redux";
import Themes from "../../../../../../../themes";
import ModalMenu from "../../../../../common/ModalMenu";
import useThemeProvider from "../../../../../../../services/providers/theme";
import {
  selectNotifyRead,
  selectNotifyUnread,
} from "../../../../../../state/slices/notification/selectors";
import UnreadNotification from "../../../notification/UnreadNotification";
import OldNotification from "../../../notification/OldNotification";
import { useEffect, useRef } from "react";
import useOnScreen from "../../../../../../../services/hooks/use-on-screen";
import { read } from "../../../../../../state/slices/notification";

function NotificationsMenu() {
  const { theme } = useThemeProvider();

  const notifyUnread = useSelector(selectNotifyUnread);
  const notifyRead = useSelector(selectNotifyRead);

  const hasUnread = notifyUnread.length !== 0;
  const hasHistory = notifyRead.length !== 0;

  const dispatch = useDispatch();

  const ref = useRef();

  const isVisible = useOnScreen(ref && ref);

  useEffect(() => {
    const notifRead = () =>
      isVisible && notifyUnread.forEach((unread) => dispatch(read(unread.id)));

    return () => notifRead();
  });

  return (
    <ModalMenu
      id="notificationsMenu"
      fade
      themeMode={Themes[theme]}
      reference={ref}
    >
      <ModalMenu.Dialog scrollable>
        <ModalMenu.Content>
          <ModalMenu.Header>
            <ModalMenu.Title>Recent Notifications</ModalMenu.Title>
          </ModalMenu.Header>
          <ModalMenu.Body>
            {hasUnread || hasHistory ? (
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
                  <p className="text-center text-muted m-2">
                    That's all there is.
                  </p>
                )}
              </>
            ) : (
              <p className="text-center text-muted m-2">
                Nothing to show here...
              </p>
            )}
          </ModalMenu.Body>
          <ModalMenu.Footer>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Dismiss
            </button>
          </ModalMenu.Footer>
        </ModalMenu.Content>
      </ModalMenu.Dialog>
    </ModalMenu>
  );
}

export default NotificationsMenu;
