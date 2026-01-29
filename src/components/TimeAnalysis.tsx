import { useMemo, useState } from 'react';
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
import { FiClock, FiCalendar, FiSunrise, FiGlobe } from 'react-icons/fi';
import type { Trade } from '../types';

const TimeAnalysis = () => {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly', 'daily', 'session'
  const { getFilteredTrades, isDarkMode } = useTradeStore();
  const filteredTrades = getFilteredTrades();

  const hourlyPerformance = useMemo(() => {
    const hourData: { [key: number]: { pnl: number; count: number } } = {};

    for (let i = 0; i < 24; i++) {
      hourData[i] = { pnl: 0, count: 0 };
    }

    filteredTrades
      .filter((t: Trade) => t.status === 'closed' && t.exitTime)
      .forEach((trade: Trade) => {
        const hour = trade.exitTime!.getHours();
        hourData[hour].pnl += trade.pnl;
        hourData[hour].count += 1;
      });

    return Object.entries(hourData).map(([hour, data]) => ({
      hour: `${hour.padStart(2, '0')}:00`,
      avgPnl: data.count > 0 ? data.pnl / data.count : 0,
      totalPnl: data.pnl,
      trades: data.count,
    }));
  }, [filteredTrades]);

  const dailyPerformance = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayData: { [key: number]: { pnl: number; count: number } } = {};

    for (let i = 0; i < 7; i++) {
      dayData[i] = { pnl: 0, count: 0 };
    }

    filteredTrades
      .filter((t: Trade) => t.status === 'closed' && t.exitTime)
      .forEach((trade: Trade) => {
        const day = trade.exitTime!.getDay();
        dayData[day].pnl += trade.pnl;
        dayData[day].count += 1;
      });

    return Object.entries(dayData).map(([day, data]) => ({
      day: dayNames[parseInt(day)],
      avgPnl: data.count > 0 ? data.pnl / data.count : 0,
      totalPnl: data.pnl,
      trades: data.count,
    }));
  }, [filteredTrades]);

  const sessionPerformance = useMemo(() => {
    const sessions = {
      'Asian': { pnl: 0, count: 0, time: '00:00-08:00', icon: 'FiGlobe', color: 'blue' },
      'European': { pnl: 0, count: 0, time: '08:00-16:00', icon: 'FiGlobe', color: 'green' },
      'American': { pnl: 0, count: 0, time: '16:00-00:00', icon: 'FiGlobe', color: 'purple' },
    };

    filteredTrades
      .filter((t: Trade) => t.status === 'closed' && t.exitTime)
      .forEach((trade: Trade) => {
        const hour = trade.exitTime!.getHours();
        if (hour >= 0 && hour < 8) {
          sessions['Asian'].pnl += trade.pnl;
          sessions['Asian'].count += 1;
        } else if (hour >= 8 && hour < 16) {
          sessions['European'].pnl += trade.pnl;
          sessions['European'].count += 1;
        } else {
          sessions['American'].pnl += trade.pnl;
          sessions['American'].count += 1;
        }
      });

    return Object.entries(sessions).map(([session, data]) => ({
      session,
      avgPnl: data.count > 0 ? data.pnl / data.count : 0,
      totalPnl: data.pnl,
      trades: data.count,
      time: data.time,
      icon: data.icon,
      color: data.color,
    }));
  }, [filteredTrades]);

  const textColor = isDarkMode ? '#9CA3AF' : '#4B5563';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-600">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">{label}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Avg PnL:</span>
              <span className={`ml-4 font-bold ${
                payload[0].value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                ${payload[0].value.toFixed(2)}
              </span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Trades:</span>
              <span className="ml-4 font-bold text-gray-900 dark:text-white">{payload[0].payload.trades}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
            {activeTab === 'hourly' && <FiClock className="text-blue-600 dark:text-blue-400 w-6 h-6" />}
            {activeTab === 'daily' && <FiCalendar className="text-purple-600 dark:text-purple-400 w-6 h-6" />}
            {activeTab === 'session' && <FiSunrise className="text-orange-600 dark:text-orange-400 w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'hourly' && 'Performance by Time of Day'}
              {activeTab === 'daily' && 'Performance by Day of Week'}
              {activeTab === 'session' && 'Performance by Trading Session'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {activeTab === 'hourly' && 'Discover your most profitable trading hours'}
              {activeTab === 'daily' && 'Identify your best trading days'}
              {activeTab === 'session' && 'Compare performance across global markets'}
            </p>
          </div>
        </div>
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
              activeTab === 'hourly' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            By Hour
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
              activeTab === 'daily' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            By Day
          </button>
          <button
            onClick={() => setActiveTab('session')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
              activeTab === 'session' ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            By Session
          </button>
        </div>
      </div>

      {activeTab === 'hourly' && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={hourlyPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} />
            <XAxis 
              dataKey="hour" 
              stroke={textColor} 
              style={{ fontSize: '12px', fontWeight: '500' }}
              tickMargin={10}
            />
            <YAxis 
              stroke={textColor} 
              style={{ fontSize: '12px', fontWeight: '500' }} 
              tickFormatter={(value) => `$${value}`}
              tickMargin={10}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'transparent' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Bar 
              dataKey="avgPnl" 
              radius={[8, 8, 0, 0]} 
              animationDuration={1000}
              isAnimationActive={false}
            >
              {hourlyPerformance.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.avgPnl >= 0 ? '#10B981' : '#EF4444'}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {activeTab === 'daily' && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={dailyPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} />
            <XAxis 
              dataKey="day" 
              stroke={textColor} 
              style={{ fontSize: '13px', fontWeight: '500' }}
              tickMargin={10}
            />
            <YAxis 
              stroke={textColor} 
              style={{ fontSize: '12px', fontWeight: '500' }} 
              tickFormatter={(value) => `$${value}`}
              tickMargin={10}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'transparent' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Bar 
              dataKey="avgPnl" 
              radius={[8, 8, 0, 0]} 
              animationDuration={1000}
              isAnimationActive={false}
            >
              {dailyPerformance.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.avgPnl >= 0 ? '#10B981' : '#EF4444'}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {activeTab === 'session' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {sessionPerformance.map((session) => {
            return (
              <div 
                key={session.session} 
                className={`group bg-gradient-to-br ${
                  session.color === 'blue' 
                    ? 'from-blue-50 to-white dark:from-blue-900/20 dark:to-blue-900/10' 
                    : session.color === 'green'
                    ? 'from-green-50 to-white dark:from-green-900/20 dark:to-green-900/10'
                    : 'from-purple-50 to-white dark:from-purple-900/20 dark:to-purple-900/10'
                } p-6 rounded-xl border-2 ${
                  session.color === 'blue'
                    ? 'border-blue-200 dark:border-blue-800'
                    : session.color === 'green'
                    ? 'border-green-200 dark:border-green-800'
                    : 'border-purple-200 dark:border-purple-800'
                } hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    session.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900/50'
                      : session.color === 'green'
                      ? 'bg-green-100 dark:bg-green-900/50'
                      : 'bg-purple-100 dark:bg-purple-900/50'
                  }`}>
                    <FiGlobe className={`w-6 h-6 ${
                      session.color === 'blue'
                        ? 'text-blue-600 dark:text-blue-400'
                        : session.color === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    session.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : session.color === 'green'
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                      : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                  }`}>
                    {session.time}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {session.session} Session
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg PnL</span>
                    <span className={`text-xl font-bold ${
                      session.avgPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ${session.avgPnl.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Trades</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{session.trades}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Total PnL</span>
                    <span className={`text-sm font-bold ${
                      session.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ${session.totalPnl.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeAnalysis;