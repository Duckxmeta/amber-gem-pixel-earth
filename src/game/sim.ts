// Pure-TS game simulation: no React, no three.js.
import { LAYOUT } from "./missions";
import {
  BIG_BED, BIG_SURFACE, DOCK, FENCE, ISLAND, LILY_Y, LURE_SPOTS, ROAD_Z, WAKE_RAMPS,
  inBigPond, lilyAt, onDock, onIsland, rampAt, roadGate, southFenceBlocks, southGroundY,
} from "./pond";
export type PropKind =
  | "pumpkin" | "cabbage" | "bucket" | "can" | "hay" | "crate" | "barrel"
  | "plate" | "pie" | "cup" | "shovel" | "hat" | "watering" | "boot" | "pail" | "thermos" | "lure";

export const PROP_DEFS: Record<PropKind, { r: number; h: number; mass: number; wood?: boolean }> = {
  pumpkin: { r: 0.4, h: 0.6, mass: 1.2 },
  cabbage: { r: 0.3, h: 0.45, mass: 0.6 },
  bucket: { r: 0.3, h: 0.5, mass: 0.7 },
  can: { r: 0.3, h: 0.45, mass: 0.6 },
  hay: { r: 0.7, h: 0.9, mass: 3, wood: true },
  crate: { r: 0.45, h: 0.8, mass: 1.5, wood: true },
  barrel: { r: 0.4, h: 0.9, mass: 1.6, wood: true },
  plate: { r: 0.22, h: 0.06, mass: 0.2 },
  pie: { r: 0.25, h: 0.15, mass: 0.3 },
  cup: { r: 0.12, h: 0.18, mass: 0.15 },
  shovel: { r: 0.35, h: 0.15, mass: 0.6, wood: true },
  hat: { r: 0.35, h: 0.2, mass: 0.2 },
  watering: { r: 0.28, h: 0.42, mass: 0.5 },
  boot: { r: 0.22, h: 0.28, mass: 0.35 },
  pail: { r: 0.28, h: 0.4, mass: 0.55, wood: true },
  thermos: { r: 0.12, h: 0.32, mass: 0.35 },
  lure: { r: 0.16, h: 0.08, mass: 0.15 },
};
/** Props that clatter like crockery. */
export const FRAGILE = new Set<PropKind>(["plate", "cup", "pie", "thermos"]);
/** Upright props that tip over once knocked. */
export const TIPPABLE = new Set<PropKind>(["can", "bucket", "cup", "barrel"]);
/** Props heavier than this ignore the quack shockwave. */
export const QUACK_MAX_MASS = 2;

// ---- Feel constants ----
export const G = 22; // props
export const DUCK_G = 30, FALL_MULT = 1.5, CUT_MULT = 2.4; // duck: snappier rise, faster fall, short hop on early release
export const WALK = 4.5, SPRINT = 8, SWIM = 7.5, HYDRO = 13;
export const ACCEL = 14, AIR_ACCEL = 6, TURN = 20;
export const JUMP_V = 9.2, COYOTE = 0.1, JUMP_BUFFER = 0.12;
export const GLIDE_FALL = -1.6, GLIDE_TIME = 1.2, FLAP_EVERY = 0.11;
export const GROUND_DRAG = 3.5, STEP = 0.6, BOUND = FENCE, SNAP = 0.4;
export const STRIDE_WALK = 0.65, STRIDE_SPRINT = 1.1, PADDLE_EVERY = 0.38;
export const QUACK_RADIUS = 4.5, QUACK_FORCE = 6, QUACK_COOLDOWN = 0.35, QUACK_ANIM = 0.45;
export const CHICKEN_HEAR = QUACK_RADIUS + 3, FARMER_HEAR = 7;
/** Sprint or quack inside this radius sends a chicken straight away from the duck. */
export const HERD_NEAR = 5.2;
export const GRAB_RANGE = 1.7, FLING = 9;

// ---- Map zones ----
export const POND = { x: -12, z: 10, r: 6 };
export const BARN = { x0: 8, x1: 16, z0: -18, z1: -10 };
export const LOFT = { x0: 2, x1: 8, z0: -18, z1: -15.2, h: 2.2 };
export const RAMP = { x0: 2, x1: 8, z0: -12, z1: -6 };
export const HOUSE = { x0: -20, x1: -8, z0: -21, z1: -13 };
export const PORCH = { x0: -20, x1: -8, z0: -13, z1: -9 };
export const TABLE = { x0: -15.6, x1: -12.4, z0: -7.7, z1: -6.3, h: 0.8 };
export const GARDEN = { x0: 4, x1: 14, z0: 4, z1: 14 };
export const COOP = { x0: 16, x1: 20, z0: 15, z1: 19 };
export const SCARECROW = { x: 9, z: 12.8 };
export const SPAWN = { x: 11, z: 9 };
/** Springy hay tucked under the barn's east eave. y is the landing deck. */
export const HAY_BOUNCE = { x: 17.15, z: LAYOUT.egg.z, r: 1.15, y: 1.12 };
export const ROOF_Y = 6.2;
export const ROOF_HALF_Z = 1.55;
/** Ridge deck runs the barn and overhangs the hay so a straight bounce lands on it. */
export const ROOF_X0 = 8.05;
export const ROOF_X1 = 18.35;
/** Shared with heightAt so a shut gate becomes a wall. Reset in createSim. */
export const coopGate = { shut: false };

const inRect = (r: { x0: number; x1: number; z0: number; z1: number }, x: number, z: number, m = 0) =>
  x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;
export const inPond = (x: number, z: number) => Math.hypot(x - POND.x, z - POND.z) < POND.r - 0.3;
export const inGarden = (x: number, z: number) => inRect(GARDEN, x, z, 0.3);
export const onHay = (x: number, z: number) => Math.hypot(x - HAY_BOUNCE.x, z - HAY_BOUNCE.z) < HAY_BOUNCE.r;
/** Past the coop doorway, inside the pen. */
export const inCoopBounds = (x: number, z: number) =>
  x > COOP.x0 + 0.55 && x < COOP.x1 - 0.55 && z > COOP.z0 + 0.4 && z < COOP.z1 - 0.45;
export const onWood = (x: number, z: number, y: number) =>
  inRect(PORCH, x, z) || (y > 0.05 && (inRect(LOFT, x, z) || inRect(RAMP, x, z) || inRect(TABLE, x, z) || (inRect(BARN, x, z) && y > 4)));

export function heightAt(x: number, z: number, y = 0): number {
  if (inRect(BARN, x, z) || (x > ROOF_X0 && x < ROOF_X1 && Math.abs(z - LAYOUT.egg.z) <= ROOF_HALF_Z)) {
    if (x > ROOF_X0 && x < ROOF_X1 && Math.abs(z - LAYOUT.egg.z) <= ROOF_HALF_Z && y >= ROOF_Y - 0.5) return ROOF_Y;
    if (inRect(BARN, x, z)) return 50;
  }
  if (inRect(HOUSE, x, z)) return 50;
  if (inRect(COOP, x, z)) {
    const inset = 0.42;
    const room = x > COOP.x0 + inset && x < COOP.x1 - inset && z > COOP.z0 + inset && z < COOP.z1 - inset;
    if (room) return 0;
    const door = Math.abs(x - LAYOUT.latch.x) < 0.95 && z <= COOP.z0 + inset + 0.08 && z >= COOP.z0 - 0.5;
    if (door && !coopGate.shut) return 0;
    return 50;
  }
  if (inPond(x, z)) return -0.15;
  if (southFenceBlocks(x, z)) return 50;
  if (onDock(x, z)) return DOCK.y;
  if (onIsland(x, z)) return ISLAND.y;
  const pad = lilyAt(x, z);
  if (pad >= 0 && y > BIG_SURFACE - 0.15) return LILY_Y;
  const ramp = rampAt(x, z);
  if (ramp >= 0 && y > BIG_SURFACE - 0.2) {
    const spec = WAKE_RAMPS[ramp]!;
    const dx = x - spec.x, dz = z - spec.z;
    const c = Math.cos(spec.yaw), s = Math.sin(spec.yaw);
    const lz = -dx * s + dz * c;
    const t = Math.max(0, Math.min(1, (lz + 0.3) / 3.6));
    return BIG_SURFACE + 0.12 + t * 0.95;
  }
  if (inBigPond(x, z)) return BIG_SURFACE;
  if (z > 24.4) return southGroundY(z);
  if (inRect(LOFT, x, z)) return LOFT.h;
  if (inRect(RAMP, x, z)) return LOFT.h * ((RAMP.z1 - z) / (RAMP.z1 - RAMP.z0));
  if (inRect(TABLE, x, z)) return TABLE.h;
  if (onHay(x, z)) return HAY_BOUNCE.y;
  return 0;
}

export interface Body { x: number; y: number; z: number; vx: number; vy: number; vz: number; onGround: boolean }
export interface Prop extends Body {
  id: number; kind: PropKind; ox: number; oz: number; yaw: number; tilt: number; tipped: boolean; hitCd: number;
  disturbed: boolean; pondCounted: boolean; table: boolean; attached: boolean;
  /** Tutorial tag. Feed cans stay pinned until the mission knocks them. */
  role?: "feed" | "watering" | "boot" | "pail";
  pinned?: boolean;
  /** True after a fling until the prop lands outside the pond. */
  flung?: boolean;
}
export interface Chicken { id: number; x: number; z: number; yaw: number; vx: number; vz: number; tx: number; tz: number; flee: number; hop: number; penned: boolean }
export interface Duck extends Body {
  yaw: number; glide: number; swimming: boolean; held: number | null; quackCd: number; flap: number;
  coyote: number; jumpBuf: number; flapCd: number; stepDist: number; quackAnim: number; quacks: number;
  /** Act 2. air is seconds of breath left (max 4). diving is true while submerged. */
  air: number; diving: boolean; boosting: boolean; diveCd: number;
}
export interface Farmer { x: number; z: number; yaw: number; wp: number; angry: number; startle: number; hasHat: boolean; asleep: boolean; chase: boolean; shooCd: number; lure: boolean; trapped: boolean }
export type GameEvent =
  | "quack" | "splash" | "step" | "stepWood" | "paddle" | "jump" | "flap"
  | "grab" | "fling" | "thud" | "clatter" | "bump" | "chime" | "won" | "grumble" | "boing";
export type ObjectiveId = "pond" | "pumpkin" | "scarecrow" | "picnic" | "hat";
export interface Input { fx: number; fz: number; sprint: boolean; jumpHeld: boolean; jump: boolean; grab: boolean; quack: boolean; reset: boolean; dive: boolean }

export interface Ring { x: number; y: number; z: number; yaw: number; t: number }
export interface Sim {
  duck: Duck; props: Prop[]; chickens: Chicken[]; farmer: Farmer;
  scarecrowDown: boolean; scarecrowTilt: number; scarecrowAV: number;
  rings: Ring[];
  score: number; elapsed: number; time: number;
  objectives: Record<ObjectiveId, boolean>;
  pondSet: Set<number>;
  events: GameEvent[];
  won: boolean;
  /** Mission 7: fleeing chickens may cross into the garden. */
  herd: boolean;
  bounceCd: number;
  /** Visual squash timer for the hay pile. */
  boing: number;
  gateShut: boolean;
  /** 0 = shut across the doorway, negative = swung open to the south. */
  gateAngle: number;
  /** 2 during the Mission 10 finale so knockover and splash points double. 1 otherwise. */
  scoreMul: number;
  /** South farm gate. Angle 0 is shut; negative swings the leaf down the road. */
  roadOpen: boolean;
  roadAngle: number;
  /** Ramp id launched this step, or -1. Mission 12 reads it. */
  justRamp: number;
  rampLatch: number;
}

export const FARMER_PATH = [
  { x: -16, z: -11 }, { x: -8, z: -6 }, { x: 1, z: 0 },
  { x: 9, z: 2.4 }, { x: 9, z: 5.4 }, { x: 0, z: 1 },
];

export function createSim(): Sim {
  const props: Prop[] = [];
  const add = (kind: PropKind, x: number, z: number, y = 0, extra: Partial<Prop> = {}) => {
    props.push({ id: props.length, kind, x, y, z, vx: 0, vy: 0, vz: 0, ox: x, oz: z, yaw: (props.length * 1.7) % 6.28,
      tilt: 0, tipped: false, hitCd: 0, onGround: true, disturbed: false, pondCounted: false, table: false, attached: false, ...extra });
  };
  for (const [x, z] of [[5.5, 6.2], [7.4, 6.8], [6.2, 9.2], [8.2, 8.4], [5.8, 11.5], [7.6, 12.2]] as const) add("pumpkin", x, z);
  for (let i = 0; i < 4; i++) add("cabbage", 5.5 + i * 2.5, 10.8);
  add("crate", 3, -16.4, 2.2); add("crate", 3.8, -17.2, 2.2); add("crate", 4.6, -16.2, 2.2);
  add("barrel", 6.2, -16.8, 2.2); add("barrel", 7, -17.2, 2.2); add("crate", 6.4, -17.4, 2.2);
  add("hay", 5, -17, 2.2); add("hay", 5, -17, 3.1);
  add("hay", 11, -8); add("hay", 13, -8); add("hay", 12, -8, 0.9);
  add("bucket", -3, 4); add("bucket", 2, -3); add("can", 3, 2); add("can", -5, -2);
  add("shovel", 0, 8); add("shovel", 16, 6); add("bucket", 17, 12);
  add("crate", -4, -9); add("barrel", -6, 12.5);
  // stacked can pyramid just ahead of the spawn point
  const cz = -2.5, ch = PROP_DEFS.can.h;
  add("can", -0.6, cz, 0, { yaw: 0 }); add("can", 0, cz, 0, { yaw: 0 }); add("can", 0.6, cz, 0, { yaw: 0 });
  add("can", -0.3, cz, ch, { yaw: 0 }); add("can", 0.3, cz, ch, { yaw: 0 }); add("can", 0, cz, ch * 2, { yaw: 0 });
  // picnic table
  const t = (kind: PropKind, x: number, z: number) => add(kind, x, z, TABLE.h, { table: true });
  t("plate", -15, -7.3); t("plate", -14.2, -6.85); t("plate", -13.1, -7.25); t("pie", -14.6, -6.55); t("thermos", -13.15, -6.55);
  add("hat", LAYOUT.chair.x, LAYOUT.chair.z, 1.15, { attached: true });
  for (const c of LAYOUT.cans) add("can", c.x, c.z, c.y, { role: "feed", pinned: true, yaw: 0 });
  add("watering", LAYOUT.tax.watering.x, LAYOUT.tax.watering.z, 0, { role: "watering" });
  add("boot", LAYOUT.tax.boot.x, LAYOUT.tax.boot.z, 0, { role: "boot" });
  add("pail", LAYOUT.tax.pail.x, LAYOUT.tax.pail.z, 0, { role: "pail" });
  LURE_SPOTS.forEach((spot) => add("lure", spot.x, spot.z, BIG_BED + 0.06, { pinned: true, disturbed: true, pondCounted: true }));
  const chickens: Chicken[] = [];
  const flock: [number, number][] = [[16.6, 11.2], [17.8, 12.35], [19.15, 11.05], [18.35, 13.25], [16.7, 13.45]];
  flock.forEach(([x, z], i) => {
    chickens.push({ id: i, x, z, yaw: i * 1.2, vx: 0, vz: 0, tx: x, tz: z, flee: 0, hop: i, penned: false });
  });
  roadGate.open = false;
  coopGate.shut = false;
  return {
    duck: { x: SPAWN.x, y: 0, z: SPAWN.z, vx: 0, vy: 0, vz: 0, onGround: true, yaw: Math.atan2(LAYOUT.roost.x - SPAWN.x, LAYOUT.roost.z - SPAWN.z), glide: 0, swimming: false, held: null,
      quackCd: 0, flap: 0, coyote: 0, jumpBuf: 0, flapCd: 0, stepDist: 0, quackAnim: 0, quacks: 0, air: 4, diving: false, boosting: false, diveCd: 0 },
    props, chickens,
    farmer: { x: LAYOUT.chair.x, z: LAYOUT.chair.z, yaw: 0.4, wp: 0, angry: 0, startle: 0, hasHat: true, asleep: true, chase: false, shooCd: 0, lure: false, trapped: false },
    scarecrowDown: false, scarecrowTilt: 0, scarecrowAV: 0, rings: [], score: 0, elapsed: 0, time: 0,
    objectives: { pond: false, pumpkin: false, scarecrow: false, picnic: false, hat: false },
    pondSet: new Set(), events: [], won: false,
    herd: false, bounceCd: 0, boing: 0, gateShut: false, gateAngle: -1.15, scoreMul: 1,
    roadOpen: false, roadAngle: 0, justRamp: -1, rampLatch: -1,
  };
}

interface StepOpts { g?: number; snap?: boolean; bounce?: boolean; floor?: number }
/** Integrates one body; returns the landing speed if it touched down this step (else 0). */
function stepBody(b: Body, dt: number, drag: number, o: StepOpts = {}): number {
  const wasGround = b.onGround;
  b.vy -= (o.g ?? G) * dt;
  const zHi = roadGate.open ? ROAD_Z : FENCE;
  const nx = Math.max(-FENCE, Math.min(FENCE, b.x + b.vx * dt));
  const nz = Math.max(-FENCE, Math.min(zHi, b.z + b.vz * dt));
  const h = heightAt(nx, nz, b.y);
  if (h > b.y + STEP) {
    if (heightAt(nx, b.z, b.y) <= b.y + STEP) { b.x = nx; b.vz *= -0.2; }
    else if (heightAt(b.x, nz, b.y) <= b.y + STEP) { b.z = nz; b.vx *= -0.2; }
    else { b.vx *= -0.3; b.vz *= -0.3; }
  } else { b.x = nx; b.z = nz; }
  if (Math.abs(nx) >= FENCE - 0.001) b.vx *= -0.4;
  if (nz <= -FENCE + 0.001 || nz >= zHi - 0.001) b.vz *= -0.4;
  b.y += b.vy * dt;
  const g = Math.min(heightAt(b.x, b.z, b.y), b.y + STEP + 0.01);
  let ground = g > 40 ? b.y : g;
  // Dive replaces the pond surface with the bed. Land, dock, and pads stay put.
  if (o.floor != null && ground < 0 && ground > o.floor && ground < o.floor + 1.25) ground = o.floor;
  let landed = 0;
  if (b.y <= ground) {
    if (!wasGround) landed = -b.vy;
    b.y = ground;
    b.vy = o.bounce !== false && b.vy < -4 ? -b.vy * 0.25 : 0;
    b.onGround = true;
    const k = Math.exp(-drag * dt);
    b.vx *= k; b.vz *= k;
  } else if (o.snap && wasGround && b.vy <= 0 && b.y - ground < SNAP) {
    // stick to slopes (e.g. walking down the barn ramp) instead of floating off them
    b.y = ground; b.vy = 0; b.onGround = true;
  } else b.onGround = false;
  return landed;
}

export const pumpkinsOut = (s: Sim) => s.props.filter((p) => p.kind === "pumpkin" && !inGarden(p.x, p.z)).length;
export const tableCleared = (s: Sim) =>
  s.props.filter((p) => p.table).every((p) => !inRect(TABLE, p.x, p.z, 0.1) || p.y < TABLE.h - 0.2);
export const hatInPond = (s: Sim) => { const h = s.props.find((p) => p.kind === "hat")!; return !h.attached && inPond(h.x, h.z); };

export function evaluateObjectives(s: Sim): Record<ObjectiveId, boolean> {
  return {
    pond: s.pondSet.size >= 3,
    pumpkin: pumpkinsOut(s) >= 5,
    scarecrow: s.scarecrowDown,
    picnic: tableCleared(s),
    hat: hatInPond(s),
  };
}

const impactSound = (a: PropKind, b?: PropKind): GameEvent =>
  FRAGILE.has(a) || (b && FRAGILE.has(b)) ? "clatter" : PROP_DEFS[a].wood || (b && PROP_DEFS[b].wood) ? "thud" : "bump";
function impact(s: Sim, active: boolean, ev: GameEvent, ...ps: Prop[]) {
  if (!active || ps.some((p) => p.hitCd > 0)) return;
  for (const p of ps) p.hitCd = 0.25;
  s.events.push(ev);
}

export function stepSim(s: Sim, input: Input, camYaw: number, dt: number, active: boolean) {
  // Keep a hot-reloaded sim from the previous build from throwing on new fields.
  if (s.gateAngle == null || s.boing == null || s.roadAngle == null) {
    s.herd ??= false; s.bounceCd ??= 0; s.boing ??= 0; s.gateShut ??= false; s.gateAngle ??= -1.15;
    s.farmer.lure ??= false; s.farmer.trapped ??= false;
    s.chickens.forEach((c, i) => { c.id ??= i; c.penned ??= false; });
    s.scoreMul ??= 1; s.roadOpen ??= false; s.roadAngle ??= 0; s.justRamp ??= -1; s.rampLatch ??= -1;
    s.duck.air ??= 4; s.duck.diving ??= false; s.duck.boosting ??= false; s.duck.diveCd ??= 0;
    coopGate.shut = !!s.gateShut;
    roadGate.open = !!s.roadOpen;
  }
  roadGate.open = !!s.roadOpen;
  if (!s.props.some((p) => p.kind === "lure")) {
    for (const spot of LURE_SPOTS) {
      const id = s.props.length;
      s.props.push({
        id, kind: "lure", x: spot.x, y: BIG_BED + 0.06, z: spot.z, vx: 0, vy: 0, vz: 0,
        ox: spot.x, oz: spot.z, yaw: id, tilt: 0, tipped: false, hitCd: 0, onGround: true,
        disturbed: true, pondCounted: true, table: false, attached: false, pinned: true,
      });
    }
  }
  s.justRamp = -1;
  s.time += dt;
  if (active) s.elapsed += dt;
  const d = s.duck;
  const fwdX = -Math.sin(camYaw), fwdZ = -Math.cos(camYaw);
  const rx = -fwdZ, rz = fwdX;
  let gliding = false;
  let wantDive = false;

  if (active) {
    if (input.reset) { d.x = SPAWN.x; d.z = SPAWN.z; d.y = 0.5; d.vx = d.vy = d.vz = 0; }
    let mx = fwdX * input.fz + rx * input.fx, mz = fwdZ * input.fz + rz * input.fx;
    const ml = Math.hypot(mx, mz);
    if (ml > 1) { mx /= ml; mz /= ml; }
    const inBig = inBigPond(d.x, d.z);
    const onTop = onDock(d.x, d.z) || onIsland(d.x, d.z) || lilyAt(d.x, d.z) >= 0 || rampAt(d.x, d.z) >= 0;
    d.swimming = ((inPond(d.x, d.z) && d.y < 0.1) || (inBig && !onTop && d.y < BIG_SURFACE + 0.4));
    wantDive = inBig && input.dive && d.air > 0 && d.diveCd <= 0 && !onTop && d.y < southGroundY(d.z) + 0.35;
    const grounded = d.onGround || d.swimming;
    const heldMass = d.held !== null ? PROP_DEFS[s.props[d.held]!.kind].mass : 0;
    const boost = input.sprint && inBig && d.swimming && !input.dive;
    const speed = (d.swimming ? (boost ? HYDRO : SWIM) : input.sprint ? SPRINT : WALK) / (1 + heldMass * 0.25);
    const a = 1 - Math.exp(-(grounded ? ACCEL : AIR_ACCEL) * dt);
    d.vx += (mx * speed - d.vx) * a;
    d.vz += (mz * speed - d.vz) * a;
    if (ml > 0.1) {
      const target = Math.atan2(mx, mz);
      let diff = target - d.yaw; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      d.yaw += diff * Math.min(1, dt * TURN);
    }
    d.coyote = grounded ? COYOTE : Math.max(0, d.coyote - dt);
    d.jumpBuf = input.jump ? JUMP_BUFFER : Math.max(0, d.jumpBuf - dt);
    if (d.jumpBuf > 0 && d.coyote > 0) {
      d.vy = JUMP_V; d.glide = 0; d.onGround = false; d.coyote = 0; d.jumpBuf = 0; s.events.push("jump");
    }
    if (!d.onGround && input.jumpHeld && d.vy < GLIDE_FALL && d.glide < GLIDE_TIME) {
      d.vy = GLIDE_FALL; d.glide += dt; d.flap += dt * 30; gliding = true;
    }
    if (d.onGround) d.glide = 0;
    if (gliding) { d.flapCd -= dt; if (d.flapCd <= 0) { d.flapCd = FLAP_EVERY; s.events.push("flap"); } } else d.flapCd = 0;
    d.flap += dt * (ml > 0.1 ? (input.sprint ? 22 : 12) : 0);
  } else { d.vx *= 0.9; d.vz *= 0.9; }

  const rising = d.vy > 0;
  const gDuck = gliding ? DUCK_G : rising ? (active && input.jumpHeld ? DUCK_G : DUCK_G * CUT_MULT) : DUCK_G * FALL_MULT;
  const wasInPond = inPond(d.x, d.z);
  const landSpeed = stepBody(d, dt, 0, { g: gDuck, snap: !gliding && !wantDive, bounce: false, floor: wantDive ? BIG_BED + 0.32 : undefined });
  if (!wasInPond && inPond(d.x, d.z) && active) { s.events.push("splash"); s.score += 5 * (s.scoreMul || 1); }
  else if ((inPond(d.x, d.z) || inBigPond(d.x, d.z)) && landSpeed > 6 && active && !d.diving) s.events.push("splash");
  s.bounceCd = Math.max(0, s.bounceCd - dt);
  s.boing = Math.max(0, s.boing - dt);
  d.diveCd = Math.max(0, d.diveCd - dt);
  const inBigNow = inBigPond(d.x, d.z);
  const onRampNow = rampAt(d.x, d.z) >= 0;
  const boost = active && input.sprint && inBigNow && !input.dive && (d.swimming || onRampNow);
  d.boosting = boost;
  if (active && inBigNow && input.dive && d.air > 0 && d.diveCd <= 0 && d.y < southGroundY(d.z) + 0.2 && !onDock(d.x, d.z) && !onIsland(d.x, d.z) && lilyAt(d.x, d.z) < 0) {
    d.diving = true;
    d.boosting = false;
    d.swimming = true;
    d.air = Math.max(0, d.air - dt);
    const target = BIG_BED + 0.32;
    d.y += (target - d.y) * Math.min(1, dt * 7);
    d.vy = Math.min(0, d.vy);
    d.onGround = false;
    if (d.air <= 0) { d.diving = false; d.diveCd = 0.65; }
  } else {
    d.diving = false;
    if (inBigNow && d.y < BIG_SURFACE - 0.3) d.y += (BIG_SURFACE - d.y) * Math.min(1, dt * 4);
    if (d.swimming || d.onGround) d.air = Math.min(4, d.air + dt * 1.15);
  }
  if (active && d.boosting) {
    const rid = rampAt(d.x, d.z);
    const uphill = rid >= 0 && d.y > BIG_SURFACE + 0.35;
    if (uphill && Math.hypot(d.vx, d.vz) > 5 && s.rampLatch !== rid) {
      s.rampLatch = rid;
      s.justRamp = rid;
      d.vy = 11;
      d.onGround = false;
      d.swimming = false;
      s.events.push("splash");
    } else if (rid < 0) s.rampLatch = -1;
  } else if (rampAt(d.x, d.z) < 0) s.rampLatch = -1;
  if (active && s.bounceCd <= 0 && onHay(d.x, d.z) && landSpeed > 0.8) {
    d.vy = 22;
    d.onGround = false;
    d.glide = 0;
    const ax = LAYOUT.egg.x - d.x, az = LAYOUT.egg.z - d.z, al = Math.hypot(ax, az) || 1;
    const along = d.vx * (ax / al) + d.vz * (az / al);
    const aim = 1.6;
    if (along < aim) { d.vx += (ax / al) * (aim - along); d.vz += (az / al) * (aim - along); }
    s.bounceCd = 0.45;
    s.boing = 0.38;
    s.events.push("boing");
  }
  d.quackCd = Math.max(0, d.quackCd - dt);
  d.quackAnim = Math.max(0, d.quackAnim - dt);

  // footsteps / paddling
  const hs = Math.hypot(d.vx, d.vz);
  if (active && hs > 0.8 && (d.onGround || d.swimming)) {
    if (d.swimming) {
      d.stepDist += dt;
      if (d.stepDist > PADDLE_EVERY) { d.stepDist = 0; s.events.push("paddle"); }
    } else {
      d.stepDist += hs * dt;
      if (d.stepDist > (input.sprint ? STRIDE_SPRINT : STRIDE_WALK)) { d.stepDist = 0; s.events.push(onWood(d.x, d.z, d.y) ? "stepWood" : "step"); }
    }
  } else if (landSpeed > 4 && active && !d.swimming) s.events.push(onWood(d.x, d.z, d.y) ? "stepWood" : "step");

  // grab / fling
  const dfx = Math.sin(d.yaw), dfz = Math.cos(d.yaw);
  if (active && input.grab) {
    if (d.held !== null) {
      const p = s.props[d.held]!;
      const m = PROP_DEFS[p.kind].mass;
      const f = FLING / Math.sqrt(m);
      p.vx = d.vx + dfx * f; p.vz = d.vz + dfz * f; p.vy = 3.5; p.onGround = false; p.flung = true;
      d.held = null; s.events.push("fling");
    } else {
      let best = -1, bd = GRAB_RANGE;
      for (const p of s.props) {
        if (p.kind === "lure" && !d.diving) continue;
        const dist = Math.hypot(p.x - (d.x + dfx * 0.6), p.z - (d.z + dfz * 0.6)) - PROP_DEFS[p.kind].r * 0.5;
        const yGap = p.kind === "lure" ? 1.2 : 1.5;
        if (Math.abs(p.y - d.y) > yGap && !p.attached) continue;
        if (p.attached) {
          const f = s.farmer;
          const behind = (d.x - f.x) * Math.sin(f.yaw) + (d.z - f.z) * Math.cos(f.yaw) < 0.2;
          if (!behind || Math.hypot(d.x - f.x, d.z - f.z) > 1.8) continue;
          if (1.0 < bd) { bd = 1.0; best = p.id; }
          continue;
        }
        if (dist < bd) { bd = dist; best = p.id; }
      }
      if (best >= 0) {
        const p = s.props[best]!;
        if (p.attached) { p.attached = false; s.farmer.hasHat = false; s.farmer.angry = 2.5; s.score += 30; }
        if (p.kind === "lure") p.pinned = false;
        p.tipped = false; p.tilt = 0;
        d.held = best; s.events.push("grab");
      }
    }
  }

  // quack
  if (active && input.quack && d.quackCd <= 0) {
    d.quackCd = QUACK_COOLDOWN; d.quackAnim = QUACK_ANIM; d.quacks++;
    s.events.push("quack"); s.score += 1;
    s.rings.push({ x: d.x + dfx * 0.7, y: d.y + 0.88, z: d.z + dfz * 0.7, yaw: d.yaw, t: 0 });
    for (const p of s.props) {
      if (p.attached || p.id === d.held || p.pinned) continue;
      const dx = p.x - d.x, dz = p.z - d.z, dist = Math.hypot(dx, dz);
      if (dist < QUACK_RADIUS && dist > 0.01) {
        const m = PROP_DEFS[p.kind].mass;
        if (m > QUACK_MAX_MASS) continue;
        const f = (QUACK_FORCE * (1 - dist / QUACK_RADIUS)) / m;
        p.vx += (dx / dist) * f; p.vz += (dz / dist) * f; p.vy += f * 0.5; p.onGround = false;
        if (TIPPABLE.has(p.kind)) p.tipped = true;
      }
    }
    for (const c of s.chickens) if (!c.penned && Math.hypot(c.x - d.x, c.z - d.z) < HERD_NEAR) c.flee = 2.15;
    const fdx0 = d.x - s.farmer.x, fdz0 = d.z - s.farmer.z, fd0 = Math.hypot(fdx0, fdz0);
    const ahead = fd0 > 0.05 ? (fdx0 * Math.sin(s.farmer.yaw) + fdz0 * Math.cos(s.farmer.yaw)) / fd0 : 1;
    if (fd0 < 1.65 && ahead < -0.35) {
      const hat = s.props.find((p) => p.kind === "hat" && p.attached);
      if (hat) {
        hat.attached = false; hat.onGround = false; s.farmer.hasHat = false;
        hat.vx = -Math.sin(s.farmer.yaw) * 2.4; hat.vz = -Math.cos(s.farmer.yaw) * 2.4; hat.vy = 3.6;
        s.farmer.angry = 2.6; s.farmer.startle = 1.2;
      }
    }
    if (fd0 < FARMER_HEAR) { s.farmer.angry = Math.max(s.farmer.angry, 2.5); s.farmer.startle = Math.max(s.farmer.startle, 0.6); }
    if (Math.hypot(SCARECROW.x - d.x, SCARECROW.z - d.z) < 2.3) shoveScarecrow(s, 1.6);
  }
  s.rings = s.rings.filter((r) => (r.t += dt) < 0.8);

  // props
  for (const p of s.props) {
    const def = PROP_DEFS[p.kind];
    p.hitCd = Math.max(0, p.hitCd - dt);
    if (p.pinned) { p.vx = p.vy = p.vz = 0; p.onGround = true; continue; }
    if (p.attached) {
      const f = s.farmer; p.x = f.x; p.z = f.z; p.y = f.asleep ? 1.15 : 1.75; p.yaw = f.yaw; continue;
    }
    if (p.id === d.held) {
      p.x = d.x + dfx * (0.55 + def.r); p.z = d.z + dfz * (0.55 + def.r); p.y = d.y + 0.25;
      p.vx = d.vx; p.vz = d.vz; p.vy = 0; p.yaw = d.yaw;
      if (heightAt(p.x, p.z) > p.y + STEP) { p.x = d.x; p.z = d.z; }
    } else {
      const sp = Math.hypot(p.vx, p.vz);
      const landed = stepBody(p, dt, inPond(p.x, p.z) ? 1.2 : GROUND_DRAG);
      if (landed > 3.5 && !inPond(p.x, p.z)) impact(s, active, impactSound(p.kind), p);
      if (p.onGround && !inPond(p.x, p.z)) p.flung = false;
      p.yaw += sp * dt * 0.8;
    }
    if (p.tipped) p.tilt += (Math.PI / 2 - p.tilt) * Math.min(1, dt * 8);
    if (!p.disturbed && Math.hypot(p.x - p.ox, p.z - p.oz) > 0.8) {
      p.disturbed = true;
      if (TIPPABLE.has(p.kind) && p.id !== d.held) p.tipped = true;
      if (active) { s.score += 10 * (s.scoreMul || 1); impact(s, active, impactSound(p.kind), p); }
    }
    if (!p.pondCounted && inPond(p.x, p.z) && p.id !== d.held) {
      p.pondCounted = true; s.pondSet.add(p.id);
      if (active) { s.score += 25 * (s.scoreMul || 1); s.events.push("splash"); }
    }
    if (p.kind === "lure" && p.id !== d.held && !p.pinned && inBigPond(p.x, p.z) && !onDock(p.x, p.z)) {
      p.y = BIG_BED + 0.06; p.vx = p.vz = p.vy = 0; p.pinned = true; p.onGround = true;
    }
    if (!s.scarecrowDown && Math.hypot(p.x - SCARECROW.x, p.z - SCARECROW.z) < 0.7 && Math.hypot(p.vx, p.vz) > 2) shoveScarecrow(s, 2.4);
  }

  // collisions: duck vs props, props vs props
  const DR = 0.4;
  for (const p of s.props) {
    if (p.attached || p.pinned || p.id === d.held) continue;
    const def = PROP_DEFS[p.kind];
    if (p.y > d.y + 0.8 || d.y > p.y + def.h) continue;
    const dx = p.x - d.x, dz = p.z - d.z, dist = Math.hypot(dx, dz), min = DR + def.r;
    if (dist < min && dist > 1e-4) {
      const nx = dx / dist, nz = dz / dist, push = (min - dist);
      p.x += nx * push; p.z += nz * push;
      const rel = d.vx * nx + d.vz * nz;
      if (rel > 0) {
        const k = (1.6 / def.mass); p.vx += nx * rel * k; p.vz += nz * rel * k; if (rel > 4 && def.mass < 1) p.vy += 2;
        if (rel > 3) impact(s, active, impactSound(p.kind), p);
      }
    }
  }
  for (let i = 0; i < s.props.length; i++) for (let j = i + 1; j < s.props.length; j++) {
    const a = s.props[i]!, b = s.props[j]!;
    if (a.attached || b.attached || a.pinned || b.pinned || a.id === d.held || b.id === d.held) continue;
    const da = PROP_DEFS[a.kind], db = PROP_DEFS[b.kind];
    if (a.y > b.y + db.h * 0.9 || b.y > a.y + da.h * 0.9) {
      // stacking: rest on top
      const top = a.y > b.y ? a : b, bot = top === a ? b : a, dt2 = top === a ? db : da;
      if (Math.hypot(a.x - b.x, a.z - b.z) < (da.r + db.r) * 0.6 && top.y < bot.y + dt2.h && top.vy <= 0) {
        if (top.vy < -3.5) impact(s, active, impactSound(a.kind, b.kind), a, b);
        top.y = bot.y + dt2.h; top.vy = 0; top.onGround = true; top.vx *= 0.9; top.vz *= 0.9;
      }
      continue;
    }
    const dx = b.x - a.x, dz = b.z - a.z, dist = Math.hypot(dx, dz), min = da.r + db.r;
    if (dist < min && dist > 1e-4) {
      const nx = dx / dist, nz = dz / dist, push = (min - dist) / 2;
      a.x -= nx * push; a.z -= nz * push; b.x += nx * push; b.z += nz * push;
      const rel = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
      if (rel > 0) {
        const tm = da.mass + db.mass;
        a.vx -= nx * rel * (db.mass / tm) * 1.2; a.vz -= nz * rel * (db.mass / tm) * 1.2;
        b.vx += nx * rel * (da.mass / tm) * 1.2; b.vz += nz * rel * (da.mass / tm) * 1.2;
        if (rel > 2.5) impact(s, active, impactSound(a.kind, b.kind), a, b);
      }
    }
  }
  // duck vs scarecrow
  if (!s.scarecrowDown && Math.hypot(d.x - SCARECROW.x, d.z - SCARECROW.z) < 0.85 && Math.hypot(d.vx, d.vz) > 2.4) shoveScarecrow(s, 3.2);
  {
    const a = s.scarecrowTilt;
    const torque = a < 0.7 ? -a * 7 : 11;
    s.scarecrowAV += torque * dt;
    s.scarecrowAV *= Math.exp(-1.4 * dt);
    s.scarecrowTilt = Math.max(0, Math.min(Math.PI / 2, a + s.scarecrowAV * dt));
    if (!s.scarecrowDown && s.scarecrowTilt > Math.PI / 3) { s.scarecrowDown = true; s.events.push("thud"); }
  }

  // chickens — flee straight away from a sprint or a quack; penned birds stay in the garden and peck
  for (const c of s.chickens) {
    const ddx = c.x - d.x, ddz = c.z - d.z, dd = Math.hypot(ddx, ddz);
    if (c.penned) c.flee = 0;
    else if (input.sprint && dd < HERD_NEAR && Math.hypot(d.vx, d.vz) > 1.6) c.flee = Math.max(c.flee, 1.35);
    let tx: number, tz: number, sp: number;
    if (!c.penned && c.flee > 0) {
      c.flee -= dt;
      tx = c.x + (ddx / (dd || 1)) * 4;
      tz = c.z + (ddz / (dd || 1)) * 4;
      sp = 6.4;
    } else if (c.penned) {
      if (Math.hypot(c.tx - c.x, c.tz - c.z) < 0.28 || Math.random() < dt * 0.45) {
        c.tx = GARDEN.x0 + 1.4 + Math.random() * (GARDEN.x1 - GARDEN.x0 - 2.8);
        c.tz = GARDEN.z0 + 1.4 + Math.random() * (GARDEN.z1 - GARDEN.z0 - 2.8);
      }
      tx = c.tx; tz = c.tz; sp = 0.55;
    } else {
      if (Math.hypot(c.tx - c.x, c.tz - c.z) < 0.3 || Math.random() < dt * 0.15) {
        c.tx = 16.2 + Math.random() * 3.6;
        c.tz = 10.4 + Math.random() * 3.2;
      }
      tx = c.tx; tz = c.tz; sp = 1.15;
    }
    const lx = tx - c.x, lz = tz - c.z, ll = Math.hypot(lx, lz) || 1;
    c.vx += ((lx / ll) * sp - c.vx) * Math.min(1, dt * 6);
    c.vz += ((lz / ll) * sp - c.vz) * Math.min(1, dt * 6);
    const nx = Math.max(-BOUND, Math.min(BOUND, c.x + c.vx * dt));
    const nz = Math.max(-BOUND, Math.min(BOUND, c.z + c.vz * dt));
    const entering = !c.penned && inGarden(nx, nz) && !inGarden(c.x, c.z);
    const leaving = c.penned && !inGarden(nx, nz);
    const blocked = inRect(COOP, nx, nz, 0.2) || inPond(nx, nz);
    const h = heightAt(nx, nz);
    if (entering && !(s.herd && c.flee > 0)) {
      const cx = (GARDEN.x0 + GARDEN.x1) / 2, cz = (GARDEN.z0 + GARDEN.z1) / 2;
      const ax = c.x - cx, az = c.z - cz, al = Math.hypot(ax, az) || 1;
      c.vx = (ax / al) * 2.4; c.vz = (az / al) * 2.4;
      c.tx = c.x + ax; c.tz = c.z + az;
    } else if (leaving || blocked || !(h < 0.3 && h > -0.1)) {
      c.vx *= -0.5; c.vz *= -0.5;
      if (c.penned) { c.tx = 9; c.tz = 9; }
      else { c.tx = c.x; c.tz = Math.min(c.z, COOP.z0 - 1.2); }
    } else { c.x = nx; c.z = nz; }
    if (Math.hypot(c.vx, c.vz) > 0.2) c.yaw = Math.atan2(c.vx, c.vz);
    c.hop += dt * (c.penned && Math.hypot(c.vx, c.vz) < 0.85 ? 9 : Math.hypot(c.vx, c.vz) * 4);
  }

  // farmer
  const f = s.farmer;
  f.startle = Math.max(0, f.startle - dt);
  f.shooCd = Math.max(0, f.shooCd - dt);
  const tableCx = (TABLE.x0 + TABLE.x1) / 2, tableCz = (TABLE.z0 + TABLE.z1) / 2;
  const onTable = inRect(TABLE, d.x, d.z, 0.05) && d.y > TABLE.h - 0.35;
  const toTx = tableCx - f.x, toTz = tableCz - f.z, toTd = Math.hypot(toTx, toTz) || 1;
  const facingTable = (Math.sin(f.yaw) * toTx + Math.cos(f.yaw) * toTz) / toTd > 0.45;
  if (!f.asleep && !f.chase && onTable && toTd < 5 && facingTable) {
    f.angry = Math.max(f.angry, 0.85);
    if (f.shooCd <= 0) {
      f.shooCd = 1.15; s.events.push("grumble"); f.startle = Math.max(f.startle, 0.45);
      const ox = d.x - tableCx, oz = d.z - tableCz, ol = Math.hypot(ox, oz) || 1;
      d.vx += (ox / ol) * 5.5; d.vz += (oz / ol) * 5.5; d.vy = Math.max(d.vy, 3.2);
    }
  }
  if (f.trapped) {
    f.angry = Math.max(f.angry, 2.2);
    f.chase = false;
    f.lure = false;
    const spotX = 18, spotZ = 17.15;
    const lx = spotX - f.x, lz = spotZ - f.z, ll = Math.hypot(lx, lz);
    if (ll > 0.25) {
      const step = Math.min(1.5 * dt, ll);
      f.x += (lx / ll) * step; f.z += (lz / ll) * step;
    }
    let diff = Math.PI - f.yaw; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    f.yaw += diff * Math.min(1, dt * 8);
  } else if (f.lure) {
    f.chase = false;
    const linedUp = Math.abs(f.x - LAYOUT.latch.x) < 0.75 && f.z > COOP.z0 - 0.55;
    const tx = LAYOUT.latch.x;
    const tz = linedUp ? 17.2 : COOP.z0 - 0.15;
    const lx = tx - f.x, lz = tz - f.z, ll = Math.hypot(lx, lz);
    if (ll > 0.2) {
      const step = Math.min(4.2 * dt, ll);
      f.x += (lx / ll) * step; f.z += (lz / ll) * step;
      let diff = Math.atan2(lx, lz) - f.yaw; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      f.yaw += diff * Math.min(1, dt * 6);
    }
  } else if (f.asleep) {
    /* dozing on the porch until the coop quack wakes him */
  } else if (f.chase) {
    let tx = d.x, tz = d.z;
    const edge = POND.r + 0.45;
    if (Math.hypot(tx - POND.x, tz - POND.z) < edge) {
      const ang = Math.atan2(tz - POND.z, tx - POND.x);
      tx = POND.x + Math.cos(ang) * edge; tz = POND.z + Math.sin(ang) * edge;
    }
    const lx = tx - f.x, lz = tz - f.z, ll = Math.hypot(lx, lz);
    if (ll > 0.35) {
      const step = Math.min(3.6 * dt, ll);
      let nx = f.x + (lx / ll) * step, nz = f.z + (lz / ll) * step;
      if (Math.hypot(nx - POND.x, nz - POND.z) < edge) {
        const ang = Math.atan2(f.z - POND.z, f.x - POND.x);
        nx = POND.x + Math.cos(ang) * edge; nz = POND.z + Math.sin(ang) * edge;
      }
      f.x = nx; f.z = nz;
      let diff = Math.atan2(lx, lz) - f.yaw; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      f.yaw += diff * Math.min(1, dt * 8);
    }
  } else if (f.angry > 0) {
    f.angry -= dt;
    let diff = Math.atan2(d.x - f.x, d.z - f.z) - f.yaw; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    f.yaw += diff * Math.min(1, dt * 14);
  } else {
    const w = FARMER_PATH[f.wp]!;
    const lx = w.x - f.x, lz = w.z - f.z, ll = Math.hypot(lx, lz);
    if (ll < 0.2) f.wp = (f.wp + 1) % FARMER_PATH.length;
    else {
      const sp = 1.3 * dt;
      f.x += (lx / ll) * Math.min(sp, ll); f.z += (lz / ll) * Math.min(sp, ll);
      let diff = Math.atan2(lx, lz) - f.yaw; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      f.yaw += diff * Math.min(1, dt * 5);
    }
  }
  const gateTarget = s.gateShut || coopGate.shut ? 0 : -1.15;
  s.gateAngle += (gateTarget - s.gateAngle) * Math.min(1, dt * (s.gateShut ? 10 : 4));
  const roadTarget = s.roadOpen || roadGate.open ? -1.45 : 0;
  s.roadAngle += (roadTarget - s.roadAngle) * Math.min(1, dt * 2.4);
  const fdx = d.x - f.x, fdz = d.z - f.z, fd = Math.hypot(fdx, fdz);
  if (!f.chase && fd < 0.9 && fd > 1e-4 && d.y < 1.6) { d.x = f.x + (fdx / fd) * 0.9; d.z = f.z + (fdz / fd) * 0.9; }
}

function shoveScarecrow(s: Sim, power: number) {
  if (s.scarecrowTilt > Math.PI / 2 - 0.08) return;
  s.scarecrowAV += power;
}
