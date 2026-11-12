// Pure camera math (no three.js) so the orbit rules are testable.
export const CAM_DIST = 7.6, CAM_PITCH = 0.42, PITCH_MIN = 0.08, PITCH_MAX = 1.4; // just above ground … near top-down
export const ORBIT_YAW_SPEED = 0.0025, ORBIT_PITCH_SPEED = 0.002; // radians per mouse pixel

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Camera yaw that sits directly behind a duck facing `duckYaw`, picked as the nearest equivalent angle to `currentYaw`. */
export function behindYaw(duckYaw: number, currentYaw: number) {
  return currentYaw + wrap(duckYaw + Math.PI - currentYaw);
}

/** Moves `from` toward `to` along the shortest arc with exponential smoothing. */
export function dampAngle(from: number, to: number, rate: number, dt: number) {
  return from + (to - from) * (1 - Math.exp(-rate * dt));
}

export const clampPitch = (p: number) => Math.max(PITCH_MIN, Math.min(PITCH_MAX, p));

/** Offset from the duck to the camera for a given orbit yaw/pitch. */
export function orbitOffset(yaw: number, pitch: number, dist = CAM_DIST) {
  const h = Math.cos(pitch) * dist;
  return { x: Math.sin(yaw) * h, y: Math.sin(pitch) * dist, z: Math.cos(yaw) * h };
}
