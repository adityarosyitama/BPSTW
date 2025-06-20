import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoSliderProps {
  videoUrls: string[];
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videoUrls, isMuted, setIsMuted, isMobile }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [orientation, setOrientation] = useState<"landscape" | "portrait" | null>(null);
  const startX = useRef(0);
  const dragDistance = useRef(0);

  const handleThumbnailClick = (index: number) => {
    setCurrentVideoIndex(index);
    setIsMuted(false);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragDistance.current = 0;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
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
    setOrientation(video.videoWidth >= video.videoHeight ? "landscape" : "portrait");
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const getContainerStyles = () => {
    const desktopStyles = {
      landscape: { maxHeight: "90vh", width: "auto", margin: "0 auto" },
      portrait: { height: "90vh", maxWidth: "50vw", margin: "0 auto" },
      default: { paddingBottom: "56.25%", margin: "0 auto" },
    };

    const mobileStyles = {
      landscape: { height: "100vh", width: "auto", maxWidth: "100vw", margin: "0 auto" },
      portrait: { width: "100vw", height: "auto", maxHeight: "100vh", margin: "0 auto" },
      default: { width: "100vw", height: "56.25vw", maxHeight: "100vh", margin: "0 auto" },
    };

    return orientation
      ? isMobile
        ? mobileStyles[orientation]
        : desktopStyles[orientation]
      : isMobile
        ? mobileStyles.default
        : desktopStyles.default;
  };

  return (
    <div className="mt-2 flex h-full w-full flex-col items-center overflow-hidden" onClick={toggleMute}>
      <div className="flex w-full justify-center space-x-2 overflow-x-auto bg-opacity-50 p-2 md:hidden">
        {videoUrls.map((url, index) => (
          <motion.div
            key={index}
            className={`cursor-pointer overflow-hidden rounded-md border-4 ${
              currentVideoIndex === index ? "border-white" : "border-transparent"
            } h-16 w-24 flex-shrink-0`}
            onClick={() => handleThumbnailClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <video src={url} className="h-full w-full object-cover" muted preload="metadata" />
          </motion.div>
        ))}
      </div>

      <div
        className="relative h-full w-full overflow-hidden"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentVideoIndex}
            initial={{ opacity: 0, x: dragDistance.current < 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dragDistance.current < 0 ? -50 : 50 }}
            transition={{ duration: 0.5 }}
            className="relative flex h-full w-full items-center justify-center"
            style={getContainerStyles()}
          >
            <div className="absolute left-0 top-0 hidden w-full justify-center space-x-2 overflow-x-auto bg-opacity-50 p-2 md:flex">
              {videoUrls.map((url, index) => (
                <motion.div
                  key={index}
                  className={`cursor-pointer overflow-hidden rounded-md border-4 ${
                    currentVideoIndex === index ? "border-white" : "border-transparent"
                  } h-16 w-24 flex-shrink-0`}
                  onClick={() => handleThumbnailClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <video src={url} className="h-full w-full object-cover" muted preload="metadata" />
                </motion.div>
              ))}
            </div>

            <div className="relative flex h-full w-full items-center justify-center">
              <video
                src={videoUrls[currentVideoIndex]}
                onLoadedMetadata={handleVideoMetadata}
                className="max-h-full max-w-full rounded-md object-contain shadow-lg"
                autoPlay
                loop
                muted={isMobile ? isMuted : false}
                playsInline
                onClick={toggleMute}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoSlider;