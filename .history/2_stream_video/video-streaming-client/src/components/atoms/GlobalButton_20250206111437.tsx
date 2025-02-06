import React from 'react';
import { Button } from '@mui/material';

export type ButtonProps = {
  text: string;
  onClick?: () => void;
};

const GlobalButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <div>
      <Button variant="contained" onClick={onClick}>
        {text}
      </Button>
    </div>
  );
};

export default GlobalButton;