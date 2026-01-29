import { FiSun, FiMoon, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { useTradeStore } from '../store/useTradeStore';

/**
 * Header Component
 * Displays the dashboard title and theme toggle button with animated logo
 */
const Header = () => {
  // Get theme state and toggle function from store
  const { isDarkMode, toggleTheme } = useTradeStore();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            {/* Animated Logo */}
            <div className="relative group cursor-pointer">
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              
              {/* Main logo container */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                {/* Background icon (Activity wave) */}
                <FiActivity className="absolute w-10 h-10 text-white/30 animate-pulse" />
                
                {/* Foreground icon (TrendingUp) */}
                <FiTrendingUp className="relative w-8 h-8 text-white font-bold transform group-hover:scale-125 transition-transform duration-300" />
                
                {/* Decorative dots */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
                Deriverse Analytics
              </h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5 flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <FiActivity className="hidden sm:inline w-3.5 h-3.5 text-purple-500 dark:text-purple-400 animate-pulse" />
                <span>Solana Trading Dashboard</span>
              </p>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="group relative p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
            aria-label="Toggle theme"
          >
            <div className="relative w-6 h-6">
              {isDarkMode ? (
                <>
                  <FiSun className="w-6 h-6 text-yellow-500 absolute inset-0 transition-all duration-500 group-hover:rotate-180 group-hover:scale-125" />
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </>
              ) : (
                <>
                  <FiMoon className="w-6 h-6 text-indigo-600 absolute inset-0 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-125" />
                  <div className="absolute inset-0 bg-indigo-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;