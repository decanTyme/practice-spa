import { useCallback, useEffect, useMemo } from "react";
import Product from "./components/ProductDetail";
import ProductTable from "./components/ProductTable";
import AddProductForm from "./components/AddProductForm/AddProductForm";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  selectAuthStaleStatus,
  selectAuthStatus,
} from "app/state/reducers/auth";
import {
  fetchData,
  modifyData,
  removeData,
  selectAllData,
  selectDataDetails,
  selectDataError,
  selectDataFetchStatus,
  addToSelection,
  viewData,
  selectDataInSelection,
} from "app/state/reducers/data";
import ProductOptions from "./components/Options";
import {
  useTable,
  usePagination,
  useRowSelect,
  useExpanded,
  useSortBy,
  useGlobalFilter,
  useFilters,
} from "react-table";
import { matchSorter } from "match-sorter";
import { isMobile } from "react-device-detect";
import IndeterminateCheckbox from "./components/IndeterminateCheckbox";
import SliderColumnFilter from "./components/SliderColumnFilter";
import SelectColumnFilter from "./components/SelectColumnFilter";
import DefaultColumnFilter from "./components/DefaultColumnFilter";

const mobileColumns = [
  {
    Header: "Product",
    columns: [
      {
        Header: "Name",
        accessor: "name",
        width: "52%",
        Filter: "",
      },
    ],
  },
  {
    Header: "Stock Information",
    columns: [
      {
        Header: "Quantity",
        accessor: "quantity",
        Filter: "",
      },
      {
        Header: "Price",
        accessor: "price",
        Filter: SliderColumnFilter,
        filter: filterGreaterThan,
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
        width: "10%",
        Filter: "",
      },
      {
        Header: "Brand",
        accessor: "brand",
        width: "12%",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Name",
        accessor: "name",
        width: "30%",
        Filter: "",
      },
      {
        Header: "Class",
        accessor: "class",
        width: "12%",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Category",
        accessor: "category",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
    ],
  },
  {
    Header: "Stock Information",
    columns: [
      {
        Header: "Quantity",
        accessor: "quantity",
        Filter: "",
      },
      {
        Header: "Unit",
        accessor: "unit",
        width: "7%",
        Filter: "",
      },
      {
        Header: "Price",
        accessor: "price",
        Filter: SliderColumnFilter,
        filter: filterGreaterThan,
      },
      {
        Header: "Sale",
        accessor: "salePrice",
        Filter: "",
      },
    ],
  },
  {
    Header: () => <div className="text-center">Actions</div>,
    id: "details",
    Cell: ({ row }) => (
      <div {...row.getToggleRowExpandedProps()} className="text-center mx-auto">
        {row.isExpanded ? "⯆" : "⯈"}
      </div>
    ),
    Filter: "",
  },
];

function ProductsWrapper() {
  const location = useLocation();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectAuthStatus);
  const stale = useSelector(selectAuthStaleStatus);

  const data = useSelector(selectAllData);
  const dataDetails = useSelector(selectDataDetails);
  const dataInSelection = useSelector(selectDataInSelection);

  const dataFetchStatus = useSelector(selectDataFetchStatus);
  const error = useSelector(selectDataError);

  useEffect(() => {
    if (
      dataFetchStatus === "idle" ||
      (dataFetchStatus === "failed" && isLoggedIn && !stale)
    ) {
      dispatch(fetchData());
    }
  }, [dataFetchStatus, dispatch, error, isLoggedIn, stale]);

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

  let idx;
  const index = isNaN(
    (idx = parseInt(new URLSearchParams(location.search).get("page")))
  )
    ? 1
    : idx;

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const table = useTable(
    {
      columns: isMobile ? mobileColumns : webColumns,
      data,
      initialState: {
        pageIndex: index - 1,
      },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div className="text-center">
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div className="text-center">
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
          Filter: "",
        },
        ...columns,
      ]);
    }
  );

  const {
    allColumns,
    getToggleHideAllColumnsProps,
    selectedFlatRows,
    selectedRowIds,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { globalFilter },
  } = table;

  const tableActionsDropdown = useCallback(
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

  const selectData = useCallback(
    (data) => {
      const items = data.map((item) => item.original);
      if (dataInSelection.length !== items.length)
        dispatch(addToSelection(items));
    },
    [dataInSelection.length, dispatch]
  );

  useEffect(() => {
    selectData(selectedFlatRows, selectedRowIds);
  }, [selectData, selectedFlatRows, selectedRowIds]);

  return (
    <div className="container-fluid px-3 products-wrapper">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Products</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Share
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-sm-9">
          <ErrorBoundary>
            <ProductTable
              dataLength={data.length}
              tableProps={table}
              renderRowSubComponent={tableActionsDropdown}
              getRowProps={(row) => ({
                onClick: () =>
                  isMobile ? viewDataDetails(row.original._id) : null,
              })}
            />
          </ErrorBoundary>
        </div>
        <aside className="col-sm-3">
          {dataDetails ? (
            <ErrorBoundary>
              <Product product={dataDetails} />
            </ErrorBoundary>
          ) : (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Select a product to view</h5>
              </div>
            </div>
          )}

          <ProductOptions
            allColumns={allColumns}
            getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
          />

          <div className="mt-3">
            <AddProductForm />
          </div>
        </aside>
      </div>
    </div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Custom filter function
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

export default ProductsWrapper;
