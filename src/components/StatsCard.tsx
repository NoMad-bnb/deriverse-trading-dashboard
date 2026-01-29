import type { ReactNode } from 'react';

/**
 * Props for StatsCard component
 */
interface StatsCardProps {
  title: string;           // Card title
  value: string | number;  // Main value to display
  icon: ReactNode;         // Icon component
  trend?: {                // Optional trend indicator
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;       // Optional subtitle
  colorClass?: string;     // Optional custom color class
}

/**
 * StatsCard Component
 * Displays a statistical metric with icon, value, and optional trend
 */
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  subtitle,
  colorClass = 'from-blue-500 to-purple-600'
}: StatsCardProps) => {
  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      {/* Icon with gradient background */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white text-2xl">
            {icon}
          </div>
        </div>
        
        {/* Trend indicator (if provided) */}
        {trend && (
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold text-sm ${
            trend.isPositive 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            <span className="text-lg">{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
        {title}
      </h3>

      {/* Main Value */}
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
        {value}
      </p>

      {/* Subtitle (if provided) */}
      {subtitle && (
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
          <span>{subtitle}</span>
        </p>
      )}
    </div>
  );
};

export default StatsCard;