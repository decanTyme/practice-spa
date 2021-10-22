import { selectCurrentlySelectedProducts } from "../../../../../../app/state/slices/data/product/selectors";
import { useDispatch, useSelector } from "react-redux";
import AddProductMenu from "./AddProductMenu";
import Card from "../../../../common/Card";
import { removeProducts } from "../../../../../../app/state/slices/data/product/async-thunks";
import { useState } from "react";
import SpinnerButton from "../../../components/SpinnerButton";

function ProductOptions() {
  const dispatch = useDispatch();

  const dataInSelection = useSelector(selectCurrentlySelectedProducts);

  const [loading, setLoading] = useState(false);

  const onMultiDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete the following?\n\n" +
          dataInSelection
            ?.map(({ brand, name }) => `${brand.name} ${name}`)
            .join("\n")
      )
    ) {
      const reallySure = prompt(
        `Are you really sure? THIS CANNOT BE UNDONE.\n\nType DELETE ALL below to confirm.`
      );

      if (reallySure !== null && reallySure === "DELETE ALL") {
        setLoading(true);

        try {
          await dispatch(
            removeProducts(dataInSelection.map(({ _id }) => _id))
          ).unwrap();
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className="mb-3">Options</Card.Title>
          <button
            className="btn btn-sm btn-success"
            data-bs-target="#addProductMenu"
            data-bs-toggle="modal"
          >
            Add New Product
          </button>
        </Card.Body>

        {dataInSelection.length !== 0 && (
          <div
            className="btn-group"
            role="group"
            aria-label="Currently selected items"
          >
            <div className="border-top py-2 px-5">
              Selected items: {dataInSelection.length}
            </div>

            <SpinnerButton
              role="status"
              className="btn btn-danger rounded-0"
              isLoading={loading}
              onClick={onMultiDelete}
              disabled={loading}
            >
              Delete All
            </SpinnerButton>
          </div>
        )}

        <Card.ListGroup flush>
          {dataInSelection.map(({ _id, brand, name, unit }) => (
            <Card.ListGroupItem
              key={_id}
              className="d-inline-flex justify-content-between fst-italic text-danger"
            >
              {`${brand.name} - ${name} (${unit.capitalize()})`}
            </Card.ListGroupItem>
          ))}
        </Card.ListGroup>
      </Card>

      <AddProductMenu />
    </>
  );
}

export default ProductOptions;
