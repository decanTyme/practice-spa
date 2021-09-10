import "./app.css";
import { Redirect, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from "./routes/home/pages/components/spinner";
import SettingsMenu from "./routes/home/components/sidebar/footer/menus/SettingsMenu";
import Scanner from "./routes/home/pages/shop/products/components/AddProductForm/Scanner";
import AuthManager from "./routes/components/AuthManager";
import ThemeProvider from "./routes/components/ThemeManager";
import ProtectedRoute from "./routes/auth/ProtectedRoute";
const Login = lazy(() => import("./routes/auth/login"));
const Home = lazy(() => import("./routes/home"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthManager>
        <Switch>
          {/* -------------------------- Base Route --------------------------- */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

          {/* -------------------------- Login Page --------------------------- */}
          <ProtectedRoute path="/login">
            <Login />
          </ProtectedRoute>

          {/* --------------------------- Dashboard --------------------------- */}
          <ProtectedRoute path="/dashboard">
            <ThemeProvider>
              <Home />

              {/* ----------------  Modals ---------------- */}
              <SettingsMenu />
              <Scanner id="addProductScannerModal" />
            </ThemeProvider>
          </ProtectedRoute>

          {/* ------------------------- 404 Not Found ------------------------- */}
          <Route
            component={({ location }) => (
              <Redirect
                to={Object.assign({}, location, { state: { is404: true } })}
              />
            )}
          />
        </Switch>
      </AuthManager>
    </Suspense>
  );
}

export default App;
