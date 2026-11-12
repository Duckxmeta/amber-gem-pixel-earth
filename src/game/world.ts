import type { Sim } from "./sim";
import { CAM_PITCH } from "./camera";

export const world: {
  sim: Sim | null;
  camYaw: number;
  yawTarget: number;
  pitch: number;
  pitchTarget: number;
  canvas: HTMLCanvasElement | null;
} = { sim: null, camYaw: 0, yawTarget: 0, pitch: CAM_PITCH, pitchTarget: CAM_PITCH, canvas: null };

/** Engage pointer lock on the game canvas. Must be called from a click or keypress. */
export function requestMouseLook() {
  const el = world.canvas;
  if (!el || document.pointerLockElement === el) return;
  try {
    const r = el.requestPointerLock() as unknown as Promise<void> | undefined;
    if (r && typeof r.catch === "function") r.catch(() => {});
  } catch { /* unsupported or denied: keyboard still works */ }
}
