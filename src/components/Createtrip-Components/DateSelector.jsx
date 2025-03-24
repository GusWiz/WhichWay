import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateSelector.css"; // Import styles

const DateSelector = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="date-selector-container">
      <div className="fading-date-text" onClick={() => setIsOpen(!isOpen)}>
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
