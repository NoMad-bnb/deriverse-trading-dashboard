// Trading data types for Deriverse platform

// Trade direction
export type TradeDirection = 'long' | 'short';

// Trade status
export type TradeStatus = 'open' | 'closed';

// Order types
export type OrderType = 'market' | 'limit' | 'stop';

// Trading pair symbols
export type TradingSymbol = 'SOL/USDT' | 'BTC/USDT' | 'ETH/USDT' | 'BONK/USDT' | 'RAY/USDT';

// Single trade interface
export interface Trade {
  id: string;
  symbol: TradingSymbol;
  direction: TradeDirection;
  orderType: OrderType;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  leverage: number;
  entryTime: Date;
  exitTime: Date | null;
  pnl: number;
  pnlPercentage: number;
  fees: number;
  status: TradeStatus;
  notes?: string;
}

// Statistics interface
export interface TradingStats {
  totalPnL: number;
  totalVolume: number;
  totalFees: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  averageTradeDuration: number;
  longTrades: number;
  shortTrades: number;
  longShortRatio: number;
}

// Filter options
export interface FilterOptions {
  symbol: TradingSymbol | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

// Chart data point
export interface ChartDataPoint {
  date: string;
  pnl: number;
  cumulativePnL: number;
}