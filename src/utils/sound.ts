/**
 * Synthesizes a realistic paper rustling/page-turn sound using the Web Audio API.
 * This runs completely client-side, offline, with zero network overhead or dependencies.
 */
let audioCtx: AudioContext | null = null;

export function playPageTurnSound() {
  try {
    // Initialize AudioContext on first interaction
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const duration = 0.4; // seconds
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate soft pink/white-ish noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Filter white noise to create pink noise (softer, warmer sound)
      lastOut = 0.99 * lastOut + 0.01 * white;
      data[i] = lastOut;
    }

    // Create Audio Nodes
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    // Start filter at high frequency and sweep down to mimic the page friction
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + duration);
    filter.Q.setValueAtTime(3.0, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    // Fade in quickly, then fade out smoothly
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.06);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    // Connect nodes
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start playback
    noiseSource.start();
    noiseSource.stop(audioCtx.currentTime + duration);
  } catch (error) {
    console.warn('Audio synthesis failed (Web Audio API might be restricted by user gesture or browser policy):', error);
  }
}
