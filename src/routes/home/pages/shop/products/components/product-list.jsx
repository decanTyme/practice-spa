import { useCallback, useRef } from "react";
import { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import useDataService from "../../../../../../services/providers/data";
import TablePagination from "./TablePagination";

function ProductList() {
  const ds = useDataService();

  const webColumns = useMemo(
    () => [
      {
        Header: "Product",
        columns: [
          {
            Header: "Code",
            accessor: "code",
          },
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Class",
            accessor: "class",
          },
          {
            Header: "Category",
            accessor: "category",
          },
        ],
      },
      {
        Header: "Stock Information",
        columns: [
          {
            Header: "Quantity",
            accessor: "quantity",
          },
          {
            Header: "Price",
            accessor: "price",
          },
          {
            Header: "Sale Price",
            accessor: "salePrice",
          },
        ],
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "⯆" : "⯈"}
          </span>
        ),
      },
    ],
    []
  );

  const mobileColumns = useMemo(
    () => [
      {
        Header: "Product",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
        ],
      },
      {
        Header: "Stock Information",
        columns: [
          {
            Header: "Quantity",
            accessor: "quantity",
          },
          {
            Header: "Price",
            accessor: "price",
          },
        ],
      },
    ],
    []
  );

  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(
    ({ pageIndex, pageSize }) => {
      const fetchId = ++fetchIdRef.current;

      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;

        ds.fetchItems().then((data) => {
          setProducts(data.slice(startRow, endRow));
          setPageCount(Math.ceil(data.length / pageSize));
        });
      }
    },
    // eslint-disable-next-line
    [ds.isAdding, ds.isDeleting]
  );

  const subComp = useCallback(
    ({ row }) => (
      <div>
        <button
          className="btn btn-primary float-end mx-1"
          onClick={() => {
            ds.viewDataDetails(row.original._id);
          }}
        >
          View
        </button>
        <button className="btn btn-danger float-end mx-1">Quick Delete</button>
      </div>
    ),
    [ds]
  );

  return (
    <div className="card products-list-wrapper">
      <TablePagination
        columns={isMobile ? mobileColumns : webColumns}
        fetchData={fetchData}
        data={products}
        loading={ds.isFetching}
        pageCount={pageCount}
        renderRowSubComponent={subComp}
        getRowProps={(row) => ({
          onClick: () => ds.viewDataDetails(row.original._id),
        })}
      />
    </div>
  );
}

export default ProductList;
