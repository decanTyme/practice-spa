import classNames from "classnames";

function Card({ children, className }) {
  return (
    <div className={"card " + (className ? " " + className : "")}>
      {children}
    </div>
  );
}

function Body({ children, className }) {
  return (
    <div className={"card-body" + (className ? " " + className : "")}>
      {children}
    </div>
  );
}

function Title({ children, h6, className }) {
  if (h6)
    return (
      <h6 className={"card-title mb-1" + (className ? " " + className : "")}>
        {children}
      </h6>
    );

  return (
    <h5 className={"card-title mb-1" + (className ? " " + className : "")}>
      {children}
    </h5>
  );
}

function SubTitle({ children, className }) {
  return (
    <p
      className={
        "card-subtitle text-muted mb-2" + (className ? " " + className : "")
      }
    >
      {children}
    </p>
  );
}

function Text({ children, className }) {
  return (
    <p className={"card-text" + (className ? " " + className : "")}>
      {children}
    </p>
  );
}

function Footer({ children, className }) {
  return (
    <div
      className={"card-footer text-muted" + (className ? " " + className : "")}
    >
      {children}
    </div>
  );
}

function ListGroup({ children, id, flush = false, className }) {
  return (
    <ul
      id={id}
      className={classNames(
        "list-group",
        { "list-group-flush": flush },
        className ? " " + className : ""
      )}
    >
      {children}
    </ul>
  );
}

function ListGroupItem({ children, className }) {
  return (
    <li className={"list-group-item" + (className ? " " + className : "")}>
      {children}
    </li>
  );
}

Card.Body = Body;
Card.Title = Title;
Card.SubTitle = SubTitle;
Card.Text = Text;
Card.Footer = Footer;
Card.ListGroup = ListGroup;
Card.ListGroupItem = ListGroupItem;

export default Card;
