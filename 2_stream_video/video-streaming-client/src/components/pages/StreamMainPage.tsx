import React, { useState, useEffect } from 'react';
import InputArea from '../molecules/InputArea';
import VideoPlayer from '../atoms/VideoPlayer';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// WebSocket 연결
const socket = io(API_URL);

const StreamMainPage = () => {
  const [value, setValue] = useState('');
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const placeholder = '영상 주소를 입력해주세요.';

  useEffect(() => {
    // WebSocket에서 실시간 지연 시간 수신
    socket.on('latency', ({ delay }) => {
      setLatency(delay.toFixed(3)); // 소수점 3자리까지 표시
    });

    return () => {
      socket.off('latency');
    };
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // 버튼 클릭 시 스트리밍 요청
  const onClick = async () => {
    if (!value) return;
    setLoading(true);
    try {
      // API에 영상 소스를 전달하여 스트리밍 URL을 가져옴
      const response = await axios.post(`${API_URL}/api/stream`, { source: value });
      setSrc(response.data.streamUrl);
    } catch (error) {
      console.error('스트리밍 시작 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title variant="h3" fontWeight="medium">
        VIDEO STREAMING CLIENT
      </Title>
      <InputArea value={value} onChange={onChange} placeholder={placeholder} onClick={onClick} />
      {loading && <StatusText>스트리밍 요청 중...</StatusText>}
      {src && (
        <>
          <VideoPlayer src={src} />
          <LatencyText>지연 시간: {latency ? `${latency} 초` : '측정 중...'}</LatencyText>
        </>
      )}
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

const LatencyText = styled(Typography)`
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #d9534f; /* Bootstrap danger 색상 */
`;

export default StreamMainPage;