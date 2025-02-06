import React, { useState } from 'react';
import InputArea from '../molecules/InputArea';
import VideoPlayer from '../atoms/VideoPlayer';
import styled from '@emotion/styled';

const StreamMainPage = () => {
  const [value, setValue] = useState('')
  const [src, setSrc] = useState('')
  const placeholder = '영상 주소를 입력해주세요.'
  
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const onClick = () => {
    setSrc(value)
  }

  return (
    <Wrapper>
      <InputArea value={value} onChange={onChange} placeholder={placeholder} onClick={onClick} />
      <VideoPlayer src={src} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
`

export default StreamMainPage