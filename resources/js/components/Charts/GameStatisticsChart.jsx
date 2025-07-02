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
 * Game Statistics Chart Component
 * 
 * @param {Object} props Component props
 * @param {Array} props.data The statistics data to display
 * @param {string} props.title Chart title
 * @param {string} props.xAxisLabel X-axis label
 * @param {string} props.yAxisLabel Y-axis label
 * @returns {JSX.Element} Chart component
 */
const GameStatisticsChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
  const { t } = useTranslation();
  
  // Default options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!title,
        text: title || t('charts.game_statistics'),
      },
    },
    scales: {
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel || t('charts.category'),
        }
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || t('charts.value'),
        },
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="chart-container" style={{ height: '400px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GameStatisticsChart;
