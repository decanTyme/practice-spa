import logo from "../../../../assets/logo_btph_bg_removed.png";
function ToastNotify(props) {
  return (
    <div
      className={
        "position-fixed bottom-0 end-0 pb-4 mb-4 me-2 p-lg-2 m-lg-1 mb-lg-3" +
        props.className
      }
      style={{ zIndex: 11 }}
    >
      <div
        id={props.id}
        className="toast fade hide"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ width: "96vw", maxWidth: 400 }}
      >
        <div className="toast-header">
          <img
            src={logo}
            height={32}
            className="rounded me-2"
            alt="BTPH Logo"
          />
          <strong className="me-auto">{props?.title}</strong>
          <small>A few moments ago</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">{props?.message}</div>
      </div>
    </div>
  );
}

export default ToastNotify;
