import { useCallback, useEffect, useMemo } from "react";
import Product from "./components/ProductDetail";
import ProductTable from "./components/ProductTable";
import AddProductForm from "./components/AddProductForm/AddProductForm";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  selectAuthStaleStatus,
  selectAuthState,
} from "../../../../../app/state/slices/auth";
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
} from "../../../../../app/state/slices/data";
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
import Wrapper from "../common/Wrapper";

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
        width: "12%",
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
        accessor: "stock.quantity",
        Filter: "",
      },
      {
        Header: "Unit",
        accessor: "stock.unit",
        width: "7%",
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

  const isLoggedIn = useSelector(selectAuthState);
  const stale = useSelector(selectAuthStaleStatus);

  const data = useSelector(selectAllData);
  const dataDetails = useSelector(selectDataDetails);
  const dataInSelection = useSelector(selectDataInSelection);

  const dataFetchStatus = useSelector(selectDataFetchStatus);
  const error = useSelector(selectDataError);

  useEffect(() => {
    if (
      (dataFetchStatus === "idle" || dataFetchStatus === "failed") &&
      isLoggedIn &&
      !stale
    ) {
      dispatch(fetchData());
    }
  }, [dispatch, dataFetchStatus, error, isLoggedIn, stale]);

  const viewDataDetails = useCallback(
    (itemId) => {
      data.forEach((item) => {
        if (item._id === itemId && dataDetails?._id !== itemId) {
          console.log(item);
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
    <Wrapper pageTitle="Products">
      <section className="row g-3">
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
      </section>
    </Wrapper>
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
