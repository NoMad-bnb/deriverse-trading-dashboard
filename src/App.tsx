import { useEffect, useState } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import StatsGrid from './components/StatsGrid';
import PnLChart from './components/PnLChart';
import DrawdownChart from './components/DrawdownChart';
import TimeAnalysis from './components/TimeAnalysis';
import FeeBreakdown from './components/FeeBreakdown';
import VolumeAnalysis from './components/VolumeAnalysis';
import DirectionAnalysis from './components/DirectionAnalysis';
import OrderTypeAnalysis from './components/OrderTypeAnalysis';
import TradeTable from './components/TradeTable';
import { useTradeStore } from './store/useTradeStore';

function App() {
  const { isDarkMode } = useTradeStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'fees'>('overview');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <FilterBar />

          <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`relative flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="relative z-10">Overview</span>
                {activeTab === 'overview' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`relative flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'analysis'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="relative z-10">Advanced Analysis</span>
                {activeTab === 'analysis' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('fees')}
                className={`relative flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'fees'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="relative z-10">Fees & Orders</span>
                {activeTab === 'fees' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <StatsGrid />
              <PnLChart />
              <DrawdownChart />
              <TradeTable />
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-8">
              <TimeAnalysis />
              <VolumeAnalysis />
              <DirectionAnalysis />
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-8">
              <FeeBreakdown />
              <OrderTypeAnalysis />
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Deriverse Trading Analytics Dashboard - Solana DeFi Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;