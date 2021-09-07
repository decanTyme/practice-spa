import "./viewport.css";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import NotFoundPage from "../../../404";
import Dashboard from "../../pages/dashboard/dashboard";
import Reports from "../../pages/reports/reports";
import Shop from "../../pages/shop/shop";

function Viewport() {
  const { path } = useRouteMatch();

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
    </div>
  );
}

export default Viewport;
