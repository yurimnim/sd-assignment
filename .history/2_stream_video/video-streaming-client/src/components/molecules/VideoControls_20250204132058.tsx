import React from 'react';
import PlayButton from '../atoms/Button';
import './VideoControls.css';

export type VideoControlsProps = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
};

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  return (
    <div className="molecule-video-controls">
      <PlayButton  
    text={isPlaying ? 'Pause' : 'Play'}
      onClick={onPlayPause} />
      <input
        type="range"
        className="progress-bar"
        min="0"
        max={duration}
        step="0.1"
        value={currentTime}
        onChange={handleChange}
      />
      <span className="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default VideoControls;