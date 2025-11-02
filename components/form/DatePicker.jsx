"use client";
import React, { useState, useRef, useEffect } from "react";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const daysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export default function DatePicker({
  register,
  name = "date",
  error,
  defaultValue = "",
  placeholder = "DD-MMM-YYYY",
  setValue,
  inputClassName = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const dropdownRef = useRef(null);

  // Parse default value if provided (expects YYYY-MM-DD format)
  useEffect(() => {
    if (defaultValue) {
      const date = new Date(defaultValue);
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        setSelectedDay(day);
        setSelectedMonth(month);
        setSelectedYear(String(year));
        setDisplayValue(`${day}-${month}-${year}`);
      }
    }
  }, [defaultValue]);

  // Generate year options (from 1900 to current year + 1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear + 1 - i);

  // Generate day options based on selected month and year
  const getDayOptions = () => {
    if (!selectedMonth || !selectedYear) return Array.from({ length: 31 }, (_, i) => i + 1);
    const monthIndex = months.indexOf(selectedMonth);
    const days = daysInMonth(monthIndex, parseInt(selectedYear));
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDay(day);
    updateDate(day, selectedMonth, selectedYear);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    updateDate(selectedDay, month, selectedYear);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    updateDate(selectedDay, selectedMonth, year);
  };

  const updateDate = (day, month, year) => {
    if (day && month && year) {
      const paddedDay = String(day).padStart(2, '0');
      const displayFormat = `${paddedDay}-${month}-${year}`;
      setDisplayValue(displayFormat);

      // Convert to YYYY-MM-DD for form submission
      const monthIndex = months.indexOf(month);
      const isoFormat = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${paddedDay}`;

      if (setValue) {
        setValue(name, isoFormat);
      }
    }
  };

  const handleClear = () => {
    setSelectedDay("");
    setSelectedMonth("");
    setSelectedYear("");
    setDisplayValue("");
    if (setValue) {
      setValue(name, "");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Display Input */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          className={`mt-1 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${inputClassName}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-sm shadow-lg p-4">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {/* Day Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Day</label>
              <select
                value={selectedDay}
                onChange={handleDayChange}
                className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">DD</option>
                {getDayOptions().map((day) => (
                  <option key={day} value={day}>
                    {String(day).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">MMM</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">YYYY</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-sm hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Hidden input for form registration */}
      <input
        type="hidden"
        {...register(name)}
        value={selectedDay && selectedMonth && selectedYear
          ? `${selectedYear}-${String(months.indexOf(selectedMonth) + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
          : ""}
      />
    </div>
  );
}
