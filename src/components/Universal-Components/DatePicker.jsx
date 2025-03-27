import React from 'react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function DatePickerInput(){
    const [selectedDate, setSelectedDate] = useState(null);

    HandleDateChange = (date) => {
        setSelectedDate(date);
    }
    return(
        <DatePicker
        selected={selectedDate}
        onChange={HandleDateChange}
        dateFormat="MM/DD/YYYY"
        />
    )
}

export default DatePickerInput;
