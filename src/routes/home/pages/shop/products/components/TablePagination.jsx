import { forwardRef, Fragment, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import {
  useTable,
  usePagination,
  useRowSelect,
  useExpanded,
  useSortBy,
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
  currentIndex: controlledIndex,
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
      initialState: {
        pageIndex:
          controlledIndex > controlledPageCount ? 0 : controlledIndex - 1,
      },
      manualPagination: true,
      manualSortBy: false,
      autoResetPage: false,
      autoResetSortBy: false,
      pageCount: controlledPageCount,
    },
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
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
  }, [fetchData, pageIndex, pageSize]);

  return (
    <div className="table-responsive">
      <table {...getTableProps()} className="table table-hover rounded-top">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps([
                    column.getSortByToggleProps(),
                    getColumnProps(column),
                  ])}
                  scope="col"
                  className="px-3"
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
              <Fragment key={page.map(() => btoa(Math.random())).pop()}>
                <tr {...row.getRowProps(getRowProps(row))}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
      <div>
        <div
          className={
            "d-flex mx-2 justify-content-" + (isMobile ? "center" : "between")
          }
        >
          <ul className="pagination mx-2">
            <li className={"page-item" + (!canPreviousPage ? " disabled" : "")}>
              <Link
                to={`?${new URLSearchParams({ page: 1 })}`}
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
                to={`?${new URLSearchParams({ page: pageCount - 1 })}`}
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
