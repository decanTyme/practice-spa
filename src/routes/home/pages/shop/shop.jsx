import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Soon from "../../../coming-soon";
import DataService from "../../../components/DataService";
import Products from "./products/wrapper";

function Shop() {
  const { url } = useRouteMatch();

  return (
    <DataService>
      <Switch>
        <Route path={url + "/products"}>
          <Products />
        </Route>
        <Route path={url + "/orders"}>
          <Soon />
        </Route>
        <Route path={url + "/customers"}>
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
