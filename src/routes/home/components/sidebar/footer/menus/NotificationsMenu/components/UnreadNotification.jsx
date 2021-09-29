import { formatDistanceToNow, parseISO } from "date-fns";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { read } from "../../../../../../../../app/state/slices/notification";
import useOnScreen from "../../../../../../../../services/hooks/use-on-screen";
import { determineMargin, toastStyle } from "../utils";

function UnreadNotification({
  unfilteredLength,
  data: { id, date, type, title, message },
  index: i,
}) {
  const dispatch = useDispatch();

  const ref = useRef();

  const isVisible = useOnScreen(ref && ref);

  useEffect(() => {
    const allRead = () => {
      isVisible && dispatch(read(id));
    };

    return () => allRead();
  });

  return (
    <div
      key={id}
      className={"card " + determineMargin(unfilteredLength, i, 2)}
      ref={ref}
    >
      <div className="card-body" style={{ fontSize: "0.925rem" }}>
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 fw-bolder">
            {title}
            <span className="badge rounded-pill bg-success ms-2 opacity-75">
              New
            </span>
          </p>
          <p className={"me-1 mb-1 " + toastStyle(type)}>{type}</p>
        </div>
        <p className="card-subtitle mb-2 text-muted fst-italic">
          {formatDistanceToNow(parseISO(date))} ago
        </p>
        <p className="card-text">{message}</p>
      </div>
    </div>
  );
}

export default UnreadNotification;
