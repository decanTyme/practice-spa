function Spinner(props) {
  return (
    <span className="w-100 h-100 d-flex align-items-center justify-content-center text-center bg-transparent">
      <span
        className={
          "spinner-" + (props?.type || "border") + " " + props.addClass
        }
        role="status"
        aria-hidden={props.ariaset?.hidden || false}
      ></span>
      <span className="ps-2">
        {props.children === undefined ? "" : "   " + props.children}
      </span>
    </span>
  );
}

export default Spinner;
