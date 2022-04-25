import { forwardRef } from "react";
import Spinner from "./Spinner";

function SpinnerButton(props, ref) {
  return (
    <button
      className={props.className || "btn"}
      data-key={props.itemId}
      ref={ref}
      {...props}
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
