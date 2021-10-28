// import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../../../../../../common/Card";
import Container from "../../../../../../common/Container";

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
    <Card>
      <Card.Body>
        <Card.Title h6>Add Customer</Card.Title>
        <form id="addCustomerForm" className="needs-validation">
          <Container.Row g="2" className="mb-3">
            <Container.Col modifier="sm" columns="7">
              <label htmlFor="customerName" className="form-label">
                First Name
              </label>
              <input id="customerName" type="text" className="form-control" />
              <div className="invalid-feedback">
                Please select a valid name.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </Container.Col>
            <Container.Col modifier="sm" columns="5">
              <label htmlFor="customerName" className="form-label">
                Last Name
              </label>
              <input id="customerName" type="text" className="form-control" />
              <div className="invalid-feedback">
                Please select a valid name.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </Container.Col>
          </Container.Row>

          <Container.Row g="2" className="mb-3">
            <Container.Col>
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
              <div className="invalid-feedback">
                Please select a valid contact number.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </Container.Col>
            <Container.Col columns="6">
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
                Please select a valid customer type.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </Container.Col>
          </Container.Row>

          <Container.Row g="2" className="mb-3">
            <Container.Col>
              <label htmlFor="customerAddress" className="form-label">
                Address
              </label>
              <textarea
                id="customerAddress"
                type="text"
                name="address"
                className="form-control"
              />
              <div className="invalid-feedback">
                Please enter a address name.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </Container.Col>
          </Container.Row>

          <Container.Row g="2" className="mt-3">
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
          </Container.Row>
        </form>
      </Card.Body>
    </Card>
  );
}

export default AddCustomerForm;
