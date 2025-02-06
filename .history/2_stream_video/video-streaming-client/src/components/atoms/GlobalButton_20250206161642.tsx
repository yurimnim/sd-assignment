import React from 'react';
import { Button } from '@mui/material';

export type ButtonProps = {
  text: string;
  onClick?: () => void;
};

const GlobalButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <>
      <Button variant="outlined" lg onClick={onClick}>
        {text}
      </Button>
    </>
  );
};

export default GlobalButton;