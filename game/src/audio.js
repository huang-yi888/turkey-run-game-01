// Tiny WebAudio sound effects: jumps, corn, trips, gobbles and jingles.
// No audio files; every sound is a few oscillator notes.

let context = null;

function audio() {
  if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
  if (context.state === "suspended") context.resume();
  return context;
}

function tone(freq, start, length, type = "square", gain = 0.06, slideTo = null) {
  const ctx = audio();
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + start + length);
  amp.gain.setValueAtTime(gain, ctx.currentTime + start);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + length);
  osc.connect(amp).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + length);
}

export const sfx = {
  jump() { tone(300, 0, 0.16, "square", 0.05, 640); },
  corn() { tone(880, 0, 0.08, "triangle", 0.07); tone(1320, 0.07, 0.12, "triangle", 0.07); },
  trip() { tone(220, 0, 0.2, "sawtooth", 0.07, 90); },
  gobble() { tone(420, 0, 0.07, "square", 0.06, 300); tone(420, 0.09, 0.07, "square", 0.06, 300); tone(380, 0.18, 0.1, "square", 0.06, 240); },
  caught() { tone(392, 0, 0.18, "triangle", 0.08); tone(330, 0.16, 0.18, "triangle", 0.08); tone(262, 0.32, 0.34, "triangle", 0.08); },
  escaped() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.16, "triangle", 0.08)); },
};
