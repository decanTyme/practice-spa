import "./AddProductForm/add-product-form.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse";
import {
  selectProductScannedCode,
  selectProductPushStatus,
  selectProductImportedCSV,
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
import { Modal } from "bootstrap";
import AddVariantForm from "./AddProductForm/AddVariantForm";
import { selectProductInEdit } from "../../../../../../app/state/slices/data/product/selectors";
import ModalMenu from "../../../../common/menus/ModalMenu";
import { isMobile } from "react-device-detect";
import classNames from "classnames";
import {
  customNanoid,
  getInitVariantVal,
  INIT_BTN_STATE,
  INIT_BTN_TEXT,
  INIT_FORM_VAL,
} from "./AddProductForm/init";
import useInitializeTooltips from "../../../../../../services/hooks/use-init-tooltips";
import { selectAllBrands } from "../../../../../../app/state/slices/data/brand";
import BrandMenu from "./BrandMenu";
import Container from "../../../../common/Container";
import SpinnerButton from "../../../components/SpinnerButton";

function AddProductMenu() {
  useInitializeTooltips();

  const dispatch = useDispatch();

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
  const [isBrandMenuOpen, toggleBrandMenu] = useState();

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
        brand: productInEdit.brand._id,
        images: productInEdit.images.map(({ url }) => url),
      });

      setVariants(
        productInEdit.variants.map((variant) => {
          const newVariant = { ...variant };
          newVariant.__id = customNanoid();

          newVariant.prices = newVariant.prices.map((price) => {
            const newPrice = { ...price };
            newPrice.__id = customNanoid();

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
        submitBtn: "Update",
        resetBtn: "Cancel",
      });
    }
  }, [productInEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productForm = document.getElementById("addProductForm");

    if (productForm.checkValidity()) {
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
            unit: product.unit.toLowerCase(),
            category: product.category.toLowerCase(),
            _class: product._class.toLowerCase(),
            description:
              product.description === "" ? undefined : product.description,
            images: product.images.map((url) => ({ url })),
            variants: variants.map((variant) => {
              variant.prices = variant.prices.map((price) => {
                delete price.description;
                return price;
              });

              variant.description =
                variant.description === "" ? undefined : product.description;

              return variant;
            }),
          })
        );
      else if (importedCSV) dispatch(pushProduct(importedCSV));
      else
        dispatch(
          pushProduct({
            ...product,
            unit: product.unit.toLowerCase(),
            category: product.category.toLowerCase(),
            _class: product._class.toLowerCase(),
            description:
              product.description === "" ? undefined : product.description,
            images:
              product.images.length === 0
                ? undefined
                : product.images.map((url) => ({ url })),
            variants: variants.map((variant) => {
              variant.prices = variant.prices.map((price) => {
                delete price.description;
                return price;
              });

              variant.description =
                variant.description === "" ? undefined : product.description;

              return variant;
            }),
          })
        );

      productForm.classList.remove("was-validated");
    } else {
      productForm.classList.add("was-validated");
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
      _class: name === "class" ? value : product._class,
      category: name === "category" ? value : product.category,
      description: name === "description" ? value : product.description,
      unit: name === "unit" ? value : product.unit,
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
      submitBtn: "Save",
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
    toggleBrandMenu(false);

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
      return (document.getElementById("csvImportBtn").value = "");
    }

    // Revert all states to INIT
    setDisable(INIT_BTN_STATE);
    setText(INIT_BTN_TEXT);
    setProduct(INIT_FORM_VAL);
    setVariants([getInitVariantVal()]);
    document.getElementById("addProductForm").classList.remove("was-validated");
  }, [dispatch, importedCSV, productInEdit, toggleBrandMenu]);

  useEffect(() => {
    const saveSuccess =
      saveStatus === Constants.SUCCESS || modifyStatus === Constants.SUCCESS;

    const saveFailed =
      saveStatus === Constants.FAILED || modifyStatus === Constants.FAILED;

    // If a save or modify action is a success, hide the menu
    if (saveSuccess)
      return Modal.getOrCreateInstance(
        document.getElementById("addProductMenu")
      ).hide();

    // Otherwise, only reset the button state
    // so the user has a chance to re-edit
    if (saveFailed)
      return setDisable({
        submitBtn: true,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });
  }, [dispatch, saveStatus, modifyStatus]);

  // Listen for modal events
  useEffect(() => {
    const productMenu = document.getElementById("addProductMenu");

    // When modal is closed, revert all states to INIT
    const hideModalListener = () => {
      if (!isBrandMenuOpen) {
        setDisable(INIT_BTN_STATE);
        setText(INIT_BTN_TEXT);
        setProduct(INIT_FORM_VAL);
        setVariants([getInitVariantVal()]);

        document
          .getElementById("addProductForm")
          .classList.remove("was-validated");

        dispatch(resetAllProductModification());
      }
    };

    const hidePreventedListener = () => {
      console.log("Modal prevented from closing");
    };

    productMenu.addEventListener("hidden.bs.modal", hideModalListener);

    productMenu.addEventListener(
      "hidePrevented.bs.modal",
      hidePreventedListener
    );

    const removeListeners = () => {
      productMenu.removeEventListener("hidden.bs.modal", hideModalListener);
      productMenu.removeEventListener(
        "hidePrevented.bs.modal",
        hidePreventedListener
      );
    };

    return () => removeListeners();
  }, [dispatch, isBrandMenuOpen]);

  const codePlaceholder = useMemo(() => {
    return Math.ceil(Math.random() * 100000000);
  }, []);

  return (
    <>
      <ModalMenu id="addProductMenu" fade _static keyboard>
        <ModalMenu.Dialog scrollable size="lg">
          <ModalMenu.Content>
            <ModalMenu.Header>
              <ModalMenu.Title>
                {productInEdit ? "Edit Product" : "Add New Product"}
              </ModalMenu.Title>
              {!productInEdit && (
                <ModalMenu.DismissButton onClick={() => toggleBrandMenu(false)}>
                  Dismiss
                </ModalMenu.DismissButton>
              )}
            </ModalMenu.Header>

            <ModalMenu.Body>
              <form
                id="addProductForm"
                className="needs-validation px-1 add-product-form"
                noValidate
              >
                <Container.Row>
                  <Container.Col
                    modifier="sm"
                    columns="6"
                    className={classNames({ "border-end": !isMobile })}
                  >
                    {!isMobile && (
                      <h6 className="mb-3">Enter Product Information</h6>
                    )}

                    <Container.Row>
                      <Container.Col className="mb-3">
                        <label htmlFor="productName" className="form-label">
                          Name
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
                        <div className="invalid-feedback">
                          Invalid product name.
                        </div>
                        <div className="valid-feedback">Looks good!</div>
                      </Container.Col>

                      <Container.Col modifier="sm" columns="5" className="mb-3">
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
                              disabled
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
                      </Container.Col>
                    </Container.Row>

                    <Container.Row>
                      <Container.Col modifier="sm" columns="6" className="mb-3">
                        <label htmlFor="productBrand" className="form-label">
                          Brand
                        </label>
                        <a
                          href="#addBrandMenu"
                          role="button"
                          data-bs-target="#brandMenu"
                          data-bs-toggle="modal"
                          className="text-decoration-none float-end fw-light"
                          style={{ fontSize: "0.8rem", marginTop: "0.075rem" }}
                          onClick={() => toggleBrandMenu(true)}
                        >
                          Edit brands
                        </a>
                        <select
                          id="productBrand"
                          name="brand"
                          className="form-select"
                          value={product.brand}
                          onChange={handleChange}
                          disabled={disable.inputs}
                          required
                        >
                          <option value="">Select Brand</option>
                          {brands.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please select a valid brand.
                        </div>
                        <div className="valid-feedback">Looks good!</div>
                      </Container.Col>

                      <Container.Col modifier="sm" columns="6" className="mb-3">
                        <label htmlFor="productClass" className="form-label">
                          Class
                        </label>
                        <input
                          className="form-control text-capitalize"
                          list="productClassList"
                          id="productClass"
                          name="class"
                          autoComplete="off"
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
                      </Container.Col>
                    </Container.Row>

                    <Container.Row>
                      <Container.Col modifier="sm" columns="6" className="mb-3">
                        <label htmlFor="productUnit" className="form-label">
                          Unit
                        </label>
                        <input
                          className="form-control text-capitalize"
                          list="unitList"
                          id="productUnit"
                          name="unit"
                          autoComplete="off"
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
                      </Container.Col>

                      <Container.Col modifier="sm" columns="6" className="mb-3">
                        <label htmlFor="productCategory" className="form-label">
                          Category
                        </label>
                        <input
                          className="form-control text-capitalize"
                          list="categoryList"
                          id="productCategory"
                          name="category"
                          autoComplete="off"
                          placeholder={categories[0]}
                          value={product.category}
                          onChange={handleChange}
                          disabled={disable.inputs}
                          required
                        />
                        <datalist id="categoryList">
                          {categories.map((category) => (
                            <option
                              key={category}
                              value={category.capitalize()}
                            />
                          ))}
                        </datalist>
                        <div className="invalid-feedback">
                          Please select a valid category.
                        </div>
                        <div className="valid-feedback">Looks good!</div>
                      </Container.Col>
                    </Container.Row>

                    <Container.Row className="mb-3">
                      <Container.Col columns="12">
                        <label htmlFor="productDesc" className="form-label">
                          Description (Optional)
                        </label>
                        <textarea
                          id="productDesc"
                          name="description"
                          className="form-control"
                          placeholder="Any description of the product here..."
                          style={{ height: "75px" }}
                          value={product.description}
                          onChange={handleChange}
                          disabled={disable.inputs}
                        ></textarea>
                        <div className="valid-feedback">Looks good!</div>
                      </Container.Col>
                    </Container.Row>

                    <Container.Row className="mb-3">
                      <Container.Col>
                        <label htmlFor="productImages" className="form-label">
                          Images{" "}
                          <i
                            className="fas fa-question-circle text-muted"
                            data-bs-toggle="tooltip"
                            title="Optional. Valid image links only, no spaces. Multiple links may be separated by commas."
                            onClick={(e) => e.preventDefault()}
                          />
                        </label>
                        <input
                          id="productImages"
                          type="url"
                          name="image"
                          className="form-control"
                          placeholder="https://..."
                          value={product.images}
                          onChange={handleChange}
                          disabled={disable.inputs}
                          pattern="(https?|ftp|image)://(-\.)?([^\s/?\.#-]+\.?)+(/[^\s]*)?$"
                        />
                        <div className="invalid-feedback">
                          Invalid image link.
                        </div>
                        <div className="valid-feedback">Looks good!</div>
                      </Container.Col>
                    </Container.Row>

                    <Container.Row className={classNames({ "mb-4": isMobile })}>
                      <div className="form-label">Image Previews</div>
                      <Container.Col className="d-flex justify-content-center flex-wrap mt-0">
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
                                  key={customNanoid()}
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
                                  key={customNanoid()}
                                  className={classNames("carousel-item", {
                                    active: i === 0,
                                  })}
                                >
                                  <img
                                    src={url}
                                    className="d-block w-100"
                                    alt=""
                                  />
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
                      </Container.Col>
                    </Container.Row>
                  </Container.Col>

                  {/* ------------------------------ Variants ------------------------------ */}
                  <div
                    className={classNames("col-sm-6 ps-2", {
                      "mt-0": isMobile,
                    })}
                  >
                    <AddVariantForm
                      disable={disable}
                      setDisable={setDisable}
                      variants={variants}
                      setVariants={setVariants}
                    />
                  </div>
                </Container.Row>
              </form>
            </ModalMenu.Body>

            <ModalMenu.Footer>
              <label
                htmlFor="csvImportBtn"
                className="bt-file-upload btn btn-primary ms-2 disabled"
              >
                Import CSV
              </label>
              <input
                id="csvImportBtn"
                type="file"
                accept=".csv"
                onChange={onImportCSV}
              />

              <button
                type="reset"
                className="btn btn-secondary ms-2"
                disabled={disable.resetBtn}
                onClick={resetToDefaults}
              >
                {text.resetBtn}
              </button>

              <SpinnerButton
                type="submit"
                role="status"
                className="btn btn-success ms-2"
                isLoading={
                  saveStatus !== Constants.IDLE ||
                  modifyStatus !== Constants.IDLE
                }
                onClick={handleSubmit}
                disabled={disable.submitBtn}
              >
                {text.submitBtn}
              </SpinnerButton>
            </ModalMenu.Footer>
          </ModalMenu.Content>
        </ModalMenu.Dialog>
      </ModalMenu>

      <BrandMenu />
    </>
  );
}

export default AddProductMenu;
