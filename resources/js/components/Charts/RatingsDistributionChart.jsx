import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTranslation } from '../../lang/translationHelper';
import ChartLoadingIndicator from './ChartLoadingIndicator';
import { chartColors, mergeWithDefaultOptions } from './chartTheme';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

/**
 * Ratings Distribution Chart Component
 *
 * @param {Object} props Component props
 * @param {Object} props.ratings The ratings data to display
 * @param {boolean} props.isLoading Whether the chart is loading
 * @param {boolean} props.enableInteraction Enable interactive features
 * @param {Function} props.onRatingClick Callback when a rating segment is clicked
 * @returns {JSX.Element} Chart component
 */
const RatingsDistributionChart = ({
  ratings,
  isLoading = false,
  enableInteraction = false,
  onRatingClick = () => {}
}) => {
  const { t } = useTranslation();
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const chartRef = useRef(null);

  // Handle window resize for responsive options
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle chart click for interaction
  const handleChartClick = (event) => {
    if (!enableInteraction || !chartRef.current) return;

    const chart = chartRef.current;
    const activeElements = chart.getElementsAtEventForMode(
      event.native,
      'nearest',
      { intersect: true },
      false
    );

    if (activeElements.length === 0) return;

    const { datasetIndex, index } = activeElements[0];
    const ratingValue = 5 - index; // Convert index to rating (5 to 1)
    const count = chartData.datasets[datasetIndex].data[index];

    onRatingClick({ rating: ratingValue, count });
  };

  // Calculate total ratings
  const totalRatings = Object.values(ratings).reduce((sum, count) => sum + (count || 0), 0);

  // Prepare data for the chart
  const chartData = {
    labels: [
      `5 ${t('charts.stars')} (${ratings[5] || 0})`,
      `4 ${t('charts.stars')} (${ratings[4] || 0})`,
      `3 ${t('charts.stars')} (${ratings[3] || 0})`,
      `2 ${t('charts.stars')} (${ratings[2] || 0})`,
      `1 ${t('charts.star')} (${ratings[1] || 0})`,
    ],
    datasets: [
      {
        data: [
          ratings[5] || 0,
          ratings[4] || 0,
          ratings[3] || 0,
          ratings[2] || 0,
          ratings[1] || 0,
        ],
        backgroundColor: [
          chartColors.rating5, // Green for 5 stars
          chartColors.rating4, // Light green for 4 stars
          chartColors.rating3, // Yellow for 3 stars
          chartColors.rating2, // Orange for 2 stars
          chartColors.rating1, // Red for 1 star
        ],
        borderColor: [
          '#388E3C',
          '#689F38',
          '#FFA000',
          '#F57C00',
          '#D32F2F',
        ],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  // Options for the chart
  const options = mergeWithDefaultOptions({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: screenWidth < 768 ? 'bottom' : 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      title: {
        display: true,
        text: t('charts.ratings_distribution'),
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = totalRatings > 0 ? Math.round((value / totalRatings) * 100) : 0;
            return `${label}: ${percentage}%`;
          }
        }
      }
    },
    onClick: enableInteraction ? handleChartClick : undefined,
    animation: {
      animateRotate: true,
      animateScale: true
    }
  }, screenWidth);

  return (
    <ChartLoadingIndicator isLoading={isLoading} size="md">
      <div className="chart-container relative" style={{ height: screenWidth < 640 ? '250px' : '300px', width: '100%' }}>
        <Pie
          data={chartData}
          options={options}
          ref={chartRef}
        />

        {/* Display total ratings in center if no data */}
        {!isLoading && totalRatings === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">
                {t('charts.no_data')}
              </p>
            </div>
          </div>
        )}

        {/* Display total ratings in center */}
        {!isLoading && totalRatings > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {totalRatings}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('charts.ratings')}
              </div>
            </div>
          </div>
        )}
      </div>
    </ChartLoadingIndicator>
  );
};

export default RatingsDistributionChart;
