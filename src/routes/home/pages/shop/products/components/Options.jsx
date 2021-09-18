import { selectDataInSelection } from "app/state/reducers/data";
import { useSelector } from "react-redux";

function SelectedProductOptions() {
  const dataInSelect = useSelector(selectDataInSelection);

  const onMultiDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete the following?\n\n" +
          dataInSelect?.map(({ name }) => name).join("\n")
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
    <div className="card mt-3">
      <div className="card-body pb-1">
        <div className="card-title d-flex justify-content-between align-items-center">
          <h5 className="mb-1">Options</h5>
          <span className="mb-1">Selected items: {dataInSelect?.length}</span>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-danger rounded-0"
        onClick={onMultiDelete}
      >
        Delete All
      </button>
      <ul className="list-group list-group-flush">
        {dataInSelect?.map((item) => (
          <li
            key={item._id}
            className="list-group-item d-inline-flex justify-content-between"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectedProductOptions;
