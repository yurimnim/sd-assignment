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
  height: '30px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#000000',
  border: '1px solid #000000',
  borderRadius: '5px',
  cursor: 'pointer',
});

export default GlobalButton;