import "./footer.css";
import { Link } from "react-router-dom";
import { Modal } from "bootstrap";
import useAuthManager from "../../../../../services/providers/auth";

function SidebarFooter(props) {
  const auth = useAuthManager();
  const onLogout = () => {
    auth.signOut();
  };

  const onSettings = () => {
    const myModal = new Modal(document.getElementById("settingsMenu"), {
      keyboard: true,
      backdrop: "static",
      focus: true,
    });
    myModal.toggle();
  };

  return (
    <div className="sidebar-footer">
      <Link to="#">
        <i className="fa fa-bell"></i>
        <span className="badge rounded-pill bg-warning notification">3</span>
      </Link>
      <Link to="#">
        <i className="fa fa-envelope"></i>
        <span className="badge rounded-pill bg-success notification">7</span>
      </Link>
      {props.menuButton}
      <Link to="#" onClick={onSettings}>
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
