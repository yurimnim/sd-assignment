import React from 'react';
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';
import { MediaPlayer } from '@vidstack/react';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';

interface VideoPlayerProps {
  src: string;       // 비디오 경로 또는 URL (필수)
  poster?: string;   // 옵션: 포스터 이미지 URL
}

const VideoContainer = styled(Paper)`
  background-color: #000;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  /* video 요소의 크기 조절 */
  & video {
    width: 100%;
    height: auto;
    max-height: 500px;
  }
`;

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {

  return (
    <VideoContainer elevation={3}>
      <MediaPlayer
          autoPlay={true}
          src={src}
          data-loading='lazy'
          aspectRatio="16:9"
        >
          <MediaOutlet></MediaOutlet>
          <MediaCommunitySkin />
        </MediaPlayer>
    </VideoContainer>
  );
};

export default VideoPlayer;