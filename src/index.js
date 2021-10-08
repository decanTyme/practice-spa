import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/fontawesome-free-5.15.4-web/css/all.min.css";
import "./index.css";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import NotFound from "./routes/404";
import App from "./app";
import state from "./app/state";

ReactDOM.render(
  <Provider store={state}>
    <React.StrictMode>
      <BrowserRouter basename="/" keyLength={15}>
        <Route
          render={({ location }) =>
            location.state?.is404 ? <NotFound /> : <App />
          }
        />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
