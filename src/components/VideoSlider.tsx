import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoSliderProps {
  videoUrls: string[];
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videoUrls }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const startX = useRef(0);
  const dragDistance = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null); // Add ref for video element

  // Detect client-side rendering and get initial screen width
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Play video when currentVideoIndex changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Reload the video to ensure the new source is applied
      videoRef.current.play().catch((error) => {
        console.error('Video playback failed:', error);
      });
    }
  }, [currentVideoIndex]);

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

    const swipeThreshold = 50;
    if (dragDistance.current > swipeThreshold && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else if (dragDistance.current < -swipeThreshold && currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const { videoWidth, videoHeight } = video;
    setOrientation(videoWidth >= videoHeight ? 'landscape' : 'portrait');
  };

  // Dynamic container styles based on orientation and screen size
  const getContainerStyles = () => {
    // Desktop styles (md and above)
    const desktopStyles = {
      landscape: {
        maxHeight: '90vh',
        width: 'auto',
        margin: '0 auto',
      },
      portrait: {
        height: '90vh',
        maxWidth: '50vw',
        margin: '0 auto',
      },
      default: {
        paddingBottom: '56.25%',
        margin: '0 auto',
      },
    };

    // Mobile styles
    const mobileStyles = {
      landscape: {
        height: '100vh',
        width: 'auto',
        maxWidth: '100vw',
        margin: '0 auto',
      },
      portrait: {
        width: '100vw',
        height: 'auto',
        maxHeight: '100vh',
        margin: '0 auto',
      },
      default: {
        width: '100vw',
        height: '56.25vw',
        maxHeight: '100vh',
        margin: '0 auto',
      },
    };

    // Use mobile styles as default for SSR (when screenWidth is null)
    if (!isClient || screenWidth === null) {
      return mobileStyles.default;
    }

    // Return styles based on orientation and screen width
    if (orientation === 'landscape') {
      return screenWidth >= 768 ? desktopStyles.landscape : mobileStyles.landscape;
    } else if (orientation === 'portrait') {
      return screenWidth >= 768 ? desktopStyles.portrait : mobileStyles.portrait;
    }
    return screenWidth >= 768 ? desktopStyles.default : mobileStyles.default;
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden mt-2">
      {/* Thumbnails (Mobile) */}
      <div className="md:hidden flex space-x-2 overflow-x-auto w-full justify-center z-10 bg-opacity-50 p-2">
        {videoUrls.map((url, index) => (
          <motion.div
            key={index}
            className={`cursor-pointer border-4 ${currentVideoIndex === index ? 'border-white' : 'border-transparent'
              } rounded-md overflow-hidden flex-shrink-0 w-24 h-16`}
            onClick={() => handleThumbnailClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <video
              src={url}
              className="object-cover w-full h-full"
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
            {/* Thumbnails (Desktop) */}
            <div className="hidden md:flex absolute top-0 left-0 space-x-2 overflow-x-auto w-full justify-center z-10 bg-opacity-50 p-2">
              {videoUrls.map((url, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer border-4 ${currentVideoIndex === index ? 'border-white' : 'border-transparent'
                    } rounded-md overflow-hidden flex-shrink-0 w-24 h-16`}
                  onClick={() => handleThumbnailClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <video
                    src={url}
                    className="object-cover w-full h-full"
                    preload="metadata"
                  />
                </motion.div>
              ))}
            </div>

            {/* Video */}
            <video
              ref={videoRef} // Attach ref to video element
              width="100%"
              loop
              playsInline // Keep this to ensure mobile compatibility
              onLoadedMetadata={handleVideoMetadata}
              className="rounded-md shadow-lg object-contain max-w-full max-h-full"
            >
              <source src={videoUrls[currentVideoIndex]} type="video/webm" />
              <p>Browser Anda tidak mendukung elemen video.</p>
            </video>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoSlider;