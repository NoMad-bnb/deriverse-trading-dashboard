import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiLayers } from 'react-icons/fi';
import type { TradingSymbol } from '../types';

// Mapping for crypto symbols to their names for logo URLs
const coinNameMapping: { [key: string]: string } = {
  SOL: 'solana',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BONK: 'bonk1', // Corrected name for logo URL
  RAY: 'raydium',
};

const getCoinIcon = (symbol: TradingSymbol | 'all') => {
  if (symbol === 'all') {
    return <FiLayers className="w-5 h-5 text-gray-500" />;
  }
  const coinSymbol = symbol.split('/')[0];
  const coinName = coinNameMapping[coinSymbol as keyof typeof coinNameMapping];

  // Fallback for symbols not in our mapping
  if (!coinName) {
    return <FiLayers className="w-5 h-5 text-gray-500" />;
  }

  const logoUrl = `https://cryptologos.cc/logos/${coinName}-${coinSymbol.toLowerCase()}-logo.png`;
  
  return <img src={logoUrl} alt={`${coinSymbol} logo`} className="w-5 h-5" />;
};

interface SymbolSelectProps {
  symbols: (TradingSymbol | 'all')[];
  selectedSymbol: TradingSymbol | 'all';
  onSelectSymbol: (symbol: TradingSymbol | 'all') => void;
}

const SymbolSelect = ({ symbols, selectedSymbol, onSelectSymbol }: SymbolSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleSelect = (symbol: TradingSymbol | 'all') => {
    onSelectSymbol(symbol);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-11 pr-10 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 flex items-center"
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {getCoinIcon(selectedSymbol)}
        </div>
        <span className="flex-grow text-left">
          {selectedSymbol === 'all' ? 'All Pairs' : selectedSymbol}
        </span>
        <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          <ul className="text-sm text-gray-900 dark:text-gray-100">
            {symbols.map((symbol) => (
              <li
                key={symbol}
                onClick={() => handleSelect(symbol)}
                className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="w-5 h-5 mr-3">{getCoinIcon(symbol)}</div>
                <span>{symbol === 'all' ? 'All Pairs' : symbol}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SymbolSelect;