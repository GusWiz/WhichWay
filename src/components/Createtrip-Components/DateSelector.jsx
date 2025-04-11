import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import DatePickerInput from './DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateSelector.css'; // Import styles

const DateSelector = ({
  onDateRangeChange,
  initialStartDate = null,
  initialEndDate = null,
  dateFormat = 'MM/DD/YYYY',
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef(null);

  // Function to handle date selection
  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setIsOpen(false); // Close calendar after selection

    if (onDateRangeChange) {
      onDateRangeChange({ startDate: start, endDate: end });
    }
  };

  // Function to format the display text
  const getDisplayText = () => {
    if (!startDate) return 'Select a date';
    if (startDate && !endDate) return `on ${startDate.toLocaleDateString()}`;
    return `from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
  };

  // Close the date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup event listener on unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='date-selector-container' ref={datePickerRef}>
      <div
        className={`fading-date-text ${startDate ? 'has-date' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {getDisplayText()}
      </div>
      {isOpen && (
        <DatePicker
          selected={startDate}
          onChange={handleChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      )}
    </div>
  );
};

export default DateSelector;
