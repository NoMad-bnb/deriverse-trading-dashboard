const StatsCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mr-4"></div>
        <div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCardSkeleton;