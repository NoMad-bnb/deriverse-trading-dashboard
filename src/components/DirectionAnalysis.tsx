import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTradeStore } from '../store/useTradeStore';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';

/**
 * DirectionAnalysis Component
 * Analyzes and displays performance metrics for long vs. short trades.
 */
const DirectionAnalysis = () => {
  const { getFilteredTrades } = useTradeStore();
  const filteredTrades = getFilteredTrades();

  // Calculate statistics for long and short trades
  const directionStats = useMemo(() => {
    const stats = {
      long: { count: 0, pnl: 0, wins: 0 },
      short: { count: 0, pnl: 0, wins: 0 },
    };

    filteredTrades.forEach((trade) => {
      // Ensure the trade is closed and exitPrice is a number before calculating PnL
      if (typeof trade.exitPrice === 'number') {
        const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.direction === 'long' ? 1 : -1);

        if (trade.direction === 'long') {
          stats.long.count++;
          stats.long.pnl += pnl;
          if (pnl > 0) stats.long.wins++;
        } else { // 'short'
          stats.short.count++;
          stats.short.pnl += pnl;
          if (pnl > 0) stats.short.wins++;
        }
      }
    });

    return stats;
  }, [filteredTrades]);

  const longWinRate = directionStats.long.count > 0 ? (directionStats.long.wins / directionStats.long.count) * 100 : 0;
  const shortWinRate = directionStats.short.count > 0 ? (directionStats.short.wins / directionStats.short.count) * 100 : 0;

  const chartData = [
    { name: 'Long Trades', value: directionStats.long.count },
    { name: 'Short Trades', value: directionStats.short.count },
  ].filter(item => item.value > 0); // Filter out empty data

  const COLORS = ['#22C55E', '#EF4444']; // Green for long, Red for short

  // Custom tooltip for the pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {`${payload[0].name}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Directional Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          {chartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Long vs. Short Trade Count</p>
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-xl w-full">
              <p className="text-gray-500 dark:text-gray-400">No trade data</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Long Stats */}
          <div className="bg-gray-100/50 dark:bg-gray-700/30 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <FiArrowUpRight className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Long Trades</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{directionStats.long.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                <span className={`font-semibold ${longWinRate >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {longWinRate.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Net PnL:</span>
                <span className={`font-semibold ${directionStats.long.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${directionStats.long.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Short Stats */}
          <div className="bg-gray-100/50 dark:bg-gray-700/30 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <FiArrowDownLeft className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Short Trades</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{directionStats.short.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                <span className={`font-semibold ${shortWinRate >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {shortWinRate.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Net PnL:</span>
                <span className={`font-semibold ${directionStats.short.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${directionStats.short.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectionAnalysis;