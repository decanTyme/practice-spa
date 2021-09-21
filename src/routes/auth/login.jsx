import "./login.css";
import logo from "../../assets/logo_btph_bg_removed.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "bootstrap";
import Alert from "../home/pages/components/alert";
import {
  Constants,
  selectAuthCurrentState,
  setStatus,
  signIn,
} from "../../app/state/slices/auth";

/**
 * Login page of BodyTalks.PH Inventory Management System.
 */
function Login() {
  const dispatch = useDispatch();

  const state = useSelector(selectAuthCurrentState);

  /* States */
  const [credentials, setCredentials] = useState(INIT_STATE_CREDENTIALS);

  /* Credential Managers */
  const handleInputChange = inputManager(setCredentials, credentials);
  const handleSubmit = submitHandler(signIn, credentials, dispatch);

  useEffect(() => {
    dispatch(setStatus(Constants.IDLE));
  }, [dispatch]);

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
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
        <form onSubmit={handleSubmit}>
          <img
            src={logo}
            className="mb-4"
            alt="BodyTalks.PH Logo"
            width="192"
            height="192"
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
              disabled={state.status === Constants.Auth.SIGNING_IN}
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
              disabled={state.status === Constants.Auth.SIGNING_IN}
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
                disabled={state.status === Constants.Auth.SIGNING_IN}
              />
              Remember me
            </label>
          </div>
          {/* --------------- Submit button --------------- */}
          <button
            type="submit"
            className="w-100 mb-1 btn btn-lg btn-secondary"
            disabled={state.status === Constants.Auth.SIGNING_IN}
          >
            Submit
          </button>

          {/* --------------------- Link to password recovery --------------------- */}
          <Link
            to={
              "/forgot?" +
              new URLSearchParams({ clsid: null, tag: "UNDER_DEVELOPMENT" })
            }
            className="text-decoration-none link-secondary"
          >
            Forgot password?
          </Link>

          {/* ---------------- Alert the user if there is an error ----------------- */}
          <div
            className={"fade " + (state.error ? "show visible" : "invisible")}
          >
            <Alert message={state.error || "ERROR_NONE"} />
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
const INIT_STATE_CREDENTIALS = {
  username: "",
  password: "",
  rememberUser: false,
};

/**
 * Handles the submission process during login.
 *
 * @param {*} signIn        An Authentication Manager action creator used to get the authentication status from server.
 * @param {*} credentials   The set of credentials that are to be sent to the server for authentication.
 * @param {*} dispatch      A Redux store dispatch function.
 * @returns                 A submit handler function.
 *
 * @version 0.2.7
 * @since 0.0.9
 */
function submitHandler(signIn, credentials, dispatch) {
  return async (e) => {
    e.preventDefault();

    dispatch(signIn(credentials));
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
