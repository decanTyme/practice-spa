// import placeholderProductImg from "../../../../../../assets/placeholder_product_image.png";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyProduct } from "../../../../../../app/state/slices/data/product";
import { removeProduct } from "../../../../../../app/state/slices/data/product/async-thunks";
import { selectProductInEdit } from "../../../../../../app/state/slices/data/product/selectors";

function ProductDetailsCard({
  product,
  product: {
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
        ...variant.stocks.shipped,
      ]
        .filter((stock) => !stock.checked)
        .sort((a, _) => (a.checked ? 1 : -1)),
    [variant.stocks.inbound, variant.stocks.shipped, variant.stocks.warehouse]
  );

  return (
    <>
      <div className="card">
        <div className="row g-0">
          <div className="col-sm-4">
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
                    data-bs-interval="3000"
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

            {isMobile ? null : (
              <div className="card-footer border-0 p-2 text-muted">
                Item ID: {_id}
              </div>
            )}
          </div>

          <div className="col-sm-4 d-flex flex-column">
            {/* ------------------------------ Product Details ------------------------------ */}
            <div className="card-body flex-grow-1">
              <div className="card-title">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-1">{name}</h5>
                  <p className="fst-italic me-1 mb-1 text-success">#{code}</p>
                </div>
                <p className="card-subtitle text-muted mb-2">{brand}</p>
              </div>
              <p className="card-text">{description}</p>
            </div>

            <ul className="list-group list-group-flush">
              {/* ------------------------------ List Item ------------------------------ */}
              <li className="list-group-item d-inline-flex justify-content-between border-top">
                <div>Class</div>
                <div className="text-capitalize">{_class}</div>
              </li>

              {/* ------------------------------ List Item ------------------------------ */}
              <li className="list-group-item d-inline-flex justify-content-between">
                <div>Category</div>
                <div className="text-capitalize">{category}</div>
              </li>

              {/* ------------------------------ List Item ------------------------------ */}
              <li className="list-group-item">
                <div className="row">
                  <div className="col-8">Variant</div>
                  <div className="col-4">
                    <select
                      className="form-select form-select-sm"
                      aria-label="Select variant"
                      value={variant._id}
                      onChange={changeVariant}
                      // disabled={disable.inputs}
                    >
                      {variants.map(({ _id, name }) => (
                        <option key={_id} value={_id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </li>

              {/* ------------------------------ List Item ------------------------------ */}
              <li className="list-group-item">
                <div className="row">
                  <div className="col-3">
                    <div>Prices ({variant.value})</div>
                  </div>
                  <div className="col-9">
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
                  </div>
                </div>
              </li>
              <li
                className={classNames("list-group-item", {
                  "border-bottom": isMobile,
                })}
              >
                <div className="row">
                  <div className="col-6 d-inline-flex justify-content-between pe-4">
                    <div>Unit</div>
                    <div className="fw-bolder text-capitalize">{unit}</div>
                  </div>
                  <div className="col-6 d-inline-flex justify-content-between">
                    <div>Sale Price</div>
                    <div className="fw-bolder">
                      {variant.prices.find(({ label }) => label === "sale")
                        .value || "N/A"}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div
            className={classNames("col-sm-4 d-flex", {
              "border-start": !isMobile,
            })}
          >
            <ul className="list-group list-group-flush flex-grow-1">
              {/* ------------------------------ List Item ------------------------------ */}
              <li
                className={classNames(
                  "list-group-item h-100 border-bottom-0 d-flex flex-column",
                  { "pb-3": isMobile, "p-3": !isMobile }
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
                        <div
                          className={classNames("card", {
                            "mb-3": i !== arr.length - 1,
                          })}
                          key={batch}
                        >
                          <a
                            href={`#_${_id}`}
                            className="card-body text-decoration-none text-black"
                            data-bs-target={`#${_type}StockMenu`}
                            data-bs-toggle="modal"
                            data-bs-dismiss="modal"
                          >
                            <div className="card-title">
                              <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-1">Batch No.: {batch}</h6>
                                <p
                                  className="fst-italic me-1 mb-1 text-success"
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
                              <p className="card-subtitle text-muted mb-2">
                                {`Added by: ${addedBy.firstname} ${addedBy.lastname}`}
                              </p>
                            </div>
                            <p className="card-text">{description}</p>
                          </a>
                        </div>
                      )
                    )
                ) : (
                  <div className="text-center text-muted my-auto py-5 align-items-center">
                    Now new stock on this variant for now.
                  </div>
                )}
              </li>

              {/* ---------------------------- Stock Details ---------------------------- */}
              <div className="container-fluid border-top px-1">
                <div className="row g-0 py-2 text-center">
                  <button
                    href="#inbound"
                    className="col-4 btn btn-sm m-0 p-0"
                    data-bs-target="#inboundStockMenu"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >
                    <div>Inbound</div>
                    <div className="fw-bold">
                      {variant.stocks.inbound.length}
                    </div>
                  </button>
                  <button
                    href="#warehouse"
                    className="col-4 btn btn-sm m-0 p-0 border-end border-start"
                    data-bs-target="#warehouseStockMenu"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >
                    <div>Warehouse</div>
                    <div className="fw-bold">
                      {variant.stocks.warehouse.length}
                    </div>
                  </button>
                  <button
                    href="#shipped"
                    className="col-4 btn btn-sm m-0 p-0"
                    data-bs-target="#shippedStockMenu"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >
                    <div>Shipped</div>
                    <div className="fw-bold">
                      {variant.stocks.shipped.length}
                    </div>
                  </button>
                </div>
              </div>
              {/* ---------------------------- Product Options ---------------------------- */}
              <div
                className="btn-group"
                role="group"
                aria-label="Product options"
              >
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
            </ul>
          </div>
          {isMobile ? (
            <div className="card-footer text-muted">Item ID: {_id}</div>
          ) : null}
        </div>
      </div>

      {/* ----------------- Stock Menus ----------------- */}

      <StockMenu
        id="inboundStockMenu"
        stockList={variant.stocks.inbound}
        title="All Inbound Stocks"
        addMenuId="inboundAddStockMenu"
      />

      <StockMenu
        id="warehouseStockMenu"
        stockList={variant.stocks.warehouse}
        title="All In Warehouse Stocks"
        addMenuId="warehouseAddStockMenu"
      />

      <StockMenu
        id="shippedStockMenu"
        stockList={variant.stocks.shipped}
        title="All Shipped Stocks"
        addMenuId="shippedAddStockMenu"
      />

      <AddStockMenu
        id="inboundAddStockMenu"
        title="Add Inbound Stock"
        backTarget="inboundStockMenu"
      />

      <AddStockMenu
        id="warehouseAddStockMenu"
        title="Add Warehouse Stock"
        backTarget="warehouseStockMenu"
      />

      <AddStockMenu
        id="shippedAddStockMenu"
        title="Add Shipped Stock"
        backTarget="shippedStockMenu"
      />
    </>
  );
}

export default ProductDetailsCard;
