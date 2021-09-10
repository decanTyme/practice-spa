import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./index.css";
import { BrowserRouter, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import NotFound from "./routes/404";
import App from "./app";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/" keyLength={15}>
      <Route
        render={({ location }) =>
          location.state?.is404 ? <NotFound /> : <App />
        }
      />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
