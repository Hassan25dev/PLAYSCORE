import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTranslation } from '../../lang/translationHelper';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Rating Distribution Chart Component
 * 
 * @param {Object} props Component props
 * @param {Object} props.ratingData The rating distribution data to display
 * @param {string} props.title Chart title
 * @returns {JSX.Element} Chart component
 */
const RatingDistributionChart = ({ ratingData, title }) => {
  const { t } = useTranslation();
  
  // Default data if none provided
  const defaultData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: t('dashboard.ratings_count') || 'Number of Ratings',
        data: [2, 5, 10, 15, 8],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Use provided data or default
  const chartData = ratingData || defaultData;

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !!title,
        text: title || t('dashboard.rating_distribution') || 'Rating Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('dashboard.count') || 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: t('dashboard.rating') || 'Rating',
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: '300px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RatingDistributionChart;
