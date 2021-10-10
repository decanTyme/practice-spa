import { Toast } from "bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";
import { seen } from "../../../../app/state/slices/notification";
import logo from "../../../../assets/logo_btph_bg_removed.png";
import { determineDismissBtnStyle, determineToastStyle } from "./utils";

function Toasty({
  data: { id, type, date, timeout, noHeader, title, message },
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const thisToast = Toast.getOrCreateInstance(document.getElementById(id), {
      autohide: false,
    });

    thisToast?.show();

    let __timeout_;
    const __timeout = setTimeout(() => {
      thisToast?.hide();

      __timeout_ = setTimeout(() => {
        dispatch(seen(id));
      }, 300);
    }, timeout);

    return () => {
      clearTimeout(__timeout);
      clearTimeout(__timeout_);
    };
  }, [dispatch, id, timeout]);

  return (
    <div
      id={id}
      className={"toast fade " + determineToastStyle(type)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ width: "92vw", maxWidth: 420 }}
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
