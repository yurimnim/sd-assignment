import React from 'react';
import './Button.css';

export type ButtonProps = {
  text: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button className="atom-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;