import React, { useState } from 'react';
import './FadingTextBox.css';

const FadingTextBox = ({ type, placeholder }) => {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="fading-textbox-container">
      <input
        value={text}
        className="fading-textbox"
        type={type}
        placeholder={placeholder}
        required
        onChange={handleChange}
      />
    </div>
  );
};

export default FadingTextBox;