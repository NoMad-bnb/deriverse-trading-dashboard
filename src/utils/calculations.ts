import type { Trade, TradingStats, ChartDataPoint } from '../types';

/**
 * Calculate comprehensive trading statistics from an array of trades
 * @param trades - Array of all trades
 * @returns Complete statistics object
 */
export const calculateStats = (trades: Trade[]): TradingStats => {
  // Filter only closed trades for accurate statistics
  const closedTrades = trades.filter(t => t.status === 'closed');
  
  if (closedTrades.length === 0) {
    // Return default empty stats if no closed trades
    return {
      totalPnL: 0,
      totalVolume: 0,
      totalFees: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      averageTradeDuration: 0,
      longTrades: 0,
      shortTrades: 0,
      longShortRatio: 0,
    };
  }

  // Calculate total PnL (Profit and Loss)
  const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  
  // Calculate total trading volume
  const totalVolume = closedTrades.reduce((sum, trade) => {
    const entryValue = trade.entryPrice * trade.quantity;
    return sum + entryValue;
  }, 0);
  
  // Calculate total fees paid
  const totalFees = closedTrades.reduce((sum, trade) => sum + trade.fees, 0);
  
  // Separate winning and losing trades
  const winningTrades = closedTrades.filter(t => t.pnl > 0);
  const losingTrades = closedTrades.filter(t => t.pnl < 0);
  
  // Calculate win rate percentage
  const winRate = (winningTrades.length / closedTrades.length) * 100;
  
  // Calculate average win amount
  const averageWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length
    : 0;
  
  // Calculate average loss amount
  const averageLoss = losingTrades.length > 0
    ? losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length
    : 0;
  
  // Find largest win
  const largestWin = winningTrades.length > 0
    ? Math.max(...winningTrades.map(t => t.pnl))
    : 0;
  
  // Find largest loss
  const largestLoss = losingTrades.length > 0
    ? Math.min(...losingTrades.map(t => t.pnl))
    : 0;
  
  // Calculate average trade duration in hours
  const totalDuration = closedTrades.reduce((sum, trade) => {
    if (trade.exitTime) {
      const duration = trade.exitTime.getTime() - trade.entryTime.getTime();
      return sum + duration;
    }
    return sum;
  }, 0);
  const averageTradeDuration = totalDuration / closedTrades.length / (1000 * 60 * 60); // Convert to hours
  
  // Count long and short trades
  const longTrades = closedTrades.filter(t => t.direction === 'long').length;
  const shortTrades = closedTrades.filter(t => t.direction === 'short').length;
  
  // Calculate long/short ratio
  const longShortRatio = shortTrades > 0 ? longTrades / shortTrades : longTrades;

  return {
    totalPnL,
    totalVolume,
    totalFees,
    totalTrades: closedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    averageWin,
    averageLoss,
    largestWin,
    largestLoss,
    averageTradeDuration,
    longTrades,
    shortTrades,
    longShortRatio,
  };
};

/**
 * Formats a duration in milliseconds into a human-readable string.
 * @param milliseconds - The duration in milliseconds.
 * @returns A string in the format "Xh Ym Zs", or "N/A" for invalid input.
 */
export const formatDuration = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) {
    return 'N/A';
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(' ');
};

/**
 * Prepare chart data for PnL visualization
 * @param trades - Array of trades
 * @returns Array of chart data points with cumulative PnL
 */
export const prepareChartData = (trades: Trade[]): ChartDataPoint[] => {
  // Sort trades by exit time (oldest first)
  const sortedTrades = [...trades]
    .filter(t => t.status === 'closed' && t.exitTime)
    .sort((a, b) => {
      const dateA = a.exitTime?.getTime() || 0;
      const dateB = b.exitTime?.getTime() || 0;
      return dateA - dateB;
    });

  let cumulativePnL = 0;
  
  // Build chart data with cumulative PnL
  return sortedTrades.map(trade => {
    cumulativePnL += trade.pnl;
    return {
      date: trade.exitTime?.toLocaleDateString() || '',
      pnl: trade.pnl,
      cumulativePnL: cumulativePnL,
    };
  });
};

/**
 * Format currency values with proper symbols
 * @param value - Numeric value to format
 * @returns Formatted string with $ symbol
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage values
 * @param value - Numeric value to format
 * @returns Formatted string with % symbol
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Calculate maximum drawdown from trades
 * @param trades - Array of trades
 * @returns Maximum drawdown percentage
 */
export const calculateMaxDrawdown = (trades: Trade[]): number => {
  const chartData = prepareChartData(trades);
  
  if (chartData.length === 0) return 0;
  
  let maxDrawdown = 0;
  let peak = chartData[0].cumulativePnL;
  
  chartData.forEach(point => {
    // Update peak if current cumulative PnL is higher
    if (point.cumulativePnL > peak) {
      peak = point.cumulativePnL;
    }
    
    // Calculate drawdown from peak
    const drawdown = ((peak - point.cumulativePnL) / Math.abs(peak)) * 100;
    
    // Update max drawdown if current is larger
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  return maxDrawdown;
};