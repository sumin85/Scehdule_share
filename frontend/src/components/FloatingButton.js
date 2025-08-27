import React from 'react';
import './FloatingButton.css';

const FloatingButton = ({ onClick }) => {
  return (
    <button className="floating-button" onClick={onClick}>
      <span className="floating-button-icon">+</span>
    </button>
  );
};

export default FloatingButton;
