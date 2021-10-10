import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthAccess } from "../../../../../../app/state/slices/auth/selectors";
import Constants from "../../../../../../app/state/slices/constants";
import { setIdle } from "../../../../../../app/state/slices/data/product";
import {
  moveStock,
  stockMarkInventoryChecked,
} from "../../../../../../app/state/slices/data/product/async-thunks";
import { selectProductPushStatus } from "../../../../../../app/state/slices/data/product/selectors";
import ModalMenu from "../../../../common/menus/ModalMenu";

const INIT_STATE_LOADING = {
  check: false,
  move: false,
};

function StockMenu({ type, stockList }) {
  const dispatch = useDispatch();

  const access = useSelector(selectAuthAccess);
  const saveStatus = useSelector(selectProductPushStatus);

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
      const isInventoryChecked = e.target.checked;
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

  useEffect(() => {
    // If a save action is a success, always set
    // the status back to idle
    if (saveStatus !== Constants.IDLE)
      dispatch(setIdle(Constants.DataService.PUSH));
  }, [dispatch, saveStatus]);

  return (
    <ModalMenu
      id={`${type}StockMenu`}
      fade={true}
      scrollable={true}
      title={`All ${type.capitalize()} Stocks`}
      headerBtn={
        <button
          className="btn py-1 px-2"
          data-bs-target={`#${type}AddStockMenu`}
          data-bs-toggle="modal"
          data-bs-dismiss="modal"
        >
          Add Stock
        </button>
      }
      body={
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
                <div className={"card " + (i >= 1 && "mt-3")} key={batch}>
                  <a
                    href={`#_${_id}`}
                    className="card-body text-decoration-none text-black"
                    data-bs-toggle="collapse"
                    data-bs-target={`#_${_id}`}
                    aria-expanded="false"
                    aria-controls={`_${_id}`}
                  >
                    <div className="card-title">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-1">Batch No.: {batch}</h6>
                        <p
                          className="fst-italic me-1 mb-1 text-success"
                          style={{ fontSize: "0.875rem" }}
                        >
                          #{_id.truncate(12)}
                        </p>
                        {!checked && type !== "sold" && (
                          <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                            <span className="visually-hidden">New stock</span>
                          </span>
                        )}
                      </div>
                      <p className="card-subtitle text-muted mb-2">
                        {`Added by: ${addedBy.firstname} ${addedBy.lastname}`}
                      </p>
                    </div>
                    <p className="card-text">{description}</p>
                  </a>
                  <ul
                    id={`_${_id}`}
                    className="list-group list-group-flush collapse"
                  >
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col-6 d-inline-flex justify-content-between pe-3">
                          <div>Quantity</div>
                          <div className="fw-bolder">
                            {quantity.commaSplice()}
                          </div>
                        </div>
                        <div className="col-6 d-inline-flex justify-content-between">
                          <div>Price Per Unit</div>
                          <div className="fw-bolder">
                            Php{pricePerUnit.commaSplice()}
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className="list-group-item d-inline-flex justify-content-between">
                      <div>Total Incured</div>
                      <div className="fw-bold text-danger">
                        Php{(quantity * pricePerUnit).commaSplice()}
                      </div>
                    </li>

                    <li className="list-group-item d-inline-flex justify-content-between">
                      <div>Date of Purchase</div>
                      <div>{parseISO(purchasedOn).toDateString()}</div>
                    </li>

                    {type === "warehouse" && (
                      <li className="list-group-item d-inline-flex justify-content-between">
                        <div>Date of Arrival</div>
                        <div>{parseISO(arrivedOn).toDateString()}</div>
                      </li>
                    )}

                    <li className="list-group-item d-inline-flex justify-content-between">
                      <div>Manufacture Date</div>
                      <div>{parseISO(manufacturedOn).toDateString()}</div>
                    </li>

                    <li className="list-group-item d-inline-flex justify-content-between">
                      <div>Indicated Expiry</div>
                      <div>{parseISO(expiry).toDateString()}</div>
                    </li>

                    <li className="list-group-item d-inline-flex justify-content-between">
                      <div>Courier</div>
                      <div>{courier.name}</div>
                    </li>

                    {type === "warehouse" && (
                      <li className="list-group-item d-inline-flex justify-content-between">
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
                      </li>
                    )}

                    {type !== "sold" && (
                      <li className="list-group-item d-inline-flex justify-content-between align-items-center p-0">
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
                              data-move-checked={checked}
                              data-type-prev={_type}
                              onClick={handleMove}
                            >
                              Sold
                            </button>
                          )}
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              )
            )
          ) : (
            <div className="text-center text-muted">
              No stocks currently available.
            </div>
          )}
        </div>
      }
      dismissBtn={
        <button
          type="button"
          className="btn btn-primary"
          data-bs-dismiss="modal"
        >
          Dismiss
        </button>
      }
    />
  );
}

export default StockMenu;
