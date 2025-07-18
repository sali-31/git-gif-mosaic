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
    <div className="video-container">
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
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;

<style>{`
  .video-container {
    width: 100%;
    background: #000;
    border-radius: 0;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    position: relative;
  }
  
  @media (max-width: 1199px) {
    .video-container {
      border-radius: 1rem;
    }
  }
  
  .mosaic-video {
    width: 100%;
    height: auto;
    display: block;
    transition: opacity 0.3s ease;
  }
  
  .mosaic-video.updating {
    opacity: 0.5;
  }
  
  .update-notification {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(139, 92, 246, 0.9);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 10;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>