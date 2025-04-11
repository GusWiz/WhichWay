import React, { useState, useRef, useEffect } from 'react';
import DatePickerInput from './DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateSelector.css';

const DateSelector = ({
  onDateRangeChange,
  initialStartDate = null,
  initialEndDate = null,
  dateFormat = 'MM/DD/YYYY',
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isOpen, setIsOpen] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const datePickerRef = useRef(null);

  // New approach: handle dates separately
  const handleDateChange = (date) => {
    if (!selectingEnd) {
      // Setting start date
      setStartDate(date);
      setEndDate(null);
      setSelectingEnd(true);
    } else {
      // Setting end date
      // Ensure end date is not before start date
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setSelectingEnd(false);
      setIsOpen(false);

      if (onDateRangeChange) {
        onDateRangeChange({
          startDate: date < startDate ? date : startDate,
          endDate: date < startDate ? startDate : date,
        });
      }
    }
  };

  const getDisplayText = () => {
    if (!startDate) return 'Select travel dates';
    if (!endDate)
      return `From: ${startDate.toLocaleDateString()} (select end date)`;
    return `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (selectingEnd) {
          setSelectingEnd(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectingEnd]);

  return (
    <div className='date-selector-container' ref={datePickerRef}>
      <div
        className={`fading-date-text ${startDate ? 'has-date' : ''} ${selectingEnd ? 'selecting-end' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSelectingEnd(false);
          }
        }}
      >
        {getDisplayText()}
      </div>
      {isOpen && (
        <DatePickerInput
          selected={selectingEnd ? endDate : startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          inline
          dateFormat={dateFormat}
          monthsShown={1}
          calendarClassName='date-picker-calendar'
          // Highlight the date range in the calendar
          highlightDates={selectingEnd && startDate ? [startDate] : []}
        />
      )}
    </div>
  );
};

export default DateSelector;
