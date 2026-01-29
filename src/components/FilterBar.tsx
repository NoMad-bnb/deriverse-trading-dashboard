import { useState } from 'react';
import { FiFilter, FiX, FiCalendar } from 'react-icons/fi';
import { useTradeStore } from '../store/useTradeStore';
import type { TradingSymbol } from '../types';
import DateRangeModal from './DateRangeModal';
import SymbolSelect from './SymbolSelect';

// Import styles for the modal's datepicker
import '../styles/datepicker.css';

/**
 * FilterBar Component
 * Provides filtering options for symbol and date range with an advanced, user-friendly design.
 */
const FilterBar = () => {
  const { filters, setSymbolFilter, setDateRangeFilter, resetFilters } = useTradeStore();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Available trading symbols
  const symbols: (TradingSymbol | 'all')[] = [
    'all',
    'SOL/USDT',
    'BTC/USDT',
    'ETH/USDT',
    'BONK/USDT',
    'RAY/USDT'
  ];

  const handleApplyDateRange = (startDate: Date | null, endDate: Date | null) => {
    setDateRangeFilter(startDate, endDate);
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.symbol !== 'all' || 
    filters.dateRange.start !== null || 
    filters.dateRange.end !== null;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
            <FiFilter className="text-blue-600 dark:text-blue-400 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Filters
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Customize your data view
            </p>
          </div>
        </div>

        {/* Reset filters button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="group flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Symbol Filter */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Trading Pair</span>
          </label>
          <div className="relative">
            <SymbolSelect
              symbols={symbols}
              selectedSymbol={filters.symbol}
              onSelectSymbol={(symbol) => setSymbolFilter(symbol)}
            />
          </div>
        </div>

        {/* Date Range Button */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Date Range</span>
          </label>
          <button
            onClick={() => setIsDateModalOpen(true)}
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 hover:border-green-400 dark:hover:border-green-500 text-left relative"
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FiCalendar className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-gray-900 dark:text-white">
              {filters.dateRange.start && filters.dateRange.end
                ? `${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`
                : 'Select date range'}
            </span>
          </button>
        </div>
      </div>

      <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={handleApplyDateRange}
        initialStartDate={filters.dateRange.start}
        initialEndDate={filters.dateRange.end}
      />

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-3">
            {filters.symbol !== 'all' && (
              <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                {/* The SymbolSelect component will render the icon */}
                <span className="ml-2">{filters.symbol}</span>
              </span>
            )}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="inline-flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
                <FiCalendar className="w-4 h-4 mr-2" />
                {filters.dateRange.start?.toLocaleDateString() ?? '...'}
                <span className="mx-1.5">→</span>
                {filters.dateRange.end?.toLocaleDateString() ?? '...'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;