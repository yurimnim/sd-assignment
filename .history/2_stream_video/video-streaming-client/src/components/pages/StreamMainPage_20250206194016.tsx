import React, { useState } from 'react';
import InputArea from '../molecules/InputArea';
import VideoPlayer from '../atoms/VideoPlayer';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import axios from 'axios';

const StreamMainPage = () => {
  const [value, setValue] = useState('');
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const placeholder = '영상 주소를 입력해주세요.';

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // 버튼 클릭 시 axios로 API call 후 스트리밍 URL을 받아와 VideoPlayer에 전달합니다.
  const onClick = async () => {
    if (!value) return;
    setLoading(true);
    try {
      // POST 요청 시 body에 영상 소스를 전달합니다.
      const response = await axios.post('/api/stream', { source: value });
      // 응답으로 받은 스트리밍 URL을 state에 저장합니다.
      // 예를 들어 response.data.streamUrl 이 스트리밍 URL 이라고 가정합니다.
      setSrc(response.data.streamUrl);
    } catch (error) {
      console.error('Error starting stream:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title variant="h3" fontWeight="medium">
        VIDEO STREAMING CLIENT
      </Title>
      <InputArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onClick={onClick}
      />
      {loading && <StatusText>스트리밍 요청 중...</StatusText>}
      {src && <VideoPlayer src={src} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Title = styled(Typography)`
  margin-top: 150px;
  font-weight: medium;
`;

const StatusText = styled(Typography)`
  margin-top: 20px;
  font-size: 16px;
  color: #555;
`;

export default StreamMainPage;