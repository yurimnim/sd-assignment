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
      <StyledButton variant="outlined" size="large" onClick={onClick}>
        {text}
      </StyledButton>
    </>
  );
};

const StyledButton = styled(Button)({
  width: '80px',
  height: '60px',
});

export default GlobalButton;