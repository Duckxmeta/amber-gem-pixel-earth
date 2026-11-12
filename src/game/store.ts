import { create } from "zustand";
import type { ObjectiveId } from "./sim";
import { createMissionState, type MissionState } from "./missions";

export type Phase = "title" | "playing" | "won" | "free";
interface UI {
  phase: Phase; score: number; muted: boolean; finalTime: number;
  objectives: Record<ObjectiveId, boolean>;
  progress: { pond: number; pumpkin: number };
  resetToken: number;
  /** Whether mouse look (pointer lock) is engaged. */
  locked: boolean;
  mission: MissionState;
  /** Optional summary card. Does not change phase, so it can open without forcing a roam reset. */
  summary: boolean;
  set: (p: Partial<UI>) => void;
}
export const useGame = create<UI>((set) => ({
  phase: "title", score: 0, muted: false, finalTime: 0,
  objectives: { pond: false, pumpkin: false, scarecrow: false, picnic: false, hat: false },
  progress: { pond: 0, pumpkin: 0 }, resetToken: 0, locked: false,
  mission: createMissionState(),
  summary: false,
  set: (p) => set(p),
}));