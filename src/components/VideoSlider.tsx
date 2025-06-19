import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoSliderProps {
  videoUrls: string[];
  initialVideoIndex?: number;
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videoUrls, initialVideoIndex = 0 }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Track muted state
  const startX = useRef(0);
  const dragDistance = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Client-side initialization
  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Attempt unmuted playback, fallback to muted if blocked
  useEffect(() => {
    if (!videoRef.current || !isClient) return;

    const video = videoRef.current;
    video.muted = false; // Start unmuted
    setIsMuted(false);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Unmuted autoplay failed:', error);
        // Fallback to muted playback
        video.muted = true;
        setIsMuted(true);
        video.play().catch((mutedError) => {
          console.error('Muted autoplay also failed:', mutedError);
        });
      });
    }
  }, [currentVideoIndex, isClient]);

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

    const swipeThreshold = screenWidth ? screenWidth * 0.1 : 50;
    if (dragDistance.current > swipeThreshold && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else if (dragDistance.current < -swipeThreshold && currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isClient) return; // Skip during SSR
    const video = e.currentTarget;
    const { videoWidth, videoHeight } = video;
    setOrientation(videoWidth >= videoHeight ? 'landscape' : 'portrait');
  };

  const getContainerStyles = () => {
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

    if (!isClient || screenWidth === null) {
      return mobileStyles.default;
    }

    if (orientation === 'landscape') {
      return screenWidth >= 768 ? desktopStyles.landscape : mobileStyles.landscape;
    } else if (orientation === 'portrait') {
      return screenWidth >= 768 ? desktopStyles.portrait : mobileStyles.portrait;
    }
    return screenWidth >= 768 ? desktopStyles.default : mobileStyles.default;
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden mt-2">
      <div className="md:hidden flex space-x-2 overflow-x-auto w-full justify-center z-10 bg-opacity-50 p-2">
        {videoUrls.map((url, index) => (
          <motion.div
            key={index}
            className={`cursor-pointer border-4 ${currentVideoIndex === index ? 'border-white' : 'border-transparent'} rounded-md overflow-hidden flex-shrink-0 w-24 h-16`}
            onClick={() => handleThumbnailClick(index)}
            whileHover={{ scale: isClient ? 1.05 : 1 }} // Disable hover during SSR
            whileTap={{ scale: isClient ? 0.95 : 1 }}
            role="button"
            aria-label={`Select video ${index + 1}`}
          >
            <video
              src={url}
              className="object-cover w-full h-full"
              preload="metadata"
              muted // Thumbnails are always muted
            />
          </motion.div>
        ))}
      </div>
      <div
        className="w-full h-full relative overflow-hidden"
        onMouseDown={isClient ? handleDragStart : undefined}
        onMouseMove={isClient ? handleDragMove : undefined}
        onMouseUp={isClient ? handleDragEnd : undefined}
        onMouseLeave={isClient ? handleDragEnd : undefined}
        onTouchStart={isClient ? handleDragStart : undefined}
        onTouchMove={isClient ? handleDragMove : undefined}
        onTouchEnd={isClient ? handleDragEnd : undefined}
        role="region"
        aria-label="Video carousel"
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
            <div className="hidden md:flex absolute top-0 left-0 space-x-2 overflow-x-auto w-full justify-center z-10 bg-opacity-50 p-2">
              {videoUrls.map((url, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer border-4 ${currentVideoIndex === index ? 'border-white' : 'border-transparent'} rounded-md overflow-hidden flex-shrink-0 w-24 h-16`}
                  onClick={() => handleThumbnailClick(index)}
                  whileHover={{ scale: isClient ? 1.05 : 1 }}
                  whileTap={{ scale: isClient ? 0.95 : 1 }}
                  role="button"
                  aria-label={`Select video ${index + 1}`}
                >
                  <video
                    src={url}
                    className="object-cover w-full h-full"
                    preload="metadata"
                    muted
                  />
                </motion.div>
              ))}
            </div>
            <video
              ref={videoRef}
              width="100%"
              autoPlay={isClient} // Enable autoPlay only on client
              muted={isMuted} // Dynamic muted state
              loop
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