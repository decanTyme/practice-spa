import { forwardRef, Fragment, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import {
  useTable,
  usePagination,
  useRowSelect,
  useExpanded,
} from "react-table";
import Spinner from "../../../components/spinner";

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

const defaultPropGetter = () => ({});

function TablePagination({
  columns,
  data,
  fetchData,
  loading,
  renderRowSubComponent,
  pageCount: controlledPageCount,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    visibleColumns,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useExpanded,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
    if (isMobile) setPageSize(4);
    // eslint-disable-next-line
  }, [fetchData, pageIndex, pageSize]);

  // Render the UI for your table
  return (
    <div className="table-responsive">
      <table {...getTableProps()} className="table table-hover rounded-top">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(
                    {
                      className: column.className,
                      style: column.style,
                    },
                    [getColumnProps(column)]
                  )}
                  scope="col"
                  className="px-3"
                >
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
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
              <>
                <tr {...row.getRowProps(getRowProps(row))}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </>
            );
          })}
          <tr>
            {loading ? (
              <td colSpan="10000">
                <Spinner>Loading...</Spinner>
              </td>
            ) : (
              <td colSpan="10000">
                Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                results
              </td>
            )}
          </tr>
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div>
        <div
          className={
            "d-flex mx-2 justify-content-" + (isMobile ? "center" : "between")
          }
        >
          <ul className="pagination mx-2">
            <li className={"page-item" + (!canPreviousPage ? " disabled" : "")}>
              <Link
                to="#prev"
                className="page-link"
                onClick={() => gotoPage(0)}
                aria-label="First page"
              >
                <span aria-hidden="true">&laquo;</span>
              </Link>
            </li>
            <li className={"page-item" + (!canPreviousPage ? " disabled" : "")}>
              <Link
                className="page-link"
                to="#page"
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
                to="#page"
                onClick={() => nextPage()}
                aria-label="Next page"
              >
                Next
              </Link>
            </li>
            <li className={"page-item" + (!canNextPage ? " disabled" : "")}>
              <Link
                className="page-link"
                to="#page"
                onClick={() => gotoPage(pageCount - 1)}
                aria-label="Last page"
              >
                <span aria-hidden="true">&raquo;</span>
              </Link>
            </li>
          </ul>
          {Object.keys(selectedRowIds).length !== 0 ? (
            <div className="py-2">
              Selected items: {Object.keys(selectedRowIds).length}
            </div>
          ) : null}

          {isMobile ? null : (
            <select
              className="form-select form-select-sm mx-3"
              aria-label="Select page size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}

export default TablePagination;
