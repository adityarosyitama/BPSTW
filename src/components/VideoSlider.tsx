import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoSliderProps {
  videoUrls: string[];
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videoUrls }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const startX = useRef(0);
  const dragDistance = useRef(0);
  const isMobile = window.innerWidth < 768;

  const handleThumbnailClick = (index: number) => setCurrentVideoIndex(index);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      dragDistance.current = ('touches' in e ? e.touches[0].clientX : e.clientX) - startX.current;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const swipeThreshold = 50;
    if (dragDistance.current > swipeThreshold && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else if (dragDistance.current < -swipeThreshold && currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    setOrientation(videoWidth >= videoHeight ? 'landscape' : 'portrait');
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const containerStyles = {
    landscape: isMobile ? { height: '100vh', width: 'auto', maxWidth: '100vw' } : { maxHeight: '90vh', width: 'auto' },
    portrait: isMobile ? { width: '100vw', height: 'auto', maxHeight: '100vh' } : { height: '90vh', maxWidth: '50vw' },
    default: isMobile ? { width: '100vw', height: '56.25vw', maxHeight: '100vh' } : { paddingBottom: '56.25%' },
  };

  const getContainerStyles = () => ({
    ...containerStyles[orientation || 'default'],
    margin: '0 auto',
  });

  const Thumbnail = ({ index, url }: { index: number; url: string }) => (
    <motion.div
      className={`cursor-pointer border-4 ${currentVideoIndex === index ? 'border-white' : 'border-transparent'} rounded-md overflow-hidden flex-shrink-0 w-24 h-16`}
      onClick={() => handleThumbnailClick(index)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <video src={url} className="object-cover w-full h-full" muted preload="metadata" />
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden mt-2">
      <div className={`${isMobile ? 'md:hidden' : 'hidden md:flex'} flex space-x-2 overflow-x-auto w-full justify-center z-10 bg-opacity-50 p-2`}>
        {videoUrls.map((url, index) => (
          <Thumbnail key={index} index={index} url={url} />
        ))}
      </div>

      <div
        className="relative w-full h-full overflow-hidden"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideoIndex}
            initial={{ opacity: 0, x: dragDistance.current < 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dragDistance.current < 0 ? -50 : 50 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full flex items-center justify-center"
            style={getContainerStyles()}
          >
            <video
              src={videoUrls[currentVideoIndex]}
              onLoadedMetadata={handleVideoMetadata}
              className="rounded-md shadow-lg object-contain max-w-full max-h-full"
              autoPlay
              loop
              muted={isMobile ? isMuted : false}
              playsInline
              onClick={toggleMute}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoSlider;