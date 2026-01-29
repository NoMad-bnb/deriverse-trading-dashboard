import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTradeStore } from '../store/useTradeStore';
import { prepareChartData } from '../utils/calculations';
import { FiTrendingDown, FiAlertTriangle } from 'react-icons/fi';

/**
 * DrawdownChart Component
 * Visualizes portfolio drawdown over time - shows peak-to-trough decline
 */
const DrawdownChart = () => {
  // Get filtered trades and theme from store
  const { getFilteredTrades, isDarkMode } = useTradeStore();
  const filteredTrades = getFilteredTrades();

  // Prepare chart data with drawdown calculation
  const chartData = prepareChartData(filteredTrades);

  // Calculate drawdown data
  const drawdownData = chartData.map((point, index, array) => {
    // Find peak value up to current point
    const peak = Math.max(...array.slice(0, index + 1).map(p => p.cumulativePnL));
    
    // Calculate drawdown percentage from peak
    const drawdown = peak !== 0 ? ((point.cumulativePnL - peak) / Math.abs(peak)) * 100 : 0;
    
    return {
      date: point.date,
      drawdown: drawdown,
      cumulativePnL: point.cumulativePnL,
    };
  });

  // Find maximum drawdown
  const maxDrawdown = drawdownData.length > 0 ? Math.min(...drawdownData.map(d => d.drawdown)) : 0;

  // Determine risk level
  const getRiskLevel = (dd: number) => {
    const absDD = Math.abs(dd);
    if (absDD < 10) return { level: 'Low', color: 'green' };
    if (absDD < 20) return { level: 'Medium', color: 'yellow' };
    return { level: 'High', color: 'red' };
  };

  const riskInfo = getRiskLevel(maxDrawdown);

  // Theme colors
  const textColor = isDarkMode ? '#9CA3AF' : '#4B5563';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';

  // Custom tooltip
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
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span>Drawdown:</span>
              </span>
              <span className="ml-4 font-bold text-red-600 dark:text-red-400">
                {payload[0].value.toFixed(2)}%
              </span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span>Cumulative PnL:</span>
              </span>
              <span className={`ml-4 font-bold ${
                payload[0].payload.cumulativePnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                ${payload[0].payload.cumulativePnL.toFixed(2)}
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
          <div className="p-3 bg-red-500/10 dark:bg-red-500/20 rounded-xl">
            <FiTrendingDown className="text-red-600 dark:text-red-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Drawdown Analysis
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Monitor your risk and recovery periods
            </p>
          </div>
        </div>
        
        {/* Max Drawdown Badge */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 px-6 py-3 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1 flex items-center space-x-1">
            <FiAlertTriangle className="w-3 h-3" />
            <span>Maximum Drawdown</span>
          </p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {maxDrawdown.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold text-blue-600 dark:text-blue-400">💡 What is Drawdown?</span> 
          {' '}Drawdown shows the percentage decline from the peak cumulative PnL. Lower values indicate better risk management.
        </p>
      </div>

      {/* Chart */}
      {drawdownData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={drawdownData}>
            <defs>
              <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
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
              tickFormatter={(value) => `${value}%`}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke={gridColor} strokeDasharray="3 3" strokeWidth={2} />
            
            {/* Drawdown area */}
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#EF4444"
              strokeWidth={3}
              fill="url(#colorDrawdown)"
              name="Drawdown %"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingDown className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No trade data available for drawdown analysis
            </p>
          </div>
        </div>
      )}

      {/* Drawdown Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 p-5 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Current Drawdown</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {drawdownData.length > 0 ? drawdownData[drawdownData.length - 1].drawdown.toFixed(2) : '0.00'}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-red-900/10 p-5 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-200">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">Max Drawdown</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {maxDrawdown.toFixed(2)}%
          </p>
        </div>
        
        <div className={`bg-gradient-to-br p-5 rounded-xl border hover:shadow-lg transition-all duration-200 ${
          riskInfo.color === 'green' 
            ? 'from-green-50 to-white dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800'
            : riskInfo.color === 'yellow'
            ? 'from-yellow-50 to-white dark:from-yellow-900/20 dark:to-yellow-900/10 border-yellow-200 dark:border-yellow-800'
            : 'from-red-50 to-white dark:from-red-900/20 dark:to-red-900/10 border-red-200 dark:border-red-800'
        }`}>
          <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
            riskInfo.color === 'green'
              ? 'text-green-600 dark:text-green-400'
              : riskInfo.color === 'yellow'
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-red-600 dark:text-red-400'
          }`}>Risk Level</p>
          <p className={`text-2xl font-bold ${
            riskInfo.color === 'green'
              ? 'text-green-700 dark:text-green-300'
              : riskInfo.color === 'yellow'
              ? 'text-yellow-700 dark:text-yellow-300'
              : 'text-red-700 dark:text-red-300'
          }`}>
            {riskInfo.level}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrawdownChart;