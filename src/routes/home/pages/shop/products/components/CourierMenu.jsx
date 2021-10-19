import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  modifyCourier,
  removeCourier,
  selectAllCouriers,
} from "../../../../../../app/state/slices/data/courier";
import Card from "../../../../common/Card";
import Container from "../../../../common/Container";
import ModalMenu from "../../../../common/menus/ModalMenu";
import AddCourierMenu from "./AddCourierMenu";

function CourierMenu({ type }) {
  const dispatch = useDispatch();

  const couriers = useSelector(selectAllCouriers);

  const [loading, setLoading] = useState({});

  const onEditCourier = (courier) => (e) => {
    dispatch(modifyCourier(courier));
  };

  const onRemoveCourier = (courier, i) => async (e) => {
    const ans = prompt(
      `Are you sure you want to delete "${courier.name}"?\rTHIS CANNOT BE UNDONE.
      \nType the brand name below to confirm.`
    );

    if (ans !== null && ans === courier.name) {
      setLoading((prevState) => ({ ...prevState, [i]: true }));

      try {
        await dispatch(removeCourier(courier)).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading((prevState) => ({ ...prevState, [i]: false }));
      }
    }
  };

  return (
    <>
      <ModalMenu id="courierMenu" fade _static>
        <ModalMenu.Dialog scrollable>
          <ModalMenu.Content>
            <ModalMenu.Header>
              <ModalMenu.Title>Couriers</ModalMenu.Title>

              <div>
                <button
                  className="btn pb-1 pt-2 px-2"
                  data-bs-target="#addCourierMenu"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Add Courier
                </button>

                <button
                  className="btn pb-1 pt-2 px-2"
                  data-bs-target={`#${type}AddStockMenu`}
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Back
                </button>
              </div>
            </ModalMenu.Header>
            <ModalMenu.Body>
              {couriers.map((courier, i) => (
                <Card
                  key={courier._id}
                  className={classNames({ "mt-3": i >= 1 })}
                >
                  {loading[i] && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                        style={{ zIndex: "999" }}
                      />
                    </div>
                  )}
                  <div
                    className={classNames("card-body", {
                      "bg-blur": loading[i],
                    })}
                  >
                    <div className="d-flex justify-content-between">
                      <a
                        href={`#_${courier._id}`}
                        className="text-decoration-none text-black flex-grow-1"
                        data-bs-toggle="collapse"
                        data-bs-target={`#_${courier._id}`}
                        aria-expanded="false"
                        aria-controls={`_${courier._id}`}
                      >
                        <Card.Title h6 className="mb-0">
                          {courier.name}
                        </Card.Title>

                        <Card.SubTitle>
                          {`Added by: ${courier.addedBy.user.firstname} ${courier.addedBy.user.lastname}`}
                        </Card.SubTitle>
                      </a>

                      <div className="d-flex flex-column">
                        <a
                          href="#edit"
                          className="mb-0 pb-1 text-success"
                          data-bs-target="#addCourierMenu"
                          data-bs-toggle="modal"
                          style={{ fontSize: "0.875rem" }}
                          onClick={onEditCourier(courier)}
                        >
                          <i className="fas fa-edit"></i>
                        </a>

                        <div>
                          <a
                            href="#delete"
                            className="mb-0 text-danger"
                            style={{ fontSize: "0.875rem" }}
                            onClick={onRemoveCourier(courier, i)}
                          >
                            <i className="fas fa-trash"></i>
                          </a>
                        </div>
                      </div>
                    </div>

                    <Card.Text>{courier.bio}</Card.Text>
                  </div>

                  <Card.ListGroup
                    id={`_${courier._id}`}
                    flush
                    className="collapse"
                  >
                    <Card.ListGroupItem className="d-inline-flex justify-content-between">
                      <div>Type</div>
                      <div className="text-capitalize">{courier._type}</div>
                    </Card.ListGroupItem>

                    <Card.ListGroupItem className="d-inline-flex justify-content-between">
                      <div>Contacts</div>
                      <div>
                        {courier.contacts.map(({ _id, telcom, number }) => (
                          <div key={_id} className="d-flex">
                            <div className="text-muted text-capitalize ms-auto">
                              {telcom}
                            </div>
                            <span className="mx-2">•</span>
                            <div>{number}</div>
                            {/* <i className="fas fa-copy text-muted ms-2 d-flex align-items-center" /> */}
                          </div>
                        ))}
                      </div>
                    </Card.ListGroupItem>

                    {courier.address && (
                      <Card.ListGroupItem>
                        <Container.Row>
                          <Container.Col columns="3">Location</Container.Col>

                          <Container.Col>
                            <div className="d-inline-flex justify-content-between w-100">
                              <div className="fst-italic">Street</div>
                              <div>{courier.address.street}</div>
                            </div>

                            <div className="d-inline-flex justify-content-between w-100">
                              <div className="fst-italic">Purok</div>
                              <div>{courier.address.purok}</div>
                            </div>

                            <div className="d-inline-flex justify-content-between w-100">
                              <div className="fst-italic">Barangay</div>
                              <div>{courier.address.barangay}</div>
                            </div>

                            <div className="d-inline-flex justify-content-between w-100">
                              <div className="fst-italic">City</div>
                              <div>{courier.address.city}</div>
                            </div>

                            <div className="d-inline-flex justify-content-between w-100">
                              <div className="fst-italic">Province</div>
                              <div>{courier.address.province}</div>
                            </div>

                            <div className="d-inline-flex justify-content-between w-100">
                              <div className="fst-italic">Postal Code</div>
                              <div>{courier.address.postcode}</div>
                            </div>
                          </Container.Col>
                        </Container.Row>
                      </Card.ListGroupItem>
                    )}

                    <Card.ListGroupItem>
                      <Container.Row>
                        <Container.Col modifier="sm" columns="4">
                          Website/Social Links
                        </Container.Col>
                        <Container.Col>
                          {courier.links[0] ? (
                            courier.links.map((link) => (
                              <a
                                key={link}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="fw-bolder text-decoration-none float-sm-end"
                              >
                                {link || "None"}
                              </a>
                            ))
                          ) : (
                            <span className="float-sm-end fst-italic">
                              None
                            </span>
                          )}
                        </Container.Col>
                      </Container.Row>
                    </Card.ListGroupItem>
                  </Card.ListGroup>
                </Card>
              ))}
            </ModalMenu.Body>
          </ModalMenu.Content>
        </ModalMenu.Dialog>
      </ModalMenu>

      <AddCourierMenu />
    </>
  );
}

export default CourierMenu;
