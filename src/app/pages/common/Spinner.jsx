import classNames from "classnames";

function Spinner({
  children,
  type = "border",
  size,
  color,
  position = "left",
  addClass,
}) {
  return (
    <div
      className="w-100 h-100 d-flex align-items-center justify-content-center text-center bg-transparent"
      style={{ height: "100vh" }}
    >
      <span
        className={classNames(
          `spinner-${type}`,
          size ? `spinner-${type}-${size}` : null,
          color,
          addClass,
          { "me-2": position === "left" && children }
        )}
        role="status"
      />
      {children}
    </div>
  );
}

export default Spinner;
