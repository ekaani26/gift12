import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface IntroVideoSceneProps {
  onContinue: () => void;
  videoUrl?: string;
}

export function IntroVideoScene({
  onContinue,
  videoUrl = '/video1_fast.mp4'
}: IntroVideoSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Smooth, lag-free looping video in background
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});
  }, []);

  const handleStartJourney = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    soundFx.unlock();
    soundFx.playClick();
    soundFx.playChime();

    // Short tactile delay so click sound and chime are fully heard before transition
    setTimeout(() => {
      onContinue();
    }, 160);
  };

  return (
    <div
      id="video-scene-container"
      onClick={() => {
        soundFx.unlock();
      }}
      className="relative w-full h-full max-h-full bg-neutral-950 flex items-center justify-center overflow-hidden select-none"
    >
      {/* Clean, Full-Screen Looping Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster="/poster1.jpg"
        playsInline
        webkit-playsinline="true"
        autoPlay
        loop
        muted
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ============================================================ */}
      {/* ACTION AREA: Start Journey Button */}
      {/* ============================================================ */}
      <div className="relative z-20 flex flex-col items-center justify-center p-4 text-center -translate-y-36 sm:-translate-y-44">
        <motion.button
          id="btn-start-journey"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: [1, 1.04, 1],
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: {
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
          onClick={handleStartJourney}
          onPointerDown={() => {
            soundFx.unlock();
            soundFx.playClick();
          }}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm tracking-wider uppercase border-[1.5px] border-amber-200 cursor-pointer shadow-[0_6px_24px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-95 transition-all duration-150"
        >
          {/* Subtle glowing halo ring for organic luxury pulse */}
          <div className="absolute inset-0 -m-1 rounded-full border border-amber-300/40 animate-ping opacity-30 pointer-events-none" />
          {/* Smooth slow spinning star icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="flex items-center justify-center shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
          </motion.div>
          <span className="drop-shadow-sm font-extrabold tracking-widest">Start Journey</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
}


