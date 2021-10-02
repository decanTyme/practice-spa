import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthAccess } from "../../../../../../app/state/slices/auth/selectors";
import Constants from "../../../../../../app/state/slices/constants";
import { setIdle } from "../../../../../../app/state/slices/data/product";
import { selectProductPushStatus } from "../../../../../../app/state/slices/data/product/selectors";
import ModalMenu from "../../../../common/menus/ModalMenu";

function StockMenu({ addMenuId, stockList, id, title }) {
  const dispatch = useDispatch();

  const access = useSelector(selectAuthAccess);
  const saveStatus = useSelector(selectProductPushStatus);

  const [loading, setLoading] = useState();

  useEffect(() => {
    // If a save action is a success, always set
    // the status back to idle
    if (saveStatus !== Constants.IDLE)
      dispatch(setIdle(Constants.DataService.PUSH));
  }, [dispatch, saveStatus]);

  return (
    <ModalMenu
      id={id}
      fade={true}
      scrollable={true}
      title={title}
      headerBtn={
        <button
          className="btn py-1 px-2"
          data-bs-target={`#${addMenuId}`}
          data-bs-toggle="modal"
          data-bs-dismiss="modal"
          data-bs-backtarget={id}
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
                  batch,
                  checked,
                  addedBy,
                  description,
                  quantity,
                  pricePerUnit,
                  purchasedOn,
                  manufacturedOn,
                  expiry,
                },
                i
              ) => (
                <div className={"card " + (i === 1 && "mt-3")} key={batch}>
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
                        {checked ? null : (
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
                      <div>J&T</div>
                    </li>

                    <li className="list-group-item d-inline-flex justify-content-between">
                      <div>Mark Inventory Checked</div>
                      <div className="form-check m-0">
                        <input
                          id="addStockCheckbox"
                          className="form-check-input mx-auto"
                          type="checkbox"
                          value={isChecked || checked}
                          onChange={(e) => setChecked(e.target.checked)}
                          disabled={!access}
                        />
                      </div>
                    </li>
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