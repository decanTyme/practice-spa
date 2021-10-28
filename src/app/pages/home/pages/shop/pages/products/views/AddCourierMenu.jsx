import { Modal } from "bootstrap";
import classNames from "classnames";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constants from "../../../../../../../state/slices/constants";
import {
  pushCouriers,
  resetAllCourierModification,
  selectCourierInEdit,
  selectCourierModifyStatus,
  selectCourierPushStatus,
  selectCourierRemoveStatus,
  setIdle,
  updateCourier,
} from "../../../../../../../state/slices/data/courier";
import useInitializeTooltips from "../../../../../../../../services/hooks/use-init-tooltips";
import Container from "../../../../../../common/Container";
import ModalMenu from "../../../../../../common/ModalMenu";
import SpinnerButton from "../../../../../../common/SpinnerButton";
import { INIT_BTN_TEXT } from "../init-add-product-form";

const courierTypes = ["tracking", "regular", "cod", "others"];
const telcomTypes = ["globe", "smart", `talk n' text`, "sun"];

const INIT_FORM_VAL = {
  name: "",
  _type: "",
  address: {
    postcode: 0,
    location: "",
  },
  contacts: [{ telcom: "", number: "" }],
  bio: "",
  links: [],
};

const INIT_BTN_STATE = {
  submitBtn: true,
  resetBtn: true,
  inputs: false,
};

function AddCourierMenu() {
  useInitializeTooltips();

  const dispatch = useDispatch();

  const courierInEdit = useSelector(selectCourierInEdit);

  const saveStatus = useSelector(selectCourierPushStatus);
  const modifyStatus = useSelector(selectCourierModifyStatus);
  const removeStatus = useSelector(selectCourierRemoveStatus);

  const [courier, setCourier] = useState(INIT_FORM_VAL);
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
    if (courierInEdit) {
      setCourier({
        ...courierInEdit,
        address: courierInEdit.address
          ? {
              postcode: courierInEdit.address.postcode,
              location: Object.values({
                1: courierInEdit.address.location?.street,
                2: courierInEdit.address.location?.purok,
                3: courierInEdit.address.location?.barangay,
                4: courierInEdit.address.location?.city,
                5: courierInEdit.address.location?.province,
              }).join(", "),
            }
          : INIT_FORM_VAL.address,
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
  }, [courierInEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stockForm = document.getElementById("addCourierForm");

    if (stockForm.checkValidity()) {
      setLoading(true);
      setDisable({
        submitBtn: true,
        resetBtn: true,
        inputs: true,
        inputCode: true,
      });

      const parsedLoc =
        courier.address.location === ""
          ? undefined
          : courier.address.location.split(",").map((loc) => loc.trim());

      try {
        if (courierInEdit)
          await dispatch(
            updateCourier({
              ...courier,
              links: courier.links.length === 0 ? undefined : courier.links,
              bio: courier.bio === "" ? undefined : courier.bio,
              address:
                courier.address.location === ""
                  ? undefined
                  : {
                      postcode: courier.address.postcode,
                      street: parsedLoc[0] || "",
                      purok: parsedLoc[1] || "",
                      barangay: parsedLoc[2] || "",
                      city: parsedLoc[3] || "",
                      province: parsedLoc[4] || "",
                    },
            })
          ).unwrap();
        else
          await dispatch(
            pushCouriers({
              ...courier,
              links: courier.links.length === 0 ? undefined : courier.links,
              bio: courier.bio === "" ? undefined : courier.bio,
              address:
                courier.address.location === ""
                  ? undefined
                  : {
                      postcode: courier.address.postcode,
                      street: parsedLoc[0] || "",
                      purok: parsedLoc[1] || "",
                      barangay: parsedLoc[2] || "",
                      city: parsedLoc[3] || "",
                      province: parsedLoc[4] || "",
                    },
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

      const newContacts = [...courier.contacts];

      newContacts[index] = {
        telcom: name === "telcom" ? value : courier.contacts[index].telcom,
        number: name === "number" ? value : courier.contacts[index].number,
      };

      setCourier({
        ...courier,
        name: name === "name" ? value : courier.name,
        _type: name === "type" ? value : courier._type,
        links: name === "image" ? value.split(",") : courier.links,
        bio: name === "bio" ? value : courier.bio,
        address: {
          postcode:
            name === "postcode" ? parseInt(value) : courier.address.postcode,
          location: name === "location" ? value : courier.address.location,
        },
        contacts: newContacts,
      });
    };

  const resetAll = useCallback(() => {
    if (courierInEdit) return;

    // Revert all states to INIT
    setCourier(INIT_FORM_VAL);
    setText(INIT_BTN_TEXT);
    setDisable(INIT_BTN_STATE);
    document.getElementById("addCourierForm").classList.remove("was-validated");
  }, [courierInEdit]);

  useEffect(() => {
    // If a save action is a success, hide the menu
    if (
      saveStatus === Constants.SUCCESS ||
      modifyStatus === Constants.SUCCESS
    ) {
      Modal.getOrCreateInstance(
        document.getElementById("addCourierMenu")
      ).hide();

      return Modal.getOrCreateInstance(
        document.getElementById("courierMenu")
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
    const addCourierMenu = document.getElementById("addCourierMenu");

    // When modal is closed, revert all states to INIT
    const hideModalListener = () => {
      setCourier(INIT_FORM_VAL);
      setText(INIT_BTN_TEXT);
      setDisable(INIT_BTN_STATE);

      document
        .getElementById("addCourierForm")
        .classList.remove("was-validated");

      dispatch(resetAllCourierModification());
    };

    const hidePreventedListener = () =>
      console.log("Modal prevented from closing");

    addCourierMenu.addEventListener("hidden.bs.modal", hideModalListener);

    addCourierMenu.addEventListener(
      "hidePrevented.bs.modal",
      hidePreventedListener
    );

    const removeListeners = () => {
      addCourierMenu.removeEventListener("hidden.bs.modal", hideModalListener);
      addCourierMenu.removeEventListener(
        "hidePrevented.bs.modal",
        hidePreventedListener
      );
    };

    return () => removeListeners();
  }, [dispatch, resetAll]);

  return (
    <>
      <ModalMenu id="addCourierMenu" fade _static keyboard>
        <ModalMenu.Dialog scrollable>
          <ModalMenu.Content>
            <ModalMenu.Header>
              <ModalMenu.Title>
                {courierInEdit ? "Edit Courier" : "Add New Courier"}
              </ModalMenu.Title>

              {!courierInEdit && (
                <button
                  className="btn py-1 px-2"
                  data-bs-target="#courierMenu"
                  data-bs-toggle="modal"
                >
                  Back
                </button>
              )}
            </ModalMenu.Header>
            <ModalMenu.Body>
              <form
                id="addCourierForm"
                className="needs-validation px-1 mb-2"
                noValidate
              >
                <Container.Row className="mb-3">
                  <Container.Col columns="7">
                    <label htmlFor="courierName" className="form-label">
                      Registered Name
                    </label>
                    <input
                      id="courierName"
                      type="text"
                      name="name"
                      className="form-control"
                      value={courier.name}
                      onChange={handleChange()}
                      disabled={disable.inputs}
                      pattern="[a-zA-Z0-9 ]+"
                      required
                    />

                    <div className="invalid-feedback">
                      Invalid courier name.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>

                  <Container.Col columns="5">
                    <label htmlFor="courierType" className="form-label">
                      Type
                    </label>
                    <select
                      id="courierType"
                      name="type"
                      className="form-select text-capitalize"
                      value={courier._type}
                      onChange={handleChange()}
                      disabled={disable.inputs}
                      required
                    >
                      <option value="">Select Type</option>
                      {courierTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <div className="invalid-feedback">
                      Please select a courier type.
                    </div>
                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>
                </Container.Row>

                <Container.Row className="mb-3">
                  <Container.Col>
                    <label htmlFor="courierLinks" className="form-label">
                      Contact Number/s
                    </label>
                    <a
                      href="#addLocation"
                      role="button"
                      className="text-decoration-none float-end fw-light my-auto"
                      style={{ fontSize: "0.8rem", paddingTop: "0.075rem" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setCourier({
                          ...courier,
                          contacts: [
                            ...courier.contacts,
                            INIT_FORM_VAL.contacts[0],
                          ],
                        });
                      }}
                    >
                      Add contact
                    </a>
                    {courier.contacts.map(({ telcom, number }, i, arr) => (
                      <Container.Row
                        key={i}
                        className={classNames({
                          "mb-2": i !== arr.length - 1,
                        })}
                      >
                        <Container.Col>
                          <input
                            id="courierContacts"
                            type="text"
                            name="number"
                            className="form-control"
                            placeholder="09123456789"
                            value={number}
                            onChange={handleChange(i)}
                            disabled={disable.inputs}
                            inputMode="numeric"
                            pattern="[+]?[0-9]*"
                            required
                          />
                          <div className="invalid-feedback">
                            Invalid contact number.
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </Container.Col>

                        <Container.Col columns="5">
                          <select
                            id="courierNumberTelcom"
                            name="telcom"
                            className="form-select text-capitalize"
                            value={telcom}
                            onChange={handleChange(i)}
                            disabled={disable.inputs}
                            required
                          >
                            <option value="">Select Telcom</option>
                            {telcomTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </Container.Col>
                      </Container.Row>
                    ))}
                  </Container.Col>
                </Container.Row>

                <Container.Row className="mb-3">
                  <Container.Col>
                    <label htmlFor="courierLinks" className="form-label">
                      Website/Social Links{" "}
                      <i
                        className="fas fa-question-circle text-muted"
                        data-bs-toggle="tooltip"
                        title="Optional. Valid links only, no spaces. Multiple links may be separated by commas."
                        onClick={(e) => e.preventDefault()}
                      />
                    </label>
                    <input
                      id="courierLinks"
                      type="url"
                      name="image"
                      className="form-control"
                      placeholder="https://..."
                      value={courier.links}
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
                    <label htmlFor="courierBio" className="form-label">
                      Bio (Optional)
                    </label>
                    <textarea
                      id="courierBio"
                      name="bio"
                      className="form-control"
                      placeholder="Any bio or description of the courier here..."
                      style={{ height: "90px" }}
                      value={courier.bio}
                      pattern="[a-zA-Z0-9 ]+"
                      onChange={handleChange()}
                      disabled={disable.inputs}
                    />

                    <div className="valid-feedback">Looks good!</div>
                  </Container.Col>
                </Container.Row>

                <Container.Row>
                  <Container.Col columns="12">
                    <label htmlFor="courierLocation" className="form-label">
                      Location (Optional)
                    </label>

                    <Container.Col columns="12" className="mb-3">
                      <textarea
                        id="courierLocation"
                        name="location"
                        className="form-control"
                        placeholder={`Optional. Always separate each corresponding hierarchy in commas, up to the province.
                                      \nEx. Street, Purok, Barangay, City, Province`}
                        style={{ height: "120px" }}
                        value={courier.address.location}
                        pattern="[a-zA-Z0-9 ]+"
                        onChange={handleChange()}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </Container.Col>

                    <Container.Col columns="12">
                      <label
                        htmlFor="courierLocationPostcode"
                        className="form-label"
                      >
                        Postal Code
                      </label>
                      <input
                        id="courierLocationPostcode"
                        type="number"
                        name="locationPostcode"
                        className="form-control"
                        value={courier.address.postcode}
                        onChange={handleChange()}
                        disabled={disable.inputs}
                      />

                      <div className="valid-feedback">Looks good!</div>
                      <div className="invalid-feedback">
                        Invalid postal code.
                      </div>
                    </Container.Col>
                  </Container.Col>
                </Container.Row>
              </form>
            </ModalMenu.Body>

            <ModalMenu.Footer>
              <button
                type="reset"
                className="btn btn-secondary ms-2"
                data-bs-target={courierInEdit && "#courierMenu"}
                data-bs-toggle={courierInEdit && "modal"}
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

export default AddCourierMenu;
