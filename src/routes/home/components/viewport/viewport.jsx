import "./viewport.css";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import NotFoundPage from "../../../404";
import Dashboard from "../../pages/dashboard/dashboard";
import Reports from "../../pages/reports/reports";
import Shop from "../../pages/shop/shop";
import ToastNotify from "../Toast/NotificationToast";
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
        <Route component={NotFoundPage}></Route>
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
