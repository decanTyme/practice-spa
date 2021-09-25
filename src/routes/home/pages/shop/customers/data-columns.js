export const mobileColumns = [
  {
    Header: "Customer Information",
    columns: [
      {
        Header: "Type",
        accessor: "type",
        width: "30%",
        Filter: "",
      },
      {
        Header: "Name",
        accessor: "name",
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
        accessor: "type",
        width: "12%",
        Filter: "",
      },
      {
        Header: "Name",
        accessor: "name",
        width: "40%",
        Filter: "",
      },
      {
        Header: "Contact",
        accessor: "contact",
        width: "8%",
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
