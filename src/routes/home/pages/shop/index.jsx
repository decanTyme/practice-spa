import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Soon from "../../../ComingSoon";
import Products from "./products/ProductsWrapper";

function Shop() {
  const { path } = useRouteMatch();

  return (
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
  );
}

export default Shop;
