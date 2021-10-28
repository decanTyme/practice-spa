import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Soon from "../app/pages/components/ComingSoon";

function Documentation() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/help`}>
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

export default Documentation;
