import React from 'react';
import { Button } from '@mui/material';

export type ButtonProps = {
  text: string;
  onClick?: () => void;
};

const GlobalButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <div>
      <Button variant="outlined" onClick={onClick}>
        {text}
      </Button>
    </div>
  );
};

export default GlobalButton;