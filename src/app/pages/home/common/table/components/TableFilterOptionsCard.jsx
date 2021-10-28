import { Fragment } from "react";
import { isDesktop } from "react-device-detect";
import Card from "../../../../common/Card";
import Container from "../../../../common/Container";
import GlobalFilter from "./filters/GlobalFilter";

function FilterOptionsCard({
  preGlobalFilteredRows,
  setGlobalFilter,
  globalFilter,
  toggleColumns,
  filterColumns,
}) {
  return (
    <Card>
      <Card.Body>
        {isDesktop && (
          <>
            <Card.Title h6 className="mb-2">
              Toggle Columns
            </Card.Title>
            <Container.Row className="row-cols-2 px-3 pb-2">
              {toggleColumns.map((column) => (
                <Container.Col key={column.id} className="form-check">
                  <input
                    id={column.id}
                    type="checkbox"
                    className="form-check-input"
                    {...column.getToggleHiddenProps()}
                  />
                  <label htmlFor={column.id} className="form-check-label">
                    {column.Header}
                  </label>
                </Container.Col>
              ))}
            </Container.Row>
          </>
        )}

        {/* --------------- Filters --------------- */}
        <Card.Title h6 className="mb-2">
          Filters
        </Card.Title>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {filterColumns.map((column) => (
          <Fragment key={column.id}>
            <p className="my-2">{column.Header}</p>
            <>{column.render("Filter")}</>
          </Fragment>
        ))}
      </Card.Body>
    </Card>
  );
}

export default FilterOptionsCard;
