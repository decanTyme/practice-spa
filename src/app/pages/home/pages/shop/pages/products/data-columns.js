import SelectColumnFilter from "../../../../common/table/components/filters/SelectColumnFilter";

export const mobileColumns = [
  {
    Header: "Product Information",
    columns: [
      {
        Header: "Brand",
        accessor: "brand.name",
        width: "20%",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Name",
        accessor: "name",
        width: "55%",
        Filter: "",
      },
    ],
  },
  {
    Header: "Stock",
    columns: [
      {
        Header: "Total",
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
        accessor: "brand.name",
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
        Filter: SelectColumnFilter,
        filter: "includes",
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
