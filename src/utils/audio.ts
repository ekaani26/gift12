// Web Audio API sound manager & interactive sound effects
// Provides interactive audio effects including the "zoop" box opening effect, clicks, chimes, and fanfare.

const CLICK_AUDIO_DATA_URI =
  "data:audio/wav;base64,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";

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastClickTime: number = 0;
  private clickAudio: HTMLAudioElement | null = null;
  private chimeAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.clickAudio = new Audio(CLICK_AUDIO_DATA_URI);
        this.clickAudio.volume = 1.0;
        this.clickAudio.preload = 'auto';

        this.chimeAudio = new Audio('/reward_chime.wav');
        this.chimeAudio.volume = 0.95;
        this.chimeAudio.preload = 'auto';
      } catch {}

      const unlock = () => {
        this.unlock();
      };
      window.addEventListener('pointerdown', unlock, { passive: true, once: true });
      window.addEventListener('touchstart', unlock, { passive: true, once: true });
      window.addEventListener('click', unlock, { passive: true, once: true });
    }
  }

  public unlock() {
    try {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.clickAudio) {
        // Pre-warm HTML5 audio element so iOS allows synchronous playback
        this.clickAudio.load();
      }
      if (this.chimeAudio) {
        this.chimeAudio.load();
      }
    } catch {}
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public startPeacockMusic() {
    // Background music is handled via user-provided audio in IntroVideoScene
  }

  public stopPeacockMusic() {
    // No-op
  }

  // ========================================================================
  // INTERACTIVE SOUND EFFECTS
  // ========================================================================

  /**
   * Play the requested "ZOOP" sound effect when clicking to open the mystery box.
   * Features a snappy, rubbery upward frequency sweep (160Hz -> 1550Hz) with resonant
   * bandpass modulation and harmonic body for a distinct, energetic comic/arcade "zoop".
   */
  public playZoop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Primary "Zoop" Upward Pitch Bend
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      // Fast upward swoop "ZOOOOP"
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(1550, now + 0.22);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.32);

      // Resonant bandpass filter sweeps upward with the vocal "ooo-p" formant
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(4.2, now);
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(1750, now + 0.22);
      filter.frequency.exponentialRampToValueAtTime(1250, now + 0.32);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.38, now + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(ctx.destination);

      // 2. Harmonic body for comic richness
      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harm.type = 'triangle';
      harm.frequency.setValueAtTime(320, now);
      harm.frequency.exponentialRampToValueAtTime(2400, now + 0.22);
      harm.frequency.exponentialRampToValueAtTime(1600, now + 0.32);

      harmGain.gain.setValueAtTime(0.001, now);
      harmGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      harm.connect(harmGain);
      harmGain.connect(ctx.destination);

      osc.start(now);
      harm.start(now);
      osc.stop(now + 0.35);
      harm.stop(now + 0.35);
    } catch {}
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      const nowMs = Date.now();
      // Prevent rapid double-triggering within 40ms
      if (nowMs - this.lastClickTime < 40) return;
      this.lastClickTime = nowMs;

      // 1. Instant HTML5 audio playback (guaranteed on iOS & Android user interaction)
      if (this.clickAudio) {
        try {
          this.clickAudio.currentTime = 0;
          this.clickAudio.play().catch(() => {});
        } catch {}
      }

      // 2. Web Audio synthesis layer for rich acoustic click
      const ctx = this.getContext();
      if (ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const now = ctx.currentTime;

        // Crisp high transient click/pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);

        // Tactile body tap for solid button press feedback
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(440, now);
        subOsc.frequency.exponentialRampToValueAtTime(110, now + 0.075);

        subGain.gain.setValueAtTime(0.35, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);

        subOsc.start(now);
        subOsc.stop(now + 0.075);
      }
    } catch {}
  }

  public playRumble() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.9);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {}
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      // 1. Instant HTML5 audio playback of reward chime
      if (this.chimeAudio) {
        try {
          this.chimeAudio.currentTime = 0;
          this.chimeAudio.play().catch(() => {});
        } catch {}
      }

      // 2. Synthesized Web Audio chime layer for rich acoustic sparkle
      const ctx = this.getContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, index) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = ctx.currentTime + index * 0.07;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.24, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.9);
      });
    } catch {}
  }

  public playOpenFanfare() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      freqs.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = ctx.currentTime + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.4);
      });
    } catch {}
  }
}

export const soundFx = new SoundManager();
