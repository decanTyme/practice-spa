import classNames from "classnames";
import { parseISO } from "date-fns";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthAccess } from "../../../../../../../state/slices/auth/selectors";
import { modifyStock } from "../../../../../../../state/slices/data/product";
import {
  moveStock,
  removeStock,
  stockMarkInventoryChecked,
} from "../../../../../../../state/slices/data/product/async-thunks";
import Card from "../../../../../../common/Card";
import Container from "../../../../../../common/Container";
import ModalMenu from "../../../../../../common/ModalMenu";
import AddStockMenu from "./AddStockMenu";

const INIT_STATE_LOADING = {
  check: false,
  move: false,
  remove: false,
};

function StockMenu({ variant, type }) {
  const dispatch = useDispatch();

  const access = useSelector(selectAuthAccess);

  const [loading, setLoading] = useState(INIT_STATE_LOADING);

  const onEditStock = (stock) => {
    dispatch(modifyStock(stock));
  };

  const onRemoveStock = async (stock) => {
    const ans = prompt(
      `Are you sure you want to delete stock "${stock.batch}"?\rTHIS CANNOT BE UNDONE.
      \nType the the batch no. below to confirm.`
    );

    if (ans !== null && ans === stock.batch) {
      setLoading({
        check: false,
        move: false,
        remove: true,
      });

      try {
        await dispatch(removeStock(stock)).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(INIT_STATE_LOADING);
      }
    }
  };

  const handleMark = async (e) => {
    try {
      setLoading({
        check: true,
        move: false,
        remove: false,
      });

      await dispatch(
        stockMarkInventoryChecked({
          _id: e.target.dataset.id,
          mark: e.target.checked,
        })
      ).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(INIT_STATE_LOADING);
    }
  };

  const handleMove = async (e) => {
    try {
      const moveToType = e.target.dataset.move;
      const previousType = e.target.dataset.typePrev;
      const isInventoryChecked = JSON.parse(e.target.dataset.checked || false);
      const batchNo = e.target.dataset.batch;

      if (!isInventoryChecked && moveToType === "sold") {
        const confirmMove = window.confirm(
          `It seems that you still haven't checked the inventory of batch no. ${batchNo} yet. Are you sure you want to move this to ${e.target.dataset.move}?`
        );

        if (!confirmMove) return;
      }

      setLoading({
        move: true,
        check: false,
        remove: false,
      });

      await dispatch(
        moveStock({
          _id: e.target.dataset.id,
          _type: moveToType,
          prevType: previousType,
        })
      ).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(INIT_STATE_LOADING);
    }
  };

  return (
    <>
      <ModalMenu id={`${type}StockMenu`} fade>
        <ModalMenu.Dialog scrollable>
          <ModalMenu.Content>
            <ModalMenu.Header>
              <ModalMenu.Title>{`All ${type.capitalize()} Stocks`}</ModalMenu.Title>
              <button
                className="btn py-1 px-2"
                data-bs-target={`#${type}AddStockMenu`}
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
              >
                Add Stock
              </button>
            </ModalMenu.Header>
            <ModalMenu.Body>
              <div style={{ fontSize: "0.925rem" }}>
                {variant.stocks[type] && variant.stocks[type].length !== 0 ? (
                  variant.stocks[type].map((stock, i) => (
                    <Card
                      key={stock.batch}
                      className={classNames({ "mt-3": i >= 1 })}
                    >
                      <a
                        href={`#_${stock._id}`}
                        className="card-body text-decoration-none text-black"
                        data-bs-toggle="collapse"
                        data-bs-target={`#_${stock._id}`}
                        aria-expanded="false"
                        aria-controls={`_${stock._id}`}
                      >
                        <Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Batch No.: {stock.batch}</h6>
                            <p
                              className="fst-italic fw-normal me-1 mb-0 text-success"
                              style={{ fontSize: "0.875rem" }}
                            >
                              #{stock._id.truncate(10)}
                            </p>
                            {stock.checked ? null : (
                              <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                <span className="visually-hidden">
                                  New stock
                                </span>
                              </span>
                            )}
                          </div>
                        </Card.Title>
                        <Card.SubTitle>{`Added by: ${stock.addedBy.user.firstname} ${stock.addedBy.user.lastname}`}</Card.SubTitle>

                        <Card.Text>{stock.description}</Card.Text>
                      </a>

                      <Card.ListGroup
                        id={`_${stock._id}`}
                        flush
                        className="collapse"
                      >
                        <Card.ListGroupItem>
                          <Container.Row>
                            <Container.Col
                              columns="6"
                              className="d-inline-flex justify-content-between pe-3"
                            >
                              <div>Quantity</div>
                              <div className="fw-bolder">
                                {stock.quantity.commaSplice()}
                              </div>
                            </Container.Col>

                            <Container.Col
                              columns="6"
                              className="d-inline-flex justify-content-between"
                            >
                              <div>Price Per Unit</div>
                              <div className="fw-bolder">
                                Php{stock.pricePerUnit.commaSplice()}
                              </div>
                            </Container.Col>
                          </Container.Row>
                        </Card.ListGroupItem>

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Total Incured</div>
                          <div className="fw-bold text-danger">
                            Php
                            {(
                              stock.quantity * stock.pricePerUnit
                            ).commaSplice()}
                          </div>
                        </Card.ListGroupItem>

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Date of Purchase</div>
                          <div>
                            {parseISO(stock.purchasedOn).toDateString()}
                          </div>
                        </Card.ListGroupItem>

                        {type !== "inbound" && (
                          <Card.ListGroupItem className="d-inline-flex justify-content-between">
                            <div>Date of Arrival</div>
                            <div>
                              {parseISO(stock.arrivedOn).toDateString()}
                            </div>
                          </Card.ListGroupItem>
                        )}

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Manufacture Date</div>
                          <div>
                            {parseISO(stock.manufacturedOn).toDateString()}
                          </div>
                        </Card.ListGroupItem>

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Indicated Expiry</div>
                          <div>{parseISO(stock.expiry).toDateString()}</div>
                        </Card.ListGroupItem>

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Courier</div>
                          <div>{stock.courier.name}</div>
                        </Card.ListGroupItem>

                        {type === "warehouse" && (
                          <Card.ListGroupItem className="d-inline-flex justify-content-between">
                            <div>
                              Mark Inventory{" "}
                              {stock.checked ? "Unchecked" : "Checked"}
                            </div>
                            <div className="form-check m-0 d-inline-flex  align-items-center">
                              {loading.check && (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden={false}
                                ></span>
                              )}
                              <input
                                id="inventoryCheckbox"
                                className="form-check-input m-0 ms-2"
                                type="checkbox"
                                checked={stock.checked}
                                onChange={handleMark}
                                data-id={stock._id}
                                disabled={!access || loading.check}
                              />
                            </div>
                          </Card.ListGroupItem>
                        )}

                        {type !== "sold" && (
                          <Card.ListGroupItem className="d-inline-flex justify-content-between align-items-center p-0">
                            <div className="py-2 px-3">Move</div>
                            <div
                              className="btn-group d-inline-flex align-items-center"
                              role="group"
                              aria-label="Product options"
                            >
                              {loading.move && (
                                <span
                                  className="spinner-border spinner-border-sm me-3"
                                  role="status"
                                  aria-hidden={false}
                                ></span>
                              )}

                              {type === "inbound" && (
                                <button
                                  type="button"
                                  className="btn btn-light border-start border-end rounded-0 px-3 py-2"
                                  data-id={stock._id}
                                  data-move="warehouse"
                                  data-type-prev={stock._type}
                                  onClick={handleMove}
                                >
                                  Warehouse
                                </button>
                              )}

                              {type === "warehouse" && (
                                <button
                                  type="button"
                                  className="btn btn-light border-start rounded-0 px-3 py-2"
                                  data-id={stock._id}
                                  data-batch={stock.batch}
                                  data-move="sold"
                                  data-checked={stock.checked}
                                  data-type-prev={stock._type}
                                  onClick={handleMove}
                                >
                                  Sold
                                </button>
                              )}
                            </div>
                          </Card.ListGroupItem>
                        )}

                        <Card.ListGroupItem className="d-inline-flex justify-content-between p-0">
                          <div className="px-3 py-2">Options</div>
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Product options"
                          >
                            <button
                              type="button"
                              className="btn btn-secondary rounded-0 px-4 py-2"
                              data-bs-target="#editAddStockMenu"
                              data-bs-toggle="modal"
                              onClick={() => onEditStock(stock)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger rounded-0 px-4 py-2"
                              onClick={() => onRemoveStock(stock)}
                            >
                              {loading.remove && (
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden={false}
                                ></span>
                              )}
                              Delete
                            </button>
                          </div>
                        </Card.ListGroupItem>
                      </Card.ListGroup>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted">
                    No stocks currently available.
                  </div>
                )}
              </div>
            </ModalMenu.Body>

            <ModalMenu.Footer>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Dismiss
              </button>
            </ModalMenu.Footer>
          </ModalMenu.Content>
        </ModalMenu.Dialog>
      </ModalMenu>

      <AddStockMenu type={type} variant={variant} />
      <AddStockMenu type="edit" backTarget={`${type}StockMenu`} />
    </>
  );
}

export default StockMenu;
