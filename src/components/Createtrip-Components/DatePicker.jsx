import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DatePickerInput({
  selected,
  onDateChange,
  placeholderText = 'Select a date',
  dateFormat = 'MM/DD/YYYY',
  ...otherProps
}) {
  return (
    <DatePicker
      selected={selected}
      onChange={onDateChange}
      dateFormat={dateFormat}
      placeholderText={placeholderText}
      {...otherProps}
    />
  );
}

export default DatePickerInput;
