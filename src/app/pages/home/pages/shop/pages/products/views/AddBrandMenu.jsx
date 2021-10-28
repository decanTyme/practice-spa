import { Modal } from "bootstrap";
import classNames from "classnames";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constants from "../../../../../../../state/slices/constants";
import {
  pushBrand,
  resetAllBrandModification,
  selectBrandInEdit,
  selectBrandModifyStatus,
  selectBrandPushStatus,
  selectBrandRemoveStatus,
  setIdle,
  updateBrand,
} from "../../../../../../../state/slices/data/brand";
import useInitializeTooltips from "../../../../../../../../services/hooks/use-init-tooltips";
import Container from "../../../../../../common/Container";
import ModalMenu from "../../../../../../common/ModalMenu";
import SpinnerButton from "../../../../../../common/SpinnerButton";
import { INIT_BTN_TEXT } from "../init-add-product-form";

const INIT_FORM_VAL = {
  name: "",
  _type: "",
  links: [],
  locations: [{ _type: "main", postcode: 0, location: "" }],
  bio: "",
};

const INIT_BTN_STATE = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
};

const companyTypes = ["Inc.", "Co.", "Corp.", "LLC", "Ltd."];
const locationTypes = ["main", "branch"];

function AddBrandMenu() {
  useInitializeTooltips();

  const dispatch = useDispatch();

  const brandInEdit = useSelector(selectBrandInEdit);

  const saveStatus = useSelector(selectBrandPushStatus);
  const modifyStatus = useSelector(selectBrandModifyStatus);
  const removeStatus = useSelector(selectBrandRemoveStatus);

  const [brand, setBrand] = useState(INIT_FORM_VAL);
  const [text, setText] = useState(INIT_BTN_TEXT);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(INIT_BTN_STATE);

  useEffect(() => {
    saveStatus !== Constants.IDLE &&
      saveStatus !== Constants.LOADING &&
      dispatch(setIdle(Constants.DataService.PUSH));

    modifyStatus !== Constants.IDLE &&
      modifyStatus !== Constants.LOADING &&
      dispatch(setIdle(Constants.DataService.MODIFY));

    removeStatus !== Constants.IDLE &&
      removeStatus !== Constants.LOADING &&
      dispatch(setIdle(Constants.DataService.REMOVE));
  }, [dispatch, modifyStatus, removeStatus, saveStatus]);

  // Always listen for stock-in-edit states
  useEffect(() => {
    if (brandInEdit) {
      setBrand({
        ...brandInEdit,
        locations:
          brandInEdit.locations.length !== 0
            ? brandInEdit.locations.map((loc) => ({
                ...loc,
                location: Object.values({
                  1: loc.street,
                  2: loc.purok,
                  3: loc.barangay,
                  4: loc.city,
                  5: loc.province,
                }).join(", "),
              }))
            : INIT_FORM_VAL.locations,
      });

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

      return;
    }
  }, [brandInEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stockForm = document.getElementById("addBrandForm");

    if (stockForm.checkValidity()) {
      setLoading(true);
      setDisable({
        submitBtn: true,
        resetBtn: true,
        inputs: true,
        inputCode: true,
      });

      try {
        if (brandInEdit)
          await dispatch(
            updateBrand({
              ...brand,
              _type: brand._type === "" ? undefined : brand._type,
              links: brand.links.length === 0 ? undefined : brand.links,
              bio: brand.bio === "" ? undefined : brand.bio,
              locations:
                brand.locations[0].location === ""
                  ? undefined
                  : brand.locations.map((loc) => {
                      const parsedLoc = loc.location
                        .split(",")
                        .map((loc) => loc.trim());

                      return {
                        _type: loc._type,
                        postcode: loc.postcode,
                        street: parsedLoc[0] || "",
                        purok: parsedLoc[1] || "",
                        barangay: parsedLoc[2] || "",
                        city: parsedLoc[3] || "",
                        province: parsedLoc[4] || "",
                      };
                    }),
            })
          );
        else
          await dispatch(
            pushBrand({
              ...brand,
              _type: brand._type === "" ? undefined : brand._type,
              links: brand.links.length === 0 ? undefined : brand.links,
              bio: brand.bio === "" ? undefined : brand.bio,
              locations:
                brand.locations[0].location === ""
                  ? undefined
                  : brand.locations.map((loc) => {
                      const parsedLoc = loc.location
                        .split(",")
                        .map((loc) => loc.trim());

                      return {
                        _type: loc._type,
                        postcode: loc.postcode,
                        street: parsedLoc[0] || "",
                        purok: parsedLoc[1] || "",
                        barangay: parsedLoc[2] || "",
                        city: parsedLoc[3] || "",
                        province: parsedLoc[3] || "",
                      };
                    }),
            })
          ).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setDisable(INIT_BTN_STATE);
      }

      stockForm.classList.remove("was-validated");
    } else {
      stockForm.classList.add("was-validated");
    }
  };

  const handleChange =
    (index = 0) =>
    (e) => {
      setDisable({
        submitBtn: false,
        resetBtn: false,
        inputs: false,
        inputCode: false,
      });

      const name = e.target.name,
        value = e.target.value;

      const newLocations = [...brand.locations];

      if (newLocations.length !== 0)
        newLocations[index] = {
          _type: name === "locationType" ? value : newLocations[index]._type,
          postcode:
            name === "locationPostcode"
              ? parseInt(value)
              : newLocations[index].postcode,
          location: name === "location" ? value : newLocations[index].location,
        };

      setBrand({
        ...brand,
        name: name === "name" ? value : brand.name,
        _type: name === "type" ? value : brand._type,
        links: name === "image" ? value.split(",") : brand.links,
        bio: name === "bio" ? value : brand.bio,
        locations: newLocations,
      });
    };

  const resetAll = useCallback(() => {
    if (brandInEdit) return;

    // Revert all states to INIT
    setBrand(INIT_FORM_VAL);
    setText(INIT_BTN_TEXT);
    setDisable(INIT_BTN_STATE);
    document.getElementById("addBrandForm").classList.remove("was-validated");
  }, [brandInEdit]);

  useEffect(() => {
    // If a save action is a success, hide the menu
    if (
      saveStatus === Constants.SUCCESS ||
      modifyStatus === Constants.SUCCESS
    ) {
      Modal.getOrCreateInstance(document.getElementById("addBrandMenu")).hide();

      return Modal.getOrCreateInstance(
        document.getElementById("brandMenu")
      ).show();
    }

    // Otherwise, only reset the button state
    // so the user has a chance to re-edit
    if (saveStatus === Constants.FAILED || modifyStatus === Constants.FAILED)
      return setDisable({
        submitBtn: true,
        resetBtn: false,
        inputs: false,
        inputCode: true,
      });
  }, [modifyStatus, saveStatus]);

  // Listen for modal events
  useEffect(() => {
    const addBrandMenu = document.getElementById("addBrandMenu");

    // When modal is closed, revert all states to INIT
    const hideModalListener = () => {
      setBrand(INIT_FORM_VAL);
      setText(INIT_BTN_TEXT);
      setDisable(INIT_BTN_STATE);

      document.getElementById("addBrandForm").classList.remove("was-validated");

      dispatch(resetAllBrandModification());
    };

    const hidePreventedListener = () =>
      console.log("Modal prevented from closing");

    addBrandMenu.addEventListener("hidden.bs.modal", hideModalListener);

    addBrandMenu.addEventListener(
      "hidePrevented.bs.modal",
      hidePreventedListener
    );

    const removeListeners = () => {
      addBrandMenu.removeEventListener("hidden.bs.modal", hideModalListener);
      addBrandMenu.removeEventListener(
        "hidePrevented.bs.modal",
        hidePreventedListener
      );
    };

    return () => removeListeners();
  }, [dispatch, resetAll]);

  return (
    <>
      <ModalMenu id="addBrandMenu" fade _static keyboard>
        <ModalMenu.Dialog scrollable>
          <ModalMenu.Content>
            <ModalMenu.Header>
              <ModalMenu.Title>
                {brandInEdit ? "Edit Brand" : "Add New Brand"}
              </ModalMenu.Title>

              {!brandInEdit && (
                <button
                  className="btn py-1 px-2"
                  data-bs-target="#brandMenu"
                  data-bs-toggle="modal"
                >
                  Back
                </button>
              )}
            </ModalMenu.Header>
            <ModalMenu.Body>
              <form
                id="addBrandForm"
                className="needs-validation px-1 mb-2"
                noValidate
              >
                <Container.Row className="mb-3">
                  <Container.Col columns="7">
                    <label htmlFor="brandName" className="form-label">
                      Registered Name
                    </label>
                    <input
                      id="brandName"
                      type="text"
                      name="name"
                      className="form-control"
                      value={brand.name}
                      onChange={handleChange()}
                      disabled={disable.inputs}
                      pattern="[a-zA-Z0-9 ]+"
                      required
                    />

                    <div className="invalid-feedback">Invalid brand name.</div>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>

                  <Container.Col columns="5">
                    <label htmlFor="brandType" className="form-label">
                      Brand Type{" "}
                      <i
                        className="fas fa-question-circle text-muted"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Optional"
                        onClick={(e) => e.preventDefault()}
                      />
                    </label>
                    <select
                      id="brandType"
                      name="type"
                      className="form-select"
                      value={brand._type}
                      onChange={handleChange()}
                      disabled={disable.inputs}
                    >
                      <option value="">Select Type</option>
                      {companyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>
                </Container.Row>

                <Container.Row className="mb-3">
                  <Container.Col>
                    <label htmlFor="productImages" className="form-label">
                      Website/Social Links{" "}
                      <i
                        className="fas fa-question-circle text-muted"
                        data-bs-toggle="tooltip"
                        title="Optional. Valid links only, no spaces. Multiple links may be separated by commas."
                        onClick={(e) => e.preventDefault()}
                      />
                    </label>
                    <input
                      id="productImages"
                      type="url"
                      name="image"
                      className="form-control"
                      placeholder="https://..."
                      value={brand.links}
                      onChange={handleChange()}
                      disabled={disable.inputs}
                      pattern="(https?|ftp|image)://(-\.)?([^\s/?\.#-]+\.?)+(/[^\s]*)?$"
                    />
                    <div className="invalid-feedback">Invalid link.</div>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>
                </Container.Row>

                <Container.Row className="mb-3">
                  <Container.Col columns="12">
                    <label htmlFor="brandBio" className="form-label">
                      Bio (Optional)
                    </label>
                    <textarea
                      id="brandBio"
                      name="bio"
                      className="form-control"
                      placeholder="Any bio or description of the brand here..."
                      style={{ height: "90px" }}
                      value={brand.bio}
                      pattern="[a-zA-Z0-9 ]+"
                      onChange={handleChange()}
                      disabled={disable.inputs}
                    />

                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>
                </Container.Row>

                <Container.Row>
                  <Container.Col columns="12">
                    <label htmlFor="brandLocation" className="form-label">
                      Locations (Optional)
                    </label>
                    <a
                      href="#addLocation"
                      role="button"
                      className="text-decoration-none float-end fw-light my-auto"
                      style={{ fontSize: "0.8rem", paddingTop: "0.075rem" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setBrand({
                          ...brand,
                          locations: [
                            ...brand.locations,
                            INIT_FORM_VAL.locations[0],
                          ],
                        });
                      }}
                    >
                      Add location
                    </a>
                    {brand.locations.map(
                      ({ _type, postcode, location }, i, arr) => (
                        <div
                          key={i}
                          className={classNames("bg-light p-3", {
                            "mb-3": i !== arr.length - 1,
                          })}
                        >
                          <Container.Col columns="12" className="mb-3">
                            <Container.Row>
                              <Container.Col columns="7">
                                <label
                                  htmlFor="brandLocationType"
                                  className="form-label"
                                >
                                  Location Type
                                </label>
                                <select
                                  id="brandLocationType"
                                  name="locationType"
                                  className="form-select text-capitalize"
                                  value={_type}
                                  onChange={handleChange(i)}
                                  disabled={disable.inputs}
                                >
                                  {locationTypes.map((type) => (
                                    <option
                                      key={type}
                                      value={type}
                                      className="text-capitalize"
                                    >
                                      {type}
                                    </option>
                                  ))}
                                </select>

                                <div className="valid-feedback">
                                  Looks good!
                                </div>
                              </Container.Col>

                              <Container.Col>
                                <label
                                  htmlFor="brandLocationPostcode"
                                  className="form-label"
                                >
                                  Postal Code
                                </label>
                                <input
                                  id="brandLocationPostcode"
                                  type="number"
                                  name="locationPostcode"
                                  className="form-control"
                                  value={postcode}
                                  onChange={handleChange(i)}
                                  disabled={disable.inputs}
                                  min={1}
                                />

                                <div className="valid-feedback">
                                  Looks good!
                                </div>
                                <div className="invalid-feedback">
                                  Invalid postal code.
                                </div>
                              </Container.Col>
                            </Container.Row>
                          </Container.Col>

                          <Container.Col columns="12">
                            <textarea
                              id="brandLocation"
                              name="location"
                              className="form-control"
                              placeholder={`Optional. Always separate each corresponding hierarchy in commas, up to the province.
                                      \nEx. Street, Purok, Barangay, City, Province`}
                              style={{ height: "120px" }}
                              value={location}
                              pattern="[a-zA-Z0-9 ]+"
                              onChange={handleChange(i)}
                            />
                            <div className="valid-feedback">Looks good!</div>
                          </Container.Col>
                        </div>
                      )
                    )}
                  </Container.Col>
                </Container.Row>
              </form>
            </ModalMenu.Body>

            <ModalMenu.Footer>
              <button
                type="reset"
                className="btn btn-secondary ms-2"
                data-bs-target={brandInEdit && "#brandMenu"}
                data-bs-toggle={brandInEdit && "modal"}
                disabled={disable.resetBtn}
                onClick={resetAll}
              >
                {text.resetBtn}
              </button>

              <SpinnerButton
                type="submit"
                role="status"
                className="btn btn-success ms-2"
                isLoading={loading}
                onClick={handleSubmit}
                disabled={disable.submitBtn}
              >
                {text.submitBtn}
              </SpinnerButton>
            </ModalMenu.Footer>
          </ModalMenu.Content>
        </ModalMenu.Dialog>
      </ModalMenu>
    </>
  );
}

export default AddBrandMenu;
