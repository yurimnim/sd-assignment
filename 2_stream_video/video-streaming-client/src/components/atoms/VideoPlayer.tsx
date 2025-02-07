import React, { useRef, useEffect } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// 기존 socket.io 인스턴스를 재사용하거나 별도로 생성
const socket = io(API_URL);

interface VideoPlayerProps {
  source: string;
}

const VideoContainer = styled(Paper)`
  background-color: #000;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: 450px;
  margin-top: 20px;
  margin: 0 auto;
  border: 1px solid #000;

  /* video 요소의 크기 조절 */
  & video {
    width: 100%;
    height: auto;
  }
`;

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaSource = new MediaSource();
    let sourceBuffer: SourceBuffer | null = null;
    const video = videoRef.current;
    if (!video) return;
    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
      // 브라우저에서 지원하는 MIME 타입과 코덱 지정 (필요에 따라 조정)
      const mime = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
      try {
        sourceBuffer = mediaSource.addSourceBuffer(mime);
      } catch (e) {
        console.error('SourceBuffer 생성 실패:', e);
      }
    });

    // socket.io 'stream-chunk' 이벤트로 바이너리 데이터를 수신
    socket.on('stream-chunk', (chunk: ArrayBuffer) => {
      if (sourceBuffer && !sourceBuffer.updating) {
        try {
          sourceBuffer.appendBuffer(new Uint8Array(chunk));
        } catch (e) {
          console.error('appendBuffer 에러:', e);
        }
      }
    });

    // 스트리밍 시작 요청 (예를 들어 sample1.mp4라면)
    socket.emit('start-stream', source);

    return () => {
      socket.off('stream-chunk');
      socket.emit('stop-stream');
    };
  }, [source]);

  return (
    <VideoContainer elevation={2}>
      <MediaPlayer title="title" src={source}>
        <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </VideoContainer>
  );
};

export default VideoPlayer;