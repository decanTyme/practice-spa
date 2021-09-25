// import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../../../../../common/Card";

function AddCustomerForm({ className }) {
  // const [customer, setCustomer]= useState()
  // const [text, setText] = useState();
  // const [disable, setDisable] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const resetAll = () => {
    // Revert all states to INIT
    // setDisable();
    // setText();
    // setCustomer(INIT_FOR_VAL);
    // Make sure to reset only if there is a product currently in edit
    // if (!!customerInEdit) dispatch(resetAllCustomerModification());
    // Make sure to clear CSV imports only if there is a
    // CSV currently imported
    // if (!!importedCSV) {
    //   dispatch(abortCSVImport());
    //   document.getElementById("csvImportBtn").value = "";
    // }
  };

  return (
    <Card
      className={className}
      customTitle={<h6 className="card-title mb-3">Add Customer</h6>}
    >
      <div>
        <form id="addCustomerForm" className="needs-validation">
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mb-3">
            <div className="col-sm-7">
              <label htmlFor="customerName" className="form-label">
                First Name
              </label>
              <input id="customerName" type="text" className="form-control" />
              <div className="invalid-feedback">
                Please select a valid name.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-sm-5">
              <label htmlFor="customerName" className="form-label">
                Last Name
              </label>
              <input id="customerName" type="text" className="form-control" />
              <div className="invalid-feedback">
                Please select a valid name.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
          </div>
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mb-3">
            <div className="col">
              <label htmlFor="contactNum" className="form-label">
                Contact Number
              </label>
              <input
                id="contactNum"
                type="tel"
                name="contact"
                className="form-control"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              />
            </div>
            <div className="col-6">
              <label htmlFor="customerName" className="form-label">
                Type
              </label>
              <select
                id="customerName"
                className="form-select"
                aria-label="Customer retail type"
              >
                <option defaultValue>Retail</option>
                <option value="Retail">Bulkers</option>
                <option value="Reseller">Reseller</option>
                <option value="City Distributor">City Distributor</option>
                <option value="Provincial Distributor">
                  Provincial Distributor
                </option>
              </select>

              <div className="invalid-feedback">
                Please select a valid unit.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
          </div>
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mb-3">
            <div className="col">
              <label htmlFor="customerAddress" className="form-label">
                Address
              </label>
              <textarea
                id="customerAddress"
                type="text"
                name="address"
                className="form-control"
              />
            </div>
          </div>
          <div className="row g-2 mt-3">
            <div className="d-flex flex-row justify-content-end">
              {/* <label
                htmlFor="csvImportBtn"
                className="bt-file-upload btn btn-primary"
              >
                Import CSV
              </label>
              <input
                id="csvImport"
                type="file"
                accept=".csv"
                className="form-control form-control-sm"
                onChange={onImportCSV}
              /> */}

              <button
                id="resetBtn"
                type="reset"
                className="btn btn-secondary ms-2"
                // disabled={disable.resetBtn}
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
                // disabled={disable.submitBtn}
              >
                {/* {saveStatus !== Constants.IDLE ||
                modifyStatus !== Constants.IDLE ? (
                  <Spinner addClass="spinner-border-sm">{text.saveBtn}</Spinner>
                ) : (
                  text.saveBtn
                )} */}
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default AddCustomerForm;
