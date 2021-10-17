// import placeholderProductImg from "../../../../../../assets/placeholder_product_image.png";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthDatabaseStatus,
  selectAuthStaleStatus,
  selectAuthState,
} from "../../../../../../app/state/slices/auth/selectors";
import Constants from "../../../../../../app/state/slices/constants";
import {
  fetchCouriers,
  selectCourierFetchStatus,
} from "../../../../../../app/state/slices/data/courier";
import { modifyProduct } from "../../../../../../app/state/slices/data/product";
import { removeProducts as removeProduct } from "../../../../../../app/state/slices/data/product/async-thunks";
import { selectProductDetails } from "../../../../../../app/state/slices/data/product/selectors";
import Card from "../../../../common/Card";
import Container from "../../../../common/Container";
import StockMenu from "./StockMenu";

function ProductDetailsCard() {
  const dispatch = useDispatch();
  const productDetails = useSelector(selectProductDetails);

  const {
    _id,
    name,
    code,
    brand,
    description,
    _class,
    category,
    unit,
    images,
    variants,
  } = productDetails;

  const database = useSelector(selectAuthDatabaseStatus);
  const isLoggedIn = useSelector(selectAuthState);
  const stale = useSelector(selectAuthStaleStatus);

  const dataFetchStatus = useSelector(selectCourierFetchStatus);

  useEffect(() => {
    // Only fetch if either the user is logged in, not stale, or
    // Data Service is idle or has a previously failed attempt
    const timeout = setTimeout(() => {
      if (
        (dataFetchStatus === Constants.IDLE ||
          dataFetchStatus === Constants.FAILED) &&
        database.status === Constants.IDLE &&
        isLoggedIn &&
        !stale
      ) {
        dispatch(fetchCouriers());
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [dispatch, dataFetchStatus, isLoggedIn, stale, database]);

  const [variant, setVariant] = useState(variants[0]);

  const changeVariant = (e) => {
    setVariant(variants.find(({ _id }) => _id === e.target.value));
  };

  const onEditProduct = () => {
    dispatch(modifyProduct(productDetails));
  };

  const onRemoveProduct = () => {
    const ans = prompt(
      `Are you sure you want to delete "${name}"? \n\nType the the product name below to confirm.`
    );

    if (ans !== null && ans === name) dispatch(removeProduct(_id));
  };

  useEffect(() => {
    setVariant(variants.find(({ _id }) => _id === variant._id) || variants[0]);
  }, [variant._id, variants]);

  const newStocks = useMemo(
    () =>
      [
        ...variant.stocks.inbound,
        ...variant.stocks.warehouse,
        ...variant.stocks.sold,
      ]
        .filter((stock) => !stock.checked)
        .sort((a, _) => (a.checked ? 1 : -1)),
    [variant.stocks.inbound, variant.stocks.sold, variant.stocks.warehouse]
  );

  // For toggling to different stock type menus
  const [menuType, setMenuType] = useState("");

  return (
    <>
      <Card>
        <Container.Row g="0">
          <Container.Col modifier="sm" columns="4">
            {/* ---------------------- Product Images ---------------------- */}
            <div
              id="productImages"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                {images.map(({ _id, caption }, i) => (
                  <button
                    key={_id}
                    type="button"
                    className={classNames({
                      active: i === 0,
                    })}
                    data-bs-target="#productImages"
                    data-bs-slide-to={i}
                    aria-current={i}
                    aria-label={caption}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {images.map(({ _id, url, caption }, i) => (
                  <div
                    key={_id}
                    className={classNames("carousel-item", {
                      active: i === 0,
                    })}
                  >
                    <img src={url} className="d-block w-100" alt={caption} />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#productImages"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#productImages"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Next</span>
              </button>
            </div>

            {!isMobile && <Card.Footer>Item ID: {_id}</Card.Footer>}
          </Container.Col>

          {/* ------------------------------ Product Details ------------------------------ */}
          <Container.Col
            modifier="sm"
            columns="4"
            className="d-flex flex-column"
          >
            <Card.Body className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-1">{name}</h5>
                <p className="fst-italic me-1 mb-1 text-success">#{code}</p>
              </div>
              <Card.SubTitle>{brand.name}</Card.SubTitle>
              <Card.Text>{description}</Card.Text>
            </Card.Body>

            <Card.ListGroup flush>
              <Card.ListGroupItem className="d-inline-flex justify-content-between border-top">
                <div>Class</div>
                <div className="text-capitalize">{_class}</div>
              </Card.ListGroupItem>

              <Card.ListGroupItem className="d-inline-flex justify-content-between">
                <div>Category</div>
                <div className="text-capitalize">{category}</div>
              </Card.ListGroupItem>

              <Card.ListGroupItem>
                <Container.Row>
                  <Container.Col columns="8">Variant</Container.Col>
                  <Container.Col columns="4">
                    <select
                      className="form-select form-select-sm"
                      aria-label="Select variant"
                      value={variant._id}
                      onChange={changeVariant}
                    >
                      {variants.map(({ _id, name }) => (
                        <option key={_id} value={_id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </Container.Col>
                </Container.Row>
              </Card.ListGroupItem>

              <Card.ListGroupItem>
                <Container.Row>
                  <Container.Col columns="3">
                    Prices ({variant.value})
                  </Container.Col>
                  <Container.Col columns="9">
                    <div className="d-block">
                      {variant.prices
                        .filter(({ label }) => label !== "sale")
                        .map(({ _id, label, value }) => (
                          <div
                            key={_id}
                            className="d-inline-flex justify-content-between w-100"
                          >
                            <div className="fst-italic text-capitalize">
                              {label}
                            </div>
                            <div className="fw-bolder">{value}</div>
                          </div>
                        ))}
                    </div>
                  </Container.Col>
                </Container.Row>
              </Card.ListGroupItem>

              <Card.ListGroupItem
                className={classNames({ "border-bottom": isMobile })}
              >
                <Container.Row>
                  <Container.Col
                    columns="6"
                    className="d-inline-flex justify-content-between pe-4"
                  >
                    <div>Unit</div>
                    <div className="fw-bolder text-capitalize">{unit}</div>
                  </Container.Col>
                  <Container.Col
                    columns="6"
                    className="d-inline-flex justify-content-between"
                  >
                    <div>Sale Price</div>
                    <div className="fw-bolder">
                      {variant.prices.find(({ label }) => label === "sale")
                        ?.value || "N/A"}
                    </div>
                  </Container.Col>
                </Container.Row>
              </Card.ListGroupItem>
            </Card.ListGroup>
          </Container.Col>
          <Container.Col
            modifier="sm"
            columns="4"
            className={classNames("d-flex", { "border-start": !isMobile })}
          >
            <Card.ListGroup flush className="flex-grow-1">
              <Card.ListGroupItem
                className={classNames(
                  "h-100 border-bottom-0 d-flex flex-column",
                  { "py-3": isMobile, "p-3": !isMobile }
                )}
              >
                <h6 className="mb-3" style={{ fontSize: "0.9rem" }}>
                  Latest Stock Batches
                </h6>
                {newStocks.length !== 0 ? (
                  newStocks
                    .filter(({ checked }) => !checked)
                    .splice(0, 2)
                    .map(
                      (
                        { _id, batch, _type, checked, addedBy, description },
                        i,
                        arr
                      ) => (
                        <Card
                          key={batch}
                          className={classNames({
                            "mb-3": i !== arr.length - 1,
                          })}
                        >
                          <a
                            href={`#_${_id}`}
                            className="card-body text-decoration-none text-black"
                            data-bs-target={`#${menuType}StockMenu`}
                            data-bs-toggle="modal"
                            onClick={() => setMenuType(_type)}
                          >
                            <Card.Title>
                              <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Batch No.: {batch}</h6>
                                <p
                                  className="fst-italic fw-normal me-1 mb-0 text-success"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  #{_id.truncate(10)}
                                </p>
                                {checked ? null : (
                                  <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                    <span className="visually-hidden">
                                      New stock
                                    </span>
                                  </span>
                                )}
                              </div>
                            </Card.Title>
                            <Card.SubTitle>{`Added by: ${addedBy.user.firstname} ${addedBy.user.lastname}`}</Card.SubTitle>

                            <Card.Text>{description}</Card.Text>
                          </a>
                        </Card>
                      )
                    )
                ) : (
                  <div className="text-center text-muted my-auto py-5 align-items-center">
                    Now new stock on this variant for now.
                  </div>
                )}
              </Card.ListGroupItem>

              {/* ------------------------ Stock Details ------------------------ */}
              <Container fluid className="border-top px-1">
                <Container.Row g="0" className="py-2 text-center">
                  <button
                    href="#inbound"
                    className="col-4 btn btn-sm m-0 p-0"
                    data-bs-target={`#${menuType}StockMenu`}
                    data-bs-toggle="modal"
                    onClick={() => setMenuType("inbound")}
                  >
                    <div>Inbound</div>
                    <div className="fw-bold">
                      {variant.stocks.inbound.length}
                    </div>
                  </button>
                  <button
                    href="#warehouse"
                    className="col-4 btn btn-sm m-0 p-0 border-end border-start"
                    data-bs-target={`#${menuType}StockMenu`}
                    data-bs-toggle="modal"
                    onClick={() => setMenuType("warehouse")}
                  >
                    <div>Warehouse</div>
                    <div className="fw-bold">
                      {variant.stocks.warehouse.length}
                    </div>
                  </button>
                  <button
                    href="#sold"
                    className="col-4 btn btn-sm m-0 p-0"
                    data-bs-target={`#${menuType}StockMenu`}
                    data-bs-toggle="modal"
                    onClick={() => setMenuType("sold")}
                  >
                    <div>Sold</div>
                    <div className="fw-bold">{variant.stocks.sold.length}</div>
                  </button>
                </Container.Row>
              </Container>

              {/* ---------------------------- Product Options ---------------------------- */}
              <div
                className="btn-group"
                role="group"
                aria-label="Product options"
              >
                <button
                  type="button"
                  className="btn btn-secondary rounded-0"
                  data-bs-target="#addProductMenu"
                  data-bs-toggle="modal"
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
            </Card.ListGroup>
          </Container.Col>

          {isMobile && <Card.Footer>Item ID: {_id}</Card.Footer>}
        </Container.Row>
      </Card>

      {/* ----------------- Stock Menus ----------------- */}

      <StockMenu type={menuType} stockList={variant.stocks} variant={variant} />
    </>
  );
}

export default ProductDetailsCard;
