import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useTradeStore } from '../store/useTradeStore';
import { FiDollarSign, FiPieChart } from 'react-icons/fi';
import type { Trade } from '../types';

/**
 * FeeBreakdown Component
 * Analyzes trading fees by type, symbol, and cumulative over time
 */
const FeeBreakdown = () => {
  const { getFilteredTrades, isDarkMode } = useTradeStore();
  const filteredTrades = getFilteredTrades();

  // Calculate fees by order type
  const feesByOrderType = useMemo(() => {
    const feeData: { [key: string]: number } = {
      market: 0,
      limit: 0,
      stop: 0,
    };

    filteredTrades.forEach((trade: Trade) => {
      feeData[trade.orderType] += trade.fees;
    });

    return Object.entries(feeData).map(([type, fees]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: fees,
      percentage: (fees / Object.values(feeData).reduce((a, b) => a + b, 0)) * 100,
    }));
  }, [filteredTrades]);

  // Calculate fees by symbol
  const feesBySymbol = useMemo(() => {
    const feeData: { [key: string]: number } = {};

    filteredTrades.forEach((trade: Trade) => {
      if (!feeData[trade.symbol]) {
        feeData[trade.symbol] = 0;
      }
      feeData[trade.symbol] += trade.fees;
    });

    return Object.entries(feeData)
      .map(([symbol, fees]) => ({
        symbol,
        fees,
      }))
      .sort((a, b) => b.fees - a.fees);
  }, [filteredTrades]);

  // Total fees
  const totalFees = filteredTrades.reduce((sum: number, trade: Trade) => sum + trade.fees, 0);

  // Colors for pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Theme colors
  const textColor = isDarkMode ? '#9CA3AF' : '#4B5563';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            Fees: <span className="ml-2 font-bold text-red-600 dark:text-red-400">${payload[0].value.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Percentage: <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">{payload[0].payload.percentage.toFixed(2)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.symbol}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Total Fees: <span className="ml-2 font-bold text-red-600 dark:text-red-400">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Total Fees Summary */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/10 dark:bg-red-500/20 rounded-xl">
              <FiDollarSign className="text-red-600 dark:text-red-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Fee Analysis
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Comprehensive fee breakdown
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 px-6 py-3 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Total Fees Paid</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              ${totalFees.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fees by Order Type - Pie Chart */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Fees by Order Type</span>
            </h3>
            {feesByOrderType.length > 0 && feesByOrderType.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={feesByOrderType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    stroke={isDarkMode ? '#1F2937' : '#FFFFFF'}
                    strokeWidth={2}
                  >
                    {feesByOrderType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">No fee data available</p>
              </div>
            )}
          </div>

          {/* Fee Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Fee Statistics</span>
            </h3>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 p-5 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Average Fee per Trade</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${filteredTrades.length > 0 ? (totalFees / filteredTrades.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-red-900/10 p-5 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow duration-200">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Highest Single Fee</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                ${filteredTrades.length > 0 ? Math.max(...filteredTrades.map((t: Trade) => t.fees)).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-green-900/10 p-5 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow duration-200">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Lowest Single Fee</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                ${filteredTrades.length > 0 ? Math.min(...filteredTrades.map((t: Trade) => t.fees)).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fees by Symbol */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl">
            <FiPieChart className="text-orange-600 dark:text-orange-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Fees by Trading Pair
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Fee distribution across symbols
            </p>
          </div>
        </div>
        
        {feesBySymbol.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={feesBySymbol}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="symbol" 
                stroke={textColor} 
                style={{ fontSize: '13px', fontWeight: '600' }} 
              />
              <YAxis 
                stroke={textColor} 
                style={{ fontSize: '12px' }} 
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip 
                content={<BarTooltip />} 
                cursor={{ fill: 'transparent' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar dataKey="fees" radius={[8, 8, 0, 0]} label={false}>
                {feesBySymbol.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill="#EF4444"
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">No fee data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeBreakdown;