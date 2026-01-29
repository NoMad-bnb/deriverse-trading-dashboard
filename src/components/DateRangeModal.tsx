import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FiX, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { format as formatDate } from 'date-fns';

// Import base styles for react-datepicker FIRST
import 'react-datepicker/dist/react-datepicker.css';
// Import our custom override styles SECOND
import '../styles/datepicker.css';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate: Date | null;
  initialEndDate: Date | null;
}

// Custom Header for the DatePicker for full layout control
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}) => (
  <div className="flex items-center justify-between pb-4">
    <button
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      type="button"
      className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <FiChevronLeft className="w-5 h-5 text-gray-300" />
    </button>
    <span className="text-lg font-semibold text-white">
      {formatDate(date, 'MMMM yyyy')}
    </span>
    <button
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      type="button"
      className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <FiChevronRight className="w-5 h-5 text-gray-300" />
    </button>
  </div>
);

const DateRangeModal = ({ isOpen, onClose, onApply, initialStartDate, initialEndDate }: DateRangeModalProps) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Reset local state when initial props change (e.g., global reset)
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  if (!isOpen) {
    return null;
  }

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleApplyClick = () => {
    onApply(startDate, endDate);
    onClose();
  };

  const presetRanges = [
    { label: 'Last 7 Days', range: [subDays(new Date(), 6), new Date()] as [Date, Date] },
    { label: 'Last 30 Days', range: [subDays(new Date(), 29), new Date()] as [Date, Date] },
    { label: 'This Week', range: [startOfWeek(new Date()), endOfWeek(new Date())] as [Date, Date] },
    { label: 'This Month', range: [startOfMonth(new Date()), endOfMonth(new Date())] as [Date, Date] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-3xl bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl m-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <FiCalendar className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Select Date Range</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row">
          {/* Presets */}
          <div className="w-full md:w-1/4 p-6 border-r-0 md:border-r border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Quick Select</h3>
            <div className="flex flex-col space-y-2">
              {presetRanges.map(({ label, range }) => (
                <button
                  key={label}
                  onClick={() => handleDateChange(range)}
                  className="w-full px-4 py-2.5 text-sm text-left font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                >
                  {label}
                </button>
              ))}
               <button
                  onClick={() => handleDateChange([null, null])}
                  className="w-full px-4 py-2.5 text-sm text-left font-medium text-red-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                >
                  Clear Range
                </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 p-6 flex justify-center items-center">
            {/* This container is crucial to constrain the calendar's width */}
            <div className="w-full max-w-sm">
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                inline
                calendarClassName="deriverse-datepicker"
                renderCustomHeader={CustomHeader}
                formatWeekDay={(name: string) => name.substring(0, 2)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-700 space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyClick}
            className="px-6 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeModal;