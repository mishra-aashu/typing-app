/**
 * TypeForge Mechanical Switch Sound Engine (Synthesized via Web Audio API)
 * Zero external audio latency, works completely offline, 100% reliable.
 */
class MechanicalAudioEngine {
  constructor() {
    this.ctx = null;
    this.switchType = localStorage.getItem('typeforge_switch') || 'blue'; // 'blue', 'brown', 'red', 'off'
    this.volume = parseFloat(localStorage.getItem('typeforge_volume') || '0.35');
    this.initContext();
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSwitchType(type) {
    this.switchType = type;
    localStorage.setItem('typeforge_switch', type);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('typeforge_volume', this.volume);
  }

  playKeypress(isSpace = false) {
    if (this.switchType === 'off' || this.volume <= 0.01) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (this.switchType) {
      case 'blue': // Clicky Cherry MX Blue
        this.playClickySwitch(now, isSpace);
        break;
      case 'brown': // Tactile Cherry MX Brown
        this.playTactileSwitch(now, isSpace);
        break;
      case 'red': // Linear Cherry MX Red
        this.playLinearSwitch(now, isSpace);
        break;
      default:
        this.playClickySwitch(now, isSpace);
    }
  }

  // Crisp high click + sharp bottom out
  playClickySwitch(now, isSpace) {
    const baseFreq = isSpace ? 280 : 380 + Math.random() * 80;

    // High click snap
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(baseFreq * 4, now);
    clickOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.015);

    clickGain.gain.setValueAtTime(this.volume * 0.7, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.02);

    // Deep housing clack
    const clackOsc = this.ctx.createOscillator();
    const clackGain = this.ctx.createGain();
    clackOsc.type = 'sine';
    clackOsc.frequency.setValueAtTime(baseFreq, now + 0.004);
    clackOsc.frequency.exponentialRampToValueAtTime(80, now + 0.045);

    clackGain.gain.setValueAtTime(this.volume * 0.9, now + 0.004);
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    clackOsc.connect(clackGain);
    clackGain.connect(this.ctx.destination);

    clackOsc.start(now + 0.004);
    clackOsc.stop(now + 0.055);
  }

  // Subtle bump without sharp click
  playTactileSwitch(now, isSpace) {
    const baseFreq = isSpace ? 220 : 320 + Math.random() * 40;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Smooth thocky linear switch
  playLinearSwitch(now, isSpace) {
    const baseFreq = isSpace ? 180 : 240 + Math.random() * 30;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Error thud sound
  playErrorSound() {
    if (this.switchType === 'off' || this.volume <= 0.01) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.09);

    gain.gain.setValueAtTime(this.volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  // Victory chime when session is completed
  playVictoryChime() {
    if (this.volume <= 0.01) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + (i * 0.08);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(this.volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }
}

// Global instance
window.soundEngine = new MechanicalAudioEngine();
