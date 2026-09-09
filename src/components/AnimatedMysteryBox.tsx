import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gift, Lock, Star } from 'lucide-react';
import { BoxState } from '../types';

interface AnimatedMysteryBoxProps {
  state: BoxState;
  userName?: string;
  isCompact?: boolean;
  onBoxClick?: () => void;
}

export function AnimatedMysteryBox({
  state,
  isCompact = false,
  onBoxClick
}: AnimatedMysteryBoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Responsive sizing to guarantee zero scrolling on any screen height
  const boxDimensionClass = isCompact || state === 'revealed'
    ? 'w-32 h-32 sm:w-36 sm:h-36'
    : 'w-40 h-40 sm:w-44 sm:h-44';

  return (
    <div
      id="mystery-box-container"
      className={`relative mx-auto flex items-center justify-center perspective-1000 select-none cursor-pointer transition-all duration-500 ${
        state === 'revealed' ? 'h-[150px] sm:h-[170px]' : 'h-[200px] sm:h-[230px]'
      }`}
      onClick={onBoxClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Aura / Sunset Glow Radiance */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
          state === 'anticipation'
            ? 'bg-orange-500/70 scale-125 animate-pulse'
            : state === 'opening' || state === 'revealed'
            ? 'bg-amber-400/50 scale-130'
            : isHovered
            ? 'bg-amber-500/40 scale-110'
            : 'bg-amber-600/30 scale-95'
        }`}
      />

      {/* Rotating Sunset Light Rays when opening or revealed */}
      {(state === 'opening' || state === 'revealed') && (
        <div className="absolute -inset-10 pointer-events-none flex items-center justify-center opacity-85 animate-spin-rays">
          <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(251,191,36,0.55)_0deg,transparent_25deg,rgba(249,115,22,0.6)_50deg,transparent_75deg,rgba(251,191,36,0.55)_100deg,transparent_125deg,rgba(249,115,22,0.6)_150deg,transparent_175deg,rgba(251,191,36,0.55)_200deg,transparent_225deg,rgba(249,115,22,0.6)_250deg,transparent_275deg,rgba(251,191,36,0.55)_300deg,transparent_325deg,rgba(249,115,22,0.6)_350deg,transparent_360deg)] rounded-full blur-sm" />
        </div>
      )}

      {/* Sunset Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [-5, 5, -5], opacity: [0.4, 1, 0.4], scale: [0.85, 1.2, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-2 left-2 text-amber-300"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <motion.div
          animate={{ y: [5, -5, 5], opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}
          className="absolute top-3 right-3 text-yellow-300"
        >
          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
        </motion.div>
      </div>

      {/* 3D Box Physical Container */}
      <div
        className={`relative transition-all duration-500 transform-style-3d ${boxDimensionClass} ${
          state === 'idle' ? 'animate-float-slow' : ''
        } ${state === 'anticipation' ? 'animate-shake-violent scale-105' : ''}`}
      >
        {/* Soft ground shadow */}
        <div
          className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-36 h-6 bg-black/75 rounded-full blur-md transition-all duration-500 ${
            state === 'anticipation' ? 'scale-110 opacity-90' : 'opacity-65'
          }`}
        />

        {/* 3D Mystery Box Body */}
        <div className="relative w-full h-full">
          {/* Box Bottom Base container */}
          <div className="absolute inset-x-1.5 bottom-0 h-28 sm:h-32 rounded-2xl bg-gradient-to-b from-amber-950 via-neutral-900 to-black border-2 border-amber-500/70 shadow-[inset_0_0_20px_rgba(245,158,11,0.35),0_10px_25px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Inner Sunset Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(249,115,22,0.35),transparent_70%)]" />

            {/* Vertical Golden-Orange Center Ribbon */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 sm:w-7 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center">
              <div className="w-1 h-full bg-yellow-100/50" />
            </div>

            {/* Horizontal Golden-Orange Ribbon */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-6 sm:h-7 bg-gradient-to-b from-amber-600 via-yellow-300 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center">
              <div className="h-1 w-full bg-yellow-100/50" />
            </div>

            {/* Golden Lock Emblem in the Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 p-0.5 shadow-[0_0_18px_rgba(245,158,11,0.85)] flex items-center justify-center z-10">
              <div className="w-full h-full rounded-full bg-neutral-950 flex flex-col items-center justify-center border border-amber-400/70">
                {state === 'opening' || state === 'revealed' ? (
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-300" />
                )}
              </div>
            </div>

            {/* Corner Metal Accents */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

            {/* Radiant Sunset Light Column poured from opened interior */}
            {(state === 'opening' || state === 'revealed') && (
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/30 via-amber-400/50 to-yellow-200/80 animate-pulse pointer-events-none" />
            )}
          </div>

          {/* 3D Hinged Lid with Sunset Rim */}
          <motion.div
            animate={
              state === 'opening' || state === 'revealed'
                ? { y: -38, rotateX: -60, scale: 1.05 }
                : { y: 0, rotateX: 0, scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 190, damping: 15 }}
            className="absolute top-4 sm:top-5 inset-x-0 h-12 sm:h-13 origin-bottom z-30 transform-style-3d cursor-pointer"
          >
            {/* Lid Outer Shell */}
            <div className="w-full h-full rounded-2xl bg-gradient-to-b from-amber-500 via-orange-700 to-amber-950 border-2 border-yellow-300/90 shadow-[0_-4px_22px_rgba(245,158,11,0.6)] relative overflow-hidden flex items-center justify-center">
              {/* Sunset Top Specular Glint */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.45),transparent_60%)]" />

              {/* Vertical Ribbon Cap */}
              <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-6 sm:w-7 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 shadow-md" />

              {/* Mystery Box Top Emblem */}
              <div className="relative z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-950/80 border border-amber-300 text-amber-300 font-extrabold text-[9px] uppercase tracking-wider shadow-md">
                <Gift className="w-3 h-3 text-amber-400" />
                <span>MYSTERY BOX</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

