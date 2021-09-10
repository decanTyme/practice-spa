import "./viewport.css";
import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Dashboard from "../../pages/dashboard";
import Reports from "../../pages/reports";
import Shop from "../../pages/shop";
import ToastNotify from "../toast/NotificationToast";
import useNotifyService from "../../../../services/providers/notification";

function Viewport() {
  const { path } = useRouteMatch();
  const notifier = useNotifyService();

  return (
    <div className="viewport-wrapper">
      <Switch>
        <Route exact strict path={path}>
          <Dashboard />
        </Route>
        <Route path={path + "/reports"}>
          <Reports />
        </Route>
        <Route path={path + "/shop"}>
          <Shop />
        </Route>

        {/* ------------------------- 404 Not Found ------------------------- */}
        <Route
          component={({ location }) => (
            <Redirect
              to={Object.assign({}, location, { state: { is404: true } })}
            />
          )}
        />
      </Switch>

      <ToastNotify
        id="notifier"
        title={notifier?.data?.title}
        message={notifier?.data?.message}
      />
    </div>
  );
}

export default Viewport;
