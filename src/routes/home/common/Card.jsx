function Card({
  children,
  className = "",
  title = null,
  customTitle,
  subTitle,
  listGroupItems = null,
  nonBodyChilden = null,
}) {
  return (
    <div className={"card " + className}>
      <div className="card-body">
        {title ? <h5 className="card-title mb-1">{title}</h5> : null}
        {customTitle && customTitle}
        {subTitle ? (
          <p className="card-subtitle text-muted mb-2">{subTitle}</p>
        ) : null}

        {children}
      </div>
      {nonBodyChilden}
      {listGroupItems ? (
        <ul className="list-group list-group-flush">{listGroupItems}</ul>
      ) : null}
    </div>
  );
}

export default Card;
