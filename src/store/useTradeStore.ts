import { create } from 'zustand';
import type { Trade, FilterOptions, TradingSymbol } from '../types';
import { mockTrades } from '../data/mockTrades';

/**
 * Trade Store Interface
 * Manages the application state for trades, filters, and theme
 */
interface TradeStore {
  // State
  trades: Trade[];
  filters: FilterOptions;
  isDarkMode: boolean;
  isLoading: boolean;
  
  // Actions
  setTrades: (trades: Trade[]) => void;
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  setSymbolFilter: (symbol: TradingSymbol | 'all') => void;
  setDateRangeFilter: (start: Date | null, end: Date | null) => void;
  resetFilters: () => void;
  toggleTheme: () => void;
  
  // Computed values
  getFilteredTrades: () => Trade[];
}

/**
 * Zustand store for managing trading data and application state
 */
export const useTradeStore = create<TradeStore>((set, get) => ({
  // Initial state with mock trades
  trades: mockTrades,
  
  // Default filters (show all)
  filters: {
    symbol: 'all',
    dateRange: {
      start: null,
      end: null,
    },
  },
  
  // Default theme (dark mode)
  isDarkMode: true,
  
  // Loading state
  isLoading: false,
  
  // Set all trades (useful for loading from API)
  setTrades: (trades) => set({ trades }),
  
  // Add a new trade
  addTrade: (trade) => set((state) => ({
    trades: [...state.trades, trade],
  })),
  
  // Update existing trade
  updateTrade: (id, updates) => set((state) => ({
    trades: state.trades.map(trade =>
      trade.id === id ? { ...trade, ...updates } : trade
    ),
  })),
  
  // Delete a trade
  deleteTrade: (id) => set((state) => ({
    trades: state.trades.filter(trade => trade.id !== id),
  })),
  
  // Set symbol filter
  setSymbolFilter: (symbol) => {
    set({ isLoading: true });
    setTimeout(() => {
      set((state) => ({
        filters: {
          ...state.filters,
          symbol,
        },
        isLoading: false,
      }));
    }, 300);
  },
  
  // Set date range filter
  setDateRangeFilter: (start, end) => {
    set({ isLoading: true });
    setTimeout(() => {
      set((state) => ({
        filters: {
          ...state.filters,
          dateRange: { start, end },
        },
        isLoading: false,
      }));
    }, 300);
  },
  
  // Reset all filters to default
  resetFilters: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({
        filters: {
          symbol: 'all',
          dateRange: {
            start: null,
            end: null,
          },
        },
        isLoading: false,
      });
    }, 300);
  },
  
  // Toggle between dark and light mode
  toggleTheme: () => set((state) => ({
    isDarkMode: !state.isDarkMode,
  })),
  
  // Get filtered trades based on current filters
  getFilteredTrades: () => {
    const { trades, filters } = get();
    
    return trades.filter(trade => {
      // Filter by symbol
      const symbolMatch = filters.symbol === 'all' || trade.symbol === filters.symbol;
      
      // Filter by date range
      let dateMatch = true;
      if (filters.dateRange.start || filters.dateRange.end) {
        const tradeDate = trade.exitTime || trade.entryTime;
        
        if (filters.dateRange.start && tradeDate < filters.dateRange.start) {
          dateMatch = false;
        }
        
        if (filters.dateRange.end && tradeDate > filters.dateRange.end) {
          dateMatch = false;
        }
      }
      
      return symbolMatch && dateMatch;
    });
  },
}));