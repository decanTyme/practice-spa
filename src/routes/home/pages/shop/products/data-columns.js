import SelectColumnFilter from "../common/table/components/Filter/SelectColumnFilter";
export const mobileColumns = [
  {
    Header: "Product Information",
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
        Header: "Total Quantity",
        accessor: "stock.total",
        width: "15%",
        Filter: "",
      },
    ],
  },
];

export const webColumns = [
  {
    Header: "Product Information",
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
        accessor: "_class",
        width: "15%",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Category",
        accessor: "category",
        width: "15%",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
    ],
  },
  {
    Header: "Stock Information",
    columns: [
      {
        Header: "Total Quantity",
        accessor: "stock.total",
        width: "12%",
        className: "text-center",
        Filter: "",
      },
      {
        Header: "Unit",
        accessor: "unit",
        width: "5%",
        className: "text-center",
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
