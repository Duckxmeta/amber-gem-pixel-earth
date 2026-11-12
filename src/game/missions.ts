// Tutorial missions. Pure state: no React, no Three, no physics step.
// The frame loop feeds facts in and applies the returned effects.

export const LAYOUT = {
  spawn: { x: 11, z: 9 },
  roost: { x: 18.15, z: 14.15 },
  guide: { x: 16.4, z: 12.6 },
  near: 6,
  chair: { x: -14, z: -11 },
  corn: { x: 5, y: 4.2, z: -17 },
  /** Feed cans perched on the coop fence post. y is the pinned rest height. */
  cans: [
    { x: 17.15, z: 14.05, y: 1.05 },
    { x: 17.55, z: 14.05, y: 1.05 },
    { x: 17.35, z: 14.05, y: 1.5 },
  ],
  tax: {
    watering: { x: 6, z: 13.2 },
    boot: { x: 9.2, z: 15.2 },
    pail: { x: 4.2, z: 16.4 },
  },
  /** Golden trophy egg on the barn ridge. y is the visual height; the duck collects it from the roof deck. */
  egg: { x: 12, y: 8.05, z: -14.35 },
  /** Grand-finale crown, floating on the same barn peak the hay bounce launches toward. */
  crown: { x: 12, y: 8.35, z: -14.35 },
  /** Coop gate latch, just south of the doorway. */
  latch: { x: 18, z: 14.15 },
} as const;

export type TaxRole = "watering" | "boot" | "pail";
export type MissionIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface HintPart { text?: string; kbd?: string }

export interface MissionDef {
  index: MissionIndex;
  title: string;
  goal: number;
  hint: HintPart[];
}

export const MISSIONS: readonly MissionDef[] = [
  {
    index: 1,
    title: "Rise & Scream",
    goal: 3,
    hint: [
      { text: "Look around with your " }, { kbd: "Mouse" },
      { text: ", waddle to the Coop (" }, { kbd: "WASD" },
      { text: "), and Quack 3 times (" }, { kbd: "Right-Click" },
      { text: " or " }, { kbd: "F" },
      { text: ") to wake the farm!" },
    ],
  },
  {
    index: 2,
    title: "Pond Tax",
    goal: 3,
    hint: [
      { text: "Grab 3 farm items (" }, { kbd: "Left-Click" },
      { text: " or " }, { kbd: "E" },
      { text: ") and drop or fling them into the Pond!" },
    ],
  },
  {
    index: 3,
    title: "Hayloft Heist",
    goal: 1,
    hint: [
      { text: "Hold " }, { kbd: "Shift" },
      { text: " to sprint up the barn ramp, press " }, { kbd: "Space" },
      { text: " to jump, and hold " }, { kbd: "Space" },
      { text: " to flutter-glide to the Golden Corn!" },
    ],
  },
  {
    index: 4,
    title: "Garden Menace",
    goal: 5,
    hint: [
      { text: "Wreck the garden! Knock 5 pumpkins out of the garden patch and topple the Scarecrow!" },
    ],
  },
  {
    index: 5,
    title: "Picnic Sabotage",
    goal: 5,
    hint: [
      { text: "Clear all 5 items off the farmhouse picnic table! Watch out for the Farmer!" },
    ],
  },
  {
    index: 6,
    title: "The Great Hat Heist",
    goal: 1,
    hint: [
      { text: "Sneak behind the Farmer and snatch his hat (" }, { kbd: "Left-Click" },
      { text: " or " }, { kbd: "E" },
      { text: "), or quack at his ankles (" }, { kbd: "Right-Click" },
      { text: " or " }, { kbd: "F" },
      { text: "), then get the hat into the Pond!" },
    ],
  },
  {
    index: 7,
    title: "Chicken Stampede",
    goal: 5,
    hint: [
      { text: "Herd all 5 chickens into the Garden Patch using your sprint (" },
      { kbd: "Shift" },
      { text: ") and Quack (" },
      { kbd: "Right-Click" },
      { text: " / " },
      { kbd: "F" },
      { text: ")!" },
    ],
  },
  {
    index: 8,
    title: "Barn Roof Launch",
    goal: 1,
    hint: [
      { text: "Bounce off the springy hay pile by the barn and flutter-glide (" },
      { kbd: "Hold Space" },
      { text: ") onto the roof to grab the Golden Egg!" },
    ],
  },
  {
    index: 9,
    title: "Lock the Farmer Out",
    goal: 1,
    hint: [
      { text: "Lure the Farmer inside the Coop by quacking (" },
      { kbd: "F" },
      { text: "), then slip out and shut the Coop Gate (" },
      { kbd: "Left-Click" },
      { text: " / " },
      { kbd: "E" },
      { text: ") behind him!" },
    ],
  },
  {
    index: 10,
    title: "The Golden Duck Throne",
    goal: 1,
    hint: [
      { text: "Bounce up to the Barn Roof and claim your Golden Crown!" },
    ],
  },
  {
    index: 11,
    title: "Bottom Feeder",
    goal: 3,
    hint: [
      { text: "Press " }, { kbd: "C" },
      { text: " (or " }, { kbd: "Ctrl" },
      { text: ") while swimming in the Big Pond to dive underwater and bring 3 sunken lures onto the Fishing Dock!" },
    ],
  },
  {
    index: 12,
    title: "Wake Jumper",
    goal: 3,
    hint: [
      { text: "Hold " }, { kbd: "Shift" },
      { text: " while swimming to Hydro-Boost off all 3 floating wooden ramps in the Big Pond!" },
    ],
  },
  {
    index: 13,
    title: "Lily Pad Parkour",
    goal: 5,
    hint: [
      { text: "Hop and flutter-glide (" }, { kbd: "Space" },
      { text: ") across the 5 giant lily pads without touching the water to reach Picnic Island!" },
    ],
  },
];

export interface MissionState {
  index: MissionIndex | "done";
  quacks: number;
  pond: Record<TaxRole, boolean>;
  pumpOut: number[];
  scare: boolean;
  picnicOff: number[];
  hatPond: boolean;
  chasing: boolean;
  /** Mission 7: chickens that have entered the garden and stayed to peck. */
  herdArmed: boolean;
  chickensIn: number[];
  /** Mission 8: true once the duck has been off the egg, so a head-start doesn't auto-clear. */
  eggReady: boolean;
  egg: boolean;
  /** Mission 9 */
  lured: boolean;
  gateShut: boolean;
  /** Mission 10. Target is snapshotted as score+600 the moment the finale starts. */
  chaosTarget: number | null;
  /** Phase 1 wreck-the-yard. Phase 2 begins when this flips off and crownReady on. */
  rampage: boolean;
  crownReady: boolean;
  crowned: boolean;
  /** Act 2 */
  luresDocked: number[];
  rampsJumped: number[];
  padsStepped: number[];
  /** Banner text. Stays up through the 2s beat, then clears — except the finale line. */
  banner: string | null;
  /** performance.now() deadline before the next mission unlocks. */
  advanceAt: number | null;
}

export function createMissionState(): MissionState {
  return {
    index: 1,
    quacks: 0,
    pond: { watering: false, boot: false, pail: false },
    pumpOut: [],
    scare: false,
    picnicOff: [],
    hatPond: false,
    chasing: false,
    herdArmed: false,
    chickensIn: [],
    eggReady: false,
    egg: false,
    lured: false,
    gateShut: false,
    chaosTarget: null,
    rampage: false,
    crownReady: false,
    crowned: false,
    luresDocked: [],
    rampsJumped: [],
    padsStepped: [],
    banner: null,
    advanceAt: null,
  };
}

export interface TaxFact {
  role: TaxRole;
  inPond: boolean;
  airborne: boolean;
  x: number;
  y: number;
  z: number;
}

export interface IdFact { id: number; x: number; y: number; z: number }

export interface MissionFacts {
  now: number;
  quack: boolean;
  duckX: number;
  duckY: number;
  duckZ: number;
  tax: TaxFact[];
  pumpkins: (IdFact & { out: boolean })[];
  scareTilt: number;
  scareX: number;
  scareZ: number;
  picnic: (IdFact & { off: boolean })[];
  hat: { attached: boolean; inPond: boolean; x: number; y: number; z: number };
  chickens: { id: number; x: number; z: number; inGarden: boolean }[];
  grab: boolean;
  duckInsideCoop: boolean;
  farmerInsideCoop: boolean;
  nearLatch: boolean;
  bumpedLatch: boolean;
  /** Live chaos score. Mission 10 reads it; the HUD does not subscribe per frame. */
  score: number;
  lures: { id: number; onDock: boolean }[];
  rampId: number;
  pads: boolean[];
  onIsland: boolean;
  inBigWater: boolean;
}

export type MissionEffect =
  | { t: "chime" }
  | { t: "fanfare" }
  | { t: "score"; n: number }
  | { t: "knock" }
  | { t: "wake" }
  | { t: "ruffle" }
  | { t: "sparkle" }
  | { t: "thud" }
  | { t: "clatter" }
  | { t: "chase" }
  | { t: "armHerd" }
  | { t: "pen"; id: number }
  | { t: "egg" }
  | { t: "lure" }
  | { t: "latch" }
  | { t: "rampage" }
  | { t: "confetti" }
  | { t: "conquer" }
  | { t: "openRoad" }
  | { t: "pinLure"; id: number }
  | { t: "pop"; text: string; x: number; y: number; z: number };

export interface MissionView {
  index: MissionIndex;
  title: string;
  goal: number;
  progress: number;
  hint: HintPart[];
  detail: string | null;
}

const BANNER_MS = 2000;
const SCARE_DOWN = Math.PI / 3;
const COMPLETE = "Mission Complete! +250 Chaos";
const FINALE = "All 9 Missions Complete! Ready for the Finale!";
const ROAD = "New Area Unlocked: Down the Road to the Big Pond!";
const POND_CLEAR = "The Big Pond is yours!";

export function missionView(s: MissionState, score = 0): MissionView | null {
  if (s.index === "done") return null;
  const def = MISSIONS[s.index - 1]!;
  if (s.index === 10) {
    if (s.crownReady) {
      return { index: 10, title: def.title, goal: 1, progress: 0, hint: def.hint, detail: null };
    }
    const target = s.chaosTarget ?? score + 600;
    const current = Math.min(score, target);
    return {
      index: 10,
      title: def.title,
      goal: target,
      progress: current,
      hint: [{ text: `The Farmer is locked up! Wreck the yard to reach the Finale Chaos Goal! (${current} / ${target})` }],
      detail: null,
    };
  }
  const progress = s.index === 1 ? s.quacks
    : s.index === 2 ? Number(s.pond.watering) + Number(s.pond.boot) + Number(s.pond.pail)
    : s.index === 4 ? s.pumpOut.length
    : s.index === 5 ? s.picnicOff.length
    : s.index === 6 && s.hatPond ? 1
    : s.index === 7 ? s.chickensIn.length
    : s.index === 8 && s.egg ? 1
    : s.index === 9 && s.gateShut ? 1
    : s.index === 11 ? s.luresDocked.length
    : s.index === 12 ? s.rampsJumped.length
    : s.index === 13 ? s.padsStepped.length
    : 0;
  const detail = s.index === 4 ? (s.scare ? "Scarecrow down" : "Scarecrow still standing")
    : s.index === 6 ? "Hat in the pond"
    : s.index === 9 ? (s.gateShut ? "Gate locked" : s.lured ? "Farmer is heading for the coop" : "Quack inside the coop")
    : s.index === 13 ? (s.padsStepped.length >= 5 ? "Now land on Picnic Island" : "Don't touch the water")
    : null;
  return {
    index: s.index, title: def.title, goal: def.goal,
    progress: Math.min(def.goal, progress), hint: def.hint, detail,
  };
}

export function stepMission(prev: MissionState, f: MissionFacts): { state: MissionState; effects: MissionEffect[]; changed: boolean } {
  const effects: MissionEffect[] = [];
  let state = prev;
  let changed = false;
  const patch = (p: Partial<MissionState>) => { state = { ...state, ...p }; changed = true; };
  const finish = (extra: Partial<MissionState>, banner = COMPLETE) => {
    effects.push({ t: "score", n: 250 }, { t: "chime" });
    patch({ ...extra, banner, advanceAt: f.now + BANNER_MS });
  };

  if (state.advanceAt != null && f.now >= state.advanceAt) {
    if (state.index === 1) patch({ index: 2, quacks: 0, banner: null, advanceAt: null });
    else if (state.index === 2) patch({ index: 3, banner: null, advanceAt: null });
    else if (state.index === 3) patch({ index: 4, banner: null, advanceAt: null });
    else if (state.index === 4) patch({ index: 5, banner: null, advanceAt: null });
    else if (state.index === 5) patch({ index: 6, banner: null, advanceAt: null });
    else if (state.index === 6) patch({ index: 7, banner: null, advanceAt: null });
    else if (state.index === 7) patch({ index: 8, banner: null, advanceAt: null });
    else if (state.index === 8) patch({ index: 9, banner: null, advanceAt: null });
    else if (state.index === 9) {
      effects.push({ t: "rampage" });
      patch({
        index: 10,
        banner: null,
        advanceAt: null,
        chaosTarget: f.score + 600,
        rampage: true,
        crownReady: false,
        crowned: false,
      });
    }
    else if (state.index === 10) patch({ index: 11, banner: null, advanceAt: null });
    else if (state.index === 11) patch({ index: 12, banner: null, advanceAt: null });
    else if (state.index === 12) patch({ index: 13, banner: null, advanceAt: null });
    else if (state.index === 13) patch({ index: "done", banner: POND_CLEAR, advanceAt: null });
  }

  // Hold the beat: no new objectives until the banner's 2 seconds are up.
  if (state.advanceAt != null || state.index === "done") return { state, effects, changed };

  if (state.index === 1 && f.quack && Math.hypot(f.duckX - LAYOUT.roost.x, f.duckZ - LAYOUT.roost.z) <= LAYOUT.near) {
    const q = state.quacks + 1;
    effects.push({ t: "ruffle" });
    if (q >= 3) {
      effects.push({ t: "knock" }, { t: "wake" }, { t: "score", n: 250 }, { t: "chime" });
      patch({ quacks: 3, banner: COMPLETE, advanceAt: f.now + BANNER_MS });
    } else patch({ quacks: q });
  }

  if (state.index === 2) {
    let pond = state.pond;
    let hit = false;
    for (const item of f.tax) {
      if (!item.inPond || pond[item.role]) continue;
      pond = { ...pond, [item.role]: true };
      hit = true;
      const style = item.airborne;
      effects.push({
        t: "pop",
        text: style ? "+100 Pond Tax  +50 Style Fling!" : "+100 Pond Tax",
        x: item.x, y: Math.max(item.y, 0.4) + 0.7, z: item.z,
      });
      effects.push({ t: "score", n: style ? 150 : 100 });
    }
    if (hit) {
      const done = pond.watering && pond.boot && pond.pail;
      if (done) finish({ pond });
      else patch({ pond });
    }
  }

  if (state.index === 3) {
    const c = LAYOUT.corn;
    const close = Math.hypot(f.duckX - c.x, f.duckZ - c.z) < 1.15 && f.duckY > 1.4;
    if (close) {
      effects.push({ t: "fanfare" }, { t: "sparkle" });
      finish({});
    }
  }

  if (state.index === 4) {
    let outs = state.pumpOut;
    let scare = state.scare;
    let hit = false;
    for (const p of f.pumpkins) {
      if (!p.out || outs.includes(p.id) || outs.length >= 5) continue;
      outs = [...outs, p.id];
      hit = true;
      effects.push({ t: "pop", text: "+50 Chaos", x: p.x, y: p.y + 0.8, z: p.z });
      effects.push({ t: "score", n: 50 });
    }
    if (!scare && f.scareTilt > SCARE_DOWN) {
      scare = true;
      hit = true;
      effects.push({ t: "pop", text: "+150 Scarecrow Down!", x: f.scareX, y: 2.2, z: f.scareZ });
      effects.push({ t: "score", n: 150 }, { t: "thud" });
    }
    if (hit) {
      if (outs.length >= 5 && scare) finish({ pumpOut: outs, scare });
      else patch({ pumpOut: outs, scare });
    }
  }

  if (state.index === 5) {
    let off = state.picnicOff;
    let hit = false;
    for (const item of f.picnic) {
      if (!item.off || off.includes(item.id)) continue;
      off = [...off, item.id];
      hit = true;
      effects.push({ t: "pop", text: "+60 Chaos", x: item.x, y: Math.max(item.y, 0.3) + 0.55, z: item.z });
      effects.push({ t: "score", n: 60 }, { t: "clatter" });
    }
    if (hit) {
      if (off.length >= 5) finish({ picnicOff: off });
      else patch({ picnicOff: off });
    }
  }

  if (state.index === 6) {
    const detached = !f.hat.attached;
    const pondNow = !state.hatPond && f.hat.inPond;
    if (!state.chasing && detached && !pondNow) {
      effects.push({ t: "chase" });
      patch({ chasing: true });
    }
    if (pondNow) {
      if (!state.chasing && detached) effects.push({ t: "chase" });
      effects.push({
        t: "pop", text: "+500 Master Thief!",
        x: f.hat.x, y: Math.max(f.hat.y, 0.3) + 0.8, z: f.hat.z,
      });
      effects.push({ t: "score", n: 500 }, { t: "fanfare" });
      finish({ hatPond: true, chasing: true });
    }
  }

  if (state.index === 7) {
    if (!state.herdArmed) {
      effects.push({ t: "armHerd" });
      patch({ herdArmed: true });
    } else {
      let entered = state.chickensIn;
      let hit = false;
      for (const c of f.chickens) {
        if (!c.inGarden || entered.includes(c.id) || entered.length >= 5) continue;
        entered = [...entered, c.id];
        hit = true;
        effects.push({ t: "pop", text: "+100 Cluck Chaos!", x: c.x, y: 1.15, z: c.z });
        effects.push({ t: "score", n: 100 }, { t: "pen", id: c.id });
      }
      if (hit) {
        if (entered.length >= 5) finish({ chickensIn: entered });
        else patch({ chickensIn: entered });
      }
    }
  }

  if (state.index === 8 && !state.egg) {
    const e = LAYOUT.egg;
    const near = Math.hypot(f.duckX - e.x, f.duckZ - e.z) < 1.25 && f.duckY > 5.45;
    if (!state.eggReady) {
      if (!near) patch({ eggReady: true });
    } else if (near) {
      effects.push({ t: "pop", text: "+400 Sky Duck!", x: e.x, y: e.y + 0.45, z: e.z });
      effects.push({ t: "score", n: 400 }, { t: "fanfare" }, { t: "egg" });
      finish({ egg: true });
    }
  }

  if (state.index === 9 && !state.gateShut) {
    if (!state.lured && f.quack && f.duckInsideCoop) {
      effects.push({ t: "lure" });
      patch({ lured: true });
    }
    const canLatch = state.lured && f.farmerInsideCoop && !f.duckInsideCoop && f.nearLatch
      && (f.grab || f.quack || f.bumpedLatch);
    if (canLatch) {
      effects.push({ t: "latch" });
      effects.push({ t: "pop", text: "+500 Mastermind!", x: LAYOUT.latch.x, y: 2.1, z: LAYOUT.latch.z });
      effects.push({ t: "score", n: 500 }, { t: "fanfare" });
      patch({
        gateShut: true,
        banner: FINALE,
        advanceAt: f.now + BANNER_MS,
      });
    }
  }

  if (state.index === 10 && state.chaosTarget != null) {
    if (state.rampage && !state.crownReady && f.score >= state.chaosTarget) {
      const c = LAYOUT.crown;
      effects.push({ t: "chime" }, { t: "pop", text: "Golden Crown!", x: c.x, y: c.y, z: c.z });
      patch({ rampage: false, crownReady: true });
    } else if (state.crownReady && !state.crowned) {
      const c = LAYOUT.crown;
      const near = Math.hypot(f.duckX - c.x, f.duckZ - c.z) < 1.35 && f.duckY > 5.4;
      if (near) {
        effects.push({ t: "fanfare" }, { t: "confetti" }, { t: "openRoad" });
        patch({
          crowned: true,
          crownReady: false,
          rampage: false,
          banner: ROAD,
          advanceAt: f.now + BANNER_MS,
        });
      }
    }
  }

  if (state.index === 11) {
    let docked = state.luresDocked ?? [];
    let hit = false;
    for (const lure of f.lures) {
      if (!lure.onDock || docked.includes(lure.id)) continue;
      docked = [...docked, lure.id];
      hit = true;
      effects.push({ t: "pinLure", id: lure.id });
      effects.push({ t: "pop", text: "+150 Bottom Feeder!", x: f.duckX, y: f.duckY + 0.8, z: f.duckZ });
      effects.push({ t: "score", n: 150 });
    }
    if (hit) {
      if (docked.length >= 3) finish({ luresDocked: docked });
      else patch({ luresDocked: docked });
    }
  }

  if (state.index === 12 && f.rampId >= 0 && !(state.rampsJumped ?? []).includes(f.rampId)) {
    const jumped = [...(state.rampsJumped ?? []), f.rampId];
    effects.push({ t: "pop", text: "+120 Wake Jump!", x: f.duckX, y: f.duckY + 0.9, z: f.duckZ });
    effects.push({ t: "score", n: 120 });
    if (jumped.length >= 3) finish({ rampsJumped: jumped });
    else patch({ rampsJumped: jumped });
  }

  if (state.index === 13) {
    let pads = state.padsStepped ?? [];
    if (f.inBigWater && pads.length > 0 && !f.onIsland) {
      effects.push({ t: "pop", text: "Splash! Back to the pads", x: f.duckX, y: f.duckY + 0.8, z: f.duckZ });
      patch({ padsStepped: [] });
    } else {
      let hit = false;
      f.pads.forEach((on, i) => {
        if (!on || pads.includes(i)) return;
        pads = [...pads, i];
        hit = true;
      });
      if (hit) patch({ padsStepped: pads });
      if (pads.length >= 5 && f.onIsland) finish({ padsStepped: pads });
    }
  }

  return { state, effects, changed };
}
