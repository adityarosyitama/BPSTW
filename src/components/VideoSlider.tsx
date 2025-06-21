import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Video from 'next-video';

interface VideoSliderProps {
  videoUrls: string[];
  // isMuted: boolean;
  isMobile: boolean;
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videoUrls, isMobile }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);
  const startX = useRef(0);
  const dragDistance = useRef(0);

  const handleThumbnailClick = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragDistance.current = 0;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragDistance.current = currentX - startX.current;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = 100;
    if (dragDistance.current > swipeThreshold && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else if (dragDistance.current < -swipeThreshold && currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const { videoWidth, videoHeight } = video;
    setVideoDimensions({ width: videoWidth, height: videoHeight });
  };

  const getContainerStyles = () => {
    const baseStyles = {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (window.innerWidth < 768) {
      return {
        ...baseStyles,
        height: 'auto',
        maxHeight: '100vh',
      };
    }

    return {
      ...baseStyles,
      maxWidth: '80vw',
    };
  };

  const getVideoStyles = () => {
    const baseStyles = {
      // width: 'auto',
      // height: '100%',
      // maxWidth: '100%',
      // maxHeight: '100vh',
      objectFit: 'contain' as const,
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    // Adjust styles based on video dimensions if available
    if (videoDimensions) {
      const aspectRatio = videoDimensions.width / videoDimensions.height;
      if (aspectRatio < 1) {
        // Portrait video: limit width to avoid stretching
        return {
          ...baseStyles,
          maxWidth: isMobile?'100%':'30%',
        };
      } else {
        // Landscape video: use full available width
        return {
          ...baseStyles,
          maxWidth: isMobile?'100%':'100%',
        };
      }
    }

    return baseStyles;
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden mt-2">
      {/* Thumbnails (Mobile) */}
      <div className="md:hidden flex space-x-2 overflow-x-auto w-full justify-center z-10 bg-opacity-50 p-2">
        {videoUrls.map((url, index) => (
          <motion.div
            key={index}
            className={`cursor-pointer border-4 ${currentVideoIndex === index ? 'border-white' : 'border-transparent'} rounded-md overflow-hidden flex-shrink-0 w-24 h-16`}
            onClick={() => handleThumbnailClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <video
              src={url}
              className="object-cover w-full h-full"
              muted
              preload="metadata"
            />
          </motion.div>
        ))}
      </div>

      {/* Main Video */}
      <div
        className="w-full h-full relative overflow-hidden"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={currentVideoIndex}
            initial={{ opacity: 0, x: dragDistance.current < 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dragDistance.current < 0 ? -50 : 50 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full flex items-center justify-center"
            style={getContainerStyles()}
          >
            {/* Thumbnails (Desktop) */}
            <div className="hidden md:flex absolute top-0 left-0 space-x-2 overflow-x-auto w-full justify-center z-10 bg-opacity-50 p-2">
              {videoUrls.map((url, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer border-4 ${currentVideoIndex === index ? 'border-white' : 'border-transparent'} rounded-md overflow-hidden flex-shrink-0 w-24 h-16`}
                  onClick={() => handleThumbnailClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <video
                    src={url}
                    className="object-cover w-full h-full"
                    muted
                    preload="metadata"
                  />
                </motion.div>
              ))}
            </div>

            {/* Video */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* {isMobile ? (
                <video
                  src={videoUrls[currentVideoIndex]}
                  onLoadedMetadata={handleVideoMetadata}
                  className="rounded-md shadow-lg object-contain max-w-full max-h-full"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />
              ) : (
                <Video
                  src={videoUrls[currentVideoIndex]}
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  style={getVideoStyles()}
                  onLoadedMetadata={handleVideoMetadata}
                />
              )} */}
              <Video
                src={videoUrls[currentVideoIndex]}
                autoPlay
                loop
                playsInline
                preload="metadata"
                // muted={isMuted}
                style={getVideoStyles()}
                onLoadedMetadata={handleVideoMetadata}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoSlider;