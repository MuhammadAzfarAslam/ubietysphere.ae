"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DoorTransition from "@/components/transitions/DoorTransition";

const ExplorePage = () => {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  const handleBackToHome = (e) => {
    e.preventDefault();
    setIsClosing(true);
    // Navigate after door closing animation
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };
  // Generate random particles
  const particles = Array.from({ length: 38 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 6 + 4, // 4-10px
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15, // 15-25 seconds
    color: Math.random() > 0.5 ? 'rgba(147,51,234,0.8)' : 'rgba(59,130,246,0.8)', // purple or blue
  }));

  // Wind sway animation variants
  const swayVariant1 = {
    animate: {
      x: [-5, 5, -5],
      y: [-3, 3, -3],
      rotate: [-2, 2, -2],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const swayVariant2 = {
    animate: {
      x: [6, -6, 6],
      y: [-4, 4, -4],
      rotate: [3, -3, 3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const swayVariant3 = {
    animate: {
      x: [-4, 4, -4],
      y: [-5, 3, -5],
      rotate: [-3, 3, -3],
      transition: {
        duration: 5.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const swayVariant4 = {
    animate: {
      x: [-5, 5, -5],
      y: [-6, 4, -6],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const flowers = [
    {
      name: "purple-top-left",
      src: "/assets/images/avatar/purple-flower-transparent-1.png",
      position: "top-[8%] left-[20%]",
      size: "w-32 h-32 md:w-40 md:h-40",
      variant: swayVariant1,
      shadow: "drop-shadow-[0_0_20px_rgba(147,51,234,0.6)]",
      link: "/services/yoga",
      label: "Yoga",
    },
    {
      name: "purple-middle-right",
      src: "/assets/images/avatar/purple-flower-transparent-1.png",
      position: "top-[58%] right-[32%]",
      size: "w-40 h-40 md:w-52 md:h-52",
      variant: swayVariant4,
      shadow: "drop-shadow-[0_0_20px_rgba(147,51,234,0.6)]",
      link: "/services/meditation",
      label: "Meditation",
    },
    {
      name: "purple-bottom-left",
      src: "/assets/images/avatar/purple-flower-transparent-1.png",
      position: "top-[65%] left-[15%]",
      size: "w-32 h-32 md:w-44 md:h-44",
      variant: swayVariant1,
      shadow: "drop-shadow-[0_0_18px_rgba(147,51,234,0.5)]",
      link: "/services/sound-therapy",
      label: "Sound Therapy",
    },
    {
      name: "blue-bottom-right",
      src: "/assets/images/avatar/blue-flower-transparent-1.png",
      position: "top-[78%] right-[10%]",
      size: "w-36 h-36 md:w-48 md:h-48",
      variant: swayVariant2,
      shadow: "drop-shadow-[0_0_18px_rgba(59,130,246,0.5)]",
      link: "/services/breathwork",
      label: "Breathwork",
    },
    // {
    //   name: "purple-center-left",
    //   src: "/assets/images/avatar/purple-flower-transparent-1.png",
    //   position: "top-[50%] left-[20%]",
    //   size: "w-24 h-24 md:w-32 md:h-32",
    //   variant: swayVariant3,
    //   shadow: "drop-shadow-[0_0_15px_rgba(147,51,234,0.4)]",
    //   hidden: "hidden md:block",
    // },
    // {
    //   name: "blue-center-right",
    //   src: "/assets/images/avatar/blue-flower-transparent-1.png",
    //   position: "top-[55%] right-[25%]",
    //   size: "w-28 h-28 md:w-36 md:h-36",
    //   variant: swayVariant4,
    //   shadow: "drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]",
    //   hidden: "hidden md:block",
    // },
  ];

  return (
    <>
    <DoorTransition>
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Jungle Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/images/avatar/main-parallax-1.png"
          alt="Jungle Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Floating Glowing Particles */}
      <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `
                0 0 ${particle.size * 2}px ${particle.color},
                0 0 ${particle.size * 4}px ${particle.color},
                0 0 ${particle.size * 6}px ${particle.color}
              `,
              filter: `blur(0.5px)`,
            }}
            animate={{
              y: [typeof window !== 'undefined' ? window.innerHeight + 50 : 1000, -50],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            initial={{ y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000 }}
          />
        ))}
      </div>

      {/* Animated Flowers */}
      <div className="fixed inset-0 z-10">
        {flowers.map((flower, index) => (
          <Link href={flower.link} key={index}>
            <motion.div
              className={`flower-${flower.name} absolute ${flower.position} ${flower.size} ${flower.hidden || ""} cursor-pointer group`}
              variants={flower.variant}
              animate="animate"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <Image
                src={flower.src}
                alt={flower.label}
                fill
                className={`object-contain ${flower.shadow}`}
              />
              {/* Label tooltip */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold whitespace-nowrap border border-purple-400/50">
                  {flower.label}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-[0_0_40px_rgba(147,51,234,0.8)] text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Explore Wellness
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-blue-200 mb-12 drop-shadow-[0_0_20px_rgba(59,130,246,0.7)] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Discover holistic healing in nature
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto"
        >
          <button
            onClick={handleBackToHome}
            className="inline-block px-8 py-4 bg-purple-600/40 backdrop-blur-md border-2 border-purple-400/50 rounded-full text-white text-lg font-semibold hover:bg-purple-500/50 hover:border-purple-300 transition-all duration-300 drop-shadow-[0_0_30px_rgba(147,51,234,0.6)] cursor-pointer"
          >
            ← Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
    </DoorTransition>

    {/* Closing Door Animation */}
    <AnimatePresence>
      {isClosing && (
        <>
          {/* Left Door */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
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
                key={`left-close-${i}`}
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
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
                key={`right-close-${i}`}
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
            initial={{ opacity: 0, scale: 3 }}
            animate={{ opacity: 1, scale: 0 }}
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
    </>
  );
};

export default ExplorePage;
