import { useState } from "react";
import Spinner from "./spinner";

function StatefulButton(props) {
  const [isLoading, setLoadingState] = useState(false);

  const btnClicked = (e) => {
    try {
      setLoadingState(true);
      props?.onStatefulClick(e).finally(() => setLoadingState(false));
    } catch (error) {}
  };

  return (
    <button
      onClick={(e) => {
        btnClicked(e);
      }}
      className={props.className}
      data-key={props?.itemId}
      type={props?.type}
      disabled={props?.disabled}
      // eslint-disable-next-line
      role={props?.role}
    >
      {isLoading ? (
        <Spinner addClass="spinner-border-sm">{props.children}</Spinner>
      ) : (
        props.children
      )}
    </button>
  );
}

export default StatefulButton;
