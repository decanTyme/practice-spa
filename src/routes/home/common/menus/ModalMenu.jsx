function ModalMenu(props) {
  return (
    <div
      id={props.id}
      className={
        "modal" +
        (props?.fade ? " fade" : " ") +
        (props?.centered ? " modal-dialog-centered" : " ") +
        (props?.scrollable ? " modal-dialog-scrollable" : " ")
      }
      tabIndex="-1"
    >
      <div className="modal-dialog">
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