import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Sim } from "./sim";
import { GRAB_RANGE, inPond, inGarden, coopGate, HAY_BOUNCE, ROOF_Y } from "./sim";
import { LAYOUT, type MissionEffect } from "./missions";
import { DOCK, onDock, roadGate } from "./pond";
import { playSound } from "./soundEffects";
import { useGame } from "./store";
import { world } from "./world";

interface Pop { id: number; text: string; x: number; y: number; z: number; life: number }
interface Bit { x: number; y: number; z: number; vx: number; vy: number; vz: number; spin: number; c: number; life: number }
const CONFETTI_N = 56;
export const cues = {
  rooster: 0,
  sparkle: 0,
  corn: true,
  egg: true,
  eggSpark: 0,
  pops: [] as Pop[],
  seq: 1,
  confetti: [] as Bit[],
};

const CONFETTI_COLORS = ["#ffd24a", "#ff4d6d", "#7ec8ea", "#b8f25a", "#fff7ea", "#ff9f1c"];
const confettiMats = CONFETTI_COLORS.map((c) => new THREE.MeshBasicMaterial({ color: c }));

function spawnConfetti() {
  const bits: Bit[] = [];
  for (let i = 0; i < CONFETTI_N; i++) {
    const a = (i / CONFETTI_N) * Math.PI * 2 + Math.random() * 0.4;
    const r = 2 + Math.random() * 16;
    bits.push({
      x: Math.cos(a) * r * 0.85,
      y: 9 + Math.random() * 10,
      z: Math.sin(a) * r * 0.7,
      vx: Math.cos(a) * (1.2 + Math.random() * 2.2),
      vy: 3 + Math.random() * 5,
      vz: Math.sin(a) * (1.2 + Math.random() * 2.2),
      spin: Math.random() * 6,
      c: i % CONFETTI_COLORS.length,
      life: 3.2 + Math.random() * 1.6,
    });
  }
  cues.confetti = bits;
}

export function applyMissionEffect(s: Sim, e: MissionEffect) {
  if (e.t === "score") s.score += e.n;
  else if (e.t === "chime") playSound("chime");
  else if (e.t === "fanfare") playSound("fanfare", 0.08);
  else if (e.t === "ruffle") {
    cues.rooster = 1;
    for (const c of s.chickens) c.flee = 2.2;
  } else if (e.t === "knock") {
    for (const p of s.props) if (p.role === "feed") {
      p.pinned = false; p.onGround = false; p.disturbed = true; p.tipped = true;
      p.vy = 5.5;
      p.vx = (p.x - LAYOUT.roost.x) * 6 - 2;
      p.vz = -4;
    }
  } else if (e.t === "wake") {
    s.farmer.asleep = false;
    s.farmer.startle = 1.5;
    s.farmer.angry = 1.8;
  } else if (e.t === "sparkle") {
    cues.sparkle = 1.2;
    cues.corn = false;
  } else if (e.t === "thud") playSound("thud");
  else if (e.t === "clatter") playSound("clatter");
  else if (e.t === "chase") s.farmer.chase = true;
  else if (e.t === "armHerd") {
    s.herd = true;
    const spots = [[16.6, 11.2], [17.8, 12.35], [19.15, 11.05], [18.35, 13.25], [16.7, 13.45]];
    s.chickens.forEach((c, i) => {
      if (c.penned || !inGarden(c.x, c.z)) return;
      const spot = spots[i % spots.length]!;
      c.x = spot[0]; c.z = spot[1]; c.vx = 0; c.vz = 0; c.tx = spot[0]; c.tz = spot[1]; c.flee = 0;
    });
  } else if (e.t === "pen") {
    const c = s.chickens.find((ch) => ch.id === e.id);
    if (c) { c.penned = true; c.flee = 0; }
  } else if (e.t === "egg") {
    cues.egg = false;
    cues.eggSpark = 1.2;
  } else if (e.t === "lure") {
    s.farmer.lure = true;
    s.farmer.chase = false;
    s.farmer.asleep = false;
    s.farmer.angry = Math.max(s.farmer.angry, 0.6);
    s.farmer.startle = Math.max(s.farmer.startle, 0.8);
  } else if (e.t === "latch") {
    s.gateShut = true;
    coopGate.shut = true;
    s.farmer.trapped = true;
    s.farmer.lure = false;
    s.farmer.chase = false;
    s.farmer.angry = 3;
    s.farmer.startle = 1.1;
    playSound("latch");
  } else if (e.t === "rampage") {
    s.scoreMul = 2;
    // Re-arm props from where they sit so the finale is a fresh 600-point rampage,
    // not a pile of objects that already paid out in earlier missions.
    for (const p of s.props) {
      if (p.attached || p.pinned) continue;
      p.ox = p.x;
      p.oz = p.z;
      p.disturbed = false;
      if (!inPond(p.x, p.z)) p.pondCounted = false;
    }
  } else if (e.t === "confetti") {
    spawnConfetti();
  } else if (e.t === "conquer") {
    s.scoreMul = 1;
  } else if (e.t === "openRoad") {
    s.scoreMul = 1;
    s.roadOpen = true;
    roadGate.open = true;
  } else if (e.t === "pinLure") {
    const p = s.props.find((q) => q.id === e.id);
    if (p) {
      if (s.duck.held === p.id) s.duck.held = null;
      p.pinned = true;
      p.vx = p.vy = p.vz = 0;
      p.onGround = true;
      p.y = DOCK.y + 0.06;
      if (!onDock(p.x, p.z)) {
        p.x = (DOCK.x0 + DOCK.x1) / 2;
        p.z = (DOCK.z0 + DOCK.z1) / 2;
      }
    }
  } else if (e.t === "pop") {
    cues.pops.push({ id: cues.seq++, text: e.text, x: e.x, y: e.y, z: e.z, life: 1.35 });
    if (cues.pops.length > 6) cues.pops.shift();
  }
}

const gold = new THREE.MeshStandardMaterial({ color: "#ffd24a", emissive: "#c8890a", emissiveIntensity: 0.6, roughness: 0.35 });
const crownGold = new THREE.MeshStandardMaterial({ color: "#ffe14a", emissive: "#ffb000", emissiveIntensity: 0.9, roughness: 0.28, metalness: 0.62, flatShading: true });
const crownJewel = new THREE.MeshStandardMaterial({ color: "#ff3355", emissive: "#ff2244", emissiveIntensity: 0.75, roughness: 0.25, flatShading: true });
const red = new THREE.MeshStandardMaterial({ color: "#e23b2f", roughness: 0.5 });

/** Low-poly crown. Shared by the roof beacon and the duck once it's claimed. */
export function GoldenCrown() {
  return (
    <group>
      <mesh material={crownGold} position-y={0.02} castShadow>
        <cylinderGeometry args={[0.18, 0.21, 0.07, 6]} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} material={crownGold} position={[Math.sin(a) * 0.16, 0.11, Math.cos(a) * 0.16]} castShadow>
            <coneGeometry args={[0.046, 0.15, 4]} />
          </mesh>
        );
      })}
      <mesh material={crownJewel} position-y={0.2}>
        <octahedronGeometry args={[0.05, 0]} />
      </mesh>
    </group>
  );
}

export function TutorialActors() {
  const ring = useRef<THREE.Mesh>(null);
  const roost = useRef<THREE.Group>(null);
  const corn = useRef<THREE.Group>(null);
  const egg = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.Group>(null);
  const eggSparks = useRef<THREE.Group>(null);
  const hayRing = useRef<THREE.Mesh>(null);
  const latchRing = useRef<THREE.Mesh>(null);
  const crown = useRef<THREE.Group>(null);
  const crownRing = useRef<THREE.Mesh>(null);
  const bits = useRef<(THREE.Mesh | null)[]>([]);
  const prompt = useRef<HTMLDivElement>(null);
  const promptAnchor = useRef<THREE.Group>(null);
  const popG = useRef<(THREE.Group | null)[]>([]);
  const popL = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(({ clock }, dt) => {
    const mission = useGame.getState().mission.index;
    if (ring.current) {
      const show = mission === 1;
      ring.current.visible = show;
      const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.08;
      ring.current.scale.set(s, s, s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = show ? 0.45 + Math.sin(clock.elapsedTime * 3) * 0.2 : 0;
    }
    cues.rooster = Math.max(0, cues.rooster - dt * 1.6);
    if (roost.current) {
      const hop = Math.sin(cues.rooster * Math.PI) * 0.28;
      roost.current.position.y = hop;
      roost.current.rotation.z = Math.sin(cues.rooster * 18) * 0.2 * cues.rooster;
    }
    if (corn.current) {
      corn.current.visible = cues.corn;
      corn.current.rotation.y += dt * 1.6;
      corn.current.position.y = LAYOUT.corn.y + Math.sin(clock.elapsedTime * 2.4) * 0.08;
    }
    if (egg.current) {
      egg.current.visible = cues.egg;
      egg.current.rotation.y += dt * 1.8;
      egg.current.position.y = LAYOUT.egg.y + Math.sin(clock.elapsedTime * 2.2) * 0.1;
    }
    cues.sparkle = Math.max(0, cues.sparkle - dt);
    cues.eggSpark = Math.max(0, cues.eggSpark - dt);
    if (sparks.current) {
      sparks.current.visible = cues.sparkle > 0;
      const k = cues.sparkle / 1.2;
      sparks.current.scale.setScalar(0.4 + (1 - k) * 2.2);
    }
    if (eggSparks.current) {
      eggSparks.current.visible = cues.eggSpark > 0;
      const k = cues.eggSpark / 1.2;
      eggSparks.current.scale.setScalar(0.4 + (1 - k) * 2.4);
      eggSparks.current.rotation.y += dt * 2;
    }
    if (hayRing.current) {
      const show = mission === 8;
      hayRing.current.visible = show;
      const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.06;
      hayRing.current.scale.set(s, s, s);
      (hayRing.current.material as THREE.MeshBasicMaterial).opacity = show ? 0.4 + Math.sin(clock.elapsedTime * 3) * 0.15 : 0;
    }
    const gateOpen = !world.sim?.gateShut;
    if (latchRing.current) {
      const show = mission === 9 && gateOpen;
      latchRing.current.visible = show;
      const s = 1 + Math.sin(clock.elapsedTime * 3.4) * 0.07;
      latchRing.current.scale.set(s, s, s);
      (latchRing.current.material as THREE.MeshBasicMaterial).opacity = show ? 0.5 : 0;
    }
    const missionState = useGame.getState().mission;
    if (crown.current) {
      const show = missionState.crownReady;
      crown.current.visible = show;
      crown.current.rotation.y += dt * 1.7;
      crown.current.position.y = LAYOUT.crown.y + Math.sin(clock.elapsedTime * 2.4) * 0.16;
    }
    if (crownRing.current) {
      const show = missionState.crownReady;
      crownRing.current.visible = show;
      const s = 1 + Math.sin(clock.elapsedTime * 3) * 0.08;
      crownRing.current.scale.set(s, s, s);
      (crownRing.current.material as THREE.MeshBasicMaterial).opacity = show ? 0.55 : 0;
    }
    for (const bit of cues.confetti) {
      if (bit.life <= 0) continue;
      bit.life -= dt;
      bit.vy -= 8 * dt;
      bit.x += bit.vx * dt;
      bit.y += bit.vy * dt;
      bit.z += bit.vz * dt;
      bit.spin += dt * 5;
      if (bit.y < 0.12) { bit.y = 0.12; bit.vy = Math.abs(bit.vy) * 0.35; bit.vx *= 0.7; bit.vz *= 0.7; }
    }
    for (let i = 0; i < CONFETTI_N; i++) {
      const mesh = bits.current[i];
      const bit = cues.confetti[i];
      if (!mesh) continue;
      if (!bit || bit.life <= 0) { mesh.visible = false; continue; }
      mesh.visible = true;
      mesh.position.set(bit.x, bit.y, bit.z);
      mesh.rotation.set(bit.spin, bit.spin * 0.6, 0);
      mesh.scale.setScalar(bit.life < 0.4 ? bit.life / 0.4 : 1);
    }
    const duck = world.sim?.duck;
    let showPrompt = false;
    let promptText = "";
    if (duck && world.sim) {
      if (mission === 2) {
        let best: { x: number; y: number; z: number; d: number } | null = null;
        for (const p of world.sim.props) {
          if (p.role !== "watering" && p.role !== "boot" && p.role !== "pail") continue;
          if (inPond(p.x, p.z) || p.id === duck.held) continue;
          const d = Math.hypot(p.x - duck.x, p.z - duck.z);
          if (d < GRAB_RANGE + 0.4 && (!best || d < best.d)) best = { x: p.x, y: p.y, z: p.z, d };
        }
        if (best && promptAnchor.current) {
          showPrompt = true;
          promptText = "Grab";
          promptAnchor.current.position.set(best.x, best.y + 0.8, best.z);
        }
      } else if (mission === 9 && !world.sim.gateShut) {
        const d = Math.hypot(duck.x - LAYOUT.latch.x, duck.z - LAYOUT.latch.z);
        if (d < 2.4 && promptAnchor.current) {
          showPrompt = true;
          promptText = world.sim.farmer.lure ? "Shut gate" : "Quack inside first";
          promptAnchor.current.position.set(LAYOUT.latch.x, 1.5, LAYOUT.latch.z);
        }
      }
    }
    if (prompt.current) {
      prompt.current.style.opacity = showPrompt ? "1" : "0";
      if (showPrompt) {
        prompt.current.innerHTML = promptText === "Grab"
          ? "Grab <kbd class=\"kbd\">Left-Click</kbd> / <kbd class=\"kbd\">E</kbd>"
          : promptText === "Shut gate"
            ? "Latch <kbd class=\"kbd\">Left-Click</kbd> / <kbd class=\"kbd\">E</kbd>"
            : "Quack inside the coop first";
      }
    }
    for (const pop of cues.pops) pop.life -= dt;
    cues.pops = cues.pops.filter((pop) => pop.life > 0);
    for (let i = 0; i < 6; i++) {
      const g = popG.current[i]; const el = popL.current[i]; const pop = cues.pops[i];
      if (!g || !el) continue;
      g.visible = !!pop;
      if (!pop) continue;
      g.position.set(pop.x, pop.y + (1.35 - pop.life) * 0.7, pop.z);
      el.style.opacity = String(Math.min(1, pop.life * 1.6));
      el.textContent = pop.text;
    }
  });

  return (
    <group>
      <mesh ref={ring} position={[LAYOUT.guide.x, 0.06, LAYOUT.guide.z]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.7, 1.05, 32]} />
        <meshBasicMaterial color="#ffd24a" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <group position={[LAYOUT.chair.x, 0, LAYOUT.chair.z]}>
        <mesh position={[0, 0.28, 0]} castShadow><boxGeometry args={[0.7, 0.12, 0.7]} /><meshStandardMaterial color="#8a5a35" /></mesh>
        <mesh position={[0, 0.7, -0.28]}><boxGeometry args={[0.7, 0.7, 0.1]} /><meshStandardMaterial color="#8a5a35" /></mesh>
      </group>
      <group position={[LAYOUT.roost.x, 0, LAYOUT.roost.z]}>
        <mesh position-y={0.55}><cylinderGeometry args={[0.08, 0.1, 1.1, 6]} /><meshStandardMaterial color="#f2efe6" /></mesh>
        <group ref={roost} position-y={1.15}>
          <mesh castShadow material={red}><sphereGeometry args={[0.28, 10, 8]} /></mesh>
          <mesh position={[0, 0.22, 0.05]} material={red}><boxGeometry args={[0.06, 0.16, 0.12]} /></mesh>
          <mesh position={[0, 0.05, 0.28]} rotation-x={Math.PI / 2}><coneGeometry args={[0.06, 0.16, 5]} /><meshStandardMaterial color="#f5b51b" /></mesh>
          <mesh position={[0.22, 0.05, -0.05]} rotation-z={-0.6}><boxGeometry args={[0.28, 0.05, 0.16]} /><meshStandardMaterial color="#b42318" /></mesh>
        </group>
      </group>
      <group ref={corn} position={[LAYOUT.corn.x, LAYOUT.corn.y, LAYOUT.corn.z]}>
        <mesh rotation-z={0.4} material={gold}><capsuleGeometry args={[0.12, 0.38, 4, 8]} /></mesh>
        <pointLight color="#ffd24a" intensity={4} distance={4} />
      </group>
      <group ref={sparks} position={[LAYOUT.corn.x, LAYOUT.corn.y, LAYOUT.corn.z]} visible={false}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[Math.cos(i) * 0.45, (i % 3) * 0.2, Math.sin(i) * 0.45]} material={gold}>
            <sphereGeometry args={[0.06, 6, 6]} />
          </mesh>
        ))}
      </group>
      <group ref={egg} position={[LAYOUT.egg.x, LAYOUT.egg.y, LAYOUT.egg.z]}>
        <mesh scale={[0.85, 1.15, 0.85]} material={gold}><sphereGeometry args={[0.28, 12, 10]} /></mesh>
        <mesh position-y={0.34} material={gold}><sphereGeometry args={[0.08, 8, 6]} /></mesh>
        <pointLight color="#ffe27a" intensity={6} distance={6} />
      </group>
      <group ref={eggSparks} position={[LAYOUT.egg.x, LAYOUT.egg.y, LAYOUT.egg.z]} visible={false}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh key={i} position={[Math.cos(i) * 0.55, (i % 3) * 0.22, Math.sin(i) * 0.55]} material={gold}>
            <sphereGeometry args={[0.07, 6, 6]} />
          </mesh>
        ))}
      </group>
      <mesh ref={hayRing} position={[HAY_BOUNCE.x, 0.08, HAY_BOUNCE.z]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.25, 1.55, 32]} />
        <meshBasicMaterial color="#ffd24a" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={latchRing} position={[LAYOUT.latch.x, 0.07, LAYOUT.latch.z]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.55, 0.85, 28]} />
        <meshBasicMaterial color="#ffd24a" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <group ref={crown} position={[LAYOUT.crown.x, LAYOUT.crown.y, LAYOUT.crown.z]} visible={false}>
        <GoldenCrown />
        <pointLight color="#ffe27a" intensity={10} distance={16} />
      </group>
      <mesh ref={crownRing} position={[LAYOUT.crown.x, ROOF_Y + 0.1, LAYOUT.crown.z]} rotation-x={-Math.PI / 2} visible={false}>
        <ringGeometry args={[0.7, 1.15, 32]} />
        <meshBasicMaterial color="#ffe14a" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: CONFETTI_N }, (_, i) => (
        <mesh key={i} ref={(el) => { bits.current[i] = el; }} visible={false} material={confettiMats[i % confettiMats.length]}>
          <boxGeometry args={[0.16, 0.08, 0.04]} />
        </mesh>
      ))}
      <group ref={promptAnchor}>
        <Html center zIndexRange={[14, 0]} style={{ pointerEvents: "none" }}>
          <div ref={prompt} className="hud-pill px-2 py-1 text-xs font-bold" style={{ opacity: 0 }}>
            Grab <kbd className="kbd">Left-Click</kbd> / <kbd className="kbd">E</kbd>
          </div>
        </Html>
      </group>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group key={i} ref={(el) => { popG.current[i] = el; }} visible={false}>
          <Html center zIndexRange={[16, 0]} style={{ pointerEvents: "none" }}>
            <div ref={(el) => { popL.current[i] = el; }} className="quack-pop" style={{ fontSize: "1.15rem", opacity: 0 }} />
          </Html>
        </group>
      ))}
    </group>
  );
}
