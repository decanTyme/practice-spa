import placeholderCustomerImg from "../../../../../assets/placeholder_customer_image.png";

function CustomerDetailsCard({ customerDetails }) {
  const onEditProduct = (e) => {
    alert(`Sorry, we can't do that right now!`);

    // if (editData?._id !== props?.product?._id)
    //   dispatch(modifyProduct(props.product));
  };

  const onRemoveProduct = () => {
    alert(`Sorry, we can't do that right now!`);

    // prompt(
    //   `Are you sure you want to delete ""? \n\nType the the product name below to confirm.`
    // );

    // if (ans !== null && ans === props.product.name)
    //   dispatch(removeProduct(props?.product?._id));
  };
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="flex-fill mb-1">{customerDetails.name}</h5>
            <p className="card-subtitle text-muted">{customerDetails.type}</p>
          </div>
          <div>
            <img
              src={placeholderCustomerImg}
              width="72"
              className="img-thumbnail"
              alt={customerDetails.name}
            />
          </div>
        </div>
      </div>

      <ul className="list-group list-group-flush">
        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Contact Number</div>
          <div className="d-inline-flex">
            <div className="text-muted">Globe</div>
            <span className="mx-2">•</span>
            <div>{customerDetails.contact}</div>
          </div>
        </li>
        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Address</div>
          <div>{customerDetails.address}</div>
        </li>

        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Postal Code</div>
          <div>8502</div>
        </li>
        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Jurisdiction</div>
          <div>N/A</div>
        </li>
        <li className="list-group-item">
          <div className="row">
            <div className="col-6 d-inline-flex justify-content-between pe-4">
              <div>Debt</div>
              <div className="fw-bolder">{customerDetails.debt}</div>
            </div>
            <div className="col-6 d-inline-flex justify-content-between">
              <div>Assets</div>
              <div className="fw-bolder">123</div>
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
      <div className="card-footer text-muted">
        Customer ID: {customerDetails._id}
      </div>
    </div>
  );
}

export default CustomerDetailsCard;
