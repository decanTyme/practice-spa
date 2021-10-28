import classNames from "classnames";

function Container({ children, fluid, className }) {
  fluid = fluid ? "-fluid" : "";

  return (
    <div className={classNames(`container${fluid}`, className)}>{children}</div>
  );
}

function Row({ children, section, g: gutter, className }) {
  gutter = gutter ? `g-${gutter}` : "";

  if (section)
    return (
      <section className={classNames("row", gutter, className)}>
        {children}
      </section>
    );

  return <div className={classNames("row", gutter, className)}>{children}</div>;
}

function Col({ children, aside, modifier, columns, className }) {
  modifier = modifier ? `-${modifier}` : "";
  columns = columns ? `-${columns}` : "";

  if (aside)
    return (
      <aside className={classNames(`col${modifier}${columns}`, className)}>
        {children}
      </aside>
    );

  return (
    <div className={classNames(`col${modifier}${columns}`, className)}>
      {children}
    </div>
  );
}

Container.Row = Row;
Container.Col = Col;

export default Container;
