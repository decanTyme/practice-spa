import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Soon from "../app/pages/components/ComingSoon";

function Drive() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/google`}>
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

export default Drive;
