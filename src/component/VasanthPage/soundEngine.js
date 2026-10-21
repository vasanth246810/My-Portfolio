/**
 * Procedural Analog Audio Synthesis Engine & Lofi Stream Player
 * Features:
 * - Mathematical Math.tanh(1.6 * t) saturation distortion curve for vintage tape warmth
 * - Web Audio API oscillator nodes for zero-dependency procedural retro UI feedback
 * - Streaming ambient lofi radio endpoints (reyfm.de & isekoi-radio.com)
 */

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Generates an analog tape saturation curve using Math.tanh(1.6 * x)
function getAnalogShaper(ctx) {
  const n_samples = 256;
  const curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; i++) {
    const x = (i * 2) / n_samples - 1;
    // Mathematical Math.tanh(1.6 * t) distortion for vintage warmth
    curve[i] = Math.tanh(1.6 * x);
  }
  const shaper = ctx.createWaveShaper();
  shaper.curve = curve;
  shaper.oversample = '2x';
  return shaper;
}

export const playSound = (type) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const shaper = getAnalogShaper(ctx);

    // Route: Oscillator -> Analog Tape Saturation -> Gain Envelope -> Destination
    osc.connect(shaper);
    shaper.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'click':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'hover':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
        break;

      case 'open':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;

      case 'close':
      case 'minimise':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'theme':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.setValueAtTime(480, now + 0.05);
        osc.frequency.setValueAtTime(640, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
        break;

      case 'arrange':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.08);
        osc.frequency.linearRampToValueAtTime(420, now + 0.16);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
        break;

      case 'score':
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'fail':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'tick':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
        break;

      case 'unlock':
        // Secret easter egg chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, now); // G4
        osc.frequency.setValueAtTime(523.25, now + 0.07); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.14); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.21); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.28); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        break;

      default:
        break;
    }
  } catch (err) {
    // Autoplay policy or unsupported browser fallback
  }
};

export const setSoundMuted = (muted) => {
  soundEnabled = !muted;
};

export const isSoundEnabled = () => soundEnabled;

/* ==========================================================================
   Streaming Lofi Radio Player
   ========================================================================== */

const LOFI_STATIONS = [
  { id: 'reyfm', name: 'ReyFM Lofi (128kbps)', url: 'https://listen.reyfm.de/lofi_128kbps.mp3' },
  { id: 'isekoi', name: 'Isekoi Chill Radio', url: 'https://public.isekoi-radio.com/listen/chill/radio.mp3' }
];

let lofiAudio = null;
let currentStationIndex = 0;
let isPlaying = false;

export const toggleLofi = (onStatusChange) => {
  if (typeof window === 'undefined') return;

  if (!lofiAudio) {
    lofiAudio = new Audio(LOFI_STATIONS[currentStationIndex].url);
    lofiAudio.crossOrigin = 'anonymous';
    lofiAudio.volume = 0.4;
    lofiAudio.addEventListener('error', () => {
      // Fallback station on error
      currentStationIndex = (currentStationIndex + 1) % LOFI_STATIONS.length;
      lofiAudio.src = LOFI_STATIONS[currentStationIndex].url;
      if (isPlaying) lofiAudio.play().catch(() => {});
    });
  }

  if (isPlaying) {
    lofiAudio.pause();
    isPlaying = false;
    playSound('close');
  } else {
    lofiAudio.play()
      .then(() => {
        isPlaying = true;
        playSound('open');
      })
      .catch(() => {
        isPlaying = false;
      });
  }

  if (onStatusChange) {
    onStatusChange({
      isPlaying,
      station: LOFI_STATIONS[currentStationIndex].name
    });
  }
};

export const getLofiStatus = () => ({
  isPlaying,
  station: LOFI_STATIONS[currentStationIndex].name
});
