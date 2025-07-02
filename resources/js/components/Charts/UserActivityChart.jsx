import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTranslation } from '../../lang/translationHelper';
import ChartLoadingIndicator from './ChartLoadingIndicator';
import ChartTimeFilter from './ChartTimeFilter';
import { chartColors, mergeWithDefaultOptions } from './chartTheme';
import { fetchUserActivityData } from '../../api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * User Activity Chart Component
 *
 * @param {Object} props Component props
 * @param {Object} props.activityData The activity data to display
 * @param {string} props.title Chart title
 * @param {boolean} props.isLoading Whether the chart is loading
 * @param {boolean} props.showTimeFilter Whether to show time period filter
 * @param {Function} props.onPeriodChange Callback when time period changes
 * @param {boolean} props.enableInteraction Enable interactive features
 * @param {Function} props.onPointClick Callback when a data point is clicked
 * @returns {JSX.Element} Chart component
 */
const UserActivityChart = ({
  activityData: propActivityData,
  title,
  isLoading: propIsLoading = false,
  showTimeFilter = true,
  onPeriodChange = () => {},
  enableInteraction = false,
  onPointClick = () => {}
}) => {
  const { t } = useTranslation();
  const [activePeriod, setActivePeriod] = useState('12months');
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const chartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(propIsLoading || !propActivityData);
  const [activityData, setActivityData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch activity data if not provided as prop
  useEffect(() => {
    if (propActivityData) {
      setActivityData(propActivityData);
      setIsLoading(propIsLoading);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchUserActivityData(activePeriod);

        if (response.data) {
          // Apply chart styling to the datasets
          const styledData = {
            labels: response.data.labels,
            datasets: response.data.datasets.map((dataset, index) => ({
              ...dataset,
              borderColor: index === 0 ? chartColors.primary : chartColors.secondary,
              backgroundColor: index === 0
                ? `rgba(${parseInt(chartColors.primary.slice(1, 3), 16)}, ${parseInt(chartColors.primary.slice(3, 5), 16)}, ${parseInt(chartColors.primary.slice(5, 7), 16)}, 0.1)`
                : `rgba(${parseInt(chartColors.secondary.slice(1, 3), 16)}, ${parseInt(chartColors.secondary.slice(3, 5), 16)}, ${parseInt(chartColors.secondary.slice(5, 7), 16)}, 0.1)`,
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: index === 0 ? chartColors.primary : chartColors.secondary,
              pointBorderColor: '#fff',
              pointBorderWidth: 1,
              pointRadius: 4,
              pointHoverRadius: 6,
              label: t(`dashboard.${dataset.label.toLowerCase().replace(/\s+/g, '_')}`) || dataset.label,
            }))
          };

          setActivityData(styledData);
        }
      } catch (err) {
        console.error('Error fetching activity data:', err);
        setError('Failed to load activity data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [propActivityData, propIsLoading, activePeriod, t]);

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

  // Handle period change
  const handlePeriodChange = (period) => {
    setActivePeriod(period);
    onPeriodChange(period);
  };

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
    const label = chartData.labels[index];
    const value = chartData.datasets[datasetIndex].data[index];
    const dataset = chartData.datasets[datasetIndex].label;

    onPointClick({ label, value, dataset, index, datasetIndex });
  };

  // Default data if none provided and still loading
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: t('dashboard.ratings_given') || 'Ratings Given',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: chartColors.primary,
        backgroundColor: `rgba(${parseInt(chartColors.primary.slice(1, 3), 16)}, ${parseInt(chartColors.primary.slice(3, 5), 16)}, ${parseInt(chartColors.primary.slice(5, 7), 16)}, 0.1)`,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: t('dashboard.comments_posted') || 'Comments Posted',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: chartColors.secondary,
        backgroundColor: `rgba(${parseInt(chartColors.secondary.slice(1, 3), 16)}, ${parseInt(chartColors.secondary.slice(3, 5), 16)}, ${parseInt(chartColors.secondary.slice(5, 7), 16)}, 0.1)`,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: chartColors.secondary,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Use provided data or default
  const chartData = activityData || defaultData;

  // Options for the chart
  const options = mergeWithDefaultOptions({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: screenWidth < 768 ? 'bottom' : 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      title: {
        display: !!title,
        text: title || t('dashboard.activity_over_time') || 'Activity Over Time',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(30, 34, 53, 0.8)',
        padding: 12,
        cornerRadius: 8,
        caretSize: 6,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('dashboard.count') || 'Count',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          precision: 0,
        }
      },
      x: {
        title: {
          display: true,
          text: t('dashboard.month') || 'Month',
        },
        grid: {
          display: false,
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    onClick: enableInteraction ? handleChartClick : undefined,
    hover: {
      mode: 'nearest',
      intersect: false
    }
  }, screenWidth);

  return (
    <div className="chart-wrapper">
      {showTimeFilter && (
        <ChartTimeFilter
          activePeriod={activePeriod}
          onChange={handlePeriodChange}
        />
      )}

      {error ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchUserActivityData(activePeriod)
                .then(response => {
                  if (response.data) {
                    setActivityData({
                      labels: response.data.labels,
                      datasets: response.data.datasets.map((dataset, index) => ({
                        ...dataset,
                        borderColor: index === 0 ? chartColors.primary : chartColors.secondary,
                        backgroundColor: index === 0
                          ? `rgba(${parseInt(chartColors.primary.slice(1, 3), 16)}, ${parseInt(chartColors.primary.slice(3, 5), 16)}, ${parseInt(chartColors.primary.slice(5, 7), 16)}, 0.1)`
                          : `rgba(${parseInt(chartColors.secondary.slice(1, 3), 16)}, ${parseInt(chartColors.secondary.slice(3, 5), 16)}, ${parseInt(chartColors.secondary.slice(5, 7), 16)}, 0.1)`,
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: index === 0 ? chartColors.primary : chartColors.secondary,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 1,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                      }))
                    });
                  }
                  setIsLoading(false);
                })
                .catch(err => {
                  console.error('Error retrying activity data fetch:', err);
                  setError('Failed to load activity data');
                  setIsLoading(false);
                });
            }}
          >
            {t('common.retry') || 'Retry'}
          </button>
        </div>
      ) : (
        <ChartLoadingIndicator isLoading={isLoading} size="md">
          <div className="chart-container" style={{ height: screenWidth < 640 ? '250px' : '300px', width: '100%' }}>
            <Line
              data={chartData}
              options={options}
              ref={chartRef}
            />
          </div>
        </ChartLoadingIndicator>
      )}
    </div>
  );
};

export default UserActivityChart;
