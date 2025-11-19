import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsChart = ({ type, data, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar options={options} data={data} />;
      case "line":
        return <Line options={options} data={data} />;
      case "doughnut":
        return <Doughnut options={options} data={data} />;
      default:
        return <Bar options={options} data={data} />;
    }
  };

  return <div className="analytics-chart">{renderChart()}</div>;
};

export default AnalyticsChart;

