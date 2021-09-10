import useDataService from "../../../../../../services/providers/data";

function Product(props) {
  const ds = useDataService();

  const onDelete = (itemId) => {
    ds.deleteItem(itemId);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-1">{props.name}</h5>
            <p className="fst-italic me-1 mb-1 text-success fw-lighter">
              #{props.code}
            </p>
          </div>
          <p className="card-subtitle text-muted mb-2">{props.brand}</p>
        </div>
        <p className="card-text">{props.description}</p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Class</div>
          <div>{props.class}</div>
        </li>
        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Category</div>
          <div>{props.category}</div>
        </li>
        <li className="list-group-item">
          <div className="row">
            <div className="col-6 d-inline-flex justify-content-between pe-4">
              <div>Price</div>
              <div className="fw-bolder">{props.price}</div>
            </div>
            <div className="col-6 d-inline-flex justify-content-between">
              <div>In Stock</div>
              <div className="fw-bolder">{props.inStock}</div>
            </div>
          </div>
        </li>
      </ul>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-secondary rounded-0"
          disabled={ds.isDeleting}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger rounded-0"
          onClick={() => onDelete(props._id)}
          disabled={ds.isDeleting}
        >
          Delete
        </button>
      </div>
      <div className="card-footer text-muted">Item ID: {props._id}</div>
    </div>
  );
}

export default Product;
