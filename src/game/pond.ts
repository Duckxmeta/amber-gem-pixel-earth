// Act 2 zone: south of the farm fence. Pure numbers, no React or physics step.

export const FENCE = 23.4;
export const ROAD_Z = 74;
export const SOUTH_GROUND = -1.8;
export const BIG_SURFACE = -2.05;
export const BIG_BED = -2.85;
export const BIG = { x: 0, z: 56, rx: 13, rz: 11 };
export const DOCK = { x0: -10, x1: -2.2, z0: 44.2, z1: 48.6, y: -1.32 };
export const ISLAND = { x: 5.2, z: 64, r: 2.05, y: -1.22 };
export const LILY_R = 1.32;
export const LILY_Y = -1.48;
export const LILIES: readonly { x: number; z: number }[] = [
  { x: -1.2, z: 49.2 },
  { x: 1.6, z: 52.2 },
  { x: 3.6, z: 55.1 },
  { x: 5.0, z: 57.8 },
  { x: 5.3, z: 60.2 },
];
export const WAKE_RAMPS: readonly { id: number; x: number; z: number; yaw: number }[] = [
  { id: 0, x: -7.2, z: 51.2, yaw: 0.45 },
  { id: 1, x: -6.4, z: 57.6, yaw: -0.15 },
  { id: 2, x: 1.2, z: 65.4, yaw: 1.05 },
];
export const LURE_SPOTS: readonly { x: number; z: number }[] = [
  { x: -4.6, z: 54.2 },
  { x: 2.4, z: 57.4 },
  { x: -1.2, z: 63.1 },
];
/** Gate hinge on the south fence. The leaf extends toward +X when shut. */
export const SOUTH_GATE = { x: -2.15, z: 24 };
export const roadGate = { open: false };

const inRect = (r: { x0: number; x1: number; z0: number; z1: number }, x: number, z: number, m = 0) =>
  x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;

export const inBigPond = (x: number, z: number) => {
  const dx = (x - BIG.x) / BIG.rx, dz = (z - BIG.z) / BIG.rz;
  return dx * dx + dz * dz < 1;
};
export const southGroundY = (z: number) => {
  if (z < 25) return 0;
  if (z < 40) return SOUTH_GROUND * ((z - 25) / 15);
  return SOUTH_GROUND;
};
export const roadX = (z: number) => Math.sin((z - 24) * 0.18) * 8;
export const onDock = (x: number, z: number) => inRect(DOCK, x, z, 0.15);
export const onIsland = (x: number, z: number) => Math.hypot(x - ISLAND.x, z - ISLAND.z) < ISLAND.r;
export function lilyAt(x: number, z: number): number {
  for (let i = 0; i < LILIES.length; i++) {
    const p = LILIES[i]!;
    if (Math.hypot(x - p.x, z - p.z) < LILY_R) return i;
  }
  return -1;
}
export function rampAt(x: number, z: number): number {
  for (const r of WAKE_RAMPS) {
    const dx = x - r.x, dz = z - r.z;
    const c = Math.cos(r.yaw), s = Math.sin(r.yaw);
    const lx = dx * c + dz * s;
    const lz = -dx * s + dz * c;
    if (Math.abs(lx) < 0.85 && lz > -0.3 && lz < 3.3) return r.id;
  }
  return -1;
}
/** Closed south fence is solid. Open, only the posts outside the leaf stay solid. */
export function southFenceBlocks(x: number, z: number): boolean {
  if (z < 22.95 || z > 24.25 || Math.abs(x) > FENCE + 0.6) return false;
  if (roadGate.open && Math.abs(x - 0) < 2.25) return false;
  return true;
}
