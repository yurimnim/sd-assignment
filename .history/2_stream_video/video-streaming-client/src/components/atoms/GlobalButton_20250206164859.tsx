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
      <StyledButton variant="contained" color='secondary' size="large" onClick={onClick} disableRipple>
        {text}
      </StyledButton>
    </>
  );
};

const StyledButton = styled(Button)({
  width: '80px',
  fontSize: '15px',
  boxShadow: 'none',
  height: '100%',
});

export default GlobalButton;