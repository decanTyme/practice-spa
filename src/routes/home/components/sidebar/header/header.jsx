import { useEffect, useState } from "react";
import "./header.css";
import DP from "../../../../../assets/default_img.png";
import useAuthManager from "../../../../../services/providers/auth";
import useNotifyService from "../../../../../services/providers/notification";

function SidebarHeader() {
  const auth = useAuthManager();
  const [userInfo, setUserInfo] = useState(null);
  const [isDbConnected, setDbStatus] = useState(null);
  const notifier = useNotifyService();

  useEffect(() => {
    auth
      .getDatabaseStatus()
      .then((connection) => {
        if (connection?.auth) setDbStatus(true);
      })
      .catch(() => {
        setDbStatus(false);
        notifier.notify({
          title: "Error",
          message: "Unable to connect to the database",
        });
      });

    setUserInfo(auth.userInfo);
    // eslint-disable-next-line
  }, []);

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
