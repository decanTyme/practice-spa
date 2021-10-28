import "./app-shell.css";
import { isMobile } from "react-device-detect";
import Viewport from "../../../routes";
import SidebarContent from "./components/sidebar/SidebarContent";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import SidebarFooter from "./components/sidebar/SidebarFooter";
import useThemeProvider from "../../../services/providers/theme";
import Themes from "../../../themes";
import ToastyWrapper from "./components/notification/ToastWrapper";
import SettingsMenu from "./components/sidebar/footer/menus/SettingsMenu";
import NotificationsMenu from "./components/sidebar/footer/menus/NotificationsMenu";
import classNames from "classnames";

const onDesktopSidebarClass = "col-sm-5 col-md-4 col-lg-3 col-xl-2";
const onMobileSidebarClass = "offcanvas offcanvas-start";
const onDesktopViewportClass =
  "col-sm-7 col-md-8 ms-sm-auto mb-md-3 col-lg-9 col-xl-10";
const onMobileViewportClass = "mb-1";

function AppShell() {
  const { theme } = useThemeProvider();
  const currentTheme = Themes[theme];

  return (
    <>
      <div
        className="container-fluid m-0 p-0 home-wrapper light-mode"
        style={currentTheme}
      >
        <div>
          {/* ----------------------------- Sidebar Wrapper -----------------------------  */}
          <aside
            id="sidebarMenu"
            tabIndex="-1"
            className={classNames(
              "sidebar-wrapper mb-0",
              isMobile ? onMobileSidebarClass : onDesktopSidebarClass
            )}
          >
            <SidebarContent hideFooter={isMobile} className="offcanvas-body" />
          </aside>

          {/* --------------------- Navigation Bar when in mobile ----------------------  */}
          {isMobile && (
            <nav className="fixed-bottom p-0">
              <SidebarFooter
                menuButton={
                  <Link
                    to="#open"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sidebarMenu"
                    aria-controls="sidebarMenu"
                  >
                    <FontAwesomeIcon icon={faList} />
                  </Link>
                }
              />
            </nav>
          )}

          {/* ----------------------------- Viewport Wrapper ----------------------------- */}
          <main
            className={classNames(
              "p-0 pt-2 pb-5 pb-md-1",
              isMobile ? onMobileViewportClass : onDesktopViewportClass
            )}
            style={{ height: "100vh", minHeight: "100vh" }}
          >
            <Viewport />

            <ToastyWrapper />
          </main>
        </div>
      </div>

      {/* --------  Menus -------- */}
      <SettingsMenu />
      <NotificationsMenu />
    </>
  );
}

export default AppShell;
