import "./viewport.css";
import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Dashboard from "../../pages/dashboard";
import Reports from "../../pages/reports";
import Shop from "../../pages/shop";
import ToastNotify from "../notification/Toast";
import useNotifyService from "../../../../services/providers/notification";
import Payments from "../../pages/payments";
import Documentation from "../../pages/documentation";
import Maps from "../../pages/maps";
import Drive from "../../pages/drive";
import Calendar from "../../pages/calendar";

function Viewport() {
  const { path } = useRouteMatch();
  const notifier = useNotifyService();

  return (
    <div className="viewport-wrapper">
      <Switch>
        <Route exact strict path={path}>
          <Dashboard />
        </Route>

        <Route path={`${path}/reports`}>
          <Reports />
        </Route>

        <Route path={`${path}/shop`}>
          <Shop />
        </Route>

        <Route path={`${path}/payments`}>
          <Payments />
        </Route>

        <Route path={`${path}/maps`}>
          <Maps />
        </Route>

        <Route path={`${path}/documentation`}>
          <Documentation />
        </Route>

        <Route path={`${path}/calendar`}>
          <Calendar />
        </Route>

        <Route path={`${path}/drive`}>
          <Drive />
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
