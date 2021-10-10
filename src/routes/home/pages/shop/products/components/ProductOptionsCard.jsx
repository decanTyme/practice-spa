import { selectCurrentlySelectedProducts } from "../../../../../../app/state/slices/data/product/selectors";
import { useSelector } from "react-redux";
import AddProductMenu from "./AddProductMenu";

function ProductOptions() {
  const dataInSelection = useSelector(selectCurrentlySelectedProducts);

  const onMultiDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete the following?\n\n" +
          dataInSelection?.map(({ name }) => name).join("\n")
      )
    ) {
      const reallySure = prompt(
        `Are you really sure? THIS CANNOT BE UNDONE.\n\nType DELETE ALL below to confirm.`
      );

      if (reallySure !== null && reallySure === "DELETE ALL") {
        alert(`Sorry, we can't do that right now!`);
      }
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h6 className="card-title mb-3">Options</h6>
          <button
            className="btn btn-sm btn-success"
            data-bs-target="#addProductMenu"
            data-bs-toggle="modal"
          >
            Add New Product
          </button>
        </div>
        {dataInSelection.length !== 0 ? (
          <div
            className="btn-group"
            role="group"
            aria-label="Currently selected items"
          >
            <div className="border-top py-2 px-5">
              Selected items: {dataInSelection.length}
            </div>
            <button
              type="button"
              className="btn btn-danger rounded-0"
              onClick={onMultiDelete}
            >
              Delete All
            </button>
          </div>
        ) : null}
        <ul className="list-group list-group-flush">
          {dataInSelection.map(({ _id, brand, name, unit }) => (
            <div
              key={_id}
              className="list-group-item  d-inline-flex justify-content-between fst-italic text-danger"
            >
              {`${brand} - ${name} (${unit.capitalize()})`}
            </div>
          ))}
        </ul>
      </div>

      <AddProductMenu />
    </>
  );
}

export default ProductOptions;
