import "./app.css";
import { Redirect, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from "./routes/home/pages/components/spinner";
import SettingsMenu from "./routes/home/components/sidebar/footer/menus/settings";
import Scanner from "./routes/home/pages/shop/products/components/scanner";
import AuthManager from "./routes/components/manager-auth";
import ThemeProvider from "./routes/components/manager-theme";
import ProtectedRoute from "./routes/auth/route-protected";
const Login = lazy(() => import("./routes/auth/login"));
const Home = lazy(() => import("./routes/home/wrapper"));

function App() {
  return (
    <AuthManager>
      <Switch>
        <Suspense fallback={<Spinner />}>
          {/* -------------------------- Base Route --------------------------- */}
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>

          {/* -------------------------- Login Page --------------------------- */}
          <Route path="/login">
            <Login />
          </Route>

          {/* --------------------------- Homepage ---------------------------- */}
          <ThemeProvider>
            <ProtectedRoute path="/dashboard">
              <Home />
            </ProtectedRoute>
          </ThemeProvider>
        </Suspense>
      </Switch>

      {/* ----------------  Modals ---------------- */}
      <ThemeProvider>
        <SettingsMenu />
        <Scanner id="addProductScannerModal" />
      </ThemeProvider>
    </AuthManager>
  );
}

export default App;
