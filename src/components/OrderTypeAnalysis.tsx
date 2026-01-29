import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTradeStore } from '../store/useTradeStore';
import { FiTarget, FiZap, FiLayers, FiPauseCircle, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import type { Trade, OrderType } from '../types';

const OrderTypeAnalysis = () => {
  const { getFilteredTrades, isDarkMode } = useTradeStore();
  const filteredTrades = getFilteredTrades();

  const orderTypeStats = useMemo(() => {
    const stats: {
      [key in OrderType]: {
        totalTrades: number;
        winningTrades: number;
        losingTrades: number;
        totalPnL: number;
        totalFees: number;
        avgPnL: number;
        winRate: number;
      };
    } = {
      market: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        totalPnL: 0,
        totalFees: 0,
        avgPnL: 0,
        winRate: 0,
      },
      limit: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        totalPnL: 0,
        totalFees: 0,
        avgPnL: 0,
        winRate: 0,
      },
      stop: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        totalPnL: 0,
        totalFees: 0,
        avgPnL: 0,
        winRate: 0,
      },
    };

    filteredTrades
      .filter((t: Trade) => t.status === 'closed')
      .forEach((trade: Trade) => {
        const orderType = trade.orderType;
        stats[orderType].totalTrades += 1;
        stats[orderType].totalPnL += trade.pnl;
        stats[orderType].totalFees += trade.fees;

        if (trade.pnl > 0) {
          stats[orderType].winningTrades += 1;
        } else if (trade.pnl < 0) {
          stats[orderType].losingTrades += 1;
        }
      });

    Object.keys(stats).forEach((key) => {
      const orderType = key as OrderType;
      if (stats[orderType].totalTrades > 0) {
        stats[orderType].avgPnL = stats[orderType].totalPnL / stats[orderType].totalTrades;
        stats[orderType].winRate =
          (stats[orderType].winningTrades / stats[orderType].totalTrades) * 100;
      }
    });

    return stats;
  }, [filteredTrades]);

  const chartData = useMemo(() => {
    return Object.entries(orderTypeStats).map(([type, stats]) => ({
      orderType: type.charAt(0).toUpperCase() + type.slice(1),
      avgPnL: stats.avgPnL,
      winRate: stats.winRate,
      totalTrades: stats.totalTrades,
      totalPnL: stats.totalPnL,
    }));
  }, [orderTypeStats]);

  const textColor = isDarkMode ? '#9CA3AF' : '#4B5563';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';

  const getOrderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'market':
        return <FiZap className="w-6 h-6" />;
      case 'limit':
        return <FiLayers className="w-6 h-6" />;
      case 'stop':
        return <FiPauseCircle className="w-6 h-6" />;
      default:
        return <FiTarget className="w-6 h-6" />;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            {payload[0].payload.orderType} Orders
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Avg PnL:</span>
              <span
                className={`ml-4 font-bold ${
                  payload[0].value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                ${payload[0].value.toFixed(2)}
              </span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Win Rate:</span>
              <span className="ml-4 font-bold text-blue-600 dark:text-blue-400">
                {payload[0].payload.winRate.toFixed(2)}%
              </span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Total Trades:</span>
              <span className="ml-4 font-bold text-gray-900 dark:text-white">
                {payload[0].payload.totalTrades}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
            <FiTarget className="text-blue-600 dark:text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Performance by Order Type
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Compare average PnL and win rate across different order types
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Order Types:</span>
            {' '}Market orders execute instantly, Limit orders at specific prices, and Stop orders trigger at set levels.
          </p>
        </div>

        {chartData.some((d) => d.totalTrades > 0) ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} />
              <XAxis 
                dataKey="orderType" 
                stroke={textColor} 
                style={{ fontSize: '14px', fontWeight: '600' }}
                tickMargin={10}
              />
              <YAxis 
                stroke={textColor} 
                style={{ fontSize: '13px', fontWeight: '500' }} 
                tickFormatter={(value) => `$${value}`}
                tickMargin={10}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'transparent' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar dataKey="avgPnL" radius={[12, 12, 0, 0]} animationDuration={1200}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.avgPnL >= 0 ? '#10B981' : '#EF4444'}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTarget className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No closed trades available for order type analysis
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(orderTypeStats).map(([type, stats]) => {
          const colors = {
            market: { bg: 'blue', icon: 'blue' },
            limit: { bg: 'green', icon: 'green' },
            stop: { bg: 'orange', icon: 'orange' },
          };
          const color = colors[type as OrderType];
          
          return (
            <div
              key={type}
              className={`group bg-gradient-to-br ${
                color.bg === 'blue'
                  ? 'from-blue-50 to-white dark:from-blue-900/20 dark:to-blue-900/10'
                  : color.bg === 'green'
                  ? 'from-green-50 to-white dark:from-green-900/20 dark:to-green-900/10'
                  : 'from-orange-50 to-white dark:from-orange-900/20 dark:to-orange-900/10'
              } rounded-2xl p-6 border-2 ${
                color.bg === 'blue'
                  ? 'border-blue-200 dark:border-blue-800'
                  : color.bg === 'green'
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-orange-200 dark:border-orange-800'
              } hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-xl ${
                  color.icon === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/50'
                    : color.icon === 'green'
                    ? 'bg-green-100 dark:bg-green-900/50'
                    : 'bg-orange-100 dark:bg-orange-900/50'
                }`}>
                  <div className={`${
                    color.icon === 'blue'
                      ? 'text-blue-600 dark:text-blue-400'
                      : color.icon === 'green'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {getOrderIcon(type)}
                  </div>
                </div>
                <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm ${
                  stats.avgPnL >= 0
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 shadow-lg shadow-green-500/20'
                    : 'bg-red-500/20 text-red-600 dark:text-red-400 shadow-lg shadow-red-500/20'
                }`}>
                  {stats.avgPnL >= 0 ? (
                    <FiTrendingUp className="w-4 h-4 animate-pulse" />
                  ) : (
                    <FiTrendingDown className="w-4 h-4 animate-pulse" />
                  )}
                  <span>{stats.avgPnL >= 0 ? 'Profitable' : 'Loss'}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 capitalize">
                {type} Orders
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trades</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.totalTrades}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {stats.winRate.toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">W/L</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.winningTrades}/{stats.losingTrades}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg PnL</span>
                  <span
                    className={`text-lg font-bold ${
                      stats.avgPnL >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    ${stats.avgPnL.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Total PnL</span>
                  <span
                    className={`text-2xl font-bold ${
                      stats.totalPnL >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    ${stats.totalPnL.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total Fees</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    ${stats.totalFees.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTypeAnalysis;