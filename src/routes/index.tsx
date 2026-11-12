import { createFileRoute } from "@tanstack/react-router";
import { Fragment, lazy, Suspense, useEffect, useState } from "react";
import { useGame } from "@/game/store";
import { installAudioUnlock, setMuted, unlockAudio } from "@/game/soundEffects";
import { holdKey } from "@/game/input";
import { requestMouseLook, world } from "@/game/world";
import { createMissionState, missionView } from "@/game/missions";

const GameScene = lazy(() => import("@/game/Scene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Duck Chaos Farm — 3D Duck Mischief Game" },
      {
        name: "description",
        content: "Waddle, quack, and fling through thirteen missions, crown yourself, then dive the Big Pond.",
      },
    ],
  }),
  component: Game,
});

const CONTROLS = [
  ["WASD / Arrows", "Move"], ["Mouse", "Look around"], ["Space", "Jump · hold to glide"],
  ["Shift", "Sprint · Hydro-Boost in the pond"],
  ["Left-Click / E", "Grab / fling"], ["Right-Click / F", "QUACK"],
  ["Q", "Camera behind duck"], ["C", "Camera on land · Dive in the pond"], ["Ctrl", "Dive"],
  ["R", "Reset duck"], ["Esc", "Unlock cursor"],
];
const PILL = ["WASD Move", "Mouse Look", "Space Jump/Glide", "Shift Sprint/Boost", "C/Ctrl Dive", "Left-Click / E Grab", "Right-Click / F Quack", "Q Camera"];

const fmt = (t: number) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

function pad(code: string, label: string) {
  return (
    <button
      type="button"
      className="touch-btn"
      onPointerDown={(e) => { e.preventDefault(); holdKey(code, true); }}
      onPointerUp={() => holdKey(code, false)}
      onPointerLeave={() => holdKey(code, false)}
      onPointerCancel={() => holdKey(code, false)}
    >
      {label}
    </button>
  );
}

function ClientScene() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  if (!on) return <div className="grid h-full place-items-center text-2xl text-foreground">Hatching the farm…</div>;
  return (
    <Suspense fallback={<div className="grid h-full place-items-center text-2xl text-foreground">Hatching the farm…</div>}>
      <GameScene />
    </Suspense>
  );
}

function Game() {
  const { phase, score, muted, finalTime, locked, mission, summary, set } = useGame();
  const [time, setTime] = useState(0);
  useEffect(() => { const i = setInterval(() => setTime(world.sim?.elapsed ?? 0), 500); return () => clearInterval(i); }, []);
  useEffect(() => installAudioUnlock(), []);
  const start = () => { unlockAudio(); set({ phase: "playing", mission: createMissionState(), summary: false }); requestMouseLook(); };
  const restart = () => { unlockAudio(); set({ phase: "playing", resetToken: useGame.getState().resetToken + 1, score: 0, mission: createMissionState(), summary: false }); requestMouseLook(); };
  const keepCrown = () => { set({ phase: "free", summary: false }); };
  const card = missionView(mission, score);
  const playing = phase === "playing" || phase === "free";

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background font-game select-none">
      <ClientScene />

      <button onClick={() => { const next = !muted; setMuted(next); set({ muted: next }); }} aria-label={muted ? "Unmute" : "Mute"}
        className="hud-panel absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center text-2xl">
        {muted ? "🔇" : "🔊"}
      </button>

      {phase !== "title" && (
        <>
          {card && (
            <section className="hud-panel absolute left-3 top-3 z-10 w-[min(20rem,calc(100vw-6.75rem))] p-3 lg:left-4 lg:top-4 lg:w-80 lg:p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mission {card.index} of 13</div>
              <h2 className="text-lg font-bold text-primary">{card.title}</h2>
              <p className="mt-1 text-sm leading-snug text-foreground">
                {card.hint.map((part, i) => part.kbd
                  ? <kbd key={i} className="kbd">{part.kbd}</kbd>
                  : <span key={i}>{part.text}</span>)}
              </p>
              <div className="mt-2 text-sm font-bold text-accent-foreground">{card.progress} / {card.goal}</div>
              {card.detail && <div className="text-xs text-muted-foreground">{card.detail}</div>}
            </section>
          )}
          {mission.banner && (
            <div className="pointer-events-none absolute left-1/2 top-[38%] z-20 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 text-center lg:top-28">
              <div className="mission-banner px-4 py-3 text-lg">{mission.banner}</div>
              {mission.index === "done" && (
                <div className="pointer-events-auto mt-2 flex justify-center gap-2">
                  <button type="button" className="btn-ghost-game" onClick={() => set({ mission: { ...mission, banner: null } })}>Keep roaming</button>
                  <button type="button" className="btn-game" onClick={() => set({ summary: true })}>Summary</button>
                </div>
              )}
            </div>
          )}
          <div className="hud-panel absolute right-3 top-20 z-10 px-3 py-1.5 text-center lg:left-1/2 lg:right-auto lg:top-4 lg:-translate-x-1/2 lg:px-6 lg:py-2">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Chaos Score</div>
            <div className="text-3xl font-bold text-accent-foreground">{score}</div>
            <div className="text-xs text-muted-foreground">{phase === "free" ? "Free Play" : fmt(time)}</div>
          </div>
          {playing && !locked && (
            <div className="hud-pill pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 px-5 py-2 text-sm font-semibold md:block">
              Click canvas to resume mouse look
            </div>
          )}
          <div className="controls-pill pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 md:flex">
            {PILL.map((c, i) => <Fragment key={c}>{i > 0 && <span aria-hidden className="opacity-50">•</span>}<span>{c}</span></Fragment>)}
          </div>
          {playing && (
            <div className="touch-controls">
              <div className="grid grid-cols-3 gap-1">
                <span />
                {pad("KeyW", "W")}
                <span />
                {pad("KeyA", "A")}
                {pad("KeyS", "S")}
                {pad("KeyD", "D")}
              </div>
              <div className="flex flex-col gap-2">
                {pad("Space", "Jump")}
                {pad("ShiftLeft", "Boost")}
                {pad("ControlLeft", "Dive")}
                {pad("KeyE", "Grab")}
                {pad("KeyF", "QUACK")}
              </div>
            </div>
          )}
        </>
      )}

      {phase === "title" && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-overlay p-4">
          <div className="hud-panel max-w-md p-8 text-center">
            <h1 className="title-wobble text-5xl font-bold text-primary">Duck Chaos Farm</h1>
            <p className="mt-2 text-muted-foreground">You are a duck. The farm is not ready.</p>
            <button onClick={start} className="btn-game mt-6 w-full text-2xl">Play Game</button>
            <dl className="mt-6 hidden grid-cols-2 gap-x-4 gap-y-1 text-left text-sm sm:grid">
              {CONTROLS.map(([k, v]) => (<Fragment key={k}><dt className="font-bold text-foreground"><kbd className="kbd">{k}</kbd></dt><dd className="text-muted-foreground">{v}</dd></Fragment>))}
            </dl>
          </div>
        </div>
      )}

      {summary && phase !== "title" && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-overlay p-4">
          <div className="hud-panel max-w-sm p-8 text-center">
            <div className="text-5xl">🌽</div>
            <h2 className="mt-2 text-3xl font-bold text-primary">The Big Pond is yours</h2>
            <p className="mt-2 text-muted-foreground">Thirteen missions down. The crown stays on.</p>
            <p className="mt-4 text-lg">Chaos Score: <b>{score}</b></p>
            <button onClick={() => { set({ summary: false }); requestMouseLook(); }} className="btn-game mt-6 w-full">Back to the farm</button>
          </div>
        </div>
      )}

      {phase === "won" && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-overlay p-4">
          <div className="hud-panel max-w-sm p-8 text-center">
            <div className="text-6xl">🦆👑</div>
            <h2 className="mt-2 text-4xl font-bold text-primary">Farm Conquered!</h2>
            <p className="mt-4 text-lg">Final Chaos Score: <b>{score}</b></p>
            <p className="text-muted-foreground">Total Completion Time: {fmt(finalTime)}</p>
            <button onClick={keepCrown} className="btn-game mt-6 w-full">Free Roam (Keep Crown)</button>
            <button onClick={restart} className="btn-ghost-game mt-3 w-full">Play Again (Reset Farm)</button>
          </div>
        </div>
      )}
    </main>
  );
}
