import React from 'react';
import { TextField } from '@mui/material';
import styled from '@emotion/styled';

export type InputFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const InputField: React.FC<InputFieldProps> = ({ value, onChange, placeholder }) => {
  return (
    <StyledTextField
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size="medium"
    />
  );
};

const StyledTextField = styled(TextField)({
  width: '100%',
  height: '100%'
});

export default InputField;