function Modal(props) {
  return (
    <div
      id={props.id}
      className={
        "modal" +
        (props?.fade ? " fade" : " ") +
        (props?.centered ? " modal-dialog-centered" : " ") +
        (props?.scrollable ? " modal-dialog-scrollable" : " ")
      }
      data-bs-backdrop={props?.static ? "static" : null}
      tabIndex="-1"
    >
      <div
        className={
          "modal-dialog" +
          (props?.size?.fullscreen ? " modal-fullscreen" : " ") +
          (props?.size?.modifier ? props.size.modifier : " ")
        }
      >
        <div className="modal-content" style={props?.themeMode}>
          <div className="modal-header d-flex align-items-center">
            <h5 className="modal-title">{props.title}</h5>
            {props?.headerBtn}
            {props?.addCloseBtn ? (
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            ) : (
              ""
            )}
          </div>

          <div className="modal-body">{props.body}</div>

          <div className="modal-footer">
            {props?.footer}
            {props.dismissBtn}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
