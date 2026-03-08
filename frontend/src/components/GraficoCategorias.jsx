import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CORES = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#84cc16"];

export default function GraficoCategorias({ dados }) {
  const chartData = {
    labels: dados.map((d) => d.categoria),
    datasets: [
      {
        data: dados.map((d) => d.total),
        backgroundColor: dados.map((_, i) => CORES[i % CORES.length]),
      },
    ],
  };

  return <Doughnut data={chartData} options={{ responsive: true }} />;
}
