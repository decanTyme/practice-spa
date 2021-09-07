function Product(props) {
  const removeProduct = (item) => {};

  return (
    <div className="card my-1">
      <div className="card-body">
        <div className="card-title">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-1">{props.name}</h5>
            <p className="fst-italic me-1 mb-1 text-success fw-lighter">
              #{props.code}
            </p>
          </div>
          <p className="card-subtitle text-muted mb-2">Php{props.price}</p>
        </div>
        <p className="card-text">{props.description}</p>
      </div>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button type="button" className="btn btn-secondary rounded-0">
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger rounded-0"
          onClick={() => removeProduct(props._id)}
        >
          Delete
        </button>
      </div>
      <div className="card-footer text-muted">ID: {props._id}</div>
    </div>
  );
}

export default Product;
