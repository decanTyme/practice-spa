import "./app.css";
import { Redirect, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from "./routes/home/pages/components/spinner";
import SettingsMenu from "./routes/home/components/sidebar/footer/menus/SettingsMenu";
import Scanner from "./routes/home/pages/shop/products/components/AddProductForm/Scanner";
import ThemeProvider from "./routes/components/ThemeManager";
import ProtectedRoute from "./routes/auth/ProtectedRoute";
import NotificationsMenu from "./routes/home/components/sidebar/footer/menus/NotificationsMenu";
const Login = lazy(() => import("./routes/auth/login"));
const Home = lazy(() => import("./routes/home"));

// eslint-disable-next-line
String.prototype.capitalize = function () {
  const str = this.toString();
  return str
    .split(" ")
    .map((word) => word.replace(word.charAt(0), word.charAt(0).toUpperCase()))
    .join(" ");
};

// eslint-disable-next-line
String.prototype.truncate = function (maxLength) {
  const str = this.toString();
  return str.substring(0, maxLength) + "...";
};

// eslint-disable-next-line
Number.prototype.commaSplice = function () {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function App() {
  return (
    <Suspense fallback={<Spinner type="grow" addClass="text-danger" />}>
      <Switch>
        {/* -------------------------- Base Route --------------------------- */}
        <ProtectedRoute exact path="/" />

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
            <Scanner />
            <NotificationsMenu />
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
    </Suspense>
  );
}

export default App;
