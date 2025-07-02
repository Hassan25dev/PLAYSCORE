import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { useTranslation } from '../../lang/translationHelper';
import ChartLoadingIndicator from './ChartLoadingIndicator';
import ChartTimeFilter from './ChartTimeFilter';
import { chartColors, mergeWithDefaultOptions } from './chartTheme';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

/**
 * Dashboard Statistics Chart Component
 *
 * @param {Object} props Component props
 * @param {Object} props.stats The statistics data to display
 * @param {string} props.title Chart title
 * @param {boolean} props.isLoading Whether the chart is loading
 * @param {boolean} props.showTimeFilter Whether to show time period filter
 * @param {Function} props.onPeriodChange Callback when time period changes
 * @param {boolean} props.enableDrilldown Enable drill-down on chart segments
 * @param {Function} props.onDrilldown Callback when a segment is clicked for drill-down
 * @returns {JSX.Element} Chart component
 */
const DashboardStatsChart = ({
  stats,
  title,
  isLoading = false,
  showTimeFilter = false,
  onPeriodChange = () => {},
  enableDrilldown = false,
  onDrilldown = () => {}
}) => {
  const { t } = useTranslation();
  const [activePeriod, setActivePeriod] = useState('30days');
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

  // Handle period change
  const handlePeriodChange = (period) => {
    setActivePeriod(period);
    onPeriodChange(period);
  };

  // Handle chart click for drill-down
  const handleChartClick = (event) => {
    if (!enableDrilldown || !chartRef.current) return;

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

    onDrilldown({ label, value, index });
  };

  // Prepare data for the chart
  const chartData = {
    labels: [
      t('developer.dashboard.published'),
      t('developer.dashboard.pending'),
      t('developer.dashboard.rejected'),
      t('developer.dashboard.drafts'),
    ],
    datasets: [
      {
        data: [
          stats.published || 0,
          stats.pending || 0,
          stats.rejected || 0,
          stats.drafts || 0,
        ],
        backgroundColor: [
          chartColors.success, // Green for published
          chartColors.info,    // Blue for pending
          chartColors.danger,  // Red for rejected
          chartColors.dark,    // Grey for drafts
        ],
        borderColor: [
          '#388E3C',
          '#1976D2',
          '#D32F2F',
          '#757575',
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
          boxWidth: screenWidth < 480 ? 8 : 12,
          boxHeight: screenWidth < 480 ? 8 : 12,
          padding: screenWidth < 480 ? 8 : 15,
          font: {
            size: screenWidth < 480 ? 10 : 12,
          },
        },
      },
      title: {
        display: !!title,
        text: title || t('charts.game_status_distribution'),
        font: {
          size: screenWidth < 480 ? 14 : 16,
        },
        padding: {
          top: screenWidth < 480 ? 5 : 10,
          bottom: screenWidth < 480 ? 10 : 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        titleFont: {
          size: screenWidth < 480 ? 11 : 13,
        },
        bodyFont: {
          size: screenWidth < 480 ? 10 : 12,
        },
        padding: screenWidth < 480 ? 8 : 12,
        boxPadding: screenWidth < 480 ? 4 : 6,
      }
    },
    onClick: enableDrilldown ? handleChartClick : undefined,
    cutout: screenWidth < 480 ? '55%' : '60%',
    animation: {
      animateRotate: true,
      animateScale: true
    },
    // Increase touch radius for better mobile interaction
    elements: {
      arc: {
        borderWidth: 1,
        hoverBorderWidth: 2,
        hoverOffset: screenWidth < 480 ? 8 : 10,
      }
    }
  }, screenWidth);

  // Calculate total games
  const totalGames = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
  const hasGames = totalGames > 0;

  return (
    <div className="chart-wrapper">
      {showTimeFilter && (
        <ChartTimeFilter
          activePeriod={activePeriod}
          onChange={handlePeriodChange}
        />
      )}

      <ChartLoadingIndicator isLoading={isLoading} size={screenWidth < 480 ? "sm" : "md"}>
        <div className="chart-container relative" style={{ height: screenWidth < 640 ? '220px' : '300px', width: '100%' }}>
          {hasGames ? (
            <>
              <Doughnut
                data={chartData}
                options={options}
                ref={chartRef}
              />

              {/* Center text with total count */}
              {!isLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateX(-9%)' }}>
                  <div className="text-center bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center shadow-sm">
                    <div className={`${screenWidth < 480 ? 'text-xl' : 'text-2xl'} font-bold text-gray-800 dark:text-gray-200 leading-tight`}>
                      {totalGames}
                    </div>
                    <div className={`${screenWidth < 480 ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400`}>
                      {t('charts.total')}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <p className="text-gray-600">{t('developer.dashboard.no_games_progress')}</p>
              </div>
            </div>
          )}
        </div>
      </ChartLoadingIndicator>
    </div>
  );
};

export default DashboardStatsChart;
