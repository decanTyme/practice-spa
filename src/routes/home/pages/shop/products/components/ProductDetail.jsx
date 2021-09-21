import {
  modifyData,
  removeData,
} from "../../../../../../app/state/slices/data";
import { useDispatch, useSelector } from "react-redux";
import { selectDataInEdit } from "../../../../../../app/state/slices/data";

function Product(props) {
  const dispatch = useDispatch();
  const editData = useSelector(selectDataInEdit);

  const onEditProduct = (e) => {
    if (editData?._id !== props?.product?._id)
      dispatch(modifyData(props.product));
  };

  const onRemoveProduct = () => {
    const ans = prompt(
      `Are you sure you want to delete "${props.product.name}"? \n\nType the the product name below to confirm.`
    );

    if (ans !== null && ans === props.product.name)
      dispatch(removeData(props?.product?._id));
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-1">{props.product.name}</h5>
            <p className="fst-italic me-1 mb-1 text-success fw-lighter">
              #{props.product.code}
            </p>
          </div>
          <p className="card-subtitle text-muted mb-2">{props.product.brand}</p>
        </div>
        <p className="card-text">{props.product.description}</p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Class</div>
          <div>{props.product.class}</div>
        </li>
        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Category</div>
          <div>{props.product.category}</div>
        </li>
        <li className="list-group-item">
          <div className="row">
            <div className="col-6 d-inline-flex justify-content-between pe-4">
              <div>Price</div>
              <div className="fw-bolder">{props.product.price}</div>
            </div>
            <div className="col-6 d-inline-flex justify-content-between">
              <div>In Stock</div>
              <div className="fw-bolder">{props.product.quantity}</div>
            </div>
          </div>
        </li>
      </ul>
      <div className="btn-group" role="group" aria-label="Mini options">
        <button
          type="button"
          className="btn btn-secondary rounded-0"
          onClick={onEditProduct}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger rounded-0"
          onClick={onRemoveProduct}
        >
          Delete
        </button>
      </div>
      <div className="card-footer text-muted">Item ID: {props.product._id}</div>
    </div>
  );
}

export default Product;
