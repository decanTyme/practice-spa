import { Toast } from "bootstrap";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";
import { seen } from "../../../../app/state/slices/notification";
import logo from "../../../../assets/logo_btph_bg_removed.png";
import { determineDismissBtnStyle, determineToastStyle } from "./utils";

function Toasty({
  data: { id, type, date, timeout, noHeader, title, message },
}) {
  const dispatch = useDispatch();

  const toastRef = useRef(null);

  useEffect(() => {
    const thisToast =
      toastRef.current &&
      Toast.getOrCreateInstance(toastRef.current, { autohide: false });

    thisToast?.show();

    const __timeout = setTimeout(() => {
      thisToast?.hide();

      setTimeout(() => {
        thisToast?.dispose();
        dispatch(seen());
      }, 250);
    }, timeout);

    return () => clearTimeout(__timeout);
  });

  return (
    <div
      id={id}
      className={"toast fade " + determineToastStyle(type)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ width: "92vw", maxWidth: 420 }}
      ref={toastRef}
    >
      {noHeader ? (
        <div className="d-flex">
          <div className="toast-body">{title}</div>
          <button
            type="button"
            className={
              "btn-close me-2 m-auto " + determineDismissBtnStyle(type)
            }
            data-bs-dismiss="toast"
            aria-label="Close"
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
            ></button>
          </div>
          <div className="toast-body">{message}</div>
        </>
      )}
    </div>
  );
}

export default Toasty;
