function ModalMenu(props) {
  return (
    <div
      id={props.id}
      className={"modal" + (props?.fade ? " fade" : " ")}
      tabIndex="-1"
      data-bs-backdrop={props?.static ? "static" : null}
      data-bs-keyboard={!props?.keyboard}
      ref={props?.reference}
    >
      <div
        className={
          "modal-dialog" +
          (props?.centered ? " modal-dialog-centered" : " ") +
          (props?.scrollable ? " modal-dialog-scrollable" : " ")
        }
      >
        <div className="modal-content" style={props?.themeMode}>
          <div className="modal-header">
            <h5 className="modal-title">{props.title}</h5>
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
            {props?.headerBtn}
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

export default ModalMenu;
