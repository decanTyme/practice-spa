import { lazy } from "react";
import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Dashboard from "../app/pages/home/pages/dashboard/views/DashboardWrapper";
import Shop from "./shop";
import Payments from "./payments";
import Maps from "./maps";
import { Suspense } from "react";
import Spinner from "../app/pages/common/Spinner";

const Reports = lazy(() => import("./reports"));
const Documentation = lazy(() => import("./documentation"));
const Calendar = lazy(() => import("./calendar"));
const Drive = lazy(() => import("./drive"));

function Viewport() {
  const { path } = useRouteMatch();

  return (
    <Suspense fallback={<Spinner type="grow">Loading...</Spinner>}>
      <Switch>
        <Route strict exact path={path}>
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
    </Suspense>
  );
}

export default Viewport;
