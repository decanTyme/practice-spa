import { useCallback, useRef } from "react";
import { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router";
import useDataService from "../../../../../../services/providers/data";
import TablePagination from "./TablePagination";

function ProductList() {
  const ds = useDataService();
  const location = useLocation();

  const webColumns = useMemo(
    () => [
      {
        Header: "Product",
        columns: [
          {
            Header: "S/N",
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
        Header: () => null,
        id: "details",
        Cell: ({ row }) => (
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

  const index = isNaN(
    parseInt(new URLSearchParams(location.search).get("page"))
  )
    ? 1
    : parseInt(new URLSearchParams(location.search).get("page"));

  const fetchData = useCallback(
    ({ pageIndex, pageSize }) => {
      const fetchId = ++fetchIdRef.current;

      if (isMobile) pageSize = 4;
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;

        ds.fetchItems().then((data) => {
          try {
            setProducts(data.slice(startRow, endRow));
            setPageCount(Math.ceil(data.length / pageSize));
          } catch (e) {
            console.error(e);
          }
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
        currentIndex={index}
        getRowProps={(row) => ({
          onClick: () => ds.viewDataDetails(row.original._id),
        })}
      />
    </div>
  );
}

export default ProductList;
