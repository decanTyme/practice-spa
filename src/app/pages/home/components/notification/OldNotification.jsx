import classNames from "classnames";
import { formatDistanceToNow, parseISO } from "date-fns";
import { determineMargin, toastStyle } from "./utils";

function OldNotification({
  unfilteredLength,
  data: { id, date, type, title, message },
  index: i,
}) {
  return (
    <div key={id} className={"card " + determineMargin(unfilteredLength, i, 2)}>
      <a
        className="card-body text-decoration-none py-2 text-black"
        href={`#_${id}`}
        role="button"
        data-bs-toggle="collapse"
        aria-expanded="false"
        aria-controls={`_${id}`}
        style={{ fontSize: "0.925rem" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bolder text-muted">{title}</h6>

          <p className={"mb-auto " + toastStyle(type)}>{type}</p>
        </div>
        <div className="collapse" id={`_${id}`}>
          <p
            className={classNames("card-subtitle text-muted fst-italic", {
              "mb-2": message,
            })}
            style={{ marginTop: "0.14rem" }}
          >
            {formatDistanceToNow(parseISO(date))} ago
          </p>
          {message && (
            <p className="card-text text-muted mb-1 mt-3">{message}</p>
          )}
        </div>
      </a>
    </div>
  );
}

export default OldNotification;
