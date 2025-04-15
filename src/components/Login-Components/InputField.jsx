import React from 'react';
import './login-styling.css';
// input text boxes
const InputField = ({ type, placeholder, onChange }) => {
  return (
    <>
      <div className='ainput-wrapper'>
        <input
          type={type}
          placeholder={placeholder}
          className='ainput-field'
          required
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default InputField;
