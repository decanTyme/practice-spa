import { Toast } from "bootstrap";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";
import { seen } from "../../../../app/state/slices/notification";
import logo from "../../../../assets/logo_btph_bg_removed.png";

function Toasty({ data: { id, type, date, timeout, title, message } }) {
  const dispatch = useDispatch();

  const toastRef = document.getElementById(id);
  const thisToast = useMemo(
    () => toastRef && new Toast(toastRef, { autohide: false }),
    [toastRef]
  );

  const toastStyle = (() => {
    switch (type) {
      case Constants.NotifyService.INFO:
        return "";

      case Constants.NotifyService.ALERT:
        return "bg-warning border-warning text-white";

      case Constants.NotifyService.ERROR:
        return "bg-danger border-danger text-white";

      default:
        return "";
    }
  })();

  const dismissBtnStyle = (() => {
    switch (type) {
      case Constants.NotifyService.INFO:
        return "";

      case Constants.NotifyService.ALERT:
        return "";

      case Constants.NotifyService.ERROR:
        return "";

      default:
        return "";
    }
  })();

  useEffect(() => {
    thisToast?.show();
  }, [dispatch, thisToast]);

  useEffect(() => {
    const __timeout = setTimeout(() => {
      thisToast?.hide();

      setTimeout(() => {
        thisToast?.dispose();
        dispatch(seen());
      }, 200);
    }, timeout);

    return () => {
      clearTimeout(__timeout);
    };
  }, [dispatch, id, thisToast, timeout]);

  return (
    <div
      id={id}
      className={"toast fade " + toastStyle}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ width: "96vw", maxWidth: 400 }}
    >
      <div className="toast-header">
        <img src={logo} height={32} className="rounded me-2" alt="BTPH Logo" />
        <strong className="me-auto">{title}</strong>
          <small>{formatDistanceToNow(parseISO(date))} ago</small>
        <small>{formatDistanceToNow(date)}</small>
        <button
          type="button"
          className={"btn-close " + dismissBtnStyle}
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}

export default Toasty;
