import {
  deleteAllData,
  fetchData,
  modifyData,
  removeData,
  selectData,
  selectDataDetails,
  selectDataError,
  selectDataStatus,
  viewData,
} from "app/state/reducers/data";
import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TablePagination from "./TablePagination";

const mobileColumns = [
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
];

const webColumns = [
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
];

function ProductList() {
  const location = useLocation();
  const dispatch = useDispatch();

  const data = useSelector(selectData);

  const status = useSelector(selectDataStatus);
  const error = useSelector(selectDataError);
  const dataDetails = useSelector(selectDataDetails);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchData());
    }
  }, [status, dispatch]);

  if (status === "failed") {
    console.error(error);
    dispatch(deleteAllData());
  }

  const viewDataDetails = useCallback(
    (itemId) => {
      data.forEach((item) => {
        if (item._id === itemId && dataDetails?._id !== itemId) {
          dispatch(viewData(item));
        }
      });
    },
    [data, dataDetails, dispatch]
  );

  const removeProduct = useCallback(
    (product) => {
      const ans = prompt(
        `Are you sure you want to delete "${product.name}"? \n\nType the the product name below to confirm.`
      );

      if (ans !== null && ans === product.name)
        dispatch(removeData(product._id));
    },
    [dispatch]
  );

  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);

  const index = isNaN(
    parseInt(new URLSearchParams(location.search).get("page"))
  )
    ? 1
    : parseInt(new URLSearchParams(location.search).get("page"));

  const fetchTableData = useCallback(
    ({ pageIndex, pageSize }) => {
      const fetchId = ++fetchIdRef.current;

      if (isMobile) pageSize = 4;
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;

        setProducts(data.slice(startRow, endRow));
        setPageCount(Math.ceil(data.length / pageSize));
      }
    },
    // eslint-disable-next-line
    [data]
  );

  const subComp = useCallback(
    ({ row }) => {
      return (
        <div>
          <button
            className="btn btn-primary float-end mx-1"
            onClick={() => viewDataDetails(row.original._id)}
          >
            View
          </button>
          <button
            className="btn btn-success float-end mx-1"
            onClick={() => {
              viewDataDetails(row.original._id);
              dispatch(modifyData(row.original));
            }}
          >
            Quick Edit
          </button>
          <button
            className="btn btn-danger float-end mx-1"
            onClick={() => removeProduct(row.original)}
          >
            Quick Delete
          </button>
        </div>
      );
    },
    [dispatch, removeProduct, viewDataDetails]
  );

  return (
    <div className="card products-list-wrapper">
      <TablePagination
        columns={isMobile ? mobileColumns : webColumns}
        fetchData={fetchTableData}
        data={products}
        loading={
          status === "loading" ? true : status === "success" ? false : true
        }
        pageCount={pageCount}
        renderRowSubComponent={subComp}
        currentIndex={index}
        getRowProps={(row) => ({
          onClick: () => (isMobile ? viewDataDetails(row.original._id) : null),
        })}
      />
    </div>
  );
}

export default ProductList;
