'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler, ChartDataset } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

type ChartProps = {
  labels: string[];
  datasets: ChartDataset<"line", number[]>[];
};

const Charts = ({ labels, datasets }: ChartProps) =>{
  const chartData = { labels, datasets };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#64748b' },
      },
    },
  };

  return (
    <div className="h-full">
      <Line
        data = { chartData }
        options = { chartOptions }
        className="relative w-full"
      />
    </div>
  );
};

export default Charts;