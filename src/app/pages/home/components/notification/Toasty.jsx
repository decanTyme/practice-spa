import { Toast } from "bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";
import { seen } from "../../../../state/slices/notification";
import logo from "../../../../../assets/logo_btph_bg_removed.png";
import { determineDismissBtnStyle, determineToastStyle } from "./utils";

function Toasty({ data: { id, autohide, type, date, delay, title, message } }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const thisToastElement = document.getElementById(id);

    // Immediately show the notification
    Toast.getOrCreateInstance(thisToastElement, { autohide, delay }).show();

    // Once the notification is fully hidden,
    // mark the notification as "seen"
    thisToastElement.addEventListener(
      "hidden.bs.toast",
      () => dispatch(seen(id)),
      { once: true }
    );
  }, [dispatch, id, autohide, delay]);

  return (
    <div
      id={id}
      className={"toast fade " + determineToastStyle(type)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ width: "92vw", maxWidth: 420 }}
    >
      {!message ? (
        <div className="d-flex">
          <div className="toast-body">{title}</div>
          <button
            type="button"
            className={
              "btn-close me-2 m-auto " + determineDismissBtnStyle(type)
            }
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => {
              dispatch(seen(id));
            }}
          ></button>
        </div>
      ) : (
        <>
          <div className="toast-header">
            <img
              src={logo}
              height={32}
              className="rounded me-2"
              alt="BTPH Logo"
            />
            <strong className="me-auto">{title}</strong>
            <small>{formatDistanceToNow(parseISO(date))} ago</small>
            <button
              type="button"
              className={"btn-close " + determineDismissBtnStyle(type)}
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => {
                dispatch(seen(id));
              }}
            ></button>
          </div>
          <div className="toast-body">{message}</div>
        </>
      )}
    </div>
  );
}

export default Toasty;
