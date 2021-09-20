import "./sidebar.css";
import SidebarHeader from "./header/header";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import SidebarFooter from "./footer/footer";
import SidebarMenu from "./navigation/NavigationMenu";

function Sidebar() {
  return (
    <div className="sidebar-content">
      <div className="d-flex justify-content-center sidebar-brand">
        <Link to="/dashboard" className="flex-grow-1 w-100">
          BodyTalks.PH
        </Link>
        {isMobile ? (
          <Link
            to="#close"
            id="close-sidebar"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            hidden={!isMobile}
          >
            <i className="fa fa-close"></i>
          </Link>
        ) : null}
      </div>

      {/* User Information */}
      <SidebarHeader />

      {/* Menu Links */}
      <SidebarMenu />

      {/* Footer */}
      {isMobile ? null : <SidebarFooter />}
    </div>
  );
}

export default Sidebar;
