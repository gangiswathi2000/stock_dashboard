import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StockChart({ stocks }) {
  const data = {
    labels: stocks.map((stock) => stock.symbol),
    datasets: [
      {
        label: 'Stock Price ($)',
        data: stocks.map((stock) => stock.price),
        borderColor: 'rgba(59, 130, 246, 1)', 
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        tension: 0.4, 
        fill: true,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgba(59, 130, 246, 1)',
        pointBorderWidth: 2,
        pointRadius: 5, 
        pointHoverRadius: 8, 
        pointHoverBorderWidth: 3,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Live Stock Prices Overview',
        font: {
          size: 24,
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
      x: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mt-10 h-[500px]">
      <Line data={data} options={options} />
    </div>
  );
}

export default StockChart;