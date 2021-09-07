import { useEffect, useState } from "react";
import "./header.css";
import DP from "../../../../../assets/default_img.png";
import useAuthManager from "../../../../../services/providers/auth";

function SidebarHeader() {
  const auth = useAuthManager();
  const [userInfo, setUserInfo] = useState(null);
  const [isDbConnected, setDbStatus] = useState(null);

  useEffect(() => {
    auth.getDatabaseStatus().then((connection) => {
      if (connection?.auth) setDbStatus(true);
      else setDbStatus(false);
    });

    auth.fetchUserData().then((userInfo) => {
      if (userInfo) setUserInfo(userInfo);
      else setUserInfo(userInfo);
    });

    return () => {
      setUserInfo(null);
      setDbStatus(null);
    };
    // eslint-disable-next-line
  }, [auth]);

  return (
    <div className="sidebar-header">
      <div className="user-pic">
        <img className="img-responsive img-rounded" src={DP} alt="DP" />
      </div>
      <div className="user-info">
        <span className="user-name">
          {userInfo?.firstname ?? "null"}{" "}
          <strong>{userInfo?.lastname ?? "null"}</strong>
        </span>
        <span className="user-role">{userInfo?.role ?? "null"}</span>
        <span className="user-status">
          <i
            style={{
              color: !!isDbConnected
                ? isDbConnected
                  ? "#5cb85c"
                  : "red"
                : "darkorange",
            }}
            className="fa fa-circle"
          ></i>
          <span>
            {!!isDbConnected
              ? isDbConnected
                ? "Database connected"
                : "Cannot connect to database"
              : "Connecting to database"}
          </span>
        </span>
      </div>
    </div>
  );
}

export default SidebarHeader;
