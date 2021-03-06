import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalMenu from "../../../../../../common/ModalMenu";
import {
  selectProductImportedCSV,
  selectProductModifyStatus,
  selectProductPushStatus,
  selectStockInEdit,
} from "../../../../../../../state/slices/data/product/selectors";
import Constants from "../../../../../../../state/slices/constants";
import {
  pushStock,
  updateStock,
} from "../../../../../../../state/slices/data/product/async-thunks";
import {
  abortCSVImport,
  resetAllStockModification,
} from "../../../../../../../state/slices/data/product";
import { selectAllCouriers } from "../../../../../../../state/slices/data/courier";
import { Modal } from "bootstrap";
import Container from "../../../../../../common/Container";
import { INIT_BTN_TEXT } from "../init-add-product-form";
import CourierMenu from "./CourierMenu";
import SpinnerButton from "../../../../../../common/SpinnerButton";

const INIT_FORM_VAL = {
  batch: "",
  checked: false,
  description: "",
  quantity: 0,
  pricePerUnit: 0,
  purchasedOn: "",
  manufacturedOn: "",
  expiry: "",
  courier: "",
  arrivedOn: "",
};

const INIT_BTN_STATE = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
  inputCode: false,
};

const StockTypes = {
  INBOUND: "inbound",
  WAREHOUSE: "warehouse",
  SOLD: "sold",
};

function AddStockMenu({ backTarget, variant, type }) {
  const dispatch = useDispatch();

  const couriers = useSelector(selectAllCouriers);

  const saveStatus = useSelector(selectProductPushStatus);
  const modifyStatus = useSelector(selectProductModifyStatus);

  const importedCSV = useSelector(selectProductImportedCSV);
  const stockInEdit = useSelector(selectStockInEdit);

  const [stock, setStock] = useState(INIT_FORM_VAL);
  const [text, setText] = useState(INIT_BTN_TEXT);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(INIT_BTN_STATE);
  const [isCourierMenuOpen, toggleCourierMenu] = useState(false);

  // Always listen for stock-in-edit states
  useEffect(() => {
    if (stockInEdit) {
      setStock({
        ...stockInEdit,
        courier: stockInEdit.courier._id,
        arrivedOn: stockInEdit.arrivedOn
          ? stockInEdit.arrivedOn.split(".")[0]
          : "",
        purchasedOn: stockInEdit.purchasedOn.split(".")[0],
        manufacturedOn: stockInEdit.manufacturedOn.split(".")[0],
        expiry: stockInEdit.expiry.split(".")[0],
      });

      setDisable({
        submitBtn: true,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });

      setText({
        submitBtn: "Update",
        resetBtn: "Cancel",
      });

      return;
    }

    // For some reason when an in-edit stock
    // is canceled, the forms won't automatically
    // clear through the event listeners.
    //
    // Hence, this serves as a "fix" for now.
    if (!stockInEdit) {
      setStock(INIT_FORM_VAL);
      setDisable(INIT_BTN_STATE);
      setText(INIT_BTN_TEXT);
    }
  }, [stockInEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stockForm = document.getElementById(`${type}StockForm`);

    if (stockForm.checkValidity()) {
      setLoading(true);
      setDisable({
        submitBtn: true,
        resetBtn: true,
        inputs: true,
        inputCode: true,
      });

      try {
        if (stockInEdit)
          await dispatch(
            updateStock({
              ...stock,
              arrivedOn:
                stock.arrivedOn &&
                new Date(stock.arrivedOn).toISOString().split(".")[0],
              variantId: stock.variant,
            })
          ).unwrap();
        else
          await dispatch(
            pushStock({
              ...stock,
              checked: type === StockTypes.SOLD ? true : stock.checked,
              description:
                stock.description === "" ? undefined : stock.description,
              purchasedOn: new Date(stock.purchasedOn)
                .toISOString()
                .split(".")[0],
              manufacturedOn: new Date(stock.manufacturedOn)
                .toISOString()
                .split(".")[0],
              expiry: new Date(stock.expiry).toISOString().split(".")[0],
              arrivedOn:
                stock.arrivedOn &&
                new Date(stock.arrivedOn).toISOString().split(".")[0],
              variantId: variant._id,
              _type: type,
            })
          ).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setDisable(INIT_BTN_STATE);
      }

      stockForm.classList.remove("was-validated");
    } else {
      stockForm.classList.add("was-validated");
    }
  };

  const handleChange = (e) => {
    setDisable({
      submitBtn: false,
      resetBtn: false,
      inputs: false,
      inputCode: stockInEdit ? true : false,
    });

    const name = e.target.name,
      value = e.target.value;

    setStock({
      ...stock,
      batch: name === "batch" ? value.toUpperCase() : stock.batch,
      checked: name === "checked" ? e.target.checked : stock.checked,
      description: name === "description" ? value : stock.description,
      quantity:
        name === "quantity" ? parseInt(value) : parseInt(stock.quantity),
      pricePerUnit:
        name === "pricePerUnit"
          ? parseInt(value)
          : parseInt(stock.pricePerUnit),
      purchasedOn: name === "purchasedOn" ? value : stock.purchasedOn,
      manufacturedOn: name === "manufacturedOn" ? value : stock.manufacturedOn,
      expiry: name === "expiry" ? value : stock.expiry,
      courier: name === "courier" ? value : stock.courier,
      arrivedOn: name === "arrivedOn" ? value : stock.arrivedOn,
    });
  };

  const resetToDefaults = useCallback(() => {
    toggleCourierMenu(false);

    // Only hide the menu if there was a recent stock edit
    // and the user has cancelled editing
    //! BUG: Won't automatically reset on menu close
    // The menu listeners will take care of
    // resetting the forms
    if (stockInEdit) return;

    // Clear CSV imports only if there is a
    // CSV currently imported
    if (importedCSV) {
      dispatch(abortCSVImport());
      document.getElementById("csvImportBtn").value = "";
    }

    // Revert all states to INIT
    setStock(INIT_FORM_VAL);
    setDisable(INIT_BTN_STATE);
    setText(INIT_BTN_TEXT);
    document
      .getElementById(`${type}StockForm`)
      .classList.remove("was-validated");
  }, [dispatch, importedCSV, stockInEdit, type]);

  useEffect(() => {
    // If a save action is a success, hide the menu
    if (saveStatus === Constants.SUCCESS || modifyStatus === Constants.SUCCESS)
      return Modal.getOrCreateInstance(
        document.getElementById(`${type}AddStockMenu`)
      ).hide();

    // Otherwise, only reset the button state
    // so the user has a chance to re-edit
    if (saveStatus === Constants.FAILED || modifyStatus === Constants.FAILED)
      return setDisable({
        submitBtn: true,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });
  }, [modifyStatus, saveStatus, type]);

  // Listen for modal events
  useEffect(() => {
    const addStockMenu = document.getElementById(`${type}AddStockMenu`);

    // When modal is closed, revert all states to INIT
    const hideModalListener = () => {
      if (!isCourierMenuOpen) {
        document.getElementById("csvImportBtn").value = "";

        document
          .getElementById(`${type}StockForm`)
          .classList.remove("was-validated");

        dispatch(abortCSVImport());
        dispatch(resetAllStockModification());
      }
    };

    const hidePreventedListener = () =>
      console.log("Modal prevented from closing");

    addStockMenu.addEventListener("hidden.bs.modal", hideModalListener);

    addStockMenu.addEventListener(
      "hidePrevented.bs.modal",
      hidePreventedListener
    );

    const removeListeners = () => {
      addStockMenu.removeEventListener("hidden.bs.modal", hideModalListener);
      addStockMenu.removeEventListener(
        "hidePrevented.bs.modal",
        hidePreventedListener
      );
    };

    return () => removeListeners();
  }, [dispatch, isCourierMenuOpen, stockInEdit, type]);

  const batchPlaceholder = useMemo(() => {
    return Math.ceil(Math.random() * 100000000);
  }, []);

  return (
    <>
      <ModalMenu id={`${type}AddStockMenu`} fade _static keyboard>
        <ModalMenu.Dialog>
          <ModalMenu.Content>
            <ModalMenu.Header>
              <ModalMenu.Title>
                {stockInEdit ? "Edit Stock" : `Add ${type.capitalize()} Stock`}
              </ModalMenu.Title>

              {type !== "edit" && (
                <button
                  className="btn py-1 px-2"
                  data-bs-target={`#${type}StockMenu`}
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  onClick={() => toggleCourierMenu(false)}
                >
                  Back
                </button>
              )}
            </ModalMenu.Header>

            <ModalMenu.Body>
              <form
                id={`${type}StockForm`}
                className="needs-validation px-1 mb-2"
              >
                <Container.Row className="mb-3">
                  <Container.Col columns="12">
                    <label htmlFor="stockBatch" className="form-label">
                      Batch Number
                    </label>
                    <div className="input-group">
                      <input
                        id="stockBatch"
                        type="text"
                        name="batch"
                        className="form-control"
                        placeholder={batchPlaceholder}
                        value={stock.batch}
                        onChange={handleChange}
                        disabled={disable.inputs || disable.inputCode}
                        required
                        pattern="[A-Z0-9]+"
                      />
                      {!disable.inputCode && (
                        <button
                          id="qrBtn"
                          type="button"
                          className="btn btn-outline-secondary"
                          // data-bs-toggle="modal"
                          // data-bs-target="#addProductScannerModal"
                          disabled={true}
                          aria-label="Scan Batch Code"
                        >
                          <i className="fa fa-qrcode"></i>
                        </button>
                      )}

                      <div className="invalid-feedback">
                        Invalid batch number.
                      </div>
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                  </Container.Col>
                </Container.Row>

                <Container.Row className="mb-3">
                  <Container.Col columns="6">
                    <label htmlFor="stockQuantity" className="form-label">
                      Quantity
                    </label>
                    <div className="input-group">
                      <input
                        id="stockQuantity"
                        type="number"
                        name="quantity"
                        className="form-control"
                        placeholder="100"
                        min={1}
                        value={stock.quantity}
                        onChange={handleChange}
                        disabled={disable.inputs}
                        required
                      />
                      <span className="input-group-text">units</span>

                      <div className="invalid-feedback">
                        Cannot be less than 1.
                      </div>
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                  </Container.Col>

                  <Container.Col columns="6">
                    <label htmlFor="stockPricePerUnit" className="form-label">
                      Price Per Unit
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">Php</span>
                      <input
                        id="stockPricePerUnit"
                        type="number"
                        name="pricePerUnit"
                        className="form-control"
                        placeholder="125"
                        min={1}
                        value={stock.pricePerUnit}
                        onChange={handleChange}
                        disabled={disable.inputs}
                        required
                      />

                      <div className="invalid-feedback">
                        Cannot be less than 1.
                      </div>
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                  </Container.Col>
                </Container.Row>

                <Container.Row className="mb-3">
                  <Container.Col columns="6">
                    <label htmlFor="purchaseDate" className="form-label">
                      Purchased On
                    </label>
                    <input
                      id="purchaseDate"
                      type="datetime-local"
                      name="purchasedOn"
                      value={stock.purchasedOn}
                      className="form-control"
                      onChange={handleChange}
                      disabled={disable.inputs}
                      required
                      min="2020-01-01"
                    />

                    <div className="invalid-feedback">
                      Please select a valid date.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>

                  <Container.Col columns="6">
                    <label htmlFor="courier" className="form-label">
                      Courier
                    </label>
                    <a
                      href="#courierMenu"
                      role="button"
                      data-bs-target="#courierMenu"
                      data-bs-toggle="modal"
                      className="text-decoration-none float-end fw-light"
                      style={{ fontSize: "0.8rem", marginTop: "0.075rem" }}
                      onClick={() => toggleCourierMenu(true)}
                    >
                      Edit couriers
                    </a>
                    <select
                      id="courier"
                      name="courier"
                      className="form-select"
                      aria-label="Select courier"
                      value={stock.courier}
                      onChange={handleChange}
                      disabled={disable.inputs}
                      required
                    >
                      <option value="">Select Courier</option>
                      {couriers.map(({ _id, name }) => (
                        <option key={_id} value={_id}>
                          {name}
                        </option>
                      ))}
                    </select>

                    <div className="invalid-feedback">
                      Please select a valid category.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>
                </Container.Row>

                <Container.Row className="mb-3">
                  <Container.Col columns="6">
                    <label htmlFor="manufactureDate" className="form-label">
                      Manufactured On
                    </label>
                    <input
                      id="manufactureDate"
                      type="datetime-local"
                      name="manufacturedOn"
                      className="form-control"
                      value={stock.manufacturedOn}
                      onChange={handleChange}
                      disabled={disable.inputs}
                      min="2020-01-01"
                      required
                    />

                    <div className="invalid-feedback">
                      Please select a valid date.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>

                  <Container.Col columns="6">
                    <label htmlFor="manufactureDate" className="form-label">
                      Expiry
                    </label>
                    <input
                      id="expiry"
                      type="datetime-local"
                      name="expiry"
                      className="form-control"
                      value={stock.expiry}
                      onChange={handleChange}
                      disabled={disable.inputs}
                      min="2020-01-01"
                      required
                    />

                    <div className="invalid-feedback">
                      Please select a valid date.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>
                </Container.Row>

                {/* ------------- Show only when adding warehouse stocks ------------ */}
                {type === StockTypes.WAREHOUSE ||
                type === StockTypes.SOLD ||
                (type === "edit" && stock.arrivedOn) ? (
                  <Container.Row className="mb-3">
                    <Container.Col columns="12">
                      <label htmlFor="arrivalDate" className="form-label">
                        Arrived On
                      </label>
                      <div className="input-group">
                        <input
                          id="arrivalDate"
                          type="datetime-local"
                          name="arrivedOn"
                          className="form-control"
                          value={stock.arrivedOn}
                          onChange={handleChange}
                          disabled={disable.inputs}
                          min="2020-01-01"
                          required={
                            type === StockTypes.WAREHOUSE ||
                            type === StockTypes.SOLD ||
                            type === "edit"
                          }
                        />

                        {type !== StockTypes.SOLD && (
                          <div className="input-group-text">
                            <div className="form-check">
                              <input
                                id="inventoryChecked"
                                name="checked"
                                type="checkbox"
                                className="form-check-input"
                                checked={stock.checked}
                                onChange={handleChange}
                                style={{ marginTop: "0.32rem" }}
                                disabled={disable.inputs}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inventoryChecked"
                                style={{ fontSize: "0.9rem" }}
                              >
                                Batch Already Checked
                              </label>
                            </div>
                          </div>
                        )}

                        <div className="invalid-feedback">
                          Please select a valid date.
                        </div>
                        <div className="valid-feedback">Looks good!</div>
                      </div>
                    </Container.Col>
                  </Container.Row>
                ) : null}

                <Container.Row>
                  <Container.Col columns="12">
                    <label htmlFor="stockDesc" className="form-label">
                      Description (Optional)
                    </label>
                    <textarea
                      id="stockDesc"
                      name="description"
                      className="form-control"
                      placeholder="Any description or remarks of the batch here..."
                      style={{ height: "100px" }}
                      value={stock.description}
                      onChange={handleChange}
                    ></textarea>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>
                </Container.Row>
              </form>
            </ModalMenu.Body>

            <ModalMenu.Footer>
              <button
                type="reset"
                className="btn btn-secondary ms-2"
                data-bs-target={backTarget && `#${backTarget}`}
                data-bs-toggle={backTarget && "modal"}
                disabled={disable.resetBtn}
                onClick={resetToDefaults}
              >
                {text.resetBtn}
              </button>

              <SpinnerButton
                type="submit"
                role="status"
                className="btn btn-success ms-2"
                isLoading={loading}
                onClick={handleSubmit}
                disabled={disable.submitBtn}
              >
                {text.submitBtn}
              </SpinnerButton>
            </ModalMenu.Footer>
          </ModalMenu.Content>
        </ModalMenu.Dialog>
      </ModalMenu>

      <CourierMenu type={type} />
    </>
  );
}

export default AddStockMenu;
