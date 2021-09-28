import "./footer.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "bootstrap";
import { signOut } from "../../../../../app/state/slices/auth";
import { selectNotifyUnreadCount } from "../../../../../app/state/slices/notification/selectors";
import { isMobile } from "react-device-detect";

function SidebarFooter({ menuButton }) {
  const dispatch = useDispatch();

  const notificationsUnreadCount = useSelector(selectNotifyUnreadCount);

  const onLogout = () => {
    dispatch(signOut());
  };

  const onNotifications = () => {
    Modal.getOrCreateInstance(document.getElementById("notificationsMenu"), {
      keyboard: true,
      focus: true,
    }).show();
  };

  const onSettings = () => {
    Modal.getOrCreateInstance(document.getElementById("settingsMenu"), {
      keyboard: true,
      backdrop: "static",
      focus: true,
    }).show();
  };

  return (
    <div
      className="sidebar-footer"
      style={{ padding: isMobile ? "0.2rem 0" : null }}
    >
      <Link to="#notifications" onClick={onNotifications}>
        <i className="fa fa-bell"></i>
        {notificationsUnreadCount !== 0 ? (
          <span className="badge rounded-pill bg-warning notification">
            {notificationsUnreadCount}
          </span>
        ) : null}
      </Link>
      <Link to="#">
        <i className="fa fa-envelope"></i>
        <span className="badge rounded-pill bg-success notification">7</span>
      </Link>
      {menuButton}
      <Link to="#settings" onClick={onSettings}>
        <i className="fa fa-cog"></i>
        <span className="badge-sonar"></span>
        <span className="visually-hidden">Settings</span>
      </Link>
      <Link to="#" onClick={onLogout}>
        <i className="fa fa-power-off"></i>
        <span className="visually-hidden">Logout</span>
      </Link>
    </div>
  );
}

export default SidebarFooter;
