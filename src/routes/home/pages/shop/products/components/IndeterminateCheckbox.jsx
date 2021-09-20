import { forwardRef, useRef, useEffect } from "react";

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, props, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div className={rest.label ? "form-check" : null}>
        <input
          className="form-check-input"
          type="checkbox"
          ref={resolvedRef}
          {...rest}
        />
        {rest.label ? (
          <label className="form-check-label">{rest.label}</label>
        ) : null}
      </div>
    );
  }
);

export default IndeterminateCheckbox;
