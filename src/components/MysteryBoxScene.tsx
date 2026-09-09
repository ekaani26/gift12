import { useState, useRef, useEffect, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Film,
  Copy,
  Check,
  Tag,
  PackageCheck,
  Gift,
  ShoppingBag
} from 'lucide-react';
import { BoxState, MysteryPrize, SunsetAtmosphere } from '../types';
import { soundFx } from '../utils/audio';

const SECOND_SCREEN_VIDEO_URL = 'https://cdn.shopify.com/videos/c/o/v/3736226be57b4ff39e2b51b1e1a28b05.mp4';
const THIRD_SCREEN_VIDEO_URL = '/video3_fast.mp4';

const FIRST_TIME_BUYER_PRIZE: MysteryPrize = {
  id: 'ftb-1',
  title: 'First-Time Buyer Privilege Pass',
  tier: 'First Time Buyer',
  description: 'Special introductory offer! Enjoy 5% off your entire first purchase plus complimentary premium packaging.',
  code: 'FIRST5',
  discount: '5%',
  avatarIcon: '🎁',
  perks: [
    '5% Off First-Time Order',
    'Complimentary Premium Packaging',
    'Priority Dispatch Service'
  ],
  premiumPackaging: true
};

const BRAND_LOGO_URL = 'https://cdn.shopify.com/s/files/1/0748/5014/0446/files/Layer_x0020_1_83f4e6f8-cf11-4a6c-9d21-9bb72e6775d8.svg?v=1683268225';

interface MysteryBoxSceneProps {
  onBackToVideo?: () => void;
  bgUrl?: string;
}

export function MysteryBoxScene({
  onBackToVideo,
  bgUrl = 'https://cdn.shopify.com/s/files/1/0748/5014/0446/files/bga.png?v=1787748398'
}: MysteryBoxSceneProps) {
  const [userName, setUserName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submittedPhone, setSubmittedPhone] = useState('');
  const [boxState, setBoxState] = useState<BoxState>('idle');
  const [currentScreen, setCurrentScreen] = useState<2 | 3 | 4>(2);
  const [manualAtmosphere, setManualAtmosphere] = useState<SunsetAtmosphere | null>(null);
  const [prize, setPrize] = useState<MysteryPrize | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneErrorMsg, setPhoneErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [canClickClaim, setCanClickClaim] = useState(false);
  const screen4EnterTimestamp = useRef<number>(0);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);

  // Sunset Atmosphere Progression
  const currentAtmosphere: SunsetAtmosphere = manualAtmosphere ?? (
    currentScreen >= 3
      ? 'full'
      : boxState === 'anticipation' || boxState === 'opening'
      ? 'more'
      : 'little'
  );

  const isEndScreen = currentScreen >= 3;

  // Manage video autoplay and looping on screen 2
  useEffect(() => {
    const v2 = video2Ref.current;
    if (!v2) return;

    if (currentScreen === 2) {
      v2.loop = true;
      v2.play().catch(() => {
        v2.muted = true;
        v2.play().catch(() => {});
      });
    } else {
      v2.pause();
    }
  }, [currentScreen]);

  // Manage screen 4 appearance and protect against ghost clicks / tap bleed-through
  useEffect(() => {
    if (currentScreen === 4) {
      screen4EnterTimestamp.current = Date.now();
      setCanClickClaim(false);
      soundFx.unlock();
      const chimeTimer = setTimeout(() => {
        soundFx.playChime();
      }, 120);

      // Require at least 450ms before the user can tap "Claim & Shop"
      // to eliminate tap-through from "Want More" button
      const unlockTimer = setTimeout(() => {
        setCanClickClaim(true);
      }, 450);

      return () => {
        clearTimeout(chimeTimer);
        clearTimeout(unlockTimer);
      };
    } else {
      setCanClickClaim(false);
    }
  }, [currentScreen]);

  // Manage video autoplay and looping on screen 3 & 4
  useEffect(() => {
    const v3 = video3Ref.current;
    if (!v3) return;

    if (currentScreen === 3 || currentScreen === 4) {
      v3.play().catch(() => {
        v3.muted = true;
        v3.play().catch(() => {});
      });
    } else {
      v3.pause();
    }
  }, [currentScreen]);

  const triggerConfetti = () => {
    try {
      const count = 160;
      const defaults = { origin: { y: 0.6 }, zIndex: 9999 };
      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      };

      fire(0.25, {
        spread: 28,
        startVelocity: 45,
        colors: ['#f59e0b', '#f97316', '#fbbf24', '#ffffff']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#ffedd5', '#ea580c', '#ffd700', '#c2410c']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.92,
        scalar: 0.8,
        colors: ['#fbbf24', '#f59e0b', '#fb7185']
      });
    } catch {}
  };

  const handleEnter = (e?: FormEvent) => {
    if (e) e.preventDefault();
    soundFx.playClick();

    const trimmed = userName.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your name');
      return;
    }

    setErrorMsg('');
    setSubmittedName(trimmed);
    setManualAtmosphere(null);
    setBoxState('anticipation');
    // Play the requested "zoop" sound effect immediately when clicking open box
    soundFx.playZoop();

    setTimeout(() => {
      setBoxState('opening');
      soundFx.playOpenFanfare();
      triggerConfetti();
      setPrize(FIRST_TIME_BUYER_PRIZE);

      setTimeout(() => {
        setBoxState('revealed');
        setCurrentScreen(3);
      }, 450);
    }, 1100);
  };

  const handleWantMore = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    soundFx.unlock();

    // Validate phone number to avail discount
    const cleaned = phoneNumber.replace(/[\s\-()+]/g, '');
    if (!cleaned) {
      setPhoneErrorMsg('Please enter your phone number to avail discount');
      return;
    }
    if (!/^\d{10,15}$/.test(cleaned)) {
      setPhoneErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }

    setPhoneErrorMsg('');
    setSubmittedPhone(cleaned);
    soundFx.playClick();
    triggerConfetti();
    screen4EnterTimestamp.current = Date.now();
    setCanClickClaim(false);
    setCurrentScreen(4);
  };

  const handleBackToScreen3 = () => {
    soundFx.playClick();
    setCurrentScreen(3);
  };

  const handleReset = () => {
    soundFx.playClick();
    setBoxState('idle');
    setCurrentScreen(2);
    setUserName('');
    setSubmittedName('');
    setPhoneNumber('');
    setSubmittedPhone('');
    setPhoneErrorMsg('');
    setPrize(null);
    setManualAtmosphere(null);
    setErrorMsg('');
  };

  const handleCopyCode = () => {
    const code = prize ? prize.code : FIRST_TIME_BUYER_PRIZE.code;
    soundFx.playClick();
    fallbackCopy(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClaimAndShop = (e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Strict safeguard: Only trigger on genuine, deliberate user clicks on screen 4
    if (!canClickClaim || Date.now() - screen4EnterTimestamp.current < 450) {
      return;
    }

    soundFx.unlock();
    soundFx.playClick();
    const code = prize ? prize.code : FIRST_TIME_BUYER_PRIZE.code;
    fallbackCopy(code);
    setIsCopied(true);
    const destinationUrl = 'https://ekaani.com/';
    try {
      const win = window.open(destinationUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = destinationUrl;
      }
    } catch {
      window.location.href = destinationUrl;
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {}
  };

  return (
    <div
      id="mystery-box-scene"
      className="relative h-full max-h-full w-full flex flex-col justify-between overflow-hidden text-white select-none"
      style={{
        backgroundImage: `url('${bgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* ============================================================ */}
      {/* SCREEN 2 VIDEO: Plays continuously in loop */}
      {/* ============================================================ */}
      <video
        ref={video2Ref}
        src={SECOND_SCREEN_VIDEO_URL}
        poster="/poster2.jpg"
        playsInline
        webkit-playsinline="true"
        loop
        muted
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        onEnded={() => {
          if (video2Ref.current) {
            video2Ref.current.currentTime = 0;
            video2Ref.current.play().catch(() => {});
          }
        }}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
          currentScreen === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ============================================================ */}
      {/* SCREEN 3 & 4 LOOPING VIDEO: Seamlessly plays on 3rd & 4th screens */}
      {/* ============================================================ */}
      <video
        ref={video3Ref}
        src={THIRD_SCREEN_VIDEO_URL}
        poster="/poster3.jpg"
        playsInline
        webkit-playsinline="true"
        loop
        muted
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
          currentScreen >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Ambient Dust Motes on Screen 3 */}
      {currentScreen >= 3 && (
        <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
          <div className="absolute bottom-24 left-10 w-1.5 h-1.5 rounded-full bg-orange-400 blur-[0.5px] animate-sunset-ember opacity-70" />
          <div className="absolute bottom-36 right-12 w-1.5 h-1.5 rounded-full bg-amber-300 blur-[0.5px] animate-sunset-ember opacity-60" style={{ animationDelay: '1.4s' }} />
          <div className="absolute bottom-16 right-1/4 w-2 h-2 rounded-full bg-yellow-200 blur-[1px] animate-sunset-ember opacity-60" style={{ animationDelay: '0.8s' }} />
        </div>
      )}

      {/* ============================================================ */}
      {/* TOP HEADER: Clean Navigation without music buttons */}
      {/* ============================================================ */}
      {currentScreen === 2 && (
        <header className="relative z-20 w-full shrink-0 pt-2.5 px-3 flex items-center justify-between text-xs">
          {/* Return to Intro Video */}
          {onBackToVideo ? (
            <button
              id="btn-back-to-video"
              onClick={() => {
                soundFx.playClick();
                onBackToVideo();
              }}
              onPointerDown={() => soundFx.unlock()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-neutral-300 hover:text-white backdrop-blur-md text-[11px] font-slim active:scale-95 transition-all cursor-pointer shadow-md"
              title="Return to Intro Video"
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Intro</span>
            </button>
          ) : (
            <div className="w-12" />
          )}

          {/* Center Scene Badge */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/50 border border-white/15 backdrop-blur-md text-[10px] font-slim text-amber-300/90 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>Mystery Vault</span>
          </div>

          <div className="w-12 pointer-events-none" />
        </header>
      )}

      {currentScreen === 4 && (
        <header className="relative z-20 w-full shrink-0 pt-2.5 px-3 flex items-center justify-between text-xs">
          <button
            id="btn-back-to-screen3"
            onClick={handleBackToScreen3}
            onPointerDown={() => soundFx.unlock()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white hover:text-white backdrop-blur-md text-[11px] font-medium active:scale-95 transition-all cursor-pointer shadow-md"
            title="Back to 5% OFF Offer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-[11px] font-medium text-white shadow-sm">
            <Gift className="w-3 h-3 text-amber-400" />
            <span>Special Privilege</span>
          </div>

          <div className="w-12 pointer-events-none" />
        </header>
      )}

      {/* ============================================================ */}
      {/* MAIN CONTENT: Fitted Screen Layout (Zero Scroll) */}
      {/* ============================================================ */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-sm mx-auto flex flex-col justify-between items-center px-3 py-1.5 sm:py-2 overflow-hidden select-none">
        {/* CENTER VIEW: Screen 2 vs Screen 3 vs Screen 4 */}
        <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center py-0.5">
          <AnimatePresence mode="wait">
            {currentScreen === 2 && (
              /* SCREEN 2: Looping Video plays unobscured with input at bottom */
              <motion.div
                key="screen-2-looping-video-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex-1 min-h-0 pointer-events-none"
              />
            )}

            {currentScreen === 3 && (
              /* SCREEN 3: 5% OFF REVEAL SCREEN WITH "WANT MORE" ACTION */
              <motion.div
                key="screen-3-reveal-view"
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-1 text-center my-auto"
              >
                {/* 1. Animated Ekaani Logo */}
                <motion.div
                  id="brand-logo-animated"
                  initial={{ opacity: 0, y: -6, scale: 0.92 }}
                  animate={{
                    opacity: 1,
                    y: [0, -3, 0],
                    scale: 1,
                    filter: [
                      'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.9))',
                      'drop-shadow(0 4px 18px rgba(245, 158, 11, 0.6))',
                      'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.9))'
                    ]
                  }}
                  transition={{
                    y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                    filter: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.35 },
                    scale: { duration: 0.35 }
                  }}
                  className="flex items-center justify-center pt-1 pb-1"
                >
                  <img
                    src={BRAND_LOGO_URL}
                    alt="Ekaani"
                    referrerPolicy="no-referrer"
                    className="h-12 sm:h-14 md:h-16 w-auto max-w-[280px] sm:max-w-[320px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
                  />
                </motion.div>

                {/* 2. Privilege Badge - High Contrast */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-black/90 border border-white/40 text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-xl">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>First-Time Buyer Privilege</span>
                </div>

                {/* 3. Primary Offer: 5% OFF with solid high-contrast colors */}
                <div className="py-1">
                  <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)] leading-tight tracking-tight">
                    5% OFF
                  </h2>
                  <div className="mt-1.5 inline-block px-3.5 py-1 rounded-full bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-md">
                    Entire First Purchase
                  </div>
                  <p className="text-xs sm:text-[13px] text-white font-medium tracking-wide mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,1)] max-w-xs mx-auto">
                    Exclusive introductory discount unlocked for {submittedName || 'you'}
                  </p>
                </div>
              </motion.div>
            )}

            {currentScreen === 4 && (
              /* SCREEN 4: "WANT MORE" SCREEN - FREE PREMIUM PACKAGING ON FIRST ORDER (NO BLACK BACKGROUND ON TEXT) */
              <motion.div
                key="screen-4-want-more-view"
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="w-full flex flex-col items-center justify-center gap-2 sm:gap-2.5 px-2 text-center my-auto"
              >
                {/* 1. Animated Ekaani Logo */}
                <motion.div
                  id="brand-logo-animated-s4"
                  initial={{ opacity: 0, y: -6, scale: 0.92 }}
                  animate={{
                    opacity: 1,
                    y: [0, -3, 0],
                    scale: 1,
                    filter: [
                      'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.9))',
                      'drop-shadow(0 4px 18px rgba(245, 158, 11, 0.6))',
                      'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.9))'
                    ]
                  }}
                  transition={{
                    y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                    filter: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.35 },
                    scale: { duration: 0.35 }
                  }}
                  className="flex items-center justify-center pt-0.5 pb-0.5"
                >
                  <img
                    src={BRAND_LOGO_URL}
                    alt="Ekaani"
                    referrerPolicy="no-referrer"
                    className="h-12 sm:h-14 md:h-16 w-auto max-w-[280px] sm:max-w-[320px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
                  />
                </motion.div>

                {/* 2. Complimentary Gift Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] sm:text-[11px] font-mono font-black tracking-wider uppercase shadow-md">
                  <Gift className="w-3.5 h-3.5 text-neutral-950" />
                  <span>Complimentary Privilege</span>
                </div>

                {/* 3. Headline & Subtitle - Clean text with zero black background */}
                <div className="py-1 text-center">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
                    Free Premium Packaging
                  </h2>
                  <p className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-widest mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                    On First Order
                  </p>
                  <p className="text-xs sm:text-[13px] text-white font-medium mt-1.5 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)] max-w-xs mx-auto">
                    Enjoy our signature luxury gift packaging completely free with your first purchase.
                  </p>
                </div>

                {/* 4. Voucher Code Box with 1-Tap Copy */}
                <div className="w-full max-w-xs p-2 rounded-xl bg-black/75 border border-white/30 backdrop-blur-md flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-2 pl-2">
                    <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="text-left">
                      <span className="font-mono text-base font-black tracking-widest text-white block leading-none">
                        {FIRST_TIME_BUYER_PRIZE.code}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold tracking-wide">
                        5% OFF + Free Packaging
                      </span>
                    </div>
                  </div>

                  <button
                    id="btn-copy-promo-code-want-more"
                    onClick={handleCopyCode}
                    onPointerDown={() => soundFx.unlock()}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-white text-neutral-950 font-bold text-xs tracking-wider uppercase active:scale-95 transition-all shadow-md cursor-pointer hover:bg-neutral-100"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-950" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM ACTION AREA: Zero Scroll Footer */}
        {/* ============================================================ */}
        <footer className="w-full shrink-0 pb-1.5 pt-0.5 flex flex-col items-center justify-center">
          {currentScreen === 2 && (
            /* Screen 2 Input Form & Open Button */
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleEnter}
              className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto -translate-y-36 sm:-translate-y-44"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  id="input-user-name"
                  type="text"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  disabled={boxState === 'anticipation' || boxState === 'opening'}
                  placeholder="Enter your name..."
                  maxLength={30}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/85 border border-white/35 text-white placeholder-neutral-300 text-xs font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/50 backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.85)] disabled:opacity-50"
                  autoComplete="name"
                />
              </div>

              {errorMsg && (
                <p className="text-[11px] text-rose-300 font-medium text-center -my-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  {errorMsg}
                </p>
              )}

              <button
                id="btn-submit-mystery-name"
                type="submit"
                onPointerDown={() => soundFx.unlock()}
                disabled={boxState === 'anticipation' || boxState === 'opening'}
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-neutral-950 font-extrabold text-xs tracking-wider uppercase border border-amber-300 shadow-[0_4px_20px_rgba(245,158,11,0.55)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.75)] active:scale-[0.97] disabled:opacity-60 transition-all duration-300 cursor-pointer"
              >
                {boxState === 'anticipation' ? (
                  <>
                    <span className="w-3 h-3 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                    <span>Enter & Open Box</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {currentScreen === 3 && (
            /* SCREEN 3 ACTION: ALIGNED EXACTLY LIKE SCREEN 2 (NO FULL-WIDTH FILL) */
            <motion.form
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleWantMore}
              className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto -translate-y-36 sm:-translate-y-44"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  id="input-user-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d+\-\s()]/g, '');
                    setPhoneNumber(val);
                    if (phoneErrorMsg) setPhoneErrorMsg('');
                  }}
                  placeholder="Enter phone number to avail discount..."
                  maxLength={16}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/85 border border-white/35 text-white placeholder-neutral-300 text-xs font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/50 backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
                  autoComplete="tel"
                />
              </div>

              {phoneErrorMsg && (
                <p className="text-[11px] text-rose-300 font-semibold text-center -my-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  {phoneErrorMsg}
                </p>
              )}

              <button
                id="btn-want-more"
                type="submit"
                onPointerDown={() => soundFx.unlock()}
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-neutral-950 font-extrabold text-xs tracking-wider uppercase border border-amber-300 shadow-[0_4px_20px_rgba(245,158,11,0.55)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.75)] active:scale-[0.97] transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                <span>Want More</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-950 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-[10px] sm:text-[11px] text-white font-medium tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,1)] text-center">
                Enter phone number to avail discount & unlock perks
              </span>
            </motion.form>
          )}

          {currentScreen === 4 && (
            /* SCREEN 4 ACTION: "CLAIM & SHOP" BUTTON - ALIGNED EXACTLY LIKE SCREEN 2 & 3 */
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto -translate-y-24 sm:-translate-y-32"
            >
              <button
                id="btn-claim-and-shop"
                type="button"
                onPointerDown={() => soundFx.unlock()}
                onClick={handleClaimAndShop}
                className={`group relative inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-full bg-white text-neutral-950 font-black text-xs tracking-wider uppercase border border-white/80 shadow-[0_4px_25px_rgba(0,0,0,0.7)] hover:bg-neutral-100 active:scale-[0.97] transition-all duration-300 cursor-pointer text-center ${
                  !canClickClaim ? 'pointer-events-none opacity-90' : 'pointer-events-auto opacity-100'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-neutral-950" />
                <span>Claim & Shop</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-950 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-[10px] sm:text-[11px] text-white font-medium tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,1)] text-center">
                {isCopied ? '✓ Code FIRST5 copied to clipboard!' : 'Code FIRST5 automatically copied • Opens ekaani.com'}
              </span>
            </motion.div>
          )}
        </footer>
      </main>
    </div>
  );
}


