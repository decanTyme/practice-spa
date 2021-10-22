import { forwardRef } from "react";
import Spinner from "./spinner";

function SpinnerButton(props, ref) {
  return (
    <button
      onClick={props.onClick}
      className={props.className || "btn"}
      data-key={props.itemId}
      type={props.type}
      disabled={props.disabled}
      role={props.role}
      ref={ref}
    >
      {props.isLoading ? (
        <Spinner addClass="spinner-border-sm">{props.children}</Spinner>
      ) : (
        props.children
      )}
    </button>
  );
}

export default forwardRef(SpinnerButton);
