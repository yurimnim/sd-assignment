import React, { useState } from 'react';
import InputArea from '../molecules/InputArea';
import VideoPlayer from '../atoms/VideoPlayer';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';

const StreamMainPage = () => {

  const [value, setValue] = useState('');
  const [src, setSrc] = useState('');
  const placeholder = '영상 주소를 입력해주세요.';
  
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const onClick = () => {
    setSrc(value)
  }

  return (
    <Wrapper>
      <Title variant="h3" fontWeight="medium">VIDEO STREAMING CLIENT</Title> 
      <InputArea value={value} onChange={onChange} placeholder={placeholder} onClick={onClick} />
      <VideoPlayer src={src} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 10px;
`

const Title = styled(Typography)`
  margin-top: 150px;
  font-weight: medium;
`

export default StreamMainPage