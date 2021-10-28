import "./app.css";
import { Redirect, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./app/pages/auth/components/ProtectedRoute";
import Spinner from "./app/pages/common/Spinner";

const Login = lazy(() => import("./app/pages/auth/views/Login"));
const AppShell = lazy(() => import("./app/pages/home/AppShell"));
const ThemeProvider = lazy(() => import("./app/pages/components/ThemeManager"));

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
    <Suspense fallback={<Spinner type="grow" color="text-danger" />}>
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
            <AppShell />
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
