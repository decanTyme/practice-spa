import classNames from "classnames";
import { formatDistanceToNow, parseISO } from "date-fns";
import { determineMargin, toastStyle } from "../utils";

function UnreadNotification({
  unfilteredLength,
  data: { date, type, title, message },
  index: i,
}) {
  return (
    <div className={"card " + determineMargin(unfilteredLength, i, 2)}>
      <div className="card-body" style={{ fontSize: "0.925rem" }}>
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 fw-bolder">
            {title}
            <span className="badge rounded-pill bg-success ms-2 opacity-75">
              New
            </span>
          </p>
          <p className={"me-1 mb-1 ps-3 " + toastStyle(type)}>{type}</p>
        </div>
        <p
          className={classNames("card-subtitle text-muted fst-italic mb-2", {
            "mb-1": !message,
          })}
        >
          {formatDistanceToNow(parseISO(date))} ago
        </p>
        {message && <p className="card-text mb-1">{message}</p>}
      </div>
    </div>
  );
}

export default UnreadNotification;
