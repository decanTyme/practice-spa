import SelectColumnFilter from "../common/table/components/Filter/SelectColumnFilter";
import SliderColumnFilter from "../common/table/components/Filter/SliderColumnFilter";
import { filterGreaterThan } from "../common/table/utils";

export const mobileColumns = [
  {
    Header: "Product",
    columns: [
      {
        Header: "Brand",
        accessor: "brand",
        width: "30%",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Name",
        accessor: "name",
        width: "35%",
        Filter: "",
      },
    ],
  },
  {
    Header: "Stock Information",
    columns: [
      {
        Header: "Quantity",
        accessor: "stock.totalQuantity",
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

export const webColumns = [
  {
    Header: "Product",
    columns: [
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
        accessor: "stock.totalQuantity",
        className: "text-center",
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
        width: "8%",
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
