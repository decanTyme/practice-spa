import "../styles/customers-wrapper.css";
import { useCallback, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
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
import {
  addToCustomerSelection,
  fetchCustomers,
  viewCustomerDetail,
} from "../../../../../../../state/slices/data/customer";
import {
  selectAllCustomers,
  selectCurrentlySelectedCustomers,
  selectCustomerDetails,
  selectCustomerFetchStatus,
} from "../../../../../../../state/slices/data/customer/selectors";
import Card from "../../../../../../common/Card";
import Container from "../../../../../../common/Container";
import ErrorBoundary from "../../../../../../components/ErrorBoundary";
import PageWrapper from "../../../../../common/PageWrapper";
import FilterOptionsCard from "../../../../../common/table/components/TableFilterOptionsCard";
import PaginationTable from "../../../../../common/table/PaginationTable";
import {
  useDefaultColumn,
  FilterTypes,
  rowSelectPlugin,
} from "../../../../../common/table/utils";
import AddCustomerForm from "../components/AddCustomerForm";
import CustomerDetailsCard from "../components/CustomerDetailsCard";
import { mobileColumns, webColumns } from "../data-columns";

function Customers() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectAuthState);
  const stale = useSelector(selectAuthStaleStatus);

  const data = useSelector(selectAllCustomers);
  const customerDetails = useSelector(selectCustomerDetails);
  const dataInSelection = useSelector(selectCurrentlySelectedCustomers);

  const database = useSelector(selectAuthDatabaseStatus);

  const customerFetchStatus = useSelector(selectCustomerFetchStatus);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        (customerFetchStatus === Constants.IDLE ||
          customerFetchStatus === Constants.FAILED) &&
        database.status === Constants.IDLE &&
        isLoggedIn &&
        !stale
      ) {
        dispatch(fetchCustomers());
      }
    });

    return () => clearTimeout(timeout);
  }, [dispatch, customerFetchStatus, isLoggedIn, stale, database]);

  const viewDataDetails = useCallback(
    (item) => dispatch(viewCustomerDetail(item)),
    [dispatch]
  );

  const table = useTable(
    {
      columns: isMobile ? mobileColumns : webColumns,
      data,
      initialState: {
        pageIndex: 0,
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
    ({ row }) => {
      return (
        <>
          <button
            className="btn btn-primary float-end mx-1"
            onClick={() => viewDataDetails(row.original)}
          >
            View
          </button>
          <button
            className="btn btn-success float-end mx-1"
            onClick={() => alert(`Sorry, we can't do that right now!`)}
          >
            Quick Edit
          </button>
          <button
            className="btn btn-danger float-end mx-1"
            onClick={() => alert(`Sorry, we can't do that right now!`)}
          >
            Quick Delete
          </button>
        </>
      );
    },
    [viewDataDetails]
  );

  const selectData = useCallback(
    (data) => {
      const items = data.map((item) => item.original);
      if (dataInSelection.length !== items.length)
        dispatch(addToCustomerSelection(items));
    },
    [dataInSelection.length, dispatch]
  );

  useEffect(() => {
    selectData(selectedFlatRows, selectedRowIds);
  }, [selectData, selectedFlatRows, selectedRowIds]);

  return (
    <PageWrapper pageTitle="Customers">
      <Container.Row section g="3">
        <Container.Col modifier="sm" columns="9">
          <ErrorBoundary>
            <div className="customer-table-wrapper">
              <PaginationTable
                loading={customerFetchStatus === Constants.LOADING}
                dataLength={data.length}
                tableProps={table}
                renderRowSubComponent={tableActionsDropdown}
                getRowProps={(row) => ({
                  onClick: () =>
                    isMobile ? viewDataDetails(row.original) : null,
                })}
                getCellProps={(cellInfo) => ({
                  style: {
                    textAlign: typeof cellInfo.value === "number" && "center",
                    textTransform:
                      cellInfo.column.id === "_type" && "capitalize",
                  },
                })}
              />
            </div>
          </ErrorBoundary>
        </Container.Col>
        <Container.Col aside modifier="sm" columns="3">
          {customerDetails ? (
            <ErrorBoundary>
              <CustomerDetailsCard customerDetails={customerDetails} />
            </ErrorBoundary>
          ) : (
            <Card>
              <Card.Body>
                <Card.Title>Select a customer to view</Card.Title>
              </Card.Body>
            </Card>
          )}

          <div className="mt-3">
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
                    id !== "name" &&
                    id !== "debt"
                )}
                filterColumns={allColumns.filter(({ Filter }) => Filter !== "")}
              />
            </ErrorBoundary>
          </div>

          <div className="mt-3">
            <AddCustomerForm />
          </div>
        </Container.Col>
      </Container.Row>
    </PageWrapper>
  );
}

export default Customers;
