import { useState, useMemo } from 'react';
import { FiDownload, FiEdit2, FiSave, FiX, FiFileText, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useTradeStore } from '../store/useTradeStore';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import type { Trade } from '../types';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import TradeTableRowSkeleton from './TradeTableRowSkeleton';

const TradeTable = () => {
  const { getFilteredTrades, updateTrade, isLoading, filters } = useTradeStore();
  const filteredTrades = getFilteredTrades();
  const symbol = filters.symbol;

  const tradeStats = useMemo(() => {
    const totalTrades = filteredTrades.length;
    if (totalTrades === 0) {
      return {
        winRate: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
      };
    }

    const winningTrades = filteredTrades.filter(trade => trade.pnl >= 0).length;
    const losingTrades = totalTrades - winningTrades;
    const winRate = (winningTrades / totalTrades) * 100;

    return {
      winRate,
      totalTrades,
      winningTrades,
      losingTrades,
    };
  }, [filteredTrades]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const handleEditClick = (trade: Trade) => {
    setEditingId(trade.id);
    setEditNotes(trade.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    updateTrade(id, { notes: editNotes });
    setEditingId(null);
    setEditNotes('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNotes('');
  };

  const handleExportCSV = () => {
    const csvData = filteredTrades.map(trade => ({
      ID: trade.id,
      Symbol: trade.symbol,
      Direction: trade.direction,
      'Order Type': trade.orderType,
      'Entry Price': trade.entryPrice,
      'Exit Price': trade.exitPrice || 'Open',
      Quantity: trade.quantity,
      Leverage: trade.leverage,
      'Entry Time': trade.entryTime.toLocaleString(),
      'Exit Time': trade.exitTime?.toLocaleString() || 'Open',
      'PnL ($)': trade.pnl.toFixed(2),
      'PnL (%)': trade.pnlPercentage.toFixed(2),
      'Fees ($)': trade.fees.toFixed(2),
      Status: trade.status,
      Notes: trade.notes || '',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `deriverse-trades-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportExcel = () => {
    const excelData = filteredTrades.map(trade => ({
      ID: trade.id,
      Symbol: trade.symbol,
      Direction: trade.direction,
      'Order Type': trade.orderType,
      'Entry Price': trade.entryPrice,
      'Exit Price': trade.exitPrice || 'Open',
      Quantity: trade.quantity,
      Leverage: trade.leverage,
      'Entry Time': trade.entryTime.toLocaleString(),
      'Exit Time': trade.exitTime?.toLocaleString() || 'Open',
      'PnL ($)': trade.pnl.toFixed(2),
      'PnL (%)': trade.pnlPercentage.toFixed(2),
      'Fees ($)': trade.fees.toFixed(2),
      Status: trade.status,
      Notes: trade.notes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trades');
    XLSX.writeFile(wb, `deriverse-trades-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl">
            <FiFileText className="text-purple-600 dark:text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Trade History: <span className="text-purple-500">{symbol === 'all' ? 'All Pairs' : symbol}</span>
            </h2>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center flex-wrap gap-x-4 gap-y-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Trades: <span className="font-bold text-gray-900 dark:text-white">{tradeStats.totalTrades}</span>
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                Wins: <span className="font-bold">{tradeStats.winningTrades}</span>
              </span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                Losses: <span className="font-bold">{tradeStats.losingTrades}</span>
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Win Rate: <span className="font-bold">{tradeStats.winRate.toFixed(2)}%</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 self-end sm:self-center">
          <button
            onClick={handleExportCSV}
            className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiDownload className="w-4 h-4 group-hover:animate-bounce" />
            <span className="font-semibold text-sm">CSV</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiDownload className="w-4 h-4 group-hover:animate-bounce" />
            <span className="font-semibold text-sm">Excel</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-left py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Direction</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Entry</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Exit</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Leverage</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">PnL</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">PnL %</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Fees</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[250px]">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TradeTableRowSkeleton key={index} />
                ))
              ) : filteredTrades.length > 0 ? (
                filteredTrades.map((trade, index) => (
                  <tr
                    key={trade.id}
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/50' : ''
                    }`}
                  >
                    <td className="sticky left-0 bg-white dark:bg-gray-800 py-4 px-6 text-sm font-bold text-gray-900 dark:text-white">
                      {trade.symbol}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm ${
                        trade.direction === 'long'
                          ? 'bg-green-500/20 text-green-700 dark:text-green-400 shadow-md shadow-green-500/20'
                          : 'bg-red-500/20 text-red-700 dark:text-red-400 shadow-md shadow-red-500/20'
                      }`}>
                        {trade.direction === 'long' ? (
                          <FiTrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <FiTrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span>{trade.direction.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 font-medium capitalize">
                      {trade.orderType}
                    </td>
                    <td className="py-4 px-6 text-sm text-right font-semibold text-gray-900 dark:text-white">
                      ${trade.entryPrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-right font-semibold text-gray-900 dark:text-white">
                      {trade.exitPrice ? `$${trade.exitPrice.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-4 px-6 text-sm text-right text-gray-700 dark:text-gray-300 font-medium">
                      {trade.quantity.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-right text-gray-700 dark:text-gray-300 font-medium">
                      {trade.leverage}x
                    </td>
                    <td className={`py-4 px-6 text-sm text-right font-bold ${
                      trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(trade.pnl)}
                    </td>
                    <td className={`py-4 px-6 text-sm text-right font-bold ${
                      trade.pnlPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatPercentage(trade.pnlPercentage)}
                    </td>
                    <td className="py-4 px-6 text-sm text-right text-red-600 dark:text-red-400 font-semibold">
                      {formatCurrency(trade.fees)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${
                        trade.status === 'open'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {trade.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm min-w-[250px]">
                      {editingId === trade.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add notes..."
                          />
                          <button
                            onClick={() => handleSaveNotes(trade.id)}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          >
                            <FiSave className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 dark:text-gray-400 flex-1 truncate">
                            {trade.notes || 'No notes'}
                          </span>
                          <button
                            onClick={() => handleEditClick(trade)}
                            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <FiFileText className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500" />
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No Trades Found</h3>
                      <p className="mt-2">
                        There are no trades matching your current filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeTable;