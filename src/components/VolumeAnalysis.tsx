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
import { FiBarChart2 } from 'react-icons/fi';
import type { Trade } from '../types';

/**
 * VolumeAnalysis Component
 * Analyzes and displays trading volume metrics.
 */
const VolumeAnalysis = () => {
  const { getFilteredTrades, isDarkMode } = useTradeStore();
  const filteredTrades = getFilteredTrades();

  // Calculate total volume and volume by symbol
  const { totalVolume, volumeBySymbol } = useMemo(() => {
    const volumeData: { [key: string]: number } = {};
    let currentTotalVolume = 0;

    filteredTrades.forEach((trade: Trade) => {
      const tradeVolume = trade.quantity * trade.entryPrice;
      currentTotalVolume += tradeVolume;

      if (!volumeData[trade.symbol]) {
        volumeData[trade.symbol] = 0;
      }
      volumeData[trade.symbol] += tradeVolume;
    });

    const symbolData = Object.entries(volumeData)
      .map(([symbol, volume]) => ({
        symbol,
        volume,
      }))
      .sort((a, b) => b.volume - a.volume);

    return { totalVolume: currentTotalVolume, volumeBySymbol: symbolData };
  }, [filteredTrades]);

  // Theme colors
  const textColor = isDarkMode ? '#9CA3AF' : '#4B5563';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const barColor = '#8884d8'; // A neutral purple color for volume

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.symbol}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Volume: <span className="ml-2 font-bold text-purple-600 dark:text-purple-400">${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl">
            <FiBarChart2 className="text-purple-600 dark:text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Volume Analysis
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Total and per-symbol trading volume
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 px-6 py-3 rounded-xl border border-purple-200 dark:border-purple-800">
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Total Trading Volume</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {volumeBySymbol.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={volumeBySymbol}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="symbol" 
              stroke={textColor} 
              style={{ fontSize: '13px', fontWeight: '600' }} 
            />
            <YAxis 
              stroke={textColor} 
              style={{ fontSize: '12px' }} 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              content={<BarTooltip />} 
              cursor={{ fill: 'transparent' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
              {volumeBySymbol.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={barColor}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">No volume data available for the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default VolumeAnalysis;