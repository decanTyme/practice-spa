import "./home.css";
import { isMobile } from "react-device-detect";
import Viewport from "./components/viewport/viewport";
import Sidebar from "./components/sidebar/";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import SidebarFooter from "./components/sidebar/footer/footer";
import useThemeProvider from "../../services/providers/theme";
import NotificationService from "../components/NotificationService";
import Themes from "../../themes";

const onDesktopSidebarClass = "col-sm-5 col-md-4 col-lg-3 col-xl-2 ";
const onMobileSidebarClass = "offcanvas offcanvas-start ";
const onDesktopViewportClass =
  "col-sm-7 col-md-8 ms-sm-auto mb-md-3 col-lg-9 col-xl-10 ";
const onMobileViewportClass = "";

function Home(props) {
  const { theme } = useThemeProvider();
  const currentTheme = Themes[theme];

  return (
    <NotificationService>
      <div
        className={"container-fluid w-100 m-0 p-0 home-wrapper light-mode"}
        style={currentTheme}
      >
        <div className="w-100 ms-0 row">
          {/* ----------------------------- Sidebar Wrapper -----------------------------  */}
          <aside
            id="sidebarMenu"
            tabIndex="-1"
            className={
              (isMobile ? onMobileSidebarClass : onDesktopSidebarClass) +
              "sidebar-wrapper mb-0"
            }
          >
            <Sidebar
              logout={props.logout}
              hideFooter={isMobile}
              className="offcanvas-body"
            />
          </aside>

          {/* --------------------- Navigation Bar when in mobile ----------------------  */}
          <nav className="fixed-bottom w-100 p-0" hidden={!isMobile}>
            <SidebarFooter
              logout={props.logout}
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

          {/* ----------------------------- Viewport Wrapper ----------------------------- */}
          <main
            className={
              (isMobile ? onMobileViewportClass : onDesktopViewportClass) +
              "p-0 pb-5 pb-md-1 mt-3"
            }
          >
            <Viewport />
          </main>
        </div>
      </div>
    </NotificationService>
  );
}

export default Home;
