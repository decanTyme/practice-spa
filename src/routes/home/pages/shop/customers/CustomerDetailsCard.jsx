// import placeholderCustomerImg from "../../../../../assets/placeholder_customer_image.png";

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
            <h5 className="flex-fill mb-1">{`${customerDetails.lastname}, ${customerDetails.firstname}`}</h5>
            <p className="card-subtitle text-muted text-capitalize">
              {customerDetails._type}
            </p>
          </div>
          <div>
            <img
              src={customerDetails.displayPic}
              width="72"
              className="img-thumbnail"
              alt={customerDetails.name}
            />
          </div>
        </div>
      </div>

      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex justify-content-between">
          <div>Contact Numbers</div>
          <div>
            {customerDetails.contacts.map(({ _id, telcom, number }) => (
              <div key={_id} className="d-flex">
                <div className="text-muted">{telcom}</div>
                <span className="mx-2">•</span>
                <div>{number}</div>
                {/* <i className="fas fa-copy text-muted ms-2 d-flex align-items-center" /> */}
              </div>
            ))}
          </div>
        </li>
        <li className="list-group-item">
          <div className="row">
            <div className="col-3">Address</div>
            <div className="col">
              {Object.entries(customerDetails.address)
                .filter(([key]) => key !== "postcode")
                .map(([label, value]) => (
                  <div key={label} className="d-flex justify-content-between">
                    <div className="text-capitalize">{label}</div>
                    <div>{value}</div>
                  </div>
                ))}
            </div>
          </div>
        </li>

        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Postal Code</div>
          <div>{customerDetails.address.postcode}</div>
        </li>
        <li className="list-group-item d-inline-flex justify-content-between">
          <div>Designation</div>
          <div>{customerDetails.designation || "N/A"}</div>
        </li>
        <li className="list-group-item">
          <div className="row">
            <div className="col-4 d-inline-flex justify-content-between pe-4">
              <div>Debt</div>
              <div className="fw-bolder">{customerDetails.debt}</div>
            </div>
            <div className="col-8 d-inline-flex justify-content-between">
              <div>Total Purchased Products</div>
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
