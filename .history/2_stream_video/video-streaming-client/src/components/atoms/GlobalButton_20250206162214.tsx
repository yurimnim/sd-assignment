import React from 'react';
import { Button } from '@mui/material';
import styled from '@emotion/styled';

export type ButtonProps = {
  text: string;
  onClick?: () => void;
};

const GlobalButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <>
      <StyledButton variant="contained" size="large" onClick={onClick}>
        {text}
      </StyledButton>
    </>
  );
};

const StyledButton = styled(Button)({
  width: '80px',
  fontSize: '15px',
});

export default GlobalButton;