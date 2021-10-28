import { Route, Switch, Redirect, useRouteMatch } from "react-router-dom";
import Soon from "../app/pages/components/ComingSoon";
import { Suspense, lazy } from "react";
import Spinner from "../app/pages/common/Spinner";

const Products = lazy(() =>
  import("../app/pages/home/pages/shop/pages/products/views/ProductsWrapper")
);
const Customers = lazy(() =>
  import("../app/pages/home/pages/shop/pages/customers/views/CustomersWrapper")
);

function Shop() {
  const { path } = useRouteMatch();

  return (
    <Suspense fallback={<Spinner type="grow">Loading...</Spinner>}>
      <Switch>
        <Route path={`${path}/products`}>
          <Products />
        </Route>
        <Route path={`${path}/orders`}>
          <Soon />
        </Route>
        <Route path={`${path}/customers`}>
          <Customers />
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

export default Shop;
