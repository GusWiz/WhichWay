import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateSelector.css"; // Import styles

const DateSelector = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef(null);

  // Function to handle date selection
  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setIsOpen(false); // Close calendar after selection
  };

  // Function to format the display text
  const getDisplayText = () => {
    if (!startDate) return "Select a date";
    if (startDate && !endDate) return `on ${startDate.toLocaleDateString()}`;
    return `from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
  };

  // Close the date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="date-selector-container" ref={datePickerRef}>
      <div 
        className="fading-date-text" 
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
