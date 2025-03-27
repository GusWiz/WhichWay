import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// funuction that returns a input box that allows Users to pick/choose a date.
// Once selected it shows the user their input in format MM/DD/YYYY
function DatePickerInput({selectedDate, onDateChange, placeholderText}){
    return(
        <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="MM/DD/YYYY"
        placeholderText={placeholderText}
        />
    )
}

export default DatePickerInput;
