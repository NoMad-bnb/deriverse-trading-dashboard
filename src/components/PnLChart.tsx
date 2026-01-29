import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { useTradeStore } from '../store/useTradeStore';
import { prepareChartData } from '../utils/calculations';
import { FiTrendingUp } from 'react-icons/fi';

/**
 * PnLChart Component
 * Displays historical PnL and cumulative PnL over time
 */
const PnLChart = () => {
  // Get filtered trades and theme from store
  const { getFilteredTrades, isDarkMode } = useTradeStore();
  const filteredTrades = getFilteredTrades();

  // Prepare chart data
  const chartData = prepareChartData(filteredTrades);

  // Theme colors
  const textColor = isDarkMode ? '#9CA3AF' : '#4B5563';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            {payload[0].payload.date}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span>Trade PnL:</span>
              </span>
              <span className={`ml-4 font-bold ${
                payload[0].value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                ${payload[0].value.toFixed(2)}
              </span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>Cumulative:</span>
              </span>
              <span className={`ml-4 font-bold ${
                payload[1].value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                ${payload[1].value.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
            <FiTrendingUp className="text-blue-600 dark:text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              PnL Performance Chart
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Track your trading performance over time
            </p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trade PnL</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cumulative PnL</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
              stroke={textColor}
              style={{ fontSize: '13px', fontWeight: '500' }}
              tickMargin={10}
            />
            <YAxis
              stroke={textColor}
              style={{ fontSize: '13px', fontWeight: '500' }}
              tickFormatter={(value) => `$${value}`}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Individual trade PnL as area */}
            <Area
              type="monotone"
              dataKey="pnl"
              fill="url(#colorPnl)"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Trade PnL"
              animationDuration={1000}
            />
            
            {/* Cumulative PnL line */}
            <Line
              type="monotone"
              dataKey="cumulativePnL"
              stroke="url(#lineGradient)"
              strokeWidth={4}
              dot={{ fill: '#10B981', r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 3 }}
              name="Cumulative PnL"
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No trade data available for the selected filters
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PnLChart;