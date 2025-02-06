import React from 'react';
import './VideoElement.css';

export type VideoElementProps = {
  src: string;
  poster?: string;
};

const VideoElement = React.forwardRef<HTMLVideoElement, VideoElementProps>(
  ({ src, poster }, ref) => {
    return (
      <video
        className="atom-video"
        ref={ref}
        src={src}
        poster={poster}
        // Disable built-in controls so we can use our custom controls.
        controls={false}
      >
        Your browser does not support the video tag.
      </video>
    );
  }
);

export default VideoElement;