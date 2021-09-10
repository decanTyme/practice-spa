import { Route, Switch, Redirect, useRouteMatch } from "react-router";
import Soon from "../../../ComingSoon";

function Calendar() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
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

export default Calendar;
