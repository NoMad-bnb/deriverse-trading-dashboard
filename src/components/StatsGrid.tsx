import StatsCard from './StatsCard';
import StatsCardSkeleton from './StatsCardSkeleton';
import { useTradeStore } from '../store/useTradeStore';
import { calculateStats, formatCurrency, formatPercentage, formatDuration } from '../utils/calculations';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiActivity, 
  FiTarget,
  FiPieChart,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiBarChart2
} from 'react-icons/fi';

const StatsGrid = () => {
  const { getFilteredTrades, isLoading } = useTradeStore();
  const filteredTrades = getFilteredTrades();

  const stats = calculateStats(filteredTrades);

  const tradesWithDuration = filteredTrades.filter(
    (trade) => trade.exitTime && trade.entryTime
  );
  const totalDuration = tradesWithDuration.reduce((acc, trade) => {
      const duration = new Date(trade.exitTime!).getTime() - new Date(trade.entryTime).getTime();
      return acc + duration;
    }, 0);
  const averageDuration =
    tradesWithDuration.length > 0 ? totalDuration / tradesWithDuration.length : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (filteredTrades.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <FiBarChart2 className="mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No Trading Data</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          There are no trades matching your current filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatsCard
        title="Total PnL"
        value={formatCurrency(stats.totalPnL)}
        icon={<FiDollarSign />}
        colorClass={stats.totalPnL >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'}
        subtitle={stats.totalPnL >= 0 ? 'Profitable' : 'In Loss'}
      />

      <StatsCard
        title="Win Rate"
        value={formatPercentage(stats.winRate)}
        icon={<FiTarget />}
        colorClass="from-blue-500 to-indigo-600"
        subtitle={`${stats.winningTrades}W / ${stats.losingTrades}L`}
      />

      <StatsCard
        title="Total Volume"
        value={formatCurrency(stats.totalVolume)}
        icon={<FiBarChart2 />}
        colorClass="from-purple-500 to-pink-600"
        subtitle={`${stats.totalTrades} trades`}
      />

      <StatsCard
        title="Total Fees"
        value={formatCurrency(stats.totalFees)}
        icon={<FiActivity />}
        colorClass="from-orange-500 to-red-600"
        subtitle="Trading costs"
      />

      <StatsCard
        title="Average Win"
        value={formatCurrency(stats.averageWin)}
        icon={<FiArrowUp />}
        colorClass="from-green-500 to-teal-600"
        subtitle={`${stats.winningTrades} winning trades`}
      />

      <StatsCard
        title="Average Loss"
        value={formatCurrency(stats.averageLoss)}
        icon={<FiArrowDown />}
        colorClass="from-red-500 to-pink-600"
        subtitle={`${stats.losingTrades} losing trades`}
      />

      <StatsCard
        title="Largest Win"
        value={formatCurrency(stats.largestWin)}
        icon={<FiTrendingUp />}
        colorClass="from-emerald-500 to-green-600"
        subtitle="Best single trade"
      />

      <StatsCard
        title="Largest Loss"
        value={formatCurrency(stats.largestLoss)}
        icon={<FiTrendingUp className="rotate-180" />}
        colorClass="from-rose-500 to-red-600"
        subtitle="Worst single trade"
      />

      <StatsCard
        title="Long/Short Ratio"
        value={stats.longShortRatio.toFixed(2)}
        icon={<FiPieChart />}
        colorClass="from-cyan-500 to-blue-600"
        subtitle={`${stats.longTrades}L / ${stats.shortTrades}S`}
      />

      <StatsCard
        title="Avg Trade Duration"
        value={formatDuration(averageDuration)}
        icon={<FiClock />}
        colorClass="from-violet-500 to-purple-600"
        subtitle="Per trade"
      />
    </div>
  );
};

export default StatsGrid;