import { Fragment } from "react";
import { isDesktop } from "react-device-detect";
import Card from "../../../../common/Card";
import GlobalFilter from "./components/Filter/GlobalFilter";

function FilterOptionsCard({
  className,
  preGlobalFilteredRows,
  setGlobalFilter,
  globalFilter,
  toggleColumns,
  filterColumns,
  dataInSelection = [],
}) {
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
    <Card
      className={className}
      nonBodyChilden={
        dataInSelection.length !== 0 ? (
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
        ) : null
      }
      listGroupItems={dataInSelection.map((item) => (
        <li
          key={item._id}
          className="list-group-item d-inline-flex justify-content-between fst-italic text-danger"
        >
          {item.brand + " - " + item.name}
        </li>
      ))}
    >
      {isDesktop ? (
        <>
          <h6 className="card-title mb-2">Toggle Columns</h6>
          <div className="row row-cols-2 px-3 pb-2">
            {toggleColumns.map((column) => (
              <div key={column.id} className="col form-check">
                <input
                  id={column.id}
                  type="checkbox"
                  className="form-check-input"
                  {...column.getToggleHiddenProps()}
                />
                <label htmlFor={column.id} className="form-check-label">
                  {column.Header}
                </label>
              </div>
            ))}
          </div>
        </>
      ) : null}
      {/* --------------- Filters --------------- */}
      <h6 className="card-title mb-2">Filters</h6>
      <div>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {filterColumns.map((column) => (
          <Fragment key={column.id}>
            <p className="my-2">{column.Header}</p>
            <div key={column.id}>{column.render("Filter")}</div>
          </Fragment>
        ))}
      </div>
    </Card>
  );
}

export default FilterOptionsCard;