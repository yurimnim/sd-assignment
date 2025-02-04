import React from 'react';
import './InputField.css';

export type InputFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const InputField: React.FC<InputFieldProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      className="atom-input"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default InputField;