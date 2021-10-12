export const mobileColumns = [
  {
    Header: "Customer Information",
    columns: [
      {
        Header: "Type",
        accessor: "_type",
        width: "30%",
        Filter: "",
      },
      {
        Header: "Name",
        accessor: "fullname",
        width: "52%",
        Filter: "",
      },
    ],
  },
  {
    Header: "Status",
    columns: [
      {
        Header: "Debt",
        accessor: "debt",
        Filter: "",
      },
    ],
  },
];

export const webColumns = [
  {
    Header: "Customer Information",
    columns: [
      {
        Header: "Type",
        accessor: "_type",
        width: "20%",
        Filter: "",
      },
      {
        Header: "Name",
        accessor: "fullname",
        width: "40%",
        Filter: "",
      },
    ],
  },
  {
    Header: "Status",
    columns: [
      {
        Header: "Debt",
        accessor: "debt",
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
