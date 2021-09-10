import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Soon from "../../../ComingSoon";
import DataService from "../../../components/DataService";
import Products from "./products/wrapper";

function Shop() {
  const { path } = useRouteMatch();

  return (
    <DataService>
      <Switch>
        <Route path={`${path}/products`}>
          <Products />
        </Route>
        <Route path={`${path}/orders`}>
          <Soon />
        </Route>
        <Route path={`${path}/customers`}>
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
    </DataService>
  );
}

export default Shop;
