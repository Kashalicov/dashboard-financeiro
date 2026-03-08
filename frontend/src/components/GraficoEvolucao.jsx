import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function GraficoEvolucao({ dados }) {
  const chartData = {
    labels: dados.map((d) => d.mes),
    datasets: [
      {
        label: "Receitas",
        data: dados.map((d) => d.receitas),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        tension: 0.3,
      },
      {
        label: "Despesas",
        data: dados.map((d) => d.despesas),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.3,
      },
    ],
  };

  return <Line data={chartData} options={{ responsive: true }} />;
}
