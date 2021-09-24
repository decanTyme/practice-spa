import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import IndeterminateCheckbox from "../IndeterminateCheckbox";
import DefaultColumnFilter from "./components/Filter/DefaultColumnFilter";

export const rowSelectPlugin = (hooks) => {
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
};

export const DefaultColumn = () =>
  useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

export const FilterTypes = () =>
  useMemo(
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

export function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Custom filter function
export function filterGreaterThan(rows, id, filterValue) {
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
