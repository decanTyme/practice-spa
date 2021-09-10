import "./navigation-menu.css";
import { Link, NavLink, useRouteMatch } from "react-router-dom";
import { isMobile } from "react-device-detect";

function SidebarMenu() {
  let { path } = useRouteMatch();
  const onMobileDataBsDismiss = isMobile ? "offcanvas" : "";

  return (
    <div className="accordion accordion-flush sidebar-menu" id="sidebarMenu">
      <ul>
        <li className="header-menu">
          <span>General</span>
        </li>

        {/* -------------------- Dashboard Link -------------------- */}
        <li className="sidebar" data-bs-dismiss={onMobileDataBsDismiss}>
          <div
            className="collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#dashboardDropdown"
          >
            <NavLink strict exact to={path}>
              <i className="fa fa-tachometer-alt"></i>
              <span data-bs-parent="#sidebarMenu">Dashboard</span>
              <span className="badge rounded-pill bg-warning">New</span>
              <div id="dashboardDropdown" data-bs-parent="#sidebarMenu"></div>
            </NavLink>
          </div>
        </li>

        {/* ---------------------- Shop Link ----------------------- */}
        <li className="sidebar-dropdown">
          <Link
            to="#dropdownShop"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#dropdownShop"
            aria-controls="dropdownShop"
            aria-expanded="false"
            className="collapsed"
          >
            <i className="fa fa-shopping-cart"></i>
            <span>Shop</span>
            <span className="badge rounded-pill bg-danger">3</span>
          </Link>
          <div
            id="dropdownShop"
            className="accordion-collapse collapse"
            data-bs-parent="#sidebarMenu"
          >
            <div className="sidebar-submenu">
              <ul>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={path + "/shop/products"}>Products</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={path + "/shop/orders"}>Orders</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={path + "/shop/customers"}>Customers</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </li>

        {/* -------------------- Payments Link --------------------- */}
        <li className="sidebar-dropdown">
          <Link
            to="#dropdownPayments"
            data-bs-toggle="collapse"
            data-bs-target="#dropdownPayments"
            type="button"
            aria-expanded="false"
            aria-controls="dropdownPayments"
            className="collapsed"
          >
            <i className="far fa-gem"></i>
            <span>Payments</span>
          </Link>
          <div
            id="dropdownPayments"
            className="accordion-collapse collapse"
            data-bs-parent="#sidebarMenu"
          >
            <div className="sidebar-submenu">
              <ul>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to="#">General</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to="#">Customer TBP</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to="#">Assets</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to="#">Liabilities</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to="#">Forms</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </li>

        {/* --------------------- Reports Link --------------------- */}
        <li className="sidebar" data-bs-dismiss={onMobileDataBsDismiss}>
          <div
            className="collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#reportsDropdown"
          >
            <NavLink strict exact to={path + "/reports"}>
              <i className="fa fa-chart-line"></i>
              <span>Reports</span>
            </NavLink>
          </div>
          <div id="reportsDropdown" data-bs-parent="#sidebarMenu"></div>
        </li>

        {/* ---------------------- Maps Link ----------------------- */}
        <li className="sidebar-dropdown">
          <Link
            to="#dropdownMaps"
            data-bs-toggle="collapse"
            type="button"
            aria-expanded="false"
            aria-controls="dropdownMaps"
          >
            <i className="fa fa-globe"></i>
            <span>Maps</span>
          </Link>
          <div
            id="dropdownMaps"
            className="collapse"
            data-bs-parent="#sidebarMenu"
          >
            <div className="sidebar-submenu">
              <ul>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to="#">Google maps</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to="#">Open street map</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li className="header-menu">
          <span>Extra</span>
        </li>
        <li data-bs-dismiss={onMobileDataBsDismiss}>
          <NavLink to="#">
            <i className="fa fa-book"></i>
            <span>Documentation</span>
            <span className="badge rounded-pill bg-primary">Beta</span>
          </NavLink>
        </li>
        <li data-bs-dismiss={onMobileDataBsDismiss}>
          <NavLink to="#">
            <i className="fa fa-calendar"></i>
            <span>Calendar</span>
          </NavLink>
        </li>
        <li data-bs-dismiss={onMobileDataBsDismiss}>
          <NavLink to="#">
            <i className="fa fa-folder"></i>
            <span>Drive</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default SidebarMenu;
