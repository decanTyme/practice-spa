import classNames from "classnames";
import { parseISO } from "date-fns";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthAccess } from "../../../../../../app/state/slices/auth/selectors";
import {
  moveStock,
  stockMarkInventoryChecked,
} from "../../../../../../app/state/slices/data/product/async-thunks";
import Card from "../../../../common/Card";
import Container from "../../../../common/Container";
import ModalMenu from "../../../../common/menus/ModalMenu";

const INIT_STATE_LOADING = {
  check: false,
  move: false,
};

function StockMenu({ type, stockList }) {
  const dispatch = useDispatch();

  const access = useSelector(selectAuthAccess);

  const [loading, setLoading] = useState(INIT_STATE_LOADING);

  const handleMark = async (e) => {
    try {
      setLoading({
        check: true,
        move: false,
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
              {stockList && stockList.length !== 0 ? (
                stockList.map(
                  (
                    {
                      _id,
                      _type,
                      batch,
                      checked,
                      addedBy,
                      description,
                      quantity,
                      pricePerUnit,
                      purchasedOn,
                      arrivedOn,
                      manufacturedOn,
                      courier,
                      expiry,
                    },
                    i
                  ) => (
                    <Card
                      key={batch}
                      className={classNames({ "mt-3": i >= 1 })}
                    >
                      <a
                        href={`#_${_id}`}
                        className="card-body text-decoration-none text-black"
                        data-bs-toggle="collapse"
                        data-bs-target={`#_${_id}`}
                        aria-expanded="false"
                        aria-controls={`_${_id}`}
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

                      <Card.ListGroup id={`_${_id}`} flush className="collapse">
                        <Card.ListGroupItem>
                          <Container.Row>
                            <Container.Col
                              columns="6"
                              className="d-inline-flex justify-content-between pe-3"
                            >
                              <div>Quantity</div>
                              <div className="fw-bolder">
                                {quantity.commaSplice()}
                              </div>
                            </Container.Col>

                            <Container.Col
                              columns="6"
                              className="d-inline-flex justify-content-between"
                            >
                              <div>Price Per Unit</div>
                              <div className="fw-bolder">
                                Php{pricePerUnit.commaSplice()}
                              </div>
                            </Container.Col>
                          </Container.Row>
                        </Card.ListGroupItem>

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Total Incured</div>
                          <div className="fw-bold text-danger">
                            Php{(quantity * pricePerUnit).commaSplice()}
                          </div>
                        </Card.ListGroupItem>

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Date of Purchase</div>
                          <div>{parseISO(purchasedOn).toDateString()}</div>
                        </Card.ListGroupItem>

                        {type !== "inbound" && (
                          <Card.ListGroupItem className="d-inline-flex justify-content-between">
                            <div>Date of Arrival</div>
                            <div>{parseISO(arrivedOn).toDateString()}</div>
                          </Card.ListGroupItem>
                        )}

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Manufacture Date</div>
                          <div>{parseISO(manufacturedOn).toDateString()}</div>
                        </Card.ListGroupItem>

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Indicated Expiry</div>
                          <div>{parseISO(expiry).toDateString()}</div>
                        </Card.ListGroupItem>

                        <Card.ListGroupItem className="d-inline-flex justify-content-between">
                          <div>Courier</div>
                          <div>{courier.name}</div>
                        </Card.ListGroupItem>

                        {type === "warehouse" && (
                          <Card.ListGroupItem className="d-inline-flex justify-content-between">
                            <div>
                              Mark Inventory {checked ? "Unchecked" : "Checked"}
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
                                checked={checked}
                                onChange={handleMark}
                                data-id={_id}
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
                                  data-id={_id}
                                  data-move="warehouse"
                                  data-type-prev={_type}
                                  onClick={handleMove}
                                >
                                  Warehouse
                                </button>
                              )}

                              {type === "warehouse" && (
                                <button
                                  type="button"
                                  className="btn btn-light border-start rounded-0 px-3 py-2"
                                  data-id={_id}
                                  data-batch={batch}
                                  data-move="sold"
                                  data-checked={checked}
                                  data-type-prev={_type}
                                  onClick={handleMove}
                                >
                                  Sold
                                </button>
                              )}
                            </div>
                          </Card.ListGroupItem>
                        )}
                      </Card.ListGroup>
                    </Card>
                  )
                )
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
  );
}

export default StockMenu;
