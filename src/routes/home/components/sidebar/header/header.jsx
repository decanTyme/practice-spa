import { useEffect } from "react";
import "./header.css";
import DP from "../../../../../assets/default_img.png";
import { useSelector, useDispatch } from "react-redux";
import useRouter from "../../../../../services/hooks/use-router";
import { getDatabaseStatus } from "../../../../../app/state/slices/auth";
import Constants from "../../../../../app/state/slices/constants";
import {
  selectAuthDatabaseStatus,
  selectAuthState,
  selectAuthStatus,
  selectAuthUserData,
} from "../../../../../app/state/slices/auth/selectors";

function SidebarHeader() {
  const router = useRouter();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectAuthState);
  const authStatus = useSelector(selectAuthStatus);
  const userData = useSelector(selectAuthUserData);
  const database = useSelector(selectAuthDatabaseStatus);

  useEffect(() => {
    if (
      database.status === Constants.IDLE &&
      authStatus === Constants.IDLE &&
      isLoggedIn
    )
      dispatch(getDatabaseStatus());
    // eslint-disable-next-line
  }, [dispatch, router, authStatus, isLoggedIn]);

  let dbStatus, dbStatusColor;
  if (database.status === "CONNECTING" && !database.connected) {
    dbStatus = "Connecting to database";
    dbStatusColor = "darkorange";
  } else if (database.connected) {
    dbStatus = "Database connected";
    dbStatusColor = "#5cb85c";
  } else if (!database.connected) {
    dbStatus = "Cannot connect to database";
    dbStatusColor = "red";
  }

  return (
    <div className="sidebar-header">
      <div className="user-pic">
        <img className="img-responsive img-rounded" src={DP} alt="DP" />
      </div>
      <div className="user-info">
        <span className="user-name">
          {userData.firstname ?? "null"}{" "}
          <strong>{userData.lastname ?? "null"}</strong>
        </span>
        <span className="user-role">{userData.role ?? "null"}</span>
        <span className="user-status">
          <i
            style={{
              color: dbStatusColor,
            }}
            className="fa fa-circle"
          ></i>
          <span>{dbStatus}</span>
        </span>
      </div>
    </div>
  );
}

export default SidebarHeader;
