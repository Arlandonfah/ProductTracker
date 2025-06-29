import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RatingChartProps {
  data: { rating: number; count: number }[];
}

const RatingChart: React.FC<RatingChartProps> = ({ data }) => {
  // Prepare data for Chart.js
  const chartLabels = data.map(
    (item) => `${item.rating} étoile${item.rating > 1 ? "s" : ""}`
  );
  const chartCounts = data.map((item) => item.count);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Nombre d'avis",
        data: chartCounts,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Distribution des Notes",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Nombre d'avis",
        },
      },
      x: {
        title: {
          display: true,
          text: "Note (étoiles)",
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: "300px" }}>
      {" "}
      {/* Ensure a fixed height for the chart container */}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default RatingChart;
