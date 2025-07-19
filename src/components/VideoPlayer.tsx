import React, { useState, useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  checkInterval?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, checkInterval = 30000 }) => {
  const [currentUrl, setCurrentUrl] = useState(videoUrl);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Periodically refresh the video
    const refreshVideo = () => {
      setIsUpdating(true);

      const timestamp = new Date().getTime();
      const updatedUrl = `${videoUrl}?t=${timestamp}`;

      setTimeout(() => {
        setCurrentUrl(updatedUrl);
        setIsUpdating(false);
      }, 500);
    };

    // Initial load
    setCurrentUrl(videoUrl);

    // Set up periodic refresh
    const interval = setInterval(refreshVideo, checkInterval);

    return () => clearInterval(interval);
  }, [videoUrl, checkInterval]);

  useEffect(() => {
    if (videoRef.current && !isUpdating) {
      videoRef.current.load();
    }
  }, [currentUrl, isUpdating]);

  return (
    <div className="video-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      borderRadius: 0,
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      width: '100vw',
      height: '100vh'
    }}>
      {isUpdating && (
        <div className="update-notification">
          <span>New video detected! Loading...</span>
        </div>
      )}
      <video
        ref={videoRef}
        src={currentUrl}
        controls
        autoPlay
        loop
        muted
        playsInline
        className={`mosaic-video ${isUpdating ? 'updating' : ''}`}
        style={{
          height: 'min(100vh, 100vw)'
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;