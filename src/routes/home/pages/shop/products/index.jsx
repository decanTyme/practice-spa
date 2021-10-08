import "./products-wrapper.css";
import { useCallback, useEffect } from "react";
import ProductDetailsCard from "./components/ProductDetailsCard";
import PaginationTable from "../common/table/PaginationTable";
import AddProductForm from "./components/AddProductForm/AddProductForm";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  fetchProducts,
  removeProduct,
} from "../../../../../app/state/slices/data/product/async-thunks";
import {
  selectProductFetchStatus,
  selectAllProducts,
  selectProductDetails,
  selectCurrentlySelectedProducts,
  selectProductImportedCSV,
} from "../../../../../app/state/slices/data/product/selectors";
import {
  useTable,
  usePagination,
  useRowSelect,
  useExpanded,
  useSortBy,
  useGlobalFilter,
  useFilters,
} from "react-table";
import { isMobile } from "react-device-detect";
import Wrapper from "../common/Wrapper";
import FilterOptionsCard from "../common/table/TableFilterOptionsCard";
import Card from "../../../common/Card";
import {
  DefaultColumn,
  FilterTypes,
  rowSelectPlugin,
} from "../common/table/utils";
import {
  selectAuthDatabaseStatus,
  selectAuthStaleStatus,
  selectAuthState,
} from "../../../../../app/state/slices/auth/selectors";
import { mobileColumns, webColumns } from "./data-columns";
import Constants from "../../../../../app/state/slices/constants";
import {
  addToProductSelection,
  modifyProduct,
  viewProductDetail,
} from "../../../../../app/state/slices/data/product";

function ProductsWrapper() {
  const location = useLocation();
  const dispatch = useDispatch();

  const database = useSelector(selectAuthDatabaseStatus);
  const isLoggedIn = useSelector(selectAuthState);
  const stale = useSelector(selectAuthStaleStatus);

  const data = useSelector(selectAllProducts);
  const productDetails = useSelector(selectProductDetails);
  const dataInSelection = useSelector(selectCurrentlySelectedProducts);
  const importedCSV = useSelector(selectProductImportedCSV);

  const dataFetchStatus = useSelector(selectProductFetchStatus);

  useEffect(() => {
    // Only fetch if either the user is logged in, not stale, or
    // Data Service is idle or has a previously failed attempt
    const timeout = setTimeout(() => {
      if (
        (dataFetchStatus === Constants.IDLE ||
          dataFetchStatus === Constants.FAILED) &&
        database.status === Constants.IDLE &&
        isLoggedIn &&
        !stale
      ) {
        dispatch(fetchProducts());
      }
    });

    return () => clearTimeout(timeout);
  }, [dispatch, dataFetchStatus, isLoggedIn, stale, database]);

  const viewDataDetails = useCallback(
    (item) => dispatch(viewProductDetail(item)),
    [dispatch]
  );

  const onRemoveProduct = useCallback(
    (product) => {
      const ans = prompt(
        `Are you sure you want to delete "${product.name}"? \n\nType the the product name below to confirm.`
      );

      if (ans !== null && ans === product.name)
        dispatch(removeProduct(product._id));
    },
    [dispatch]
  );

  let idx;
  const index = isNaN(
    (idx = parseInt(new URLSearchParams(location.search).get("page")))
  )
    ? 1
    : idx;

  const table = useTable(
    {
      columns: isMobile ? mobileColumns : webColumns,
      data,
      initialState: {
        pageIndex: index - 1,
      },
      DefaultColumn,
      FilterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    rowSelectPlugin
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
    ({ row: { original: item } }) => {
      return (
        <div>
          <button
            className="btn btn-primary float-end mx-1"
            onClick={() => viewDataDetails(item)}
          >
            View Details
          </button>
          <button
            className="btn btn-success float-end mx-1"
            onClick={() => {
              viewDataDetails(item);
              dispatch(modifyProduct(item));
            }}
          >
            Quick Edit
          </button>
          <button
            className="btn btn-danger float-end mx-1"
            onClick={() => onRemoveProduct(item)}
          >
            Quick Delete
          </button>
        </div>
      );
    },
    [dispatch, onRemoveProduct, viewDataDetails]
  );

  const selectData = useCallback(
    (data) => {
      const items = data.map((item) => item.original);
      if (dataInSelection.length !== items.length)
        dispatch(addToProductSelection(items));
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
          <div className="product-table-wrapper">
            <ErrorBoundary>
              <PaginationTable
                loading={dataFetchStatus === Constants.LOADING}
                dataLength={data.length}
                tableProps={table}
                renderRowSubComponent={tableActionsDropdown}
                getRowProps={(row) => ({
                  onClick: () => isMobile && viewDataDetails(row.original),
                })}
                getCellProps={(cellInfo) => ({
                  style: {
                    textAlign: typeof cellInfo.value === "number" && "center",
                    textTransform: "capitalize",
                  },
                })}
              />
            </ErrorBoundary>
          </div>
          <div className="mt-3">
            {productDetails ? (
              <ErrorBoundary>
                <ProductDetailsCard product={productDetails} />
              </ErrorBoundary>
            ) : (
              <Card title="Select a product to view" />
            )}
          </div>
          {importedCSV ? (
            <Card title="Imported CSV (Preview)" className="mt-3">
              <table></table>
              {importedCSV.map((data) => (
                <div key={data.code}>
                  {`[${data.code}] ${data.brand} - ${
                    data.name
                  } @${data.prices.map(
                    ({ label, value }) => ` [${label}] Php${value}`
                  )} | ${data.class} ${data.category} > ${
                    data.stock.quantity.inbound
                  } ${data.stock.quantity.warehouse} ${
                    data.stock.quantity.shipped
                  } ${data.stock.unit}`}
                </div>
              ))}
            </Card>
          ) : null}
        </div>
        <aside className="col-sm-3">
          <ErrorBoundary>
            <FilterOptionsCard
              getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
              preGlobalFilteredRows={preGlobalFilteredRows}
              setGlobalFilter={setGlobalFilter}
              globalFilter={globalFilter}
              toggleColumns={allColumns.filter(
                ({ id }) =>
                  id !== "details" &&
                  id !== "selection" &&
                  id !== "brand" &&
                  id !== "name" &&
                  id !== "price" &&
                  id !== "stock.total"
              )}
              filterColumns={allColumns.filter(({ Filter }) => Filter !== "")}
            />
          </ErrorBoundary>

          <div className="mt-3">
            <ErrorBoundary>
              <AddProductForm />
            </ErrorBoundary>
          </div>
        </aside>
      </section>
    </Wrapper>
  );
}

export default ProductsWrapper;
