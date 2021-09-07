import "./add-product.css";
import { useLayoutEffect, useState } from "react";
import Spinner from "../../../../components/spinner";
import useAuthManager from "../../../../../../../services/providers/auth";

function AddProduct(props) {
  const [product, setProduct] = useState({
    name: "",
    code: "",
    class: "",
    category: "",
    quantity: 0,
    price: 0,
    salePrice: 0,
  });
  const [disable, disableOn] = useState(false);
  const [isLoading, setLoadingState] = useState(false);
  const auth = useAuthManager();

  const onSubmit = (e) => {
    e.preventDefault();
    const addProductForm = document.getElementById("addProductForm");

    if (addProductForm.checkValidity()) {
      setLoadingState(true);
      disableOn({ id: "submitBtn" });
      auth
        .pushData(product)
        .then((response) => {
          if (response?.success) {
            props.updateProducts(response.product);
          }
        })
        .finally(() => {
          disableOn(false);
          setLoadingState(false);
        });
    } else {
      addProductForm.classList.add("was-validated");
    }
  };

  const handleChangeOn = (e) => {
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
    setTimeout(() => {
      disableOn({ id: "resetBtn" });
    }, 5);
    setProduct({
      name: "",
      code: "",
      class: "",
      category: "",
      quantity: 0,
      price: 0,
      salePrice: 0,
    });
    setTimeout(() => disableOn(false), 3000);
  };

  useLayoutEffect(() => {
    var forms = document.querySelectorAll(".needs-validation");

    forms.forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  });

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
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
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
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
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
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
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
              onChange={handleChangeOn}
              disabled={disable?.id === "submitBtn" || disable?.id === "all"}
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
                onChange={handleChangeOn}
                disabled={disable?.id === "submitBtn" || disable?.id === "all"}
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
                min={1}
                onChange={handleChangeOn}
                disabled={disable?.id === "submitBtn" || disable?.id === "all"}
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
                onChange={handleChangeOn}
                disabled={disable?.id === "submitBtn" || disable?.id === "all"}
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
                disabled={disable?.id === "resetBtn" || disable}
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
                disabled={disable?.id === "submitBtn" || disable?.id === "all"}
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

export default AddProduct;
