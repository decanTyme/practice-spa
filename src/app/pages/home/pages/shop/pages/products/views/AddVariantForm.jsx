import { useState } from "react";
import classNames from "classnames";
import { isMobile } from "react-device-detect";
import { getInitVariantVal } from "../init-add-product-form";

function AddVariantForm({ disable, setDisable, variants, setVariants }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (variantIndex, priceIndex) => (e) => {
    setDisable({
      ...disable,
      inputs: false,
      submitBtn: false,
      resetBtn: false,
    });

    const name = e.target.name,
      value = e.target.value;

    const newVariants = [...variants];

    newVariants[variantIndex] = {
      ...newVariants[variantIndex],
      name: name === "vname" ? value : newVariants[variantIndex].name,
      value: name === "variantValue" ? value : newVariants[variantIndex].value,
      description:
        name === "description" ? value : newVariants[variantIndex].description,
      prices: newVariants[variantIndex].prices,
    };

    if (priceIndex !== undefined)
      newVariants[variantIndex].prices[priceIndex] = {
        ...newVariants[variantIndex].prices[priceIndex],
        value:
          name === "priceValue"
            ? parseInt(value)
            : newVariants[variantIndex].prices[priceIndex].value,
      };

    setVariants(newVariants);
  };

  return (
    <>
      <ul
        className={classNames("nav nav-tabs mb-2", { "mb-3": isMobile })}
        role="tablist"
      >
        {variants.map(({ __id, name }, variantIndex) => (
          <li
            key={__id}
            className="nav-item d-flex align-items-center"
            role="presentation"
          >
            <button
              className={classNames("nav-link text-black", {
                active: variantIndex === activeTab,
              })}
              id="pills-home-tab"
              data-bs-toggle="tab"
              data-bs-target={`#${__id}`}
              type="button"
              role="tab"
              aria-controls={__id}
              aria-selected={variantIndex === activeTab}
              onClick={() => setActiveTab(variantIndex)}
            >
              {name || `Variant ${variantIndex + 1}`}
            </button>
          </li>
        ))}
        <li
          className="nav-item d-flex align-items-center ms-auto"
          role="presentation"
        >
          <button
            className="btn p-2"
            style={{ fontSize: "0.8rem" }}
            onClick={(e) => {
              e.preventDefault();
              setVariants([...variants, getInitVariantVal()]);
              setActiveTab(variants.length);
            }}
            disabled={disable.inputs}
          >
            <i className="fas fa-plus"></i>
          </button>
        </li>
      </ul>

      <div className="tab-content px-1" id="pills-tabContent">
        {variants.map(
          (
            { __id: variantId, name, value: variantValue, description, prices },
            variantIndex
          ) => (
            <div
              key={variantId}
              className={classNames("tab-pane fade", {
                active: variantIndex === activeTab,
                show: variantIndex === activeTab,
              })}
              id={variantId}
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div className="row g-3 mb-3">
                <div className="col">
                  <label htmlFor="variantName" className="form-label">
                    Name
                  </label>
                  <input
                    id="variantName"
                    type="text"
                    name="vname"
                    className="form-control"
                    placeholder="Classic"
                    value={name}
                    onChange={handleChange(variantIndex)}
                    disabled={disable.inputs}
                    pattern="[a-zA-Z0-9 ]+"
                    required
                  />
                  <div className="invalid-feedback">Invalid variant name.</div>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col">
                  <label htmlFor="productName" className="form-label">
                    Value{" "}
                    <i
                      className="fas fa-question-circle text-muted"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title="The volume, net weight, or quantity of the variant"
                      onClick={(e) => e.preventDefault()}
                    />
                  </label>
                  <input
                    id="productName"
                    type="text"
                    name="variantValue"
                    className="form-control"
                    placeholder="120ml"
                    data-id={variantId}
                    value={variantValue}
                    onChange={handleChange(variantIndex)}
                    disabled={disable.inputs}
                    pattern="[a-z0-9]+"
                    required
                  />
                  <div className="invalid-feedback">Invalid variant value.</div>
                  <div className="valid-feedback">Looks good!</div>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <label htmlFor="variantDesc" className="form-label">
                    Description (Optional)
                  </label>
                  <textarea
                    id="variantDesc"
                    name="description"
                    className="form-control"
                    placeholder="Any description of the variant here..."
                    style={{ height: "75px" }}
                    value={description}
                    onChange={handleChange(variantIndex)}
                    disabled={disable.inputs}
                  ></textarea>
                  <div className="valid-feedback">Looks good!</div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="p-3 pt-2 bg-light">
                    <div className="row row-cols-2 g-3">
                      {prices.map(
                        (
                          { __id: priceId, label, value: priceValue },
                          priceIndex
                        ) => (
                          <div key={priceId} className="col">
                            <label
                              htmlFor={`product${label.replace(
                                /\s/g,
                                ""
                              )}Price`}
                              className="form-label text-capitalize"
                            >
                              {label}{" "}
                              {label === "sale" && (
                                <i
                                  className="fas fa-question-circle text-muted"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="right"
                                  title="Optional. If set more than 0, then variant will be tagged as currently on sale."
                                />
                              )}
                            </label>
                            <div className="input-group input-group-sm">
                              <span className="input-group-text">Php</span>
                              <input
                                id={`product${label.replace(/\s/g, "")}Price`}
                                type="number"
                                name="priceValue"
                                className="form-control"
                                value={priceValue}
                                min={label === "sale" ? 0 : 1}
                                onChange={handleChange(
                                  variantIndex,
                                  priceIndex
                                )}
                                disabled={disable.inputs}
                                required={label !== "sale"}
                              />
                              <div className="invalid-feedback">
                                Cannot be less than 1.
                              </div>
                              <div className="valid-feedback">Looks good!</div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <span
                className="d-inline-block mt-3 float-end w-100"
                tabIndex={0}
                data-bs-toggle={variants.length <= 1 ? "tooltip" : null}
                data-bs-placement={variants.length <= 1 ? "left" : null}
                title={
                  variants.length <= 1
                    ? "There must be at least 1 product variant!"
                    : null
                }
              >
                <button
                  className="btn btn-sm btn-danger w-100"
                  onClick={(e) => {
                    e.preventDefault();

                    setVariants((variants) =>
                      variants.filter((variant) => variant.__id !== variantId)
                    );

                    setDisable((disable) => ({ ...disable, submitBtn: false }));

                    setActiveTab((prevActiveTab) => {
                      if (prevActiveTab === variants.length - 1)
                        return prevActiveTab - 1;

                      return prevActiveTab;
                    });
                  }}
                  disabled={variants.length <= 1}
                >
                  Remove Variant
                </button>
              </span>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default AddVariantForm;
