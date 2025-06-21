import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SplashScreenProps {
    logoSrc: string;
    duration?: number; // Duration in seconds before fading
    onFadeComplete?: () => void; // Callback for when fade-out completes
}

const SplashScreen: React.FC<SplashScreenProps> = ({
    logoSrc,
    duration = 3, // Default duration of 3 seconds
    onFadeComplete,
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Check if splash screen has been shown before
        const hasSeenSplash = localStorage.getItem('hasSeenSplash');
        if (!hasSeenSplash) {
            setVisible(true); // Show splash screen if not seen
        } else if (onFadeComplete) {
            onFadeComplete(); // Skip splash screen and trigger callback
        }
    }, [onFadeComplete]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
                // Set flag in localStorage after splash screen fades out
                localStorage.setItem('hasSeenSplash', 'true');
            }, duration * 1000);

            return () => clearTimeout(timer);
        }
    }, [visible, duration]);

    useEffect(() => {
        if (!visible && onFadeComplete) {
            const fadeOutTimer = setTimeout(() => {
                onFadeComplete(); // Call the callback when fade-out is complete
            }, 500); // Allow time for fade-out animation

            return () => clearTimeout(fadeOutTimer);
        }
    }, [visible, onFadeComplete]);

    if (!visible) {
        return null; // Don't render the splash screen if not visible
    }
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 3 }} // Fade-out duration
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#777B7E', // Or your desired background color
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999, // Ensure it's on top
            }}
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1], // Scale from 1 to 1.2 and back to 1
                    transition: {
                        duration: 1.5, // Duration of one pulse cycle
                        repeat: Infinity, // Repeat indefinitely
                        ease: 'easeInOut', // Smooth easing
                    },
                }}
            >
                <Image
                    src={logoSrc}
                    alt="App Logo"
                    width={200} // Replace with actual width in pixels
                    height={100} // Replace with actual height in pixels
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;