import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Monitor, Volume2, VolumeX } from 'lucide-react';
import { IntroVideoScene } from './components/IntroVideoScene';
import { MysteryBoxScene } from './components/MysteryBoxScene';
import { soundFx } from './utils/audio';
import { Scene } from './types';

const VIDEO_URL = '/video1_fast.mp4';
const BG_URL = 'https://cdn.shopify.com/s/files/1/0748/5014/0446/files/bga.png?v=1787748398';
const GAMIFICATION_MUSIC_URL = '/gamification_music.mp3';

export default function App() {
  const [currentScene, setCurrentScene] = useState<Scene>('video');
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  // Audio reference for gamification soundtrack
  const gamificationAudioRef = useRef<HTMLAudioElement>(null);

  // Manage Background Music:
  // Plays smoothly on the Intro Screen (Screen 1) and continues across Mystery Box (Screens 2, 3, 4)
  useEffect(() => {
    const audio = gamificationAudioRef.current;
    if (!audio) return;

    audio.volume = 0.65;
    audio.muted = isMuted;

    const startAudio = () => {
      if (audio && !isMuted) {
        audio.play().catch(() => {});
      }
    };

    // 1. Try immediate playback
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // 2. If browser autoplay policy requires user gesture,
        // start playback on the very first touch/click anywhere
        const onFirstInteraction = () => {
          soundFx.unlock();
          startAudio();
          window.removeEventListener('pointerdown', onFirstInteraction);
          window.removeEventListener('touchstart', onFirstInteraction);
          window.removeEventListener('click', onFirstInteraction);
          window.removeEventListener('keydown', onFirstInteraction);
        };

        window.addEventListener('pointerdown', onFirstInteraction, { passive: true, once: true });
        window.addEventListener('touchstart', onFirstInteraction, { passive: true, once: true });
        window.addEventListener('click', onFirstInteraction, { passive: true, once: true });
        window.addEventListener('keydown', onFirstInteraction, { passive: true, once: true });
      });
    }
  }, [isMuted]);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    soundFx.unlock();
    soundFx.playClick();
    const audio = gamificationAudioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const handleStartMysteryBox = () => {
    soundFx.unlock();
    setCurrentScene('mystery-box');
    const audio = gamificationAudioRef.current;
    if (audio && !isMuted) {
      audio.volume = 0.65;
      audio.play().catch(() => {});
    }
  };

  const handleBackToVideo = () => {
    soundFx.playClick();
    setCurrentScene('video');
    const audio = gamificationAudioRef.current;
    if (audio && !isMuted && audio.paused) {
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="relative h-[100dvh] w-full bg-neutral-950 text-white flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Dedicated Gamification Soundtrack (WhatsApp Audio) */}
      <audio
        ref={gamificationAudioRef}
        src={GAMIFICATION_MUSIC_URL}
        loop
        preload="auto"
        className="hidden pointer-events-none"
      />

      {/* Top Device View Toggle for Desktop Viewers */}
      <div className="hidden lg:flex fixed top-3 right-4 z-50 items-center gap-1.5 p-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md shadow-xl text-xs font-slim">
        <button
          id="btn-toggle-fluid-view"
          onClick={() => {
            soundFx.playClick();
            setDeviceFrameMode(false);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
            !deviceFrameMode
              ? 'bg-amber-500 text-neutral-950 font-medium shadow-md'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Monitor className="w-3 h-3" />
          <span>Fluid View</span>
        </button>
        <button
          id="btn-toggle-frame-view"
          onClick={() => {
            soundFx.playClick();
            setDeviceFrameMode(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
            deviceFrameMode
              ? 'bg-amber-500 text-neutral-950 font-medium shadow-md'
              : 'text-neutral-300 hover:text-white'
          }`}
        >
          <Smartphone className="w-3 h-3" />
          <span>Device Frame</span>
        </button>
      </div>

      {/* Main Container Wrapper - Full View without screen cropping */}
      <div
        className={`w-full h-full transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center ${
          deviceFrameMode
            ? 'max-w-[420px] h-[94vh] max-h-[880px] my-auto rounded-[36px] border-[6px] border-neutral-800 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.2)]'
            : 'max-w-md w-full'
        }`}
      >
        {/* Device Notch / Island when in deviceFrameMode */}
        {deviceFrameMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-950 rounded-full z-50 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 rounded-full bg-neutral-900 mr-2 border border-neutral-800" />
            <div className="w-2 h-2 rounded-full bg-blue-950/60" />
          </div>
        )}

        {/* Instant Zero-Lag Screen Switching: Both scenes are primed in DOM for instantaneous playback */}
        <div className="relative w-full h-full max-h-full overflow-hidden">
          {/* Floating Sound Mute/Unmute Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md text-[10px] font-medium shadow-lg hover:bg-black/80 active:scale-95 transition-all cursor-pointer"
            title={isMuted ? 'Turn Music On' : 'Mute Music'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3 h-3 text-neutral-400" />
                <span className="text-neutral-400 tracking-wider uppercase text-[9px]">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
                <span className="text-amber-300 tracking-wider uppercase text-[9px]">Music</span>
              </>
            )}
          </button>

          {/* Screen 1: Intro Video Scene */}
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              currentScene === 'video'
                ? 'opacity-100 z-10 pointer-events-auto'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <IntroVideoScene
              videoUrl={VIDEO_URL}
              onContinue={handleStartMysteryBox}
            />
          </div>

          {/* Screen 2-4: Mystery Box Gamification Scene */}
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              currentScene === 'mystery-box'
                ? 'opacity-100 z-10 pointer-events-auto'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <MysteryBoxScene
              bgUrl={BG_URL}
              onBackToVideo={handleBackToVideo}
            />
          </div>
        </div>
      </div>

    </div>
  );
}

