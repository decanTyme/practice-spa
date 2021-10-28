import classNames from "classnames";

function Card({ children, className, ...rest }) {
  return (
    <div className={classNames("card", className)} {...rest}>
      {children}
    </div>
  );
}

function Body({ children, className, ...rest }) {
  return (
    <div className={classNames("card-body", className)} {...rest}>
      {children}
    </div>
  );
}

function Title({ children, h6, className, ...rest }) {
  if (h6)
    return (
      <h6 className={classNames("card-title mb-1", className)} {...rest}>
        {children}
      </h6>
    );

  return (
    <h5 className={classNames("card-title mb-1", className)} {...rest}>
      {children}
    </h5>
  );
}

function SubTitle({ children, className, ...rest }) {
  return (
    <p
      className={classNames("card-subtitle text-muted mb-2", className)}
      {...rest}
    >
      {children}
    </p>
  );
}

function Text({ children, className, ...rest }) {
  return (
    <p className={classNames("card-text", className)} {...rest}>
      {children}
    </p>
  );
}

function Footer({ children, className, ...rest }) {
  return (
    <div className={classNames("card-footer text-muted", className)} {...rest}>
      {children}
    </div>
  );
}

function ListGroup({ children, id, flush = false, className, ...rest }) {
  return (
    <ul
      id={id}
      className={classNames(
        "list-group",
        { "list-group-flush": flush },
        className
      )}
      {...rest}
    >
      {children}
    </ul>
  );
}

function ListGroupItem({ children, className, ...rest }) {
  return (
    <li className={classNames("list-group-item", className)} {...rest}>
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
