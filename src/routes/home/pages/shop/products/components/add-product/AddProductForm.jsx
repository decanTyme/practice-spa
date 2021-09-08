import "./add-product.css";
import { useState } from "react";
import Spinner from "../../../../components/spinner";
import useAuthManager from "../../../../../../../services/providers/auth";
import useNotifyService from "../../../../../../../services/providers/notification";

const INIT_FORM_VAL = {
  name: "",
  code: "",
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
  const [isLoading, setLoadingState] = useState(false);
  const auth = useAuthManager();
  const notifier = useNotifyService();

  const onSubmit = (e) => {
    e.preventDefault();
    const addProductForm = document.getElementById("addProductForm");

    if (addProductForm.checkValidity()) {
      setLoadingState(true);
      setDisable({ submitBtn: true, resetBtn: true, inputs: false });
      auth
        .pushData(product)
        .then((response) => {
          if (response?.success) {
            props.updateProducts(response.product);
          }
        })
        .catch((error) => {
          notifier.notify({
            title: "An error occured during saving",
            message: `${error.message} Trying to reauthenticate...`,
          });
        })
        .finally(() => {
          setProduct(INIT_FORM_VAL);
          setDisable({ submitBtn: true, resetBtn: true, inputs: false });
          setLoadingState(false);
        });
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
    <div className="border border-secondary bg-white bg-opacity-25 rounded-1 shadow p-3 add-product-form">
      <h3 className="text-center">Add a Product</h3>
      <form id="addProductForm" className="needs-validation" noValidate>
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
          </div>
          <div className="col-sm-2">
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
          </div>
        </div>

        {/* ------------------------------ Row ------------------------------ */}
        <div className="row g-2 mt-1 align-items-center">
          <div className="col-sm-3">
            <label htmlFor="productClass" className="form-label">
              Class
            </label>
            <input
              id="productClass"
              type="text"
              className="form-control"
              placeholder="Beauty Product"
              name="class"
              value={product.class}
              onChange={handleChangeOn}
              disabled={disable.inputs}
              required
            />
            <div className="invalid-feedback">Cannot be empty.</div>
          </div>
          <div className="col-sm-3">
            <label htmlFor="productCategory" className="form-label">
              Category
            </label>
            <select
              required
              id="productCategory"
              name="category"
              form="addProductForm"
              className="form-select"
              aria-label="Category"
              value={product.category}
              onChange={handleChangeOn}
              disabled={disable.inputs}
            >
              <option defaultValue></option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">A Very Long Category</option>
            </select>
            <div className="invalid-feedback">
              Please select a valid category.
            </div>
          </div>

          <div className="col-sm-1 col-md-2">
            <div>
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
            </div>
          </div>
          <div className="col-sm-2">
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
            </div>
          </div>
          <div className="col-sm-2">
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
                {isLoading ? (
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
  );
}

export default AddProductForm;
