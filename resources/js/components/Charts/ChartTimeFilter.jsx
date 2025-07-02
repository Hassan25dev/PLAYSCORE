import React from 'react';
import { useTranslation } from '../../lang/translationHelper';

/**
 * Chart Time Filter Component
 * 
 * A component that provides time period filtering options for charts
 * 
 * @param {Object} props Component props
 * @param {string} props.activePeriod The currently active time period
 * @param {Function} props.onChange Callback function when period changes
 * @param {Array} props.periods Array of available periods (optional)
 * @returns {JSX.Element} Time filter component
 */
const ChartTimeFilter = ({ 
  activePeriod = '30days', 
  onChange,
  periods = ['7days', '30days', '1year', 'all']
}) => {
  const { t } = useTranslation();
  
  // Map period keys to translation keys
  const periodLabels = {
    '7days': 'charts.last_7_days',
    '30days': 'charts.last_30_days',
    '1year': 'charts.last_year',
    'all': 'common.all'
  };
  
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 mb-4 text-sm">
      <span className="text-gray-500 dark:text-gray-400 mr-1 text-xs font-medium">
        {t('charts.filter_by_period')}:
      </span>
      <div className="flex flex-wrap gap-1">
        {periods.map(period => (
          <button
            key={period}
            onClick={() => onChange(period)}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
              activePeriod === period
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t(periodLabels[period] || period)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartTimeFilter;
