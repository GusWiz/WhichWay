import React from 'react';
import '../Login-Components/login-styling.css'; // Reuse styling or create new styles as needed

/**
 * Input field component designed specifically for trip creation forms.
 * Properly handles name, value, and other essential input properties.
 */
const TripInputField = ({
  type = 'text',
  name,
  placeholder = '',
  value = '',
  onChange,
}) => {
  return (
    <div className='ainput-wrapper'>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        className='ainput-field'
        required
        onChange={onChange}
      />
    </div>
  );
};

export default TripInputField;
