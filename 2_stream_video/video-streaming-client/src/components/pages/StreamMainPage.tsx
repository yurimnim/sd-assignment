import React, { useState, useEffect, useRef } from 'react';
import InputArea from '../molecules/InputArea';
import VideoPlayer from '../atoms/VideoPlayer';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { io, Socket } from 'socket.io-client';

const StreamMainPage = () => {
  // 사용자가 InputArea에 입력한 값을 관리하는 state
  const [inputValue, setInputValue] = useState('');
  // 실제 스트리밍에 사용할 소스(state)
  const [activeSource, setActiveSource] = useState<string>('');
  // 지연시간 상태: 서버로부터 전달받은 latency 값을 저장
  const [latency, setLatency] = useState<number | null>(null);

  // socket 인스턴스를 저장하기 위한 ref
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:8000');
    socketRef.current = socket;
  
    socket.on('connect', () => {
      console.log('Socket connected with id:', socket.id);
    });
  
    // latency 이벤트 수신 핸들러
    socket.on('latency', (data: { ptsTime: number; delay: number }) => {
      //console.log('Received latency data:', data); // 이 로그가 출력되는지 확인
      setLatency(data.delay);
    });
  
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // 전송 버튼 클릭 시, activeSource를 업데이트하고 서버에 스트림 시작 요청
  const onClick = () => {
    setActiveSource(inputValue);
    if (socketRef.current) {
      socketRef.current.emit('start-stream', inputValue);
    }
  };

  return (
    <Wrapper>
      <Title variant="h3" fontWeight="medium">
        VIDEO STREAMING CLIENT
      </Title>
      <InputArea
        value={inputValue}
        onChange={onChange}
        placeholder="영상 주소를 입력해주세요."
        onClick={onClick}
      />

      {activeSource && (
        <>
          <VideoPlayer source={activeSource} />
          <LatencyText>
            지연 시간: {latency !== null ? `${latency.toFixed(3)} 초` : '측정 중...'}
          </LatencyText>
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

const LatencyText = styled(Typography)`
  margin-top: 10px;
  font-size: 14px;
  color: #777;
`;

export default StreamMainPage;