import "../styles/products-wrapper.css";
import { useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  useExpanded,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import {
  selectAuthDatabaseStatus,
  selectAuthStaleStatus,
  selectAuthState,
} from "../../../../../../../state/slices/auth/selectors";
import Constants from "../../../../../../../state/slices/constants";
import { fetchBrands } from "../../../../../../../state/slices/data/brand";
import { fetchCouriers } from "../../../../../../../state/slices/data/courier";
import {
  addToProductSelection,
  modifyProduct,
  setIdle,
  viewProductDetail,
} from "../../../../../../../state/slices/data/product";
import {
  fetchProducts,
  removeProducts as removeProduct,
} from "../../../../../../../state/slices/data/product/async-thunks";
import {
  selectAllProducts,
  selectCurrentlySelectedProducts,
  selectProductDeleteStatus,
  selectProductDetails,
  selectProductFetchStatus,
  selectProductImportedCSV,
  selectProductModifyStatus,
  selectProductPushStatus,
} from "../../../../../../../state/slices/data/product/selectors";
import Card from "../../../../../../common/Card";
import Container from "../../../../../../common/Container";
import SpinnerButton from "../../../../../../common/SpinnerButton";
import ErrorBoundary from "../../../../../../components/ErrorBoundary";
import PageWrapper from "../../../../../common/PageWrapper";
import FilterOptionsCard from "../../../../../common/table/components/TableFilterOptionsCard";
import PaginationTable from "../../../../../common/table/PaginationTable";
import {
  FilterTypes,
  rowSelectPlugin,
  useDefaultColumn,
} from "../../../../../common/table/utils";
import ScannerMenu from "../components/ScannerMenu";
import { mobileColumns, webColumns } from "../data-columns";
import ProductDetailsCard from "./ProductDetailsCard";
import ProductOptions from "./ProductOptionsCard";

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
  const saveStatus = useSelector(selectProductPushStatus);
  const modifyStatus = useSelector(selectProductModifyStatus);
  const removeStatus = useSelector(selectProductDeleteStatus);

  useEffect(() => {
    saveStatus !== Constants.IDLE &&
      saveStatus !== Constants.LOADING &&
      dispatch(setIdle(Constants.DataService.PUSH));

    modifyStatus !== Constants.IDLE &&
      modifyStatus !== Constants.LOADING &&
      dispatch(setIdle(Constants.DataService.MODIFY));

    removeStatus !== Constants.IDLE &&
      removeStatus !== Constants.LOADING &&
      dispatch(setIdle(Constants.DataService.REMOVE));
  }, [dispatch, modifyStatus, removeStatus, saveStatus]);

  useEffect(() => {
    // Only fetch if either the user is signed in, not stale, or
    // Data Service is idle or has a previously failed attempt
    const _timeout = setTimeout(() => {
      if (
        (dataFetchStatus === Constants.IDLE ||
          dataFetchStatus === Constants.FAILED) &&
        database.status === Constants.IDLE &&
        isLoggedIn &&
        !stale
      ) {
        dispatch(fetchProducts());
        dispatch(fetchBrands());
        dispatch(fetchCouriers());
      }
    });

    return () => clearTimeout(_timeout);
  }, [dispatch, dataFetchStatus, isLoggedIn, stale, database]);

  const viewDataDetails = useCallback(
    (item) => dispatch(viewProductDetail(item)),
    [dispatch]
  );

  const [loading, setLoading] = useState({});

  const onRemoveProduct = useCallback(
    async (product) => {
      const ans = prompt(
        `Are you sure you want to delete "${product.name}"? \n\nType the the product name below to confirm.`
      );

      if (ans !== null && ans === product.name) {
        setLoading((prevLoading) => ({ ...prevLoading, [product._id]: true }));

        try {
          await dispatch(removeProduct(product._id)).unwrap();
        } catch (error) {
          console.error(error);
        } finally {
          setLoading((prevLoading) => ({
            ...prevLoading,
            [product._id]: false,
          }));
        }
      }
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
        pageSize: 5,
      },
      DefaultColumn: useDefaultColumn,
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
            data-bs-target="#addProductMenu"
            data-bs-toggle="modal"
            onClick={() => {
              viewDataDetails(item);
              dispatch(modifyProduct(item));
            }}
          >
            Quick Edit
          </button>

          <SpinnerButton
            className="btn btn-danger float-end mx-1"
            isLoading={loading[item._id]}
            onClick={() => onRemoveProduct(item)}
            disabled={loading[item._id]}
          >
            Quick Delete
          </SpinnerButton>
        </div>
      );
    },
    [dispatch, onRemoveProduct, viewDataDetails, loading]
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
    <PageWrapper pageTitle="Products">
      <Container.Row section g="3">
        <Container.Col modifier="sm" columns="9">
          <div className="product-table-wrapper">
            <ErrorBoundary>
              <PaginationTable
                loading={dataFetchStatus === Constants.LOADING}
                dataLength={data.length}
                pageSizes={[5, 10, 15, 20, 25]}
                tableProps={table}
                renderRowSubComponent={tableActionsDropdown}
                getRowProps={(row) => ({
                  onClick: () => isMobile && viewDataDetails(row.original),
                })}
                getCellProps={(cellInfo) => ({
                  style: {
                    textAlign: typeof cellInfo.value === "number" && "center",
                    textTransform:
                      (cellInfo.column.id === "_class" ||
                        cellInfo.column.id === "category" ||
                        cellInfo.column.id === "unit") &&
                      "capitalize",
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
              <Card>
                <Card.Body>
                  <Card.Title>Select a product to view</Card.Title>
                </Card.Body>
              </Card>
            )}
          </div>

          {importedCSV && (
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
                    data.stock.quantity.sold
                  } ${data.stock.unit}`}
                </div>
              ))}
            </Card>
          )}
        </Container.Col>

        <Container.Col aside modifier="sm" columns="3">
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
              <ProductOptions />
            </ErrorBoundary>
          </div>
        </Container.Col>
      </Container.Row>

      <ScannerMenu />
    </PageWrapper>
  );
}

export default ProductsWrapper;
