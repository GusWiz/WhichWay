import React from 'react';
import '../Login-Components/login-styling.css'; // Reuse styling or create new styles as needed

/**
 * Input field component designed specifically for trip creation forms.
 * Properly handles name, value, and other essential input properties.
 */
const TripInputField = ({ type, placeholder, value, onChange, name }) => {
  return (
    <div className="input-field">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required
      />
    </div>
  );
};

export default TripInputField;
