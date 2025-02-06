import React from 'react';
import { Button } from '@mui/material';

export type ButtonProps = {
  text: string;
  onClick?: () => void;
};

const GlobalButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <>
      <Button variant="outlined" onClick={onClick}>
        {text}
      </Button>
    </>
  );
};

export default GlobalButton;