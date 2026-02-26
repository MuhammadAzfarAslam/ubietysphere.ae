"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const DoorTransition = ({ children }) => {
  const [showDoors, setShowDoors] = useState(true);

  useEffect(() => {
    // Hide doors after animation completes
    const timer = setTimeout(() => {
      setShowDoors(false);
    }, 2000); // 2 seconds for full animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showDoors && (
          <>
            {/* Left Door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 1.5,
                ease: [0.43, 0.13, 0.23, 0.96],
                delay: 0.3,
              }}
              className="fixed inset-y-0 left-0 w-1/2 z-[9999] bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 shadow-[0_0_100px_rgba(138,43,226,0.8)]"
            >
              {/* Door Details */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-32 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full shadow-[0_0_30px_rgba(138,43,226,0.9)] mr-8" />
              </div>

              {/* Glowing Edge */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-purple-300 to-transparent shadow-[0_0_20px_rgba(167,139,250,0.9)]" />

              {/* Mystical Particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`left-${i}`}
                  className="absolute w-1 h-1 bg-purple-300 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>

            {/* Right Door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              exit={{ x: "100%" }}
              transition={{
                duration: 1.5,
                ease: [0.43, 0.13, 0.23, 0.96],
                delay: 0.3,
              }}
              className="fixed inset-y-0 right-0 w-1/2 z-[9999] bg-gradient-to-l from-blue-900 via-blue-800 to-blue-900 shadow-[0_0_100px_rgba(59,130,246,0.8)]"
            >
              {/* Door Details */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-32 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.9)] ml-8" />
              </div>

              {/* Glowing Edge */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-300 to-transparent shadow-[0_0_20px_rgba(147,197,253,0.9)]" />

              {/* Mystical Particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`right-${i}`}
                  className="absolute w-1 h-1 bg-blue-300 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    right: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>

            {/* Center Glow Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 3 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: 0.5,
              }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-[9998]"
            >
              <div className="absolute inset-0 bg-gradient-radial from-purple-400 via-blue-400 to-transparent blur-3xl opacity-50" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default DoorTransition;
