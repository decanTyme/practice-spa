import classNames from "classnames";

function ModalMenu({ children, id, fade, _static, keyboard, reference }) {
  if (!id) throw new Error("Modal menus need an id to be called.");

  return (
    <div
      id={id}
      tabIndex="-1"
      className={classNames("modal", { fade })}
      data-bs-backdrop={_static ? "static" : null}
      data-bs-keyboard={!keyboard}
      ref={reference}
    >
      {children}
    </div>
  );
}

function Dialog({ children, centered, scrollable, size }) {
  return (
    <div
      className={classNames("modal-dialog", {
        "modal-dialog-centered": centered,
        "modal-dialog-scrollable": scrollable,
        [`modal-${size}`]: size,
      })}
    >
      {children}
    </div>
  );
}

function Content({ children }) {
  return <div className="modal-content">{children}</div>;
}

function Header({ children }) {
  return <div className="modal-header">{children}</div>;
}

function Title({ children }) {
  return <h5 className="modal-title">{children}</h5>;
}

function Body({ children }) {
  return <div className="modal-body">{children}</div>;
}

function Footer({ children }) {
  return <div className="modal-footer">{children}</div>;
}

function DismissButton({ children }) {
  return (
    <button
      type="button"
      className="btn"
      data-bs-dismiss="modal"
      aria-label="Close"
    >
      {children}
    </button>
  );
}

ModalMenu.Dialog = Dialog;
ModalMenu.Content = Content;
ModalMenu.Header = Header;
ModalMenu.Title = Title;
ModalMenu.Body = Body;
ModalMenu.Footer = Footer;
ModalMenu.DismissButton = DismissButton;

export default ModalMenu;
