import "./AddProductForm/add-product-form.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse";
import Spinner from "../../../components/spinner";
import {
  selectProductScannedCode,
  selectProductPushStatus,
  selectProductImportedCSV,
  selectAllBrands,
  selectAllClasses,
  selectAllCategories,
  selectAllUnits,
  selectProductModifyStatus,
} from "../../../../../../app/state/slices/data/product/selectors";
import Constants from "../../../../../../app/state/slices/constants";
import {
  pushProduct,
  updateProduct,
} from "../../../../../../app/state/slices/data/product/async-thunks";
import {
  abortCSVImport,
  importCSV,
  resetAllProductModification,
} from "../../../../../../app/state/slices/data/product";
import { Modal, Tooltip } from "bootstrap";
import AddVariantForm from "./AddProductForm/AddVariantForm";
import { selectProductInEdit } from "../../../../../../app/state/slices/data/product/selectors";
import ModalMenu from "../../../../common/menus/ModalMenu";
import { customAlphabet } from "nanoid";
import { isMobile } from "react-device-detect";
import classNames from "classnames";

const INIT_FORM_VAL = {
  name: "",
  code: "",
  brand: "",
  _class: "",
  category: "",
  unit: "single",
  description: "Any description of the product here...",
  images: [],
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

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  20
);

const getInitVariantVal = () => {
  return {
    id: nanoid(),
    name: "",
    value: "",
    prices: [
      {
        id: nanoid(),
        label: "retail",
        value: 0,
        description: "The price for a regular customer.",
      },
      {
        id: nanoid(),
        label: "reseller",
        value: 0,
        description: "The price for a reseller.",
      },
      {
        id: nanoid(),
        label: "bulker",
        value: 0,
        description: "The price for a bulker or wholesaler.",
      },
      {
        id: nanoid(),
        label: "city distributor",
        value: 0,
        description: "The price for a city distributor.",
      },
      {
        id: nanoid(),
        label: "provincial distributor",
        value: 0,
        description: "The price for a provincial distributor.",
      },
      {
        id: nanoid(),
        label: "sale",
        value: 0,
        description: "The price for a regular customer.",
      },
    ],
    description: "Any description of the variant here...",
    images: [],
  };
};

function AddProductMenu() {
  const dispatch = useDispatch();

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    const tooltipList = tooltipTriggerList.map(function (tooltipTrigger) {
      return new Tooltip(tooltipTrigger);
    });

    return () => tooltipList.forEach((tooltip) => tooltip.dispose());
  });

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
  const [variants, setVariants] = useState([getInitVariantVal()]);
  const [disable, setDisable] = useState(INIT_BTN_STATE);
  const [text, setText] = useState(INIT_BTN_TEXT);

  useEffect(() => {
    if (scannedCode) {
      setProduct({ ...product, code: scannedCode });
    }
    // eslint-disable-next-line
  }, [scannedCode]);

  useEffect(() => {
    if (productInEdit) {
      setProduct({
        ...productInEdit,
        images: productInEdit.images.map(({ url }) => url),
      });

      setVariants(
        productInEdit.variants.map((variant) => {
          const newVariant = { ...variant };
          newVariant.id = nanoid();

          newVariant.prices = newVariant.prices.map((price) => {
            const newPrice = { ...price };
            newPrice.id = nanoid();

            return newPrice;
          });

          return newVariant;
        })
      );

      setDisable({
        submitBtn: true,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });

      setText({
        saveBtn: "Update",
        resetBtn: "Cancel",
      });
    }
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
            images: product.images.map((url) => ({ url })),
            variants: variants.map((variant) => {
              variant.prices = variant.prices.map((price) => {
                delete price.id;
                return price;
              });

              delete variant.stocks;
              delete variant.id;
              return variant;
            }),
          })
        );
      // else if (importedCSV) dispatch(pushProduct(importedCSV));
      else
        dispatch(
          pushProduct({
            ...product,
            images: product.images.map((url) => ({ url })),
            variants: variants.map((variant) => {
              variant.prices = variant.prices.map((price) => {
                delete price.id;
                return price;
              });

              delete variant.id;
              return variant;
            }),
          })
        );

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
      ...product,
      code: name === "code" ? value : product.code,
      brand: name === "brand" ? value : product.brand,
      name: name === "name" ? value : product.name,
      _class: name === "class" ? value.toLowerCase() : product._class,
      category: name === "category" ? value.toLowerCase() : product.category,
      description: name === "description" ? value : product.description,
      unit: name === "unit" ? value.toLowerCase() : product.unit,
      images: name === "image" ? value.split(",") : product.images,
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
                  sold: item.SOLD,
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

  const resetToDefaults = useCallback(() => {
    // Make sure to reset all current product modifications
    // only if there is a product currently in edit
    if (productInEdit) {
      // Hide the menu
      return Modal.getOrCreateInstance(
        document.getElementById("addProductMenu")
      ).hide();
    }

    // Make sure to clear CSV imports only if there is a
    // CSV currently imported
    if (importedCSV) {
      dispatch(abortCSVImport());
      document.getElementById("csvImportBtn").value = "";
    }

    // Revert all states to INIT
    setDisable(INIT_BTN_STATE);
    setText(INIT_BTN_TEXT);
    setProduct(INIT_FORM_VAL);
    setVariants([getInitVariantVal()]);
  }, [dispatch, importedCSV, productInEdit]);

  useEffect(() => {

    // If a save or modify action is a success, hide the menu
    if (
      saveStatus === Constants.SUCCESS ||
      modifyStatus === Constants.SUCCESS
    ) {
      // Hide the menu
      Modal.getOrCreateInstance(
      return Modal.getOrCreateInstance(
        document.getElementById("addProductMenu")
      ).hide();
    }

    // Otherwise, only reset the button state
    // so the user has a chance to re-edit
      setDisable({
        submitBtn: true,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });
    }
  // Listen for modal events
  useEffect(() => {
    const productForm = document.getElementById("addProductMenu");

    // When modal is closed, revert all states to INIT
    const hideModalListener = (event) => {
      setDisable(INIT_BTN_STATE);
      setText(INIT_BTN_TEXT);
      setProduct(INIT_FORM_VAL);
      setVariants([getInitVariantVal()]);

      dispatch(resetAllProductModification());
    };

    const hidePreventedListener = (event) => {
      console.log("Modal prevented from closing");
    };

    productForm.addEventListener("hidden.bs.modal", hideModalListener);

    productForm.addEventListener(
      "hidePrevented.bs.modal",
      hidePreventedListener
    );

    const removeListeners = () => {
      productForm.removeEventListener("hidden.bs.modal", hideModalListener);
      productForm.removeEventListener(
        "hidePrevented.bs.modal",
        hidePreventedListener
      );
    };

    return () => removeListeners();
  }, [dispatch]);

  const codePlaceholder = useMemo(() => {
    return Math.ceil(Math.random() * 100000000);
  }, []);

  return (
    <ModalMenu
      id="addProductMenu"
      fade={true}
      scrollable={true}
      size="lg"
      addDismissBtn={!productInEdit}
      title={productInEdit ? "Edit Product" : "Add New Product"}
      body={
        <div className="px-1">
          <form
            id="addProductForm"
            className="needs-validation add-product-form"
            noValidate
          >
            {/* ------------------------------ Row ------------------------------ */}
            <div className="row g-4">
              <div
                className={classNames("col-sm-6", { "border-end": !isMobile })}
              >
                {!isMobile && (
                  <h6 className="mb-3">Enter Product Information</h6>
                )}

                {/* -------------------------- Row -------------------------- */}
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label htmlFor="productName" className="form-label">
                      Name
                    </label>
                    <input
                      id="productName"
                      type="text"
                      name="name"
                      className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
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
                          className="btn btn-sm btn-outline-secondary"
                          data-bs-toggle="modal"
                          data-bs-target="#addProductScannerModal"
                          disabled={disable.inputs}
                          aria-label="Scan QR code"
                        >
                          <i className="fa fa-qrcode"></i>
                        </button>
                      )}
                      <div className="invalid-feedback">
                        Invalid serial number.
                      </div>
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                  </div>
                </div>

                {/* -------------------------- Row -------------------------- */}
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="productBrand" className="form-label">
                      Brand
                    </label>
                    <input
                      className="form-control form-control-sm"
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
                  <div className="col-sm-6">
                    <label htmlFor="productClass" className="form-label">
                      Class
                    </label>
                    <input
                      className="form-control form-control-sm text-capitalize"
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
                        <option key={_class} value={_class.capitalize()} />
                      ))}
                    </datalist>
                    <div className="invalid-feedback">
                      Please select a valid class.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </div>
                </div>

                {/* -------------------------- Row -------------------------- */}
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="productUnit" className="form-label">
                      Unit
                    </label>
                    <input
                      className="form-control form-control-sm text-capitalize"
                      list="unitList"
                      id="productUnit"
                      name="unit"
                      placeholder={units[0]}
                      value={product.unit}
                      onChange={handleChange}
                      disabled={disable.inputs}
                      required
                    />

                    <datalist id="unitList">
                      {units.map((unit) => (
                        <option key={unit} value={unit.capitalize()} />
                      ))}
                    </datalist>
                    <div className="invalid-feedback">
                      Please select a valid unit.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="productCategory" className="form-label">
                      Category
                    </label>
                    <input
                      className="form-control form-control-sm text-capitalize"
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
                        <option key={category} value={category.capitalize()} />
                      ))}
                    </datalist>
                    <div className="invalid-feedback">
                      Please select a valid category.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </div>
                </div>

                {/* -------------------------- Row -------------------------- */}
                <div className="row g-3 mb-3">
                  <div className="col-12">
                    <label htmlFor="productDesc" className="form-label">
                      Description (Optional)
                    </label>
                    <textarea
                      id="productDesc"
                      name="description"
                      className="form-control form-control-sm"
                      placeholder="Any description of the product here..."
                      style={{ height: "75px" }}
                      value={product.description}
                      onChange={handleChange}
                    ></textarea>
                    <div className="valid-feedback">Looks good!</div>
                  </div>
                </div>

                {/* -------------------------- Row -------------------------- */}
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label htmlFor="productImages" className="form-label">
                      Images{" "}
                      <i
                        className="fas fa-question-circle text-muted"
                        data-bs-toggle="tooltip"
                        title="Valid image links only, no spaces. Multiple links may be separated by commas."
                        onClick={(e) => e.preventDefault()}
                      />
                    </label>
                    <input
                      id="productImages"
                      type="url"
                      name="image"
                      className="form-control form-control-sm"
                      placeholder="https://..."
                      value={product.images}
                      onChange={handleChange}
                      disabled={disable.inputs}
                      pattern="(https?|ftp|image)://(-\.)?([^\s/?\.#-]+\.?)+(/[^\s]*)?$"
                    />
                    <div className="invalid-feedback">Invalid image link.</div>
                    <div className="valid-feedback">Looks good!</div>
                  </div>
                </div>

                {/* -------------------------- Row -------------------------- */}
                <div className={classNames("row g-3", { "mb-3": isMobile })}>
                  <div className="form-label">Image Previews</div>
                  <div className="col d-flex justify-content-center flex-wrap mt-0">
                    {product.images.length !== 0 &&
                    product.images[0]?.length ? (
                      <div
                        id="addProductImages"
                        className="carousel slide"
                        data-bs-ride="carousel"
                      >
                        <div className="carousel-indicators">
                          {product.images.map((_, i) => (
                            <button
                              key={nanoid()}
                              type="button"
                              className={classNames({
                                active: i === 0,
                              })}
                              data-bs-target="#addProductImages"
                              data-bs-slide-to={i}
                              aria-current={i}
                            ></button>
                          ))}
                        </div>
                        <div className="carousel-inner">
                          {product.images.map((url, i) => (
                            <div
                              key={nanoid()}
                              className={classNames("carousel-item", {
                                active: i === 0,
                              })}
                            >
                              <img src={url} className="d-block w-100" alt="" />
                            </div>
                          ))}
                        </div>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target="#addProductImages"
                          data-bs-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          />
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target="#addProductImages"
                          data-bs-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          />
                          <span className="visually-hidden">Next</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-muted mt-0 p-3">
                        No valid image links provided.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ------------------------------ Variants ------------------------------ */}
              <div
                className={classNames("col-sm-6 ps-2", { "mt-0": isMobile })}
              >
                <AddVariantForm
                  INIT_VARIANT_VAL={getInitVariantVal()}
                  disable={disable}
                  setDisable={setDisable}
                  variants={variants}
                  setVariants={setVariants}
                />
              </div>
            </div>
          </form>
        </div>
      }
      footer={
        <>
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
            className="form-control form-control-sm form-control form-control-sm-sm"
            onChange={onImportCSV}
          />

          <button
            id="resetBtn"
            type="reset"
            className="btn btn-secondary ms-2"
            disabled={disable.resetBtn}
            onClick={resetToDefaults}
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
              <Spinner addClass="spinner-border-sm">{text.saveBtn}</Spinner>
            ) : (
              text.saveBtn
            )}
          </button>
        </>
      }
    />
  );
}

export default AddProductMenu;
