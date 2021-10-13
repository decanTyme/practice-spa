// import placeholderCustomerImg from "../../../../../assets/placeholder_customer_image.png";
import Card from "../../../common/Card";
import Container from "../../../common/Container";

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
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="flex-fill mb-1">{`${customerDetails.lastname}, ${customerDetails.firstname}`}</h5>
            <Card.SubTitle className="text-capitalize">
              {customerDetails._type}
            </Card.SubTitle>
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
      </Card.Body>

      <Card.ListGroup flush>
        <Card.ListGroupItem className="d-inline-flex justify-content-between">
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
        </Card.ListGroupItem>

        <Card.ListGroupItem>
          <Container.Row>
            <Container.Col columns="3">Address</Container.Col>
            <Container.Col>
              {Object.entries(customerDetails.address)
                .filter(([key]) => key !== "postcode")
                .map(([label, value]) => (
                  <div key={label} className="d-flex justify-content-between">
                    <div className="text-capitalize">{label}</div>
                    <div>{value}</div>
                  </div>
                ))}
            </Container.Col>
          </Container.Row>
        </Card.ListGroupItem>

        <Card.ListGroupItem className="d-inline-flex justify-content-between">
          <div>Postal Code</div>
          <div>{customerDetails.address.postcode}</div>
        </Card.ListGroupItem>

        <Card.ListGroupItem className="d-inline-flex justify-content-between">
          <div>Designation</div>
          <div>{customerDetails.designation || "N/A"}</div>
        </Card.ListGroupItem>

        <Card.ListGroupItem>
          <Container.Row>
            <Container.Col
              columns="4"
              className="d-inline-flex justify-content-between pe-4"
            >
              <div>Debt</div>
              <div className="fw-bolder">{customerDetails.debt}</div>
            </Container.Col>
            <Container.Col
              columns="8"
              className="d-inline-flex justify-content-between"
            >
              <div>Total Purchased Products</div>
              <div className="fw-bolder">123</div>
            </Container.Col>
          </Container.Row>
        </Card.ListGroupItem>
      </Card.ListGroup>

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
      <Card.Footer>Customer ID: {customerDetails._id}</Card.Footer>
    </Card>
  );
}

export default CustomerDetailsCard;
