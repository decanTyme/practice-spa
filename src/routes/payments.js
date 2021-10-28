import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Soon from "../app/pages/components/ComingSoon";

function Payments() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Soon />
      </Route>
      <Route path={`${path}/customer`}>
        <Soon />
      </Route>
      <Route path={`${path}/assets`}>
        <Soon />
      </Route>
      <Route path={`${path}/liabilities`}>
        <Soon />
      </Route>
      <Route path={`${path}/forms`}>
        <Soon />
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
  );
}

export default Payments;
