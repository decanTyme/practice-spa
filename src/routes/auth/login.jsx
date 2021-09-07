import "./login.css";
import { Tooltip } from "bootstrap";
import logo from "../../assets/default_img.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../home/pages/components/alert";
import useAuthManager from "../../services/providers/auth";
import useRouter from "../../services/hooks/use-router";

/**
 * Login page of BodyTalks.PH Inventory Management System.
 */
function Login() {
  const auth = useAuthManager();
  const router = useRouter();

  /* States */
  const [credentials, setCredentials] = useState(initStateCreds);
  const [error, setError] = useState(initStateErr);
  const [isSubmitting, setOnSubmitStatus] = useState(false);

  /* Credential Managers */
  const handleInputChange = inputManager(setCredentials, credentials);
  const onSubmit = submitHandler(auth, credentials, router, setOnSubmitStatus, [
    error,
    setError,
  ]);

  useEffect(() => {
    if (router.state?.reAuth) {
      setError({ hasError: true, message: router.state?.message });
    }
  }, [router]);

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });

    return () => {
      tooltipList.forEach((tooltip) => {
        tooltip.dispose();
      });
    };
  }, []);

  return (
    <div className="h-100 d-flex">
      <div className="text-center form-signin">
        <form onSubmit={onSubmit}>
          <img
            src={logo}
            className="mb-4"
            alt="BodyTalks.PH Logo"
            width="72"
            height="72"
          />
          <h1 className="h3 mb-3 fw-normal">Please Log In</h1>
          <div className="form-floating">
            {/* ------ Username Input ------ */}
            <input
              required
              id="usernameInput"
              type="text"
              name="username"
              placeholder="Username"
              className="form-control"
              value={credentials.username}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoComplete="username"
            />
            <label htmlFor="usernameInput">Username</label>
          </div>
          <div className="form-floating">
            {/* ------ Password Input ------ */}
            <input
              required
              id="passwordInput"
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={credentials.password}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <label htmlFor="passwordInput">Password</label>
          </div>
          {/* ---------- Remember User Checkbox ---------- */}
          <div className="checkbox mb-3">
            <label
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Don't check unless you are using a personal device!"
            >
              <input
                type="checkbox"
                className="form-check-input"
                name="rememberUser"
                checked={credentials.rememberUser}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              Remember me
            </label>
          </div>
          {/* --------------- Submit button --------------- */}
          <button
            type="submit"
            className="w-100 mb-1 btn btn-lg btn-secondary"
            disabled={isSubmitting}
          >
            Submit
          </button>

          {/* --------------------- Link to password recovery --------------------- */}
          <Link
            to={
              "/forgot?" +
              new URLSearchParams({ cslid: null, tag: "UNDER_DEVELOPMENT" })
            }
            className="text-decoration-none link-secondary"
          >
            Forgot password?
          </Link>

          {/* ---------------- Alert the user if there is an error ----------------- */}
          <div
            className={
              "fade " + (error.hasError ? "show visible" : "invisible")
            }
          >
            <Alert message={error.message} />
          </div>

          <p className="mt-5 pt-3 text-muted">
            Copyright 2021 &copy; BodyTalks.PH
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

/**
 * Initial values on page load.
 *
 * @version 0.0.4
 */
const initStateCreds = {
  username: "",
  password: "",
  rememberUser: false,
};

/**
 * Initial error values.
 *
 * @version 0.0.3
 */
const initStateErr = { hasError: false, message: "null" };

/**
 * Handles the submission process during login.
 *
 * @param {*} authManager         An Authentication Manager used to get the authentication status from server.
 * @param {*} credentials         The set of credentials that are to be sent to the server for authentication.
 * @param {*} setOnSubmitStatus   A state hook to set the current submit status.
 * @param {*} error               The values from a state hook that contains the errors received from server.
 * @param {*} setError            A state hook to set errors received from the server.
 * @param {*} router              A router hook containing the methods for page redirection and its current state.
 * @returns                       An async submit handler function.
 *
 * @version 0.2.4
 * @since 0.0.9
 */
function submitHandler(
  authManager,
  credentials,
  router,
  setOnSubmitStatus,
  [error, setError]
) {
  return async (e) => {
    e.preventDefault();

    setError({ hasError: false, message: error.message });
    setOnSubmitStatus(true);

    const location = router.state?.from?.pathname ?? "/dashboard";

    authManager
      .signIn(credentials)
      .then((response) => {
        if (response.error instanceof TypeError)
          throw new Error("Please check your connection.");
        else if (response?.error) throw new Error(response.error);
        router.replace(location);
      })
      .catch((error) => {
        setError({ hasError: true, message: error.message });
      })
      .finally(() => setOnSubmitStatus(false));
  };
}

/**
 * Handles all input from all fields on this page.
 *
 * @param setCredentials  A React state hook to set the credentials received from the user input.
 * @param credentials     The values from a React state hook that contains the credentials.
 *
 * @version 0.1.6
 * @since 0.0.9
 */
function inputManager(setCredentials, credentials) {
  return (e) => {
    const name = e.target.name,
      value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setCredentials({
      username: name === "username" ? value : credentials.username,
      password: name === "password" ? value : credentials.password,
      rememberUser: name === "rememberUser" ? value : credentials.rememberUser,
    });
  };
}
