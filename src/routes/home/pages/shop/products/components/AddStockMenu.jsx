import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalMenu from "../../../../common/menus/ModalMenu";
import Spinner from "../../../components/spinner";
import {
  selectProductDetails,
  selectProductImportedCSV,
  selectProductPushStatus,
} from "../../../../../../app/state/slices/data/product/selectors";
import Constants from "../../../../../../app/state/slices/constants";
import { pushStock } from "../../../../../../app/state/slices/data/product/async-thunks";
import {
  abortCSVImport,
  setIdle,
} from "../../../../../../app/state/slices/data/product";
import { nanoid } from "@reduxjs/toolkit";

const INIT_FORM_VAL = {
  batch: "",
  description: "",
  quantity: 0,
  pricePerUnit: 0,
  purchasedOn: new Date().toISOString(),
  manufacturedOn: new Date().toISOString(),
  expiry: new Date().toISOString(),
  courier: "",
  arrivedOn: "",
};

const INIT_BTN_STATE = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
  inputCode: false,
};

function AddStockMenu({ id, backTarget, title }) {
  const dispatch = useDispatch();

  const dataInDetails = useSelector(selectProductDetails);
  const couriers = [
    {
      _id: nanoid(),
      name: "J&T",
    },
    {
      _id: nanoid(),
      name: "Capex",
    },
    {
      _id: nanoid(),
      name: "EMR",
    },
    {
      _id: nanoid(),
      name: "AP Cargo",
    },
  ];

  const saveStatus = useSelector(selectProductPushStatus);
  const importedCSV = useSelector(selectProductImportedCSV);

  const [stock, setStock] = useState(INIT_FORM_VAL);
  const [disable, setDisable] = useState(INIT_BTN_STATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addStockForm = document.getElementById("addStockForm");

    if (addStockForm.checkValidity()) {
      setDisable({
        submitBtn: true,
        resetBtn: true,
        inputs: true,
        inputCode: true,
      });

      if (importedCSV) dispatch(pushStock(importedCSV));
      else
        dispatch(
          pushStock({ ...stock, _id: dataInDetails._id, _type: "inbound" })
        );

      addStockForm.classList.remove("was-validated");
    } else {
      addStockForm.classList.add("was-validated");
    }
  };

  const handleChange = (e) => {
    setDisable({
      submitBtn: false,
      resetBtn: false,
      inputs: false,
      inputCode: false,
    });

    const name = e.target.name,
      value = e.target.value;

    setStock({
      batch: name === "batch" ? value.toUpperCase() : stock.batch,
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

  const resetAll = useCallback(() => {
    // Revert all states to INIT
    setDisable(INIT_BTN_STATE);
    setStock(INIT_FORM_VAL);

    // Make sure to clear CSV imports only if there is a
    // CSV currently imported
    if (!!importedCSV) {
      dispatch(abortCSVImport());
      document.getElementById("csvImportBtn").value = "";
    }
  }, [dispatch, importedCSV]);

  useEffect(() => {
    if (saveStatus === Constants.SUCCESS) {
      // If a save action is a success, always
      // reset everyting to defaults
      resetAll();

      saveStatus !== Constants.IDLE &&
        dispatch(setIdle(Constants.DataService.PUSH));
    } else if (saveStatus === Constants.FAILED) {
      // Otherwise, only reset the button state
      // so the user has a chance to re-edit
      setDisable({
        submitBtn: true,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });

      saveStatus !== Constants.IDLE &&
        dispatch(setIdle(Constants.DataService.PUSH));
    }
  }, [dispatch, resetAll, saveStatus]);

  const batchPlaceholder = useMemo(() => {
    return Math.ceil(Math.random() * 100000000);
  }, []);

  return (
    <ModalMenu
      id={id}
      fade={true}
      static={true}
      title={title}
      headerBtn={
        <button
          className="btn py-1 px-2"
          data-bs-target={`#${backTarget}`}
          data-bs-toggle="modal"
          data-bs-dismiss="modal"
        >
          Back
        </button>
      }
      body={
        <form
          id="addStockForm"
          className="container-fluid needs-validation mb-2"
        >
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row row-cols-auto g-2 mb-3">
            <div className="col-12">
              <label htmlFor="productCode" className="form-label">
                Batch Number
              </label>
              <div className="input-group">
                <input
                  id="productCode"
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
                {disable.inputCode ? null : (
                  <button
                    id="qrBtn"
                    type="button"
                    className="btn btn-outline-secondary"
                    // data-bs-toggle="modal"
                    // data-bs-target="#addProductScannerModal"
                    disabled={disable.inputs}
                    aria-label="Scan Batch Code"
                  >
                    <i className="fa fa-qrcode"></i>
                  </button>
                )}
                <div className="invalid-feedback">Invalid serial number.</div>
                <div className="valid-feedback">Looks good!</div>
              </div>
            </div>
          </div>
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row row-cols-auto g-3 mb-3">
            <div className="col-6">
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
                <div className="invalid-feedback">Cannot be less than 1.</div>
                <div className="valid-feedback">Looks good!</div>
              </div>
            </div>
            <div className="col-6">
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
                <div className="invalid-feedback">Cannot be less than 1.</div>
                <div className="valid-feedback">Looks good!</div>
              </div>
            </div>
          </div>
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row row-cols-2 g-3 mb-3">
            <div className="col-6">
              <label htmlFor="purchaseDate" className="form-label">
                Purchased On
              </label>
              <input
                id="purchaseDate"
                type="date"
                name="purchasedOn"
                value={stock.purchasedOn}
                placeholder="{units[0]}"
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
            </div>
            <div className="col-sm-6">
              <label htmlFor="courier" className="form-label">
                Courier
              </label>
              <select
                id="courier"
                name="courier"
                className="form-select"
                aria-label="Select courier"
                value={stock.courier}
                onChange={handleChange}
                disabled={disable.inputs}
              >
                {couriers.map(({ _id, name }) => (
                  <option key={_id} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                Please select a valid category.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
          </div>
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row row-cols-auto g-3">
            <div className="col-6">
              <label htmlFor="manufactureDate" className="form-label">
                Manufactured On
              </label>
              <input
                id="manufactureDate"
                type="date"
                name="manufacturedOn"
                className="form-control"
                placeholder="{units[0]}"
                value={stock.manufacturedOn}
                onChange={handleChange}
                disabled={disable.inputs}
                min="2020-01-01"
              />

              <div className="invalid-feedback">
                Please select a valid date.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-6">
              <label htmlFor="manufactureDate" className="form-label">
                Expiry
              </label>
              <input
                id="expiry"
                type="date"
                name="expiry"
                className="form-control"
                placeholder="{units[0]}"
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
            </div>
          </div>
        </form>
      }
      footer={
        <>
          <button
            id="resetBtn"
            type="reset"
            className="btn btn-secondary ms-2"
            disabled={disable.resetBtn}
            onClick={resetAll}
          >
            Reset
          </button>
          <button
            id="submitBtn"
            type="submit"
            className="btn btn-success ms-2"
            role="status"
            onClick={handleSubmit}
            disabled={disable.submitBtn}
          >
            {saveStatus !== Constants.IDLE ? (
              <Spinner addClass="spinner-border-sm">Save</Spinner>
            ) : (
              "Save"
            )}
          </button>
        </>
      }
    />
  );
}

export default AddStockMenu;
