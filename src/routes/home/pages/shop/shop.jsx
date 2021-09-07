import { Route, Switch, useRouteMatch } from "react-router-dom";
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
    </Switch>
  );
}

export default Shop;
