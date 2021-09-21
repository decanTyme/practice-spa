import "./add-product-form.css";
import { useEffect, useState } from "react";
import Spinner from "../../../../components/spinner";
import {
  pushData,
  updateData,
  selectDataInEdit,
  selectDataCode,
} from "../../../../../../../app/state/slices/data";
import { useDispatch } from "react-redux";
import { setStale } from "../../../../../../../app/state/slices/auth";
import { useSelector } from "react-redux";

const INIT_FORM_VAL = {
  name: "",
  code: "",
  brand: "",
  class: "",
  category: "",
  quantity: 0,
  unit: "",
  price: 0,
  salePrice: 0,
};

const INIT_STATES_BTN = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
  inputCode: false,
};

function AddProductForm() {
  const editData = useSelector(selectDataInEdit);
  const code = useSelector(selectDataCode);
  const [product, setProduct] = useState(INIT_FORM_VAL);
  const [status, setStatus] = useState("idle");
  const [disable, setDisable] = useState(INIT_STATES_BTN);
  const [btnText, setText] = useState("Save");
  const dispatch = useDispatch();

  useEffect(() => {
    if (code) {
      setProduct({ ...product, code });
    }
    // eslint-disable-next-line
  }, [code]);

  useEffect(() => {
    if (editData) {
      setProduct(editData);
      setDisable({
        submitBtn: false,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });
      setText("Update");
    }

    return () => {
      setProduct(INIT_FORM_VAL);
      setDisable(INIT_STATES_BTN);
      setText("Save");
    };
  }, [editData]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const addProductForm = document.getElementById("addProductForm");

    if (addProductForm.checkValidity()) {
      try {
        setStatus("pending");
        setDisable({
          submitBtn: true,
          resetBtn: true,
          inputs: true,
          inputCode: true,
        });
        if (editData)
          await dispatch(
            updateData({ ...product, _id: editData._id })
          ).unwrap();
        else await dispatch(pushData(product)).unwrap();
        setProduct(INIT_FORM_VAL);
        setText("Save");
        addProductForm.classList.remove("was-validated");
      } catch (err) {
        console.error("Failed to save the post: ", err);
        dispatch(setStale(true));
      } finally {
        setStatus("idle");
        setDisable(INIT_STATES_BTN);
      }
    } else {
      addProductForm.classList.add("was-validated");
    }
  };

  const handleChange = (e) => {
    setDisable({
      submitBtn: false,
      resetBtn: false,
      inputs: false,
      inputCode: editData ? true : false,
    });

    const name = e.target.name,
      value = e.target.value;

    setProduct({
      name: name === "name" ? value : product.name,
      code: name === "code" ? value : product.code,
      brand: name === "brand" ? value : product.brand,
      class: name === "class" ? value : product.class,
      category: name === "category" ? value : product.category,
      quantity: name === "quantity" ? value : product.quantity,
      unit: name === "unit" ? value : product.unit,
      price: name === "price" ? value : product.price,
      salePrice: name === "salePrice" ? value : product.salePrice,
    });
  };

  const onClear = () => {
    setDisable({ submitBtn: true, resetBtn: true, inputs: false });
    setText("Save");
    setProduct(INIT_FORM_VAL);
  };

  return (
    <div className="card border bg-white add-product-form">
      <div className="card-body">
        <h6 className="card-title">{editData ? "Edit" : "Add"} Product</h6>
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
                  placeholder="1234"
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
                  placeholder="SkinBliss"
                  value={product.brand}
                  onChange={handleChange}
                  disabled={disable.inputs}
                  required
                />
                <datalist id="brandList">
                  <option value="" />
                  <option value="Skin Bliss" />
                  <option value="Skin Can Tell" />
                  <option value="Ryx" />
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
                placeholder="Beauty Product"
                value={product.class}
                onChange={handleChange}
                disabled={disable.inputs}
                required
              />
              <datalist id="productClassList">
                <option value="" />
                <option value="Beauty Product" />
                <option value="General Merchandise" />
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
                placeholder="Facial Cleanser"
                value={product.category}
                onChange={handleChange}
                disabled={disable.inputs}
                required
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
          </div>

          {/* ------------------------------ Row ------------------------------ */}
          <div className="row g-2 mt-1 align-items-center">
            <div className="col-sm-6">
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
                onChange={handleChange}
                disabled={disable.inputs}
                required
              />
              <div className="invalid-feedback">Cannot be less than 1.</div>
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="productUnit" className="form-label">
                Unit
              </label>
              <input
                className="form-control"
                list="unitList"
                id="productUnit"
                name="unit"
                placeholder="Pack Size"
                value={product.unit}
                onChange={handleChange}
                disabled={disable.inputs}
                required
              />
              <datalist id="unitList">
                <option value="" />
                <option value="Set" />
                <option value="Packet" />
                <option value="Bundle" />
              </datalist>
              <div className="invalid-feedback">
                Please select a valid unit.
              </div>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  {status !== "idle" ? (
                    <Spinner addClass="spinner-border-sm">{btnText}</Spinner>
                  ) : (
                    btnText
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
