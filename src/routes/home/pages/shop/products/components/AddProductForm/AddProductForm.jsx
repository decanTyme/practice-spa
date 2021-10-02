import "./add-product-form.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse";
import Spinner from "../../../../components/spinner";
import {
  selectProductInEdit,
  selectProductScannedCode,
  selectProductPushStatus,
  selectProductImportedCSV,
  selectAllBrands,
  selectAllClasses,
  selectAllCategories,
  selectAllUnits,
  selectProductModifyStatus,
} from "../../../../../../../app/state/slices/data/product/selectors";
import Constants from "../../../../../../../app/state/slices/constants";
import {
  pushProduct,
  updateProduct,
} from "../../../../../../../app/state/slices/data/product/async-thunks";
import {
  abortCSVImport,
  importCSV,
  resetAllProductModification,
  setIdle,
} from "../../../../../../../app/state/slices/data/product";

const INIT_FORM_VAL = {
  name: "",
  code: "",
  brand: "",
  _class: "",
  category: "",
  stock: { quantity: { inbound: 0, warehouse: 1, shipped: 0 }, unit: "Set" },
  price: 0,
  salePrice: 0,
};

const INIT_BTN_STATE = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
  inputCode: false,
};

const INIT_BTN_TEXT = {
  saveBtn: "Save",
  resetBtn: "Reset",
};

function AddProductForm() {
  const productInEdit = useSelector(selectProductInEdit);
  const scannedCode = useSelector(selectProductScannedCode);
  const importedCSV = useSelector(selectProductImportedCSV);

  const brands = useSelector(selectAllBrands);
  const classes = useSelector(selectAllClasses);
  const categories = useSelector(selectAllCategories);
  const units = useSelector(selectAllUnits);

  const saveStatus = useSelector(selectProductPushStatus);
  const modifyStatus = useSelector(selectProductModifyStatus);

  const [product, setProduct] = useState(INIT_FORM_VAL);
  const [addStock, setAddStock] = useState(false);
  const [disable, setDisable] = useState(INIT_BTN_STATE);
  const [text, setText] = useState(INIT_BTN_TEXT);
  const dispatch = useDispatch();

  useEffect(() => {
    if (scannedCode) {
      setProduct({ ...product, code: scannedCode });
    }
    // eslint-disable-next-line
  }, [scannedCode]);

  useEffect(() => {
    if (productInEdit) {
      setProduct(productInEdit);

      setDisable({
        submitBtn: false,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });

      setText({
        saveBtn: "Update",
        resetBtn: "Cancel",
      });
    }

    return () => {
      setProduct(INIT_FORM_VAL);
      setDisable(INIT_BTN_STATE);
      setText(INIT_BTN_TEXT);
    };
  }, [productInEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addProductForm = document.getElementById("addProductForm");

    if (addProductForm.checkValidity()) {
      setDisable({
        submitBtn: true,
        resetBtn: true,
        inputs: true,
        inputCode: true,
      });

      if (productInEdit)
        dispatch(
          updateProduct({
            ...product,
            _id: productInEdit._id,
            stock: { ...product.stock, _id: productInEdit.stock._id },
          })
        );
      else if (importedCSV) dispatch(pushProduct(importedCSV));
      else dispatch(pushProduct(product));

      addProductForm.classList.remove("was-validated");
    } else {
      addProductForm.classList.add("was-validated");
    }
  };

  const handleChange = (e) => {
    setDisable({
      submitBtn: false,
      resetBtn: false,
      inputs: false,
      inputCode: productInEdit ? true : false,
    });

    const name = e.target.name,
      value = e.target.value;

    setProduct({
      code: name === "code" ? value : product.code,
      brand: name === "brand" ? value : product.brand,
      name: name === "name" ? value : product.name,
      _class: name === "class" ? value : product._class,
      category: name === "category" ? value : product.category,
      price: name === "price" ? parseInt(value) : parseInt(product.price),
      stock: {
        quantity: {
          ...product.stock.quantity,
          warehouse:
            name === "quantity"
              ? parseInt(value)
              : parseInt(product.stock.quantity.warehouse),
        },
        unit: name === "unit" ? value : product.stock.unit,
      },
    });
  };

  const onImportCSV = (e) => {
    const csvFiles = e.target.files;

    // Set some UI states
    setDisable({
      submitBtn: false,
      resetBtn: false,
      inputs: true,
      inputCode: false,
    });

    setText({
      saveBtn: "Save",
      resetBtn: "Cancel",
    });

    // If there was a previously imported CSV, clear that first
    if (!!importedCSV) dispatch(abortCSVImport());

    // Finally, parse CSV and import to datastore
    Papa.parse(csvFiles[0], {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const transformedResults = results.data
          .map((item) => {
            return {
              code: item["S/N"],
              brand: item.BRAND,
              name: item.PRODUCT_NAME,
              _class: item.CLASS,
              category: item.CATEGORY,
              prices: [
                { label: "Retail", value: item.RETAIL },
                { label: "Reseller", value: item.RESELLER },
                { label: "Bulker", value: item.BULKER },
                { label: "City Distributor", value: item.CITY_DISTRIBUTOR },
                {
                  label: "Provincial Distributor",
                  value: item.PROVINCIAL_DISTRIBUTOR,
                },
              ],
              stock: {
                quantity: {
                  inbound: item.INBOUND,
                  warehouse: item.WAREHOUSE,
                  shipped: item.SHIPPED,
                },
                unit: item.UNIT,
              },
            };
          })
          .filter(({ code }) => code !== null);
        dispatch(importCSV(transformedResults));
      },
    });
  };

  const resetAll = useCallback(() => {
    // Revert all states to INIT
    setDisable(INIT_BTN_STATE);
    setText(INIT_BTN_TEXT);
    setProduct(INIT_FORM_VAL);

    // Make sure to reset only if there is a product currently in edit
    if (!!productInEdit) dispatch(resetAllProductModification());

    // Make sure to clear CSV imports only if there is a
    // CSV currently imported
    if (!!importedCSV) {
      dispatch(abortCSVImport());
      document.getElementById("csvImportBtn").value = "";
    }
  }, [dispatch, importedCSV, productInEdit]);

  const setStatusIdle = useCallback(() => {
    saveStatus !== Constants.IDLE &&
      dispatch(setIdle(Constants.DataService.PUSH));

    modifyStatus !== Constants.IDLE &&
      dispatch(setIdle(Constants.DataService.MODIFY));
  }, [dispatch, modifyStatus, saveStatus]);

  useEffect(() => {
    if (
      saveStatus === Constants.SUCCESS ||
      modifyStatus === Constants.SUCCESS
    ) {
      // If a save action is a success, always
      // reset everyting to defaults
      resetAll();
      setStatusIdle();
    } else if (
      saveStatus === Constants.FAILED ||
      modifyStatus === Constants.FAILED
    ) {
      // Otherwise, only reset the button state
      // so the user has a chance to re-edit
      setDisable({
        submitBtn: true,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });
      setStatusIdle();
    }
  }, [dispatch, resetAll, setStatusIdle, saveStatus, modifyStatus]);

  const codePlaceholder = useMemo(() => {
    return Math.ceil(Math.random() * 100000000);
  }, []);

  return (
    <div className="card border add-product-form">
      <div className="card-body">
        <h6 className="card-title">{productInEdit ? "Edit" : "Add"} Product</h6>
        <form id="addProductForm" className="needs-validation">
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mt-1 align-items-center">
            <div className="col">
              <label htmlFor="productName" className="form-label">
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                name="name"
                className="form-control"
                placeholder="Facial Cream"
                value={product.name}
                onChange={handleChange}
                disabled={disable.inputs}
                required
                pattern="[a-zA-Z0-9- ]+"
              />
              <div className="invalid-feedback">Cannot be empty.</div>
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-sm-5">
              <label htmlFor="productCode" className="form-label">
                S/N
              </label>
              <div className="input-group">
                <input
                  id="productCode"
                  type="text"
                  name="code"
                  className="form-control"
                  placeholder={codePlaceholder}
                  value={product.code}
                  onChange={handleChange}
                  disabled={disable.inputs || disable.inputCode}
                  required
                  pattern="[0-9]+"
                />
                {disable.inputCode ? null : (
                  <button
                    id="qrBtn"
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#addProductScannerModal"
                    disabled={disable.inputs}
                    aria-label="Scan QR code"
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
          <div className="row g-2 mt-1 align-items-center">
            <div className="col">
              <div className="col">
                <label htmlFor="productBrand" className="form-label">
                  Brand
                </label>
                <input
                  className="form-control"
                  list="brandList"
                  id="productBrand"
                  name="brand"
                  placeholder={brands[0]}
                  value={product.brand}
                  onChange={handleChange}
                  disabled={disable.inputs}
                  required
                />
                <datalist id="brandList">
                  {brands.map((brand) => (
                    <option key={brand} value={brand} />
                  ))}
                </datalist>
                <div className="invalid-feedback">
                  Please select a valid brand.
                </div>
                <div className="valid-feedback">Looks good!</div>
              </div>
            </div>
          </div>

          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mt-1 align-items-center">
            <div className="col-sm-6">
              <label htmlFor="productClass" className="form-label">
                Class
              </label>
              <input
                className="form-control"
                list="productClassList"
                id="productClass"
                name="class"
                placeholder={classes[0]}
                value={product._class}
                onChange={handleChange}
                disabled={disable.inputs}
                required
              />
              <datalist id="productClassList">
                {classes.map((_class) => (
                  <option key={_class} value={_class} />
                ))}
              </datalist>
              <div className="invalid-feedback">
                Please select a valid class.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="productCategory" className="form-label">
                Category
              </label>
              <input
                className="form-control"
                list="categoryList"
                id="productCategory"
                name="category"
                placeholder={categories[0]}
                value={product.category}
                onChange={handleChange}
                disabled={disable.inputs}
                required
              />
              <datalist id="categoryList">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              <div className="invalid-feedback">
                Please select a valid category.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
          </div>

          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mt-1 align-items-center">
            <div className="col">
              <label htmlFor="productPrice" className="form-label">
                Price
              </label>
              <div className="input-group">
                <span className="input-group-text">Php</span>
                <input
                  id="productPrice"
                  type="number"
                  className="form-control"
                  placeholder="225"
                  name="price"
                  value={product.price}
                  min={1}
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
          <div className="row g-2 mt-3 align-items-center d-flex align-items-center">
            <div className="col">
              <div className="form-check m-0">
                <input
                  id="addStockCheckbox"
                  className="form-check-input"
                  type="checkbox"
                  value={addStock}
                  onChange={(e) => setAddStock(e.target.checked)}
                  disabled={disable.inputs}
                />
                <label className="form-check-label" htmlFor="addStockCheckbox">
                  {productInEdit ? "Edit" : "Add"} Stock
                </label>
              </div>
            </div>
            <div className="col form-floating">
              <input
                id="productQuantity"
                type="number"
                className="form-control"
                placeholder="50"
                name="quantity"
                min={1}
                value={product.stock.quantity.warehouse}
                onChange={handleChange}
                disabled={disable.inputs || !addStock}
                required
              />
              <label htmlFor="productQuantity" className="form-label">
                Quantity
              </label>
              <div className="invalid-feedback">Cannot be less than 1.</div>
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col form-floating">
              <input
                className="form-control"
                list="unitList"
                id="productUnit"
                name="unit"
                placeholder={units[0]}
                value={product.stock.unit}
                onChange={handleChange}
                disabled={disable.inputs || !addStock}
                required
              />
              <label htmlFor="productUnit" className="form-label">
                Unit
              </label>
              <datalist id="unitList">
                {units.map((unit) => (
                  <option key={unit} value={unit} />
                ))}
              </datalist>
              <div className="invalid-feedback">
                Please select a valid unit.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
          </div>

          {/* ------------------------------ Row ------------------------------ */}
          <div className="row mt-4 align-items-center">
            <div className="col-md-12">
              <div className="d-flex flex-row justify-content-end">
                <label
                  htmlFor="csvImportBtn"
                  className="bt-file-upload btn btn-primary ms-2"
                >
                  Import CSV
                </label>
                <input
                  id="csvImportBtn"
                  type="file"
                  accept=".csv"
                  className="form-control form-control-sm"
                  onChange={onImportCSV}
                />

                <button
                  id="resetBtn"
                  type="reset"
                  className="btn btn-secondary ms-2"
                  disabled={disable.resetBtn}
                  onClick={resetAll}
                >
                  {text.resetBtn}
                </button>
                <button
                  id="submitBtn"
                  type="submit"
                  className="btn btn-success ms-2"
                  role="status"
                  onClick={handleSubmit}
                  disabled={disable.submitBtn}
                >
                  {saveStatus !== Constants.IDLE ||
                  modifyStatus !== Constants.IDLE ? (
                    <Spinner addClass="spinner-border-sm">
                      {text.saveBtn}
                    </Spinner>
                  ) : (
                    text.saveBtn
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;
