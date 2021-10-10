import { isMobile } from "react-device-detect";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../components/spinner";

const defaultPropGetter = () => ({});
const defaultRowSubComponent = () => <div className="text-end">None</div>;

function PaginationTable({
  loading,
  dataLength,
  pageSizes = [10, 20, 30, 40, 50],
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  renderRowSubComponent = defaultRowSubComponent,
  tableProps: {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    page,
    visibleColumns,
    pageCount,
    canPreviousPage,
    gotoPage,
    previousPage,
    pageOptions,
    canNextPage,
    nextPage,
    setPageSize,
    state: { pageIndex, pageSize },
  },
}) {
  return (
    <div className="card">
      <div className="table-responsive">
        <table {...getTableProps()} className="table table-hover">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    width={column.width}
                    {...column.getHeaderProps([column.getSortByToggleProps()])}
                    scope="col"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Fragment
                  key={page.map(() => window.btoa(Math.random())).pop()}
                >
                  <tr {...row.getRowProps(getRowProps(row))}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps(getCellProps(cell))}
                          className={row.className}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                  {row.isExpanded ? (
                    <tr>
                      <td colSpan={visibleColumns.length}>
                        {renderRowSubComponent({ row })}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
            <tr>
              {loading ? (
                <td colSpan="10000" className="text-center">
                  <Spinner addClass="spinner-border-sm">Loading...</Spinner>
                </td>
              ) : (
                <td colSpan="10000" className="text-center">
                  {dataLength > 0
                    ? `Showing ${page.length} of ${dataLength} products`
                    : "It seems that there is no data yet."}
                </td>
              )}
            </tr>
          </tbody>
        </table>
        <div>
          <div
            className={
              "d-flex mx-2 justify-content-" + (isMobile ? "center" : "between")
            }
          >
            <ul className="pagination mx-2">
              <li
                className={"page-item" + (!canPreviousPage ? " disabled" : "")}
              >
                <Link
                  to={`?${new URLSearchParams({ page: 1 })}`}
                  className="page-link"
                  onClick={() => gotoPage(0)}
                  aria-label="First page"
                >
                  <span aria-hidden="true">&laquo;</span>
                </Link>
              </li>
              <li
                className={"page-item" + (!canPreviousPage ? " disabled" : "")}
              >
                <Link
                  className="page-link"
                  to={`?${new URLSearchParams({ page: pageIndex })}`}
                  onClick={() => previousPage()}
                  aria-label="Previous page"
                >
                  Previous
                </Link>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {pageIndex + 1} of {pageOptions.length}
                </span>
              </li>
              <li className={"page-item" + (!canNextPage ? " disabled" : "")}>
                <Link
                  className="page-link px-4"
                  to={`?${new URLSearchParams({ page: pageIndex + 2 })}`}
                  onClick={() => nextPage()}
                  aria-label="Next page"
                >
                  Next
                </Link>
              </li>
              <li className={"page-item" + (!canNextPage ? " disabled" : "")}>
                <Link
                  className="page-link"
                  to={`?${new URLSearchParams({
                    page: pageCount - 1,
                  })}`}
                  onClick={() => gotoPage(pageCount - 1)}
                  aria-label="Last page"
                >
                  <span aria-hidden="true">&raquo;</span>
                </Link>
              </li>
            </ul>

            {isMobile ? null : (
              <select
                className="form-select form-select-sm mx-3"
                aria-label="Select page size"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {pageSizes.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginationTable;
