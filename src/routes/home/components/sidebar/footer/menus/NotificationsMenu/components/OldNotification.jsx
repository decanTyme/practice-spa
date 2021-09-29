import { formatDistanceToNow } from "date-fns";
import { determineMargin, toastStyle } from "../utils";

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
          <h6 className="mt-1 mb-1 fw-bolder text-muted">{title}</h6>

          <p className={"me-1 mb-0 " + toastStyle(type)}>{type}</p>
        </div>
        <div className="collapse" id={`_${id}`}>
          <p
            className={
              "card-subtitle text-muted fst-italic " +
              (noHeader ? "mb-1" : "mb-2 ")
            }
          >
            {formatDistanceToNow(parseISO(date))} ago
          </p>
          <p className="card-text text-muted">{message}</p>
        </div>
      </a>
    </div>
  );
}

export default OldNotification;
