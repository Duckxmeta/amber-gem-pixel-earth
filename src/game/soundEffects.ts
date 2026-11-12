// Procedural Web Audio sound effects — no audio files needed.
export type SoundName =
  | "quack" | "splash" | "step" | "stepWood" | "paddle" | "jump" | "flap"
  | "grab" | "fling" | "thud" | "clatter" | "bump" | "chime" | "fanfare" | "grumble" | "boing" | "latch";

const VOLUME = 0.5;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let muted = false;
const last: Partial<Record<SoundName, number>> = {};
/** Minimum seconds between repeats, so piles of crashing props don't turn into noise. */
const MIN_GAP: Partial<Record<SoundName, number>> = { thud: 0.06, clatter: 0.07, bump: 0.06, step: 0.05, stepWood: 0.05, flap: 0.05, boing: 0.2, latch: 0.2 };

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC({ latencyHint: "interactive" });
    sfx = ctx.createGain();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : VOLUME;
    sfx.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Master mute. Ramped so flipping the HUD button doesn't click. */
export function setMuted(m: boolean) {
  muted = m;
  const c = ac();
  if (!c || !master) return;
  master.gain.setTargetAtTime(m ? 0 : VOLUME, c.currentTime, 0.015);
}

/** Create/resume the context. Call synchronously inside a click or key handler. */
export function unlockAudio() {
  const c = ac();
  if (c && c.state === "suspended") void c.resume();
}

/** Unlocks audio on the first pointer or key, and resumes after the tab is backgrounded. */
export function installAudioUnlock() {
  const go = () => { unlockAudio(); off(); };
  const off = () => {
    window.removeEventListener("pointerdown", go);
    window.removeEventListener("keydown", go);
  };
  window.addEventListener("pointerdown", go);
  window.addEventListener("keydown", go);
  const onVis = () => { if (document.visibilityState === "visible") unlockAudio(); };
  window.addEventListener("focus", unlockAudio);
  document.addEventListener("visibilitychange", onVis);
  return () => {
    off();
    window.removeEventListener("focus", unlockAudio);
    document.removeEventListener("visibilitychange", onVis);
  };
}

// ---- building blocks ----
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
function noise(c: AudioContext, dur: number) {
  const b = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = b; return s;
}
/** Gain envelope starting at `st` (attack a, release r), routed to master. */
function env(c: AudioContext, peak: number, st: number, a: number, r: number) {
  const g = c.createGain();
  g.gain.setValueAtTime(0, st); g.gain.linearRampToValueAtTime(peak, st + a); g.gain.exponentialRampToValueAtTime(0.0001, st + a + r);
  g.connect(sfx!); return g;
}
function filter(c: AudioContext, type: BiquadFilterType, freq: number, q = 1) {
  const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f;
}
function tone(c: AudioContext, type: OscillatorType, f0: number, f1: number, st: number, dur: number, peak: number, a = 0.005, through?: AudioNode) {
  const o = c.createOscillator(); o.type = type;
  o.frequency.setValueAtTime(f0, st); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, st + dur);
  const g = env(c, peak, st, a, dur);
  if (through) { o.connect(through); through.connect(g); } else o.connect(g);
  o.start(st); o.stop(st + a + dur + 0.02);
}
function burst(c: AudioContext, st: number, dur: number, peak: number, f: BiquadFilterNode, sweepTo?: number) {
  const n = noise(c, dur + 0.02);
  if (sweepTo) { f.frequency.setValueAtTime(f.frequency.value, st); f.frequency.exponentialRampToValueAtTime(sweepTo, st + dur); }
  n.connect(f).connect(env(c, peak, st, 0.004, dur)); n.start(st);
}

// ---- sounds ----
const SOUNDS: Record<SoundName, (c: AudioContext, t: number) => void> = {
  quack(c, t) {
    // comedic double quack: buzzy saw + triangle body through a nasal bandpass, pitch drops each honk
    const p = rnd(0.88, 1.15);
    const gap = rnd(0.12, 0.16);
    for (let k = 0; k < 2; k++) {
      const st = t + k * gap, base = (k ? 380 : 440) * p, len = k ? 0.15 : 0.12;
      const bp = filter(c, "bandpass", 1150 * p, 3.5);
      bp.frequency.setValueAtTime(1500 * p, st); bp.frequency.exponentialRampToValueAtTime(800 * p, st + len);
      const g = env(c, 0.75, st, 0.008, len);
      bp.connect(g);
      for (const [type, mul, lvl] of [["sawtooth", 1, 1], ["triangle", 0.5, 0.6]] as const) {
        const o = c.createOscillator(); o.type = type;
        o.frequency.setValueAtTime(base * mul * 1.08, st); o.frequency.exponentialRampToValueAtTime(base * mul * 0.6, st + len);
        const lg = c.createGain(); lg.gain.value = lvl;
        o.connect(lg).connect(bp); o.start(st); o.stop(st + len + 0.03);
      }
    }
  },
  splash(c, t) {
    burst(c, t, 0.55, 0.55, filter(c, "lowpass", 3200), 280);
    for (let i = 0; i < 4; i++) tone(c, "sine", rnd(500, 900), rnd(1200, 1800), t + 0.05 + i * rnd(0.04, 0.07), 0.05, 0.12);
  },
  step(c, t) { // soft grass tap
    burst(c, t, 0.05, rnd(0.12, 0.18), filter(c, "lowpass", rnd(700, 1000)));
    tone(c, "sine", rnd(140, 170), 70, t, 0.05, 0.12);
  },
  stepWood(c, t) { // hollow knock on boards
    tone(c, "triangle", rnd(260, 300), 180, t, 0.06, 0.2, 0.002, filter(c, "bandpass", 500, 5));
    burst(c, t, 0.03, 0.08, filter(c, "bandpass", 1800, 2));
  },
  paddle(c, t) { // bubbly water churn
    burst(c, t, 0.18, 0.22, filter(c, "bandpass", rnd(600, 900), 1.2), 300);
    for (let i = 0; i < 3; i++) tone(c, "sine", rnd(300, 500), rnd(800, 1300), t + i * rnd(0.03, 0.06), 0.04, 0.1);
  },
  jump(c, t) { // upward whistle + whoosh
    tone(c, "sine", 480, 1150, t, 0.16, 0.22, 0.01);
    burst(c, t, 0.2, 0.18, filter(c, "bandpass", 600, 1.5), 2600);
  },
  flap(c, t) { // soft wing puff
    burst(c, t, 0.06, rnd(0.1, 0.15), filter(c, "lowpass", rnd(500, 800)));
  },
  grab(c, t) { // crisp pop
    tone(c, "sine", 320, 950, t, 0.06, 0.4, 0.002);
    burst(c, t, 0.015, 0.2, filter(c, "highpass", 2500));
  },
  fling(c, t) { // pop + swish
    tone(c, "sine", 900, 260, t, 0.08, 0.35, 0.002);
    burst(c, t + 0.02, 0.18, 0.2, filter(c, "bandpass", 2400, 1.5), 500);
  },
  thud(c, t) { // hollow wooden thud
    tone(c, "sine", rnd(120, 150), 50, t, 0.22, 0.6, 0.002);
    tone(c, "triangle", rnd(210, 250), 160, t, 0.12, 0.3, 0.002, filter(c, "bandpass", 230, 8));
    burst(c, t, 0.08, 0.25, filter(c, "lowpass", 900));
  },
  clatter(c, t) { // ceramic clinks
    const n = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const st = t + i * rnd(0.025, 0.06), f = rnd(2300, 4200);
      tone(c, "triangle", f, f * 0.97, st, rnd(0.06, 0.14), 0.16, 0.001);
    }
    burst(c, t, 0.1, 0.12, filter(c, "highpass", 3000));
  },
  bump(c, t) { // dull soft knock (pumpkins, cabbages, buckets)
    tone(c, "sine", rnd(170, 210), 80, t, 0.1, 0.35, 0.002);
    burst(c, t, 0.05, 0.12, filter(c, "lowpass", 600));
  },
  chime(c, t) { // bright 3-note major arpeggio (C–E–G)
    [523.25, 659.25, 783.99].forEach((f, i) => {
      tone(c, "triangle", f, f, t + i * 0.1, 0.45, 0.3, 0.008);
      tone(c, "sine", f * 2, f * 2, t + i * 0.1, 0.3, 0.08, 0.008);
    });
  },
  fanfare(c, t) { // da-da-da-DAAA on a C major chord
    const notes: [number, number, number][] = [[392, 0, 0.12], [523.25, 0.13, 0.12], [659.25, 0.26, 0.12], [783.99, 0.39, 0.7]];
    for (const [f, at, len] of notes) {
      tone(c, "square", f, f, t + at, len, 0.12, 0.01, filter(c, "lowpass", 2600));
      tone(c, "triangle", f, f, t + at, len, 0.22, 0.01);
    }
    for (const f of [261.63, 329.63, 392, 523.25]) tone(c, "triangle", f, f, t + 0.39, 1.1, 0.12, 0.03);
  },
  grumble(c, t) {
    tone(c, "sawtooth", 140, 90, t, 0.18, 0.2, 0.01, filter(c, "lowpass", 420, 1.2));
    tone(c, "triangle", 220, 130, t + 0.16, 0.22, 0.16, 0.01, filter(c, "bandpass", 380, 2));
  },
  boing(c, t) { // springy hay
    tone(c, "sine", 160, 620, t, 0.2, 0.42, 0.004);
    tone(c, "triangle", 80, 340, t, 0.24, 0.28, 0.004);
    tone(c, "sine", 480, 200, t + 0.12, 0.16, 0.18, 0.004);
  },
  latch(c, t) { // heavy wooden gate clunk
    tone(c, "sine", 96, 38, t, 0.32, 0.7, 0.002);
    tone(c, "triangle", 170, 64, t, 0.18, 0.38, 0.002);
    tone(c, "square", 72, 48, t + 0.04, 0.12, 0.14, 0.002, filter(c, "lowpass", 240));
    burst(c, t, 0.14, 0.42, filter(c, "lowpass", 480));
  },
};

export function playSound(name: SoundName, delay = 0) {
  const c = ac(); if (!c || muted || !master || !sfx) return;
  const now = c.currentTime;
  const gap = MIN_GAP[name];
  if (gap && last[name] !== undefined && now - last[name]! < gap) return;
  last[name] = now;
  SOUNDS[name](c, now + delay);
}
