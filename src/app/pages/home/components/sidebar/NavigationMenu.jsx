import "./navigation-menu.css";
import { Link, NavLink, useRouteMatch } from "react-router-dom";
import { isMobile } from "react-device-detect";

function SidebarMenu() {
  const { url } = useRouteMatch();

  const onMobileDataBsDismiss = isMobile ? "offcanvas" : "";

  return (
    <div className="accordion accordion-flush sidebar-menu" id="sidebarMenu">
      <ul>
        <li className="header-menu">
          <span>General</span>
        </li>

        {/* -------------------- Dashboard Link -------------------- */}
        <li className="sidebar" data-bs-dismiss={onMobileDataBsDismiss}>
          <NavLink strict exact to={url}>
            <i className="fa fa-tachometer-alt"></i>
            <span data-bs-parent="#sidebarMenu">Dashboard</span>
            <span className="badge rounded-pill bg-warning">New</span>
            <div id="dashboardDropdown" data-bs-parent="#sidebarMenu"></div>
          </NavLink>
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
                  <NavLink to={`${url}/shop/products`}>Products</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={`${url}/shop/orders`}>Orders</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={`${url}/shop/customers`}>Customers</NavLink>
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
                  <NavLink strict exact to={`${url}/payments`}>
                    General
                  </NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={`${url}/payments/customer`}>
                    Customer TBP
                  </NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={`${url}/payments/assets`}>Assets</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={`${url}/payments/liabilities`}>
                    Liabilities
                  </NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={`${url}/payments/forms`}>Forms</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </li>

        {/* --------------------- Reports Link --------------------- */}
        <li className="sidebar" data-bs-dismiss={onMobileDataBsDismiss}>
          <NavLink strict exact to={`${url}/reports`}>
            <i className="fa fa-chart-line"></i>
            <span>Reports</span>
          </NavLink>
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
                  <NavLink to={`${url}/maps/google`}>Google maps</NavLink>
                </li>
                <li data-bs-dismiss={onMobileDataBsDismiss}>
                  <NavLink to={`${url}/maps/openstreet`}>
                    Open street map
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li className="header-menu">
          <span>Extra</span>
        </li>
        <li className="sidebar" data-bs-dismiss={onMobileDataBsDismiss}>
          <NavLink to={`${url}/documentation/help`}>
            <i className="fa fa-book"></i>
            <span>Documentation</span>
            <span className="badge rounded-pill bg-primary">Beta</span>
          </NavLink>
        </li>
        <li className="sidebar" data-bs-dismiss={onMobileDataBsDismiss}>
          <NavLink to={`${url}/calendar`}>
            <i className="fa fa-calendar"></i>
            <span>Calendar</span>
          </NavLink>
        </li>
        <li className="sidebar" data-bs-dismiss={onMobileDataBsDismiss}>
          <NavLink to={`${url}/drive/google`}>
            <i className="fa fa-folder"></i>
            <span>Drive</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default SidebarMenu;
