import "./app.css";
import { Redirect, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from "./routes/home/pages/components/spinner";
import SettingsMenu from "./routes/home/components/sidebar/footer/menus/settings";
import Scanner from "./routes/home/pages/shop/products/components/scanner";
import AuthManager from "./routes/components/manager-auth";
import ThemeProvider from "./routes/components/manager-theme";
import ProtectedRoute from "./routes/auth/route-protected";
import NotFoundPage from "./routes/404";
import Authentication from "./routes/auth/authenticate";
const Login = lazy(() => import("./routes/auth/login"));
const Home = lazy(() => import("./routes/home/wrapper"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthManager>
        <Switch>
          {/* -------------------------- Base Route --------------------------- */}
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>

          {/* -------------------------- Login Page --------------------------- */}
          <Route path="/login">
            <Login />
          </Route>

          <Route path="/authenticate">
            <Authentication />
          </Route>

          {/* --------------------------- Dashboard --------------------------- */}
          <ProtectedRoute path="/dashboard">
            <ThemeProvider>
              <Home />

              {/* ----------------  Modals ---------------- */}
              <SettingsMenu />
              <Scanner id="addProductScannerModal" />
            </ThemeProvider>
          </ProtectedRoute>
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </AuthManager>
    </Suspense>
  );
}

export default App;
