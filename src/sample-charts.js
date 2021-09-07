function generateRandomData(n) {
  let data = [];
  for (let i = 0; i < n; i++) {
    let x = Math.floor(Math.random() * 100);
    data.push(x);
  }
  return data;
}

// Line Chart
export const myLineChart = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Monthly Sales",
      data: generateRandomData(12),
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.3,
    },
  ],
};

// Bar Chart
export const myBarChart = {
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: generateRandomData(6),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
};

// Pie Chart
export const myPieChart = {
  data: {
    datasets: [
      {
        data: generateRandomData(3),
      },
    ],
    backgroundColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
    ],
    labels: ["Assets", "Debt", "TBP"],
  },
  options: {
    cutoutPercentage: 10,
    animation: {
      animateRotate: true,
      animateScale: false,
    },
  },
};

// Combo Charts
export const myLineBarComboChart = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      type: "bar",
      label: "Target Sales",
      data: generateRandomData(12),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
    },
    {
      type: "line",
      label: "Actual Sales",
      data: generateRandomData(12),
      fill: false,
      borderColor: "rgb(54, 162, 235)",
      tension: 0.4,
    },
  ],
};
