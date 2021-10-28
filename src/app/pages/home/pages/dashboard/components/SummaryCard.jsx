function SummaryCard(props) {
  const formatNum = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="card px-2">
      <div className="row g-0">
        <div className="col-4 d-flex align-items-center">
          <img
            src={props.icon.src}
            width={props.icon.width}
            className="img-fluid rounded-start m-auto"
            alt={props.type}
          />
        </div>
        <div className="col-8">
          <div className="card-body">
            <h6 className="card-title m-0">
              {props.isCurrency ? "Php" : null}
              {formatNum(props.data)}
            </h6>
            <p className="card-text m-0">{props.type}</p>
            <p className="card-text">
              <small className="text-muted">
                Last updated {props.lastUpdated} mins ago
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
