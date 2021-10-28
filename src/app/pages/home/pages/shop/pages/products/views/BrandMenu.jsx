import "../styles/brand-menu.css";
import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  modifyBrand,
  removeBrand,
  selectAllBrands,
} from "../../../../../../../state/slices/data/brand";
import Card from "../../../../../../common/Card";
import Container from "../../../../../../common/Container";
import ModalMenu from "../../../../../../common/ModalMenu";
import AddBrandMenu from "./AddBrandMenu";

function BrandMenu() {
  const dispatch = useDispatch();

  const brands = useSelector(selectAllBrands);

  const [loading, setLoading] = useState({});

  const onEditBrand = (brand) => (e) => {
    dispatch(modifyBrand(brand));
  };

  const onRemoveBrand = (brand, i) => async (e) => {
    const ans = prompt(
      `Are you sure you want to delete "${brand.name}"?\rTHIS CANNOT BE UNDONE.
      \nType the brand name below to confirm.`
    );

    if (ans !== null && ans === brand.name) {
      setLoading((prevState) => ({ ...prevState, [i]: true }));

      try {
        await dispatch(removeBrand(brand)).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading((prevState) => ({ ...prevState, [i]: false }));
      }
    }
  };

  return (
    <>
      <ModalMenu id="brandMenu" fade _static>
        <ModalMenu.Dialog scrollable>
          <ModalMenu.Content>
            <ModalMenu.Header>
              <ModalMenu.Title>Brands</ModalMenu.Title>

              <div>
                <button
                  className="btn pb-1 pt-2 px-2"
                  data-bs-target="#addBrandMenu"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Add Brand
                </button>

                <button
                  className="btn pb-1 pt-2 px-2"
                  data-bs-target="#addProductMenu"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Back
                </button>
              </div>
            </ModalMenu.Header>
            <ModalMenu.Body>
              {brands.length !== 0 ? (
                brands.map((brand, i) => (
                  <Card
                    key={brand._id}
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
                          href={`#_${brand._id}`}
                          className="text-decoration-none text-black flex-grow-1"
                          data-bs-toggle="collapse"
                          data-bs-target={`#_${brand._id}`}
                          aria-expanded="false"
                          aria-controls={`_${brand._id}`}
                        >
                          <Card.Title h6 className="mb-0">
                            {brand.name}
                          </Card.Title>

                          <Card.SubTitle>
                            {`Added by: ${brand.addedBy.user.firstname} ${brand.addedBy.user.lastname}`}
                          </Card.SubTitle>
                        </a>

                        <div className="d-flex flex-column">
                          <a
                            href="#edit"
                            className="mb-0 pb-1 text-success"
                            data-bs-target="#addBrandMenu"
                            data-bs-toggle="modal"
                            style={{ fontSize: "0.875rem" }}
                            onClick={onEditBrand(brand)}
                          >
                            <i className="fas fa-edit"></i>
                          </a>

                          <div>
                            <a
                              href="#delete"
                              className="mb-0 text-danger"
                              style={{ fontSize: "0.875rem" }}
                              onClick={onRemoveBrand(brand, i)}
                            >
                              <i className="fas fa-trash"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <Card.Text>{brand.bio}</Card.Text>
                    </div>

                    <Card.ListGroup
                      id={`_${brand._id}`}
                      flush
                      className="collapse"
                    >
                      <Card.ListGroupItem>
                        <Container.Row>
                          <Container.Col
                            modifier="sm"
                            columns="3"
                            className="mb-1"
                          >
                            Locations
                          </Container.Col>
                          <Container.Col>
                            {brand.locations[0] ? (
                              brand.locations.map(
                                ({
                                  _id,
                                  _type,
                                  street,
                                  purok,
                                  barangay,
                                  province,
                                  postcode,
                                }) => (
                                  <Container.Row key={_id}>
                                    <Container.Col
                                      columns="3"
                                      className="text-capitalize fw-bold"
                                    >
                                      {_type}
                                    </Container.Col>

                                    <Container.Col>
                                      <div className="d-inline-flex justify-content-between w-100">
                                        <div className="fst-italic">Street</div>
                                        <div>{street}</div>
                                      </div>

                                      <div className="d-inline-flex justify-content-between w-100">
                                        <div className="fst-italic">Purok</div>
                                        <div>{purok}</div>
                                      </div>

                                      <div className="d-inline-flex justify-content-between w-100">
                                        <div className="fst-italic">
                                          Barangay
                                        </div>
                                        <div>{barangay}</div>
                                      </div>

                                      <div className="d-inline-flex justify-content-between w-100">
                                        <div className="fst-italic">
                                          Province
                                        </div>
                                        <div>{province}</div>
                                      </div>

                                      <div className="d-inline-flex justify-content-between w-100">
                                        <div className="fst-italic">
                                          Postal Code
                                        </div>
                                        <div>{postcode}</div>
                                      </div>
                                    </Container.Col>
                                  </Container.Row>
                                )
                              )
                            ) : (
                              <span className="float-sm-end fst-italic">
                                Unspecified
                              </span>
                            )}
                          </Container.Col>
                        </Container.Row>
                      </Card.ListGroupItem>

                      <Card.ListGroupItem>
                        <Container.Row>
                          <Container.Col modifier="sm" columns="4">
                            Website/Social Links
                          </Container.Col>
                          <Container.Col>
                            {brand.links[0] ? (
                              brand.links.map((link) => (
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
                ))
              ) : (
                <p className="text-center text-muted m-2">
                  It seems there are no brands yet.
                </p>
              )}
            </ModalMenu.Body>
          </ModalMenu.Content>
        </ModalMenu.Dialog>
      </ModalMenu>

      <AddBrandMenu />
    </>
  );
}

export default BrandMenu;
