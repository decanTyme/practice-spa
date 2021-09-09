import "./add-product.css";
import { useState } from "react";
import Spinner from "../../../../components/spinner";
import useDataService from "../../../../../../../services/providers/data";

const INIT_FORM_VAL = {
  name: "",
  code: "",
  brand: "",
  class: "",
  category: "",
  quantity: 0,
  price: 0,
  salePrice: 0,
};

const INIT_STATES_BTN = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
};

function AddProductForm(props) {
  const [product, setProduct] = useState(INIT_FORM_VAL);
  const [disable, setDisable] = useState(INIT_STATES_BTN);
  const ds = useDataService();

  const onSubmit = (e) => {
    e.preventDefault();
    const addProductForm = document.getElementById("addProductForm");

    if (addProductForm.checkValidity()) {
      if (ds.addItem(product)) setDisable(INIT_STATES_BTN);
      if (ds.isAdding) {
        setDisable({ submitBtn: true, resetBtn: true, inputs: true });
      }
    } else {
      addProductForm.classList.add("was-validated");
    }
  };

  const handleChangeOn = (e) => {
    setDisable({ submitBtn: false, resetBtn: false, inputs: false });

    const name = e.target.name,
      value = e.target.value;

    setProduct({
      name: name === "name" ? value : product.name,
      code: name === "code" ? value : product.code,
      brand: name === "brand" ? value : product.brand,
      class: name === "class" ? value : product.class,
      category: name === "category" ? value : product.category,
      quantity: name === "quantity" ? value : product.quantity,
      price: name === "price" ? value : product.price,
      salePrice: name === "salePrice" ? value : product.salePrice,
    });
  };

  const onClear = () => {
    setDisable({ submitBtn: true, resetBtn: true, inputs: false });

    setProduct(INIT_FORM_VAL);
  };

  return (
    <div className="card border bg-white add-product-form">
      <div className="card-body">
        <h6 className="card-title">Add a Product</h6>
        <form
          id="addProductForm"
          className="card-text needs-validation"
          noValidate
        >
          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mt-3 align-items-center">
            <div className="col">
              <label htmlFor="productName" className="form-label">
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                name="name"
                className="form-control"
                placeholder="SkinBliss Facial Cream"
                value={product.name}
                onChange={handleChangeOn}
                disabled={disable.inputs}
                required
              />
              <div className="invalid-feedback">Cannot be empty.</div>
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-sm-4">
              <label htmlFor="productCode" className="form-label">
                Code
              </label>
              <input
                id="productCode"
                type="text"
                name="code"
                className="form-control"
                placeholder="SB123"
                value={product.code}
                onChange={handleChangeOn}
                disabled={disable.inputs}
                required
              />
              <div className="invalid-feedback">Cannot be empty.</div>
              <div className="valid-feedback">Looks good!</div>
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
                  placeholder="SkinBliss"
                  value={product.brand}
                  onChange={handleChangeOn}
                  disabled={disable.inputs}
                />
                <datalist id="brandList">
                  <option value="" />
                  <option value="Skin Bliss" />
                  <option value="Skin Can Tell" />
                  <option value="Toner" />
                  <option value="Lipstick" />
                </datalist>
                <div className="invalid-feedback">
                  Please select a valid category.
                </div>
                <div className="valid-feedback">Looks good!</div>
              </div>
              <label htmlFor="productClass" className="form-label">
                Class
              </label>
              <input
                className="form-control"
                list="productClassList"
                id="productClass"
                name="class"
                placeholder="Beauty Product"
                value={product.class}
                onChange={handleChangeOn}
                disabled={disable.inputs}
              />
              <datalist id="productClassList">
                <option value="" />
                <option value="Facial Cleanser" />
                <option value="Facial Scrub" />
                <option value="Toner" />
                <option value="Lipstick" />
              </datalist>
              <div className="invalid-feedback">
                Please select a valid class.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
          </div>

          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mt-1 align-items-center">
            <div className="col">
              <label htmlFor="productCategory" className="form-label">
                Category
              </label>
              <input
                className="form-control"
                list="categoryList"
                id="productCategory"
                name="category"
                placeholder="Facial Cleanser"
                value={product.category}
                onChange={handleChangeOn}
                disabled={disable.inputs}
              />
              <datalist id="categoryList">
                <option value="" />
                <option value="Facial Cleanser" />
                <option value="Facial Scrub" />
                <option value="Toner" />
                <option value="Lipstick" />
              </datalist>
              <div className="invalid-feedback">
                Please select a valid category.
              </div>
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-sm-5">
              <label htmlFor="productQuantity" className="form-label">
                Quantity
              </label>
              <input
                id="productQuantity"
                type="number"
                className="form-control"
                placeholder="50"
                name="quantity"
                min={1}
                value={product.quantity}
                onChange={handleChangeOn}
                disabled={disable.inputs}
                required
              />
              <div className="invalid-feedback">Cannot be less than 1.</div>
              <div className="valid-feedback">Looks good!</div>
            </div>
          </div>

          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mt-1 align-items-center">
            <div className="col-sm-6">
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
                  onChange={handleChangeOn}
                  disabled={disable.inputs}
                  required
                />
                <div className="invalid-feedback">Cannot be less than 1.</div>
                <div className="valid-feedback">Looks good!</div>
              </div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="productSalePrice" className="form-label">
                Sale Price
              </label>
              <div className="input-group">
                <span className="input-group-text">Php</span>
                <input
                  id="productSalePrice"
                  type="number"
                  className="form-control"
                  placeholder="Optional"
                  name="salePrice"
                  min={0}
                  value={product.salePrice}
                  onChange={handleChangeOn}
                  disabled={disable.inputs}
                />
                <div className="invalid-feedback">Cannot be less than 1.</div>
                <div className="valid-feedback">Looks good!</div>
              </div>
            </div>
          </div>

          {/* ------------------------------ Row ------------------------------ */}
          <div className="row mt-3 align-items-center">
            <div className="col-md-12">
              <div className="d-flex flex-row justify-content-end">
                <button
                  id="qrBtn"
                  type="button"
                  className="btn btn-secondary ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#addProductScannerModal"
                >
                  <i className="fa fa-qrcode"></i>
                </button>
                <button
                  id="resetBtn"
                  type="reset"
                  className="btn btn-secondary ms-2"
                  disabled={disable.resetBtn}
                  onClick={onClear}
                >
                  Reset
                </button>
                <button
                  id="submitBtn"
                  type="submit"
                  className="btn btn-success ms-2"
                  role="status"
                  onClick={onSubmit}
                  disabled={disable.submitBtn}
                >
                  {ds.isAdding ? (
                    <Spinner addClass="spinner-border-sm">Save</Spinner>
                  ) : (
                    "Save"
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
