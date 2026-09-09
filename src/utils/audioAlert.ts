/**
 * SBL Events - Admin Web Audio API Alert Chimes
 * Generates crisp, non-intrusive sound chimes natively without external asset dependencies.
 */

export const playAdminBookingChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Dual-tone chime: First tone 659.25Hz (E5), second tone 987.77Hz (B5)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(987.77, now + 0.1);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.08);
    osc1.stop(now + 0.55);
    osc2.stop(now + 0.55);
  } catch {
    // Graceful fallback for strict browser autoplay policies
  }
};
