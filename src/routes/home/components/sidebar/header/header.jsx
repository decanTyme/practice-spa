import { useEffect, useState } from "react";
import "./header.css";
import DP from "../../../../../assets/default_img.png";
import useNotifyService from "../../../../../services/providers/notification";
import useAuth from "../../../../../services/hooks/use-auth";

function SidebarHeader() {
  const auth = useAuth();
  const [isDbConnected, setDbStatus] = useState(null);
  const notifier = useNotifyService();
  const state = auth.state;

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

    return () => setDbStatus(null);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="sidebar-header">
      <div className="user-pic">
        <img className="img-responsive img-rounded" src={DP} alt="DP" />
      </div>
      <div className="user-info">
        <span className="user-name">
          {state.userData.firstname ?? "null"}{" "}
          <strong>{state.userData.lastname ?? "null"}</strong>
        </span>
        <span className="user-role">{state.userData.role ?? "null"}</span>
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
