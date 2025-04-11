import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
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

  // Handle date changes with range selection
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

      // Call the parent component's callback with the updated dates
      if (onDateRangeChange) {
        const finalStartDate = date < startDate ? date : startDate;
        const finalEndDate = date < startDate ? startDate : date;
        onDateRangeChange({
          startDate: finalStartDate,
          endDate: finalEndDate,
        });
      }
    }
  };

  // Format the display text based on selection state
  const getDisplayText = () => {
    if (!startDate) return 'Select travel dates';
    if (!endDate)
      return `From: ${startDate.toLocaleDateString()} (select end date)`;
    return `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
  };

  // Close the date picker when clicking outside
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
            // Reset to selecting start date when opening the picker anew
            setSelectingEnd(!!startDate && !endDate);
          }
        }}
      >
        {getDisplayText()}
      </div>
      {isOpen && (
        <DatePicker
          selected={selectingEnd ? endDate : startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsStart={!selectingEnd}
          selectsEnd={selectingEnd}
          inline
          dateFormat={dateFormat}
          monthsShown={1}
          calendarClassName='date-picker-calendar'
          shouldCloseOnSelect={false}
          // Key feature: Show the date range in the calendar
          highlightDates={[
            {
              'react-datepicker__day--highlighted-custom-range':
                startDate && selectingEnd
                  ? getDatesBetween(startDate, new Date())
                  : [],
            },
          ]}
        />
      )}
    </div>
  );
};

// Helper function to get an array of dates between start and end
function getDatesBetween(startDate, currentDate) {
  const dates = [];
  let currentDateCopy = new Date(startDate);

  // Add one day to start date to avoid including it (it's already highlighted as start date)
  currentDateCopy.setDate(currentDateCopy.getDate() + 1);

  // Generate all dates between start and current hover position
  while (currentDateCopy < currentDate) {
    dates.push(new Date(currentDateCopy));
    currentDateCopy.setDate(currentDateCopy.getDate() + 1);
  }

  return dates;
}

export default DateSelector;
