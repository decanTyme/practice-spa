import { Route, Switch, useRouteMatch } from "react-router-dom";
import NotFoundPage from "../../../404";
import Soon from "../../../coming-soon";
import Products from "./products/wrapper";

function Shop() {
  const { url } = useRouteMatch();

  return (
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
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default Shop;
