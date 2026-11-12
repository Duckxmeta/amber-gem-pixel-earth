import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import {
  createSim, stepSim, PROP_DEFS, POND, BARN, LOFT, RAMP, HOUSE, TABLE, GARDEN, COOP, SCARECROW,
  QUACK_ANIM, type Sim, type Input, type PropKind, pumpkinsOut, inPond, inGarden, GRAB_RANGE,
  HAY_BOUNCE, ROOF_Y, ROOF_HALF_Z, ROOF_X0, ROOF_X1, inCoopBounds,
} from "./sim";
import {
  BIG, BIG_SURFACE, DOCK, ISLAND, LILIES, LILY_R, LILY_Y, SOUTH_GATE, SOUTH_GROUND, WAKE_RAMPS,
  inBigPond, lilyAt, onDock, onIsland, roadX, southGroundY,
} from "./pond";
import { useGame } from "./store";
import { playSound } from "./soundEffects";
import { stepMission, LAYOUT } from "./missions";
import { behindYaw, clampPitch, dampAngle, orbitOffset, CAM_PITCH, ORBIT_PITCH_SPEED, ORBIT_YAW_SPEED } from "./camera";
import { keys, pressed } from "./input";
import { world, requestMouseLook } from "./world";
import { TutorialActors, applyMissionEffect, cues, GoldenCrown } from "./tutorialActors";

// ---------- input ----------
function useKeyboard() {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
      if (!keys.has(e.code)) pressed.add(e.code);
      keys.add(e.code);
    };
    const up = (e: KeyboardEvent) => keys.delete(e.code);
    const blur = () => keys.clear();
    window.addEventListener("keydown", down); window.addEventListener("keyup", up); window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, []);
}
function readInput(inWater = false): { input: Input; snap: boolean } {
  const k = (c: string) => keys.has(c);
  const dive = k("KeyC") || k("ControlLeft") || k("ControlRight");
  const inp: Input = {
    fx: (k("KeyD") || k("ArrowRight") ? 1 : 0) - (k("KeyA") || k("ArrowLeft") ? 1 : 0),
    fz: (k("KeyW") || k("ArrowUp") ? 1 : 0) - (k("KeyS") || k("ArrowDown") ? 1 : 0),
    sprint: k("ShiftLeft") || k("ShiftRight"),
    jumpHeld: k("Space"), jump: pressed.has("Space"), grab: pressed.has("KeyE") || pressed.has("MouseLeft"),
    quack: pressed.has("KeyF") || pressed.has("MouseRight"), reset: pressed.has("KeyR"),
    dive,
  };
  const snap = pressed.has("KeyQ") || (pressed.has("KeyC") && !inWater);
  pressed.clear();
  return { input: inp, snap };
}

// ---------- textures ----------
function makeTex(base: string, spots: string[], n: number, repeat: number) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d")!; g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < n; i++) {
    g.fillStyle = spots[i % spots.length]!;
    const x = Math.random() * 256, y = Math.random() * 256;
    g.fillRect(x, y, 2 + Math.random() * 3, 4 + Math.random() * 6);
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat);
  t.colorSpace = THREE.SRGBColorSpace; return t;
}
function signBoard(label: string) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 160;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e7d3a1"; g.fillRect(0, 0, 512, 160);
  g.strokeStyle = "#6b4423"; g.lineWidth = 14; g.strokeRect(10, 10, 492, 140);
  g.fillStyle = "#3a2412"; g.font = "700 68px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(label, 256, 84);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function planksTex() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d")!;
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#c0392b" : "#b5332a"; g.fillRect(i * 16, 0, 16, 128); g.fillStyle = "#7e2018"; g.fillRect(i * 16, 0, 1.5, 128); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function BouncyHay() {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    const s = world.sim;
    if (!g.current || !s) return;
    const k = Math.min(1, s.boing * 3.2);
    g.current.scale.set(1 + k * 0.16, 1 - k * 0.42, 1 + k * 0.16);
  });
  return (
    <group ref={g} position={[HAY_BOUNCE.x, 0, HAY_BOUNCE.z]}>
      <mesh position-y={0.42} castShadow><cylinderGeometry args={[1.28, 1.4, 0.84, 10]} /><meshStandardMaterial color="#e2b340" /></mesh>
      <mesh position-y={0.9} castShadow><cylinderGeometry args={[1.05, 1.18, 0.5, 10]} /><meshStandardMaterial color="#f3d56a" /></mesh>
      <mesh position-y={1.12}><torusGeometry args={[0.72, 0.05, 6, 14]} /><meshStandardMaterial color="#c9842a" /></mesh>
    </group>
  );
}
function SouthGate() {
  const g = useRef<THREE.Group>(null);
  useFrame(() => { if (g.current && world.sim) g.current.rotation.y = world.sim.roadAngle; });
  return (
    <group ref={g} position={[SOUTH_GATE.x, 0, SOUTH_GATE.z]}>
      <mesh position={[2.05, 0.95, 0]} castShadow><boxGeometry args={[4.1, 1.7, 0.12]} /><meshStandardMaterial color="#8d5a32" /></mesh>
      <mesh position={[2.05, 0.55, 0.02]}><boxGeometry args={[4.1, 0.1, 0.14]} /><meshStandardMaterial color="#6a4122" /></mesh>
      <mesh position={[2.05, 1.35, 0.02]}><boxGeometry args={[4.1, 0.1, 0.14]} /><meshStandardMaterial color="#6a4122" /></mesh>
      <mesh position={[0.12, 0.95, 0]}><boxGeometry args={[0.16, 1.7, 0.16]} /><meshStandardMaterial color="#5c381c" /></mesh>
    </group>
  );
}

function Act2() {
  const dirt = useMemo(() => makeTex("#b08968", ["#8d6e53", "#c4a484", "#6e5340"], 900, 4), []);
  const sign = useMemo(() => signBoard("Big Pond →"), []);
  const slopeAng = Math.atan2(1.8, 15);
  const pads = useRef<(THREE.Group | null)[]>([]);
  const flowers = useMemo(() => {
    const out: { x: number; z: number; c: string; h: number }[] = [];
    for (let z = 27; z <= 42; z += 2.4) {
      const cx = roadX(z);
      out.push({ x: cx - 2.4, z, c: z % 2 ? "#f2d34a" : "#e86b8a", h: 0.35 + (z % 3) * 0.08 });
      out.push({ x: cx + 2.5, z: z + 0.6, c: z % 2 ? "#f7f3ea" : "#7ec8ea", h: 0.28 });
    }
    return out;
  }, []);
  const reeds = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      out.push([BIG.x + Math.cos(a) * (BIG.rx + 0.4), BIG.z + Math.sin(a) * (BIG.rz + 0.35)]);
    }
    return out;
  }, []);
  useFrame(({ clock }) => {
    const d = world.sim?.duck;
    pads.current.forEach((g, i) => {
      if (!g) return;
      const p = LILIES[i]!;
      const near = d && Math.hypot(d.x - p.x, d.z - p.z) < LILY_R && d.y > BIG_SURFACE;
      const tx = near ? (d.x - p.x) * 0.12 : Math.sin(clock.elapsedTime * 1.4 + i) * 0.03;
      const tz = near ? (d.z - p.z) * 0.12 : Math.cos(clock.elapsedTime * 1.1 + i) * 0.03;
      g.rotation.z += (tx - g.rotation.z) * 0.15;
      g.rotation.x += (tz - g.rotation.x) * 0.15;
      g.position.y = LILY_Y + Math.sin(clock.elapsedTime * 1.6 + i) * 0.04;
    });
  });
  return (
    <group>
      <mesh position={[0, -0.9, 32.5]} rotation-x={slopeAng} receiveShadow>
        <boxGeometry args={[48, 0.25, 15.1]} /><meshStandardMaterial color="#7dba55" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, SOUTH_GROUND, 57]} receiveShadow>
        <planeGeometry args={[48, 36]} /><meshStandardMaterial color="#6eaf62" />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => {
        const z = 26 + i * 2.05;
        const x = roadX(z);
        return (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[x, southGroundY(z) + 0.04, z]} receiveShadow>
            <planeGeometry args={[3.4, 2.5]} /><meshStandardMaterial map={dirt} />
          </mesh>
        );
      })}
      {[28, 34, 40, 46].map((z) => (
        <group key={z}>
          <mesh position={[roadX(z) - 1.8, southGroundY(z) + 0.45, z]}><boxGeometry args={[0.12, 0.9, 0.12]} /><meshStandardMaterial color="#f2efe6" /></mesh>
          <mesh position={[roadX(z) + 1.8, southGroundY(z) + 0.45, z]}><boxGeometry args={[0.12, 0.9, 0.12]} /><meshStandardMaterial color="#f2efe6" /></mesh>
        </group>
      ))}
      <group position={[roadX(31), southGroundY(31), 31]}>
        <mesh position={[1.6, 0.7, 0]}><boxGeometry args={[0.08, 1.3, 0.08]} /><meshStandardMaterial color="#6b4423" /></mesh>
        <mesh position={[1.6, 1.25, 0]} rotation-y={Math.PI}><boxGeometry args={[1.2, 0.48, 0.06]} /><meshStandardMaterial map={sign} /></mesh>
      </group>
      <group position={[roadX(42), southGroundY(42), 42]}>
        <mesh position={[-1.7, 0.7, 0]}><boxGeometry args={[0.08, 1.3, 0.08]} /><meshStandardMaterial color="#6b4423" /></mesh>
        <mesh position={[-1.7, 1.25, 0]} rotation-y={Math.PI}><boxGeometry args={[1.2, 0.48, 0.06]} /><meshStandardMaterial map={sign} /></mesh>
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[BIG.x, BIG_SURFACE + 0.08, BIG.z]} scale={[BIG.rx + 1.5, BIG.rz + 1.3, 1]}>
        <circleGeometry args={[1, 40]} /><meshStandardMaterial color="#c4a574" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[BIG.x, BIG_SURFACE + 0.16, BIG.z]} scale={[BIG.rx, BIG.rz, 1]}>
        <circleGeometry args={[1, 40]} /><meshStandardMaterial color="#3a9ad4" roughness={0.12} metalness={0.15} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[(DOCK.x0 + DOCK.x1) / 2, DOCK.y, (DOCK.z0 + DOCK.z1) / 2]} receiveShadow castShadow>
        <boxGeometry args={[DOCK.x1 - DOCK.x0, 0.12, DOCK.z1 - DOCK.z0]} /><meshStandardMaterial color="#b58449" />
      </mesh>
      {([[DOCK.x0 + 0.3, DOCK.z0 + 0.3], [DOCK.x1 - 0.3, DOCK.z0 + 0.3], [DOCK.x0 + 0.3, DOCK.z1 - 0.3], [DOCK.x1 - 0.3, DOCK.z1 - 0.3]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, DOCK.y - 0.45, z]}><boxGeometry args={[0.12, 0.9, 0.12]} /><meshStandardMaterial color="#6b4423" /></mesh>
      ))}
      {WAKE_RAMPS.map((r) => (
        <group key={r.id} position={[r.x, BIG_SURFACE + 0.45, r.z]} rotation-y={r.yaw} rotation-x={-0.28}>
          <mesh castShadow receiveShadow><boxGeometry args={[1.5, 0.12, 3.2]} /><meshStandardMaterial color="#c49a6c" /></mesh>
          <mesh position={[0.7, 0.08, 0]}><boxGeometry args={[0.06, 0.16, 3.2]} /><meshStandardMaterial color="#8a5a32" /></mesh>
          <mesh position={[-0.7, 0.08, 0]}><boxGeometry args={[0.06, 0.16, 3.2]} /><meshStandardMaterial color="#8a5a32" /></mesh>
        </group>
      ))}
      {LILIES.map((p, i) => (
        <group key={i} ref={(el) => { pads.current[i] = el; }} position={[p.x, LILY_Y, p.z]}>
          <mesh rotation-x={-Math.PI / 2} receiveShadow><circleGeometry args={[LILY_R, 8]} /><meshStandardMaterial color="#3f9a45" /></mesh>
          <mesh position={[0.2, 0.05, 0.1]} rotation-x={-Math.PI / 2}><circleGeometry args={[0.16, 8]} /><meshStandardMaterial color="#f2e27a" /></mesh>
        </group>
      ))}
      <group position={[ISLAND.x, ISLAND.y, ISLAND.z]}>
        <mesh receiveShadow><cylinderGeometry args={[ISLAND.r, ISLAND.r + 0.3, 0.45, 10]} /><meshStandardMaterial color="#c4a574" /></mesh>
        <mesh position-y={0.28} receiveShadow><cylinderGeometry args={[ISLAND.r * 0.82, ISLAND.r * 0.9, 0.12, 10]} /><meshStandardMaterial color="#6eaf62" /></mesh>
        <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.45, 0.5, 0.08, 8]} /><meshStandardMaterial color="#e05a47" /></mesh>
      </group>
      {reeds.map(([x, z], i) => (
        <group key={i} position={[x, SOUTH_GROUND, z]}>
          <mesh position-y={0.7}><cylinderGeometry args={[0.03, 0.04, 1.3, 4]} /><meshStandardMaterial color="#3f7d32" /></mesh>
          <mesh position={[0.08, 1.25, 0]}><sphereGeometry args={[0.08, 6, 5]} /><meshStandardMaterial color="#6b4a2a" /></mesh>
        </group>
      ))}
      {flowers.map((f, i) => (
        <group key={i} position={[f.x, southGroundY(f.z), f.z]}>
          <mesh position-y={f.h * 0.5}><cylinderGeometry args={[0.02, 0.02, f.h, 4]} /><meshStandardMaterial color="#3f7d32" /></mesh>
          <mesh position-y={f.h}><sphereGeometry args={[0.09, 6, 5]} /><meshStandardMaterial color={f.c} /></mesh>
        </group>
      ))}
    </group>
  );
}

function CoopGate() {
  const g = useRef<THREE.Group>(null);
  useFrame(() => { if (g.current && world.sim) g.current.rotation.y = world.sim.gateAngle; });
  return (
    <group ref={g} position={[LAYOUT.latch.x - 0.92, 0, COOP.z0 + 0.2]}>
      <mesh position={[0.9, 0.95, 0]} castShadow><boxGeometry args={[1.8, 1.75, 0.1]} /><meshStandardMaterial color="#8d5a32" /></mesh>
      <mesh position={[0.9, 0.5, 0.02]}><boxGeometry args={[1.8, 0.08, 0.12]} /><meshStandardMaterial color="#6a4122" /></mesh>
      <mesh position={[0.9, 1.4, 0.02]}><boxGeometry args={[1.8, 0.08, 0.12]} /><meshStandardMaterial color="#6a4122" /></mesh>
      <mesh position={[0.22, 0.95, 0.04]}><boxGeometry args={[0.08, 1.75, 0.12]} /><meshStandardMaterial color="#5c381c" /></mesh>
      <mesh position={[1.62, 1.05, 0.12]}><boxGeometry args={[0.14, 0.2, 0.14]} /><meshStandardMaterial color="#f0cc4a" emissive="#c89612" emissiveIntensity={0.55} /></mesh>
    </group>
  );
}
// ---------- static farm ----------
const box = (r: { x0: number; x1: number; z0: number; z1: number }) => ({
  pos: [(r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2] as const, size: [r.x1 - r.x0, r.z1 - r.z0] as const,
});
function Farm() {
  const grass = useMemo(() => makeTex("#6cc24a", ["#5bb03c", "#7fd35a", "#4f9e33"], 2200, 14), []);
  const soil = useMemo(() => makeTex("#8a5a35", ["#6e4527", "#9c6a42"], 1500, 3), []);
  const planks = useMemo(() => planksTex(), []);
  const barn = box(BARN), house = box(HOUSE), loft = box(LOFT), garden = box(GARDEN), table = box(TABLE);
  const rampLen = Math.hypot(RAMP.z1 - RAMP.z0, LOFT.h), rampAng = Math.atan2(LOFT.h, RAMP.z1 - RAMP.z0);
  const posts = useMemo(() => {
    const p: [number, number][] = [];
    for (let i = -24; i <= 24; i += 2) {
      p.push([i, -24], [-24, i], [24, i]);
      if (Math.abs(i) >= 2) p.push([i, 24]);
    }
    return p;
  }, []);
  const trees = useMemo(() => Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2, r = 29 + (i % 3) * 3;
    return [Math.cos(a) * r, Math.sin(a) * r, 1 + (i % 4) * 0.25] as const;
  }).map(([x, z, s]) => {
    if (z > 22 && Math.abs(x) < 16) return [x + (x < 0 ? -12 : 12), z, s] as const;
    return [x, z, s] as const;
  }), []);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -18]} receiveShadow><planeGeometry args={[120, 84]} /><meshStandardMaterial map={grass} /></mesh>
      {/* pond */}
      <mesh rotation-x={-Math.PI / 2} position={[POND.x, 0.02, POND.z]}><circleGeometry args={[POND.r + 0.5, 40]} /><meshStandardMaterial color="#d9c48a" /></mesh>
      <mesh rotation-x={-Math.PI / 2} position={[POND.x, 0.05, POND.z]}><circleGeometry args={[POND.r, 40]} /><meshStandardMaterial color="#3fa7d6" roughness={0.1} metalness={0.2} transparent opacity={0.88} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[POND.x + Math.cos(i * 1.3) * (POND.r + 0.3), 0.2, POND.z + Math.sin(i * 1.3) * (POND.r + 0.3)]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1 + (i % 2) * 0.4]} /><meshStandardMaterial color="#4a7d2a" /></mesh>
      ))}
      {/* barn */}
      <mesh position={[barn.pos[0], 3, barn.pos[1]]} castShadow receiveShadow><boxGeometry args={[barn.size[0], 6, barn.size[1]]} /><meshStandardMaterial map={planks} /></mesh>
      <mesh position={[12, 6.75, LAYOUT.egg.z]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[1.15, 1.15, 8.1, 3]} /><meshStandardMaterial color="#6e3428" />
      </mesh>
      <mesh position={[(ROOF_X0 + ROOF_X1) / 2, ROOF_Y, LAYOUT.egg.z]} receiveShadow>
        <boxGeometry args={[ROOF_X1 - ROOF_X0, 0.16, ROOF_HALF_Z * 2]} /><meshStandardMaterial color="#8e2a20" />
      </mesh>
      <mesh position={[barn.pos[0], 2, BARN.z1 + 0.02]}><planeGeometry args={[3.5, 4]} /><meshStandardMaterial color="#f4ead5" /></mesh>
      <mesh position={[barn.pos[0], 2, BARN.z1 + 0.04]}><planeGeometry args={[3, 3.5]} /><meshStandardMaterial color="#8e2a20" /></mesh>
      {/* hayloft + ramp */}
      <mesh position={[loft.pos[0], LOFT.h / 2, loft.pos[1]]} castShadow receiveShadow><boxGeometry args={[loft.size[0], LOFT.h, loft.size[1]]} /><meshStandardMaterial color="#c99a5b" /></mesh>
      <mesh position={[(RAMP.x0 + RAMP.x1) / 2, LOFT.h / 2 - 0.1, (RAMP.z0 + RAMP.z1) / 2]} rotation-x={rampAng} castShadow receiveShadow>
        <boxGeometry args={[RAMP.x1 - RAMP.x0, 0.2, rampLen]} /><meshStandardMaterial color="#b58449" /></mesh>
      {/* farmhouse */}
      <mesh position={[house.pos[0], 2.5, house.pos[1]]} castShadow receiveShadow><boxGeometry args={[house.size[0], 5, house.size[1]]} /><meshStandardMaterial color="#f3e3c3" /></mesh>
      <mesh position={[house.pos[0], 6, house.pos[1]]} rotation-y={Math.PI / 4} castShadow><coneGeometry args={[9, 3, 4]} /><meshStandardMaterial color="#3d6e8f" /></mesh>
      <mesh position={[house.pos[0], 0.08, HOUSE.z1 + 2]} receiveShadow><boxGeometry args={[house.size[0], 0.16, 4]} /><meshStandardMaterial color="#b98b5e" /></mesh>
      <mesh position={[house.pos[0] + 2, 1.6, HOUSE.z1 + 0.02]}><planeGeometry args={[1.4, 2.6]} /><meshStandardMaterial color="#6b3e26" /></mesh>
      {[-4, 0, 4].map((dx) => <mesh key={dx} position={[house.pos[0] + dx - 2, 3, HOUSE.z1 + 0.02]}><planeGeometry args={[1.4, 1.2]} /><meshStandardMaterial color="#9fd4ea" /></mesh>)}
      {/* picnic table */}
      <mesh position={[table.pos[0], TABLE.h - 0.05, table.pos[1]]} castShadow receiveShadow><boxGeometry args={[table.size[0], 0.1, table.size[1]]} /><meshStandardMaterial color="#e05a47" /></mesh>
      {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).map(([a, b], i) => (
        <mesh key={i} position={[table.pos[0] + a * (table.size[0] / 2 - 0.2), TABLE.h / 2 - 0.05, table.pos[1] + b * (table.size[1] / 2 - 0.15)]} castShadow>
          <boxGeometry args={[0.12, TABLE.h - 0.1, 0.12]} /><meshStandardMaterial color="#8a5a35" /></mesh>
      ))}
      {/* garden */}
      <mesh rotation-x={-Math.PI / 2} position={[garden.pos[0], 0.03, garden.pos[1]]} receiveShadow><planeGeometry args={[garden.size[0], garden.size[1]]} /><meshStandardMaterial map={soil} /></mesh>
      <group>
        {([
          [GARDEN.x0, GARDEN.z0, GARDEN.x1, GARDEN.z0],
          [GARDEN.x0, GARDEN.z1, GARDEN.x1, GARDEN.z1],
          [GARDEN.x0, GARDEN.z0, GARDEN.x0, GARDEN.z1],
          [GARDEN.x1, GARDEN.z0, GARDEN.x1, (GARDEN.z0 + GARDEN.z1) / 2 - 1.4],
          [GARDEN.x1, (GARDEN.z0 + GARDEN.z1) / 2 + 1.4, GARDEN.x1, GARDEN.z1],
        ] as const).map(([x0, z0, x1, z1], i) => {
          const len = Math.hypot(x1 - x0, z1 - z0);
          const yaw = Math.atan2(x1 - x0, z1 - z0);
          return (
            <group key={i} position={[(x0 + x1) / 2, 0, (z0 + z1) / 2]} rotation-y={yaw}>
              <mesh position-y={0.38}><boxGeometry args={[0.08, 0.1, len]} /><meshStandardMaterial color="#f2efe6" /></mesh>
              <mesh position-y={0.72}><boxGeometry args={[0.08, 0.1, len]} /><meshStandardMaterial color="#f2efe6" /></mesh>
            </group>
          );
        })}
        {([
          [GARDEN.x0, GARDEN.z0], [GARDEN.x1, GARDEN.z0], [GARDEN.x0, GARDEN.z1], [GARDEN.x1, GARDEN.z1],
          [(GARDEN.x0 + GARDEN.x1) / 2, GARDEN.z0], [(GARDEN.x0 + GARDEN.x1) / 2, GARDEN.z1],
          [GARDEN.x0, (GARDEN.z0 + GARDEN.z1) / 2],
        ] as const).map(([x, z], i) => (
          <mesh key={i} position={[x, 0.55, z]}><boxGeometry args={[0.12, 1.1, 0.12]} /><meshStandardMaterial color="#f2efe6" /></mesh>
        ))}
      </group>
      {/* coop — hollow pen with a south gate */}
      <mesh rotation-x={-Math.PI / 2} position={[18, 0.03, 17.15]} receiveShadow>
        <planeGeometry args={[3.15, 3.2]} /><meshStandardMaterial color="#e4c15a" />
      </mesh>
      <mesh position={[16.2, 1.05, 17]} castShadow><boxGeometry args={[0.4, 2.1, 4]} /><meshStandardMaterial color="#e8b04b" /></mesh>
      <mesh position={[19.8, 1.05, 17]} castShadow><boxGeometry args={[0.4, 2.1, 4]} /><meshStandardMaterial color="#e8b04b" /></mesh>
      <mesh position={[18, 1.05, 18.8]} castShadow><boxGeometry args={[4, 2.1, 0.4]} /><meshStandardMaterial color="#e8b04b" /></mesh>
      <mesh position={[16.52, 1.05, 15.2]} castShadow><boxGeometry args={[1.04, 2.1, 0.4]} /><meshStandardMaterial color="#e8b04b" /></mesh>
      <mesh position={[19.48, 1.05, 15.2]} castShadow><boxGeometry args={[1.04, 2.1, 0.4]} /><meshStandardMaterial color="#e8b04b" /></mesh>
      <mesh position={[18, 2.65, 17]} rotation-y={Math.PI / 4} castShadow><coneGeometry args={[3.05, 1.15, 4]} /><meshStandardMaterial color="#a63d2f" /></mesh>
      <CoopGate />
      {/* fence */}
      {posts.map(([x, z], i) => <mesh key={i} position={[x, 0.6, z]} castShadow><boxGeometry args={[0.2, 1.2, 0.2]} /><meshStandardMaterial color="#f2efe6" /></mesh>)}
      {([[0, -24, 48, 0], [-24, 0, 48, 1], [24, 0, 48, 1]] as const).map(([x, z, l, r], i) => (
        <group key={i} position={[x, 0, z]} rotation-y={r ? Math.PI / 2 : 0}>
          <mesh position={[0, 0.5, 0]}><boxGeometry args={[l, 0.12, 0.08]} /><meshStandardMaterial color="#f2efe6" /></mesh>
          <mesh position={[0, 0.95, 0]}><boxGeometry args={[l, 0.12, 0.08]} /><meshStandardMaterial color="#f2efe6" /></mesh>
        </group>
      ))}
      {([[-13.1, 24, 21.8], [13.1, 24, 21.8]] as const).map(([x, z, l], i) => (
        <group key={`s${i}`} position={[x, 0, z]}>
          <mesh position={[0, 0.5, 0]}><boxGeometry args={[l, 0.12, 0.08]} /><meshStandardMaterial color="#f2efe6" /></mesh>
          <mesh position={[0, 0.95, 0]}><boxGeometry args={[l, 0.12, 0.08]} /><meshStandardMaterial color="#f2efe6" /></mesh>
        </group>
      ))}
      <SouthGate />
      {trees.map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s}>
          <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.25, 0.35, 1.6]} /><meshStandardMaterial color="#7a5232" /></mesh>
          <mesh position={[0, 2.8, 0]} castShadow><coneGeometry args={[1.6, 3.4, 7]} /><meshStandardMaterial color={i % 2 ? "#2f8f4e" : "#3fa35a"} flatShading /></mesh>
        </group>
      ))}
    </group>
  );
}

// ---------- props ----------
const M = (c: string, rough = 0.7) => new THREE.MeshStandardMaterial({ color: c, roughness: rough });
const mats = {
  pumpkin: M("#f28a1c"), stem: M("#4c7a22"), cabbage: M("#8fd16a"), metal: M("#9fb0b8", 0.35), can: M("#3f9d7a", 0.4),
  hay: M("#e8c25a"), crate: M("#c48a4a"), barrel: M("#9a5d32"), band: M("#4a4a4a"), plate: M("#f8f6f0", 0.3),
  pie: M("#d99a4e"), cup: M("#3a7bd5"), wood: M("#8b5a2b"), hat: M("#f0d27a"), hatBand: M("#c0392b"),
  watering: M("#e23b2f", 0.45), boot: M("#f2c14e", 0.55), pail: M("#c48a4a", 0.7),
};
function PropMesh({ kind }: { kind: PropKind }) {
  const d = PROP_DEFS[kind];
  switch (kind) {
    case "pumpkin": return <><mesh position-y={0.3} scale={[1, 0.75, 1]} castShadow material={mats.pumpkin}><sphereGeometry args={[0.4, 10, 8]} /></mesh><mesh position-y={0.65} material={mats.stem}><cylinderGeometry args={[0.04, 0.06, 0.15]} /></mesh></>;
    case "cabbage": return <mesh position-y={0.22} castShadow material={mats.cabbage}><icosahedronGeometry args={[0.28, 0]} /></mesh>;
    case "bucket": return <mesh position-y={0.25} castShadow material={mats.metal}><cylinderGeometry args={[0.3, 0.22, 0.5, 10]} /></mesh>;
    case "can": return <><mesh position-y={0.22} castShadow material={mats.can}><cylinderGeometry args={[0.22, 0.25, 0.45, 10]} /></mesh><mesh position={[0.3, 0.3, 0]} rotation-z={-0.8} material={mats.can}><cylinderGeometry args={[0.04, 0.05, 0.4]} /></mesh></>;
    case "hay": return <mesh position-y={0.45} castShadow material={mats.hay}><boxGeometry args={[1.2, 0.9, 0.8]} /></mesh>;
    case "crate": return <mesh position-y={0.4} castShadow material={mats.crate}><boxGeometry args={[0.8, 0.8, 0.8]} /></mesh>;
    case "barrel": return <><mesh position-y={0.45} castShadow material={mats.barrel}><cylinderGeometry args={[0.36, 0.36, 0.9, 12]} /></mesh><mesh position-y={0.45} material={mats.band}><cylinderGeometry args={[0.38, 0.38, 0.08, 12]} /></mesh></>;
    case "plate": return <mesh position-y={0.03} castShadow material={mats.plate}><cylinderGeometry args={[0.22, 0.18, 0.05, 14]} /></mesh>;
    case "pie": return <mesh position-y={0.07} castShadow material={mats.pie}><cylinderGeometry args={[0.25, 0.22, 0.14, 14]} /></mesh>;
    case "cup": return <mesh position-y={0.09} castShadow material={mats.cup}><cylinderGeometry args={[0.1, 0.08, 0.18, 10]} /></mesh>;
    case "shovel": return <group rotation-z={Math.PI / 2} position-y={0.08}><mesh material={mats.wood}><cylinderGeometry args={[0.04, 0.04, 1]} /></mesh><mesh position-y={-0.6} material={mats.metal}><boxGeometry args={[0.25, 0.3, 0.04]} /></mesh></group>;
    case "hat": return <><mesh position-y={0.02} castShadow material={mats.hat}><cylinderGeometry args={[0.45, 0.45, 0.04, 16]} /></mesh><mesh position-y={0.14} material={mats.hat}><cylinderGeometry args={[0.2, 0.24, 0.22, 12]} /></mesh><mesh position-y={0.07} material={mats.hatBand}><cylinderGeometry args={[0.245, 0.245, 0.06, 12]} /></mesh></>;
    case "watering": return <><mesh position-y={0.16} castShadow material={mats.watering}><cylinderGeometry args={[0.16, 0.2, 0.32, 10]} /></mesh><mesh position={[0.18, 0.28, 0]} rotation-z={-0.9} material={mats.watering}><cylinderGeometry args={[0.035, 0.04, 0.36]} /></mesh></>;
    case "boot": return <group position-y={0.08}><mesh rotation-z={Math.PI / 2} material={mats.boot}><capsuleGeometry args={[0.1, 0.28, 4, 8]} /></mesh><mesh position={[0.12, 0.12, 0]} material={mats.boot}><boxGeometry args={[0.16, 0.2, 0.18]} /></mesh></group>;
    case "pail": return <><mesh position-y={0.2} castShadow material={mats.pail}><cylinderGeometry args={[0.22, 0.18, 0.36, 10]} /></mesh><mesh position-y={0.36} material={mats.band}><torusGeometry args={[0.2, 0.015, 6, 12]} /></mesh></>;
    case "thermos": return <><mesh position-y={0.16} castShadow material={mats.metal}><cylinderGeometry args={[0.07, 0.09, 0.28, 10]} /></mesh><mesh position-y={0.32} material={mats.cup}><cylinderGeometry args={[0.08, 0.07, 0.06, 10]} /></mesh></>;
    case "lure": return (
      <group>
        <mesh position-y={0.05} rotation-x={Math.PI / 2} material={mats.metal}><torusGeometry args={[0.07, 0.016, 6, 12]} /></mesh>
        <mesh position={[0.09, 0.06, 0]} rotation-z={-0.7} material={mats.metal}><coneGeometry args={[0.028, 0.12, 6]} /></mesh>
        <mesh position-y={0.1}><sphereGeometry args={[0.045, 8, 6]} /><meshStandardMaterial color="#ffe56a" emissive="#ffcc33" emissiveIntensity={1.6} /></mesh>
      </group>
    );
  }
  return <mesh><boxGeometry args={[d.r, d.h, d.r]} /></mesh>;
}
function Props() {
  const sim = world.sim!;
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(() => {
    const s = world.sim!;
    s.props.forEach((p, i) => {
      const g = refs.current[i]; if (!g) return;
      g.position.set(p.x, p.y + Math.sin(p.tilt) * PROP_DEFS[p.kind].r * 0.85, p.z); g.rotation.set(p.tilt, p.yaw, 0, "YXZ");
      const glow = g.children[1] as THREE.Object3D | undefined;
      if (glow) glow.visible = useGame.getState().mission.index === 2 && (p.role === "watering" || p.role === "boot" || p.role === "pail") && !inPond(p.x, p.z);
    });
  });
  return <>{sim.props.map((p, i) => (
    <group key={p.id} ref={(el) => { refs.current[i] = el; }}>
      <PropMesh kind={p.kind} />
      {(p.role === "watering" || p.role === "boot" || p.role === "pail") && (
        <mesh position-y={0.22} scale={1.25} visible={false}>
          <sphereGeometry args={[PROP_DEFS[p.kind].r, 10, 8]} />
          <meshBasicMaterial color="#ffe14a" transparent opacity={0.28} depthWrite={false} />
        </mesh>
      )}
    </group>
  ))}</>;
}

// ---------- characters ----------
const duckMat = { body: M("#fbfaf4", 0.6), beak: M("#ff9f1c", 0.5), eye: M("#1b1b1b", 0.2), cap: M("#2f9e5c", 0.5) };
function Duck() {
  const g = useRef<THREE.Group>(null), wl = useRef<THREE.Mesh>(null), wr = useRef<THREE.Mesh>(null), body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null), jaw = useRef<THREE.Group>(null), pop = useRef<HTMLDivElement>(null);
  const crown = useRef<THREE.Group>(null), breath = useRef<HTMLDivElement>(null);
  const bubbles = useRef<(THREE.Mesh | null)[]>([]);
  const wake = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const d = world.sim!.duck;
    // quack: beak opens, head bobs up, comic text floats up and fades
    const q = d.quackAnim / QUACK_ANIM; // 1 → 0
    const open = q > 0 ? Math.sin(Math.min(1, (1 - q) * 2.2) * Math.PI) : 0;
    jaw.current!.rotation.x = open * 0.7;
    head.current!.rotation.x = -open * 0.35;
    head.current!.position.y = open * 0.06;
    if (pop.current) {
      const el = pop.current;
      if (q > 0) {
        const rot = ((d.quacks * 37) % 30) - 15;
        el.style.opacity = String(Math.min(1, q * 2.5));
        el.style.transform = `translate(-50%, ${-(1 - q) * 46}px) rotate(${rot}deg) scale(${0.7 + Math.min(1, (1 - q) * 5) * 0.4})`;
      } else el.style.opacity = "0";
    }
    g.current!.position.set(d.x, d.y, d.z); g.current!.rotation.y = d.yaw;
    const waddle = Math.sin(d.flap) * 0.12;
    body.current!.rotation.z = d.onGround ? waddle : 0;
    body.current!.position.y = d.diving ? -0.22 : d.swimming ? -0.15 : Math.abs(Math.sin(d.flap)) * 0.05;
    const flap = d.onGround ? 0.15 : 0.6 + Math.sin(d.flap) * 0.6;
    wl.current!.rotation.z = flap; wr.current!.rotation.z = -flap;
    if (crown.current) crown.current.visible = useGame.getState().mission.crowned;
    bubbles.current.forEach((m, i) => {
      if (!m) return;
      m.visible = d.diving;
      if (!d.diving) return;
      const t = clock.elapsedTime * 1.7 + i * 0.7;
      m.position.set(Math.sin(t) * 0.22, 0.15 + ((t * 0.35) % 1.5), -0.05 + Math.cos(t * 0.8) * 0.12);
      m.scale.setScalar(0.45 + (i % 3) * 0.28);
    });
    wake.current.forEach((m, i) => {
      if (!m) return;
      const on = d.boosting && d.swimming;
      m.visible = on;
      if (!on) return;
      m.position.set((i - 2) * 0.16, 0.06, -0.45 - i * 0.26);
      m.scale.setScalar(0.55 + i * 0.22);
    });
    if (breath.current) {
      const show = inBigPond(d.x, d.z) && (d.diving || d.air < 3.92);
      breath.current.style.display = show ? "block" : "none";
      const deg = Math.max(0, Math.min(1, d.air / 4)) * 360;
      breath.current.style.background = `conic-gradient(#7ee7ff ${deg}deg, rgba(12, 28, 40, 0.45) 0deg)`;
    }
  });
  return (
    <group ref={g}>
      <group ref={body}>
        <mesh position={[0, 0.42, 0]} scale={[0.9, 0.75, 1.2]} castShadow material={duckMat.body}><sphereGeometry args={[0.42, 14, 10]} /></mesh>
        <mesh position={[0, 0.45, -0.48]} rotation-x={0.6} material={duckMat.body}><coneGeometry args={[0.18, 0.35, 8]} /></mesh>
        <group position={[0, 0.72, 0.32]}><group ref={head}><group position={[0, -0.72, -0.32]}>
          <mesh position={[0, 0.9, 0.35]} castShadow material={duckMat.body}><sphereGeometry args={[0.26, 12, 10]} /></mesh>
          <mesh position={[0, 0.895, 0.66]} material={duckMat.beak}><boxGeometry args={[0.26, 0.06, 0.3]} /></mesh>
          <group ref={jaw} position={[0, 0.86, 0.52]}>
            <mesh position={[0, 0, 0.13]} material={duckMat.beak}><boxGeometry args={[0.23, 0.045, 0.26]} /></mesh>
          </group>
          <mesh position={[0.13, 0.98, 0.52]} material={duckMat.eye}><sphereGeometry args={[0.045, 8, 6]} /></mesh>
          <mesh position={[-0.13, 0.98, 0.52]} material={duckMat.eye}><sphereGeometry args={[0.045, 8, 6]} /></mesh>
          <group ref={crown} position={[0, 1.16, 0.35]} scale={0.72} visible={false}>
            <GoldenCrown />
          </group>
        </group></group></group>
        <mesh ref={wl} position={[0.36, 0.5, 0]} scale={[0.2, 0.6, 1]} material={duckMat.body}><sphereGeometry args={[0.32, 8, 6]} /></mesh>
        <mesh ref={wr} position={[-0.36, 0.5, 0]} scale={[0.2, 0.6, 1]} material={duckMat.body}><sphereGeometry args={[0.32, 8, 6]} /></mesh>
        <mesh position={[0.15, 0.04, 0.05]} material={duckMat.beak}><boxGeometry args={[0.16, 0.06, 0.22]} /></mesh>
        <mesh position={[-0.15, 0.04, 0.05]} material={duckMat.beak}><boxGeometry args={[0.16, 0.06, 0.22]} /></mesh>
      </group>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`b${i}`} ref={(el) => { bubbles.current[i] = el; }} visible={false}>
          <sphereGeometry args={[0.07, 6, 6]} /><meshBasicMaterial color="#e7fbff" transparent opacity={0.7} depthWrite={false} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`w${i}`} ref={(el) => { wake.current[i] = el; }} rotation-x={-Math.PI / 2} visible={false}>
          <circleGeometry args={[0.16, 8]} /><meshBasicMaterial color="#f4fbff" transparent opacity={0.72} depthWrite={false} />
        </mesh>
      ))}
      <Html position={[0.85, 1.15, 0]} center zIndexRange={[14, 0]} style={{ pointerEvents: "none" }}>
        <div ref={breath} style={{ display: "none", width: 42, height: 42, borderRadius: "50%", boxShadow: "0 0 0 3px #163044" }} />
      </Html>
      <Html position={[0, 1.55, 0]} zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
        <div ref={pop} className="quack-pop" style={{ opacity: 0 }}>QUACK!</div>
      </Html>
    </group>
  );
}
const chickMat = { body: M("#fff8ec"), comb: M("#e63b2e"), beak: M("#f5b51b") };
function Chickens() {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(() => world.sim!.chickens.forEach((c, i) => {
    const g = refs.current[i]; if (!g) return;
    const sp = Math.hypot(c.vx, c.vz);
    const peck = c.penned && sp < 0.9;
    g.position.set(c.x, peck ? 0 : Math.abs(Math.sin(c.hop)) * (c.flee > 0 ? 0.45 : 0.12), c.z);
    g.rotation.y = c.yaw;
    g.rotation.x = peck ? Math.sin(c.hop * 2.2) * 0.55 : 0;
  }));
  return <>{world.sim!.chickens.map((_, i) => (
    <group key={i} ref={(el) => { refs.current[i] = el; }}>
      <mesh position-y={0.3} scale={[0.8, 0.8, 1]} castShadow material={chickMat.body}><sphereGeometry args={[0.25, 10, 8]} /></mesh>
      <mesh position={[0, 0.55, 0.15]} material={chickMat.body}><sphereGeometry args={[0.13, 8, 6]} /></mesh>
      <mesh position={[0, 0.7, 0.15]} material={chickMat.comb}><boxGeometry args={[0.04, 0.1, 0.14]} /></mesh>
      <mesh position={[0, 0.54, 0.3]} rotation-x={Math.PI / 2} material={chickMat.beak}><coneGeometry args={[0.04, 0.1, 5]} /></mesh>
    </group>
  ))}</>;
}
const farmerMat = { skin: M("#f1c27d"), shirt: M("#d64933"), pants: M("#3b5ba5"), boot: M("#4a3426") };
function Farmer() {
  const g = useRef<THREE.Group>(null), arm = useRef<THREE.Group>(null), armL = useRef<THREE.Group>(null), bang = useRef<HTMLDivElement>(null), yell = useRef<HTMLDivElement>(null);
  useFrame(({ clock }) => {
    const f = world.sim!.farmer;
    const hop = f.startle > 0 ? Math.sin((1 - Math.min(1, f.startle / 1.4)) * Math.PI) * 0.35 : 0;
    const sit = f.asleep ? -0.42 : 0;
    g.current!.position.set(f.x, hop + sit, f.z);
    g.current!.rotation.set(f.asleep ? 0.4 : 0, f.yaw, 0);
    const flail = f.trapped || f.angry > 0.5;
    arm.current!.rotation.x = f.asleep ? 0.6 : flail ? -2.4 + Math.sin(clock.elapsedTime * (f.trapped ? 22 : 18)) * 0.5 : Math.sin(clock.elapsedTime * 3) * 0.3;
    if (armL.current) armL.current.rotation.x = f.trapped ? -2.15 + Math.sin(clock.elapsedTime * 22 + 1.2) * 0.55 : f.asleep ? 0.5 : 0.12;
    if (bang.current) bang.current.style.opacity = f.startle > 0.05 && f.hasHat ? "1" : "0";
    if (yell.current) {
      yell.current.textContent = f.trapped ? "HEY! LET ME OUT!" : "HEY! MY HAT!";
      yell.current.style.opacity = f.trapped || (f.chase && !f.hasHat) ? "1" : "0";
    }
  });
  return (
    <group ref={g}>
      <mesh position={[0.15, 0.4, 0]} castShadow material={farmerMat.pants}><boxGeometry args={[0.22, 0.8, 0.25]} /></mesh>
      <mesh position={[-0.15, 0.4, 0]} castShadow material={farmerMat.pants}><boxGeometry args={[0.22, 0.8, 0.25]} /></mesh>
      <mesh position={[0, 1.1, 0]} castShadow material={farmerMat.shirt}><boxGeometry args={[0.6, 0.65, 0.35]} /></mesh>
      <mesh position={[0, 1.6, 0]} castShadow material={farmerMat.skin}><sphereGeometry args={[0.22, 12, 10]} /></mesh>
      <mesh position={[0, 1.55, 0.2]} material={farmerMat.skin}><sphereGeometry args={[0.06, 6, 6]} /></mesh>
      <group ref={armL} position={[-0.4, 1.35, 0]}>
        <mesh position={[0, -0.3, 0]} material={farmerMat.shirt}><boxGeometry args={[0.15, 0.6, 0.15]} /></mesh>
        <mesh position={[0, -0.65, 0]} material={farmerMat.skin}><sphereGeometry args={[0.09, 8, 6]} /></mesh>
      </group>
      <group ref={arm} position={[0.4, 1.35, 0]}>
        <mesh position={[0, -0.3, 0]} material={farmerMat.shirt}><boxGeometry args={[0.15, 0.6, 0.15]} /></mesh>
        <mesh position={[0, -0.65, 0]} material={farmerMat.skin}><sphereGeometry args={[0.09, 8, 6]} /></mesh>
      </group>
      <Html position={[0, 2.15, 0]} center zIndexRange={[12, 0]} style={{ pointerEvents: "none" }}>
        <div ref={bang} className="quack-pop" style={{ opacity: 0, fontSize: "2.4rem" }}>!</div>
        <div ref={yell} className="quack-pop" style={{ opacity: 0, fontSize: "1rem" }}>HEY! MY HAT!</div>
      </Html>
    </group>
  );
}
const scareMat = { pole: M("#7a5232"), shirt: M("#4f7cac"), head: M("#e8c25a"), hat: M("#6b4a2e") };
function Scarecrow() {
  const g = useRef<THREE.Group>(null);
  useFrame(() => { g.current!.rotation.x = world.sim!.scarecrowTilt; });
  return (
    <group position={[SCARECROW.x, 0, SCARECROW.z]}><group ref={g}>
      <mesh position-y={1.35} castShadow material={scareMat.pole}><cylinderGeometry args={[0.07, 0.08, 2.7]} /></mesh>
      <mesh position-y={1.85} castShadow material={scareMat.shirt}><boxGeometry args={[1.6, 0.55, 0.28]} /></mesh>
      <mesh position-y={2.45} castShadow material={scareMat.head}><sphereGeometry args={[0.28, 10, 8]} /></mesh>
      <mesh position-y={2.8} material={scareMat.hat}><coneGeometry args={[0.4, 0.48, 10]} /></mesh>
    </group></group>
  );
}
function Rings() {
  const beak = useRef<(THREE.Mesh | null)[]>([]), ground = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(() => {
    const r = world.sim!.rings;
    for (let i = 0; i < 4; i++) {
      const b = beak.current[i], g = ground.current[i]; if (!b || !g) continue;
      const ring = r[i]; b.visible = g.visible = !!ring;
      if (!ring) continue;
      const k = ring.t / 0.8, fx = Math.sin(ring.yaw), fz = Math.cos(ring.yaw);
      // cartoon shockwave bursting forward from the beak
      const sb = 0.25 + Math.pow(k, 0.6) * 2.2;
      b.position.set(ring.x + fx * k * 1.6, ring.y, ring.z + fz * k * 1.6); b.rotation.set(0, ring.yaw, 0); b.scale.set(sb, sb, sb);
      (b.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.95;
      // wide ground ripple showing the quack's reach
      const sg = 0.5 + Math.pow(k, 0.7) * 4.2;
      g.position.set(ring.x, Math.max(0.08, ring.y - 0.8), ring.z); g.scale.set(sg, sg, sg);
      (g.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.7;
    }
  });
  return <>{[0, 1, 2, 3].map((i) => (
    <group key={i}>
      <mesh ref={(el) => { beak.current[i] = el; }} visible={false}>
        <ringGeometry args={[0.72, 1, 32]} /><meshBasicMaterial color="#fffbe6" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={(el) => { ground.current[i] = el; }} rotation-x={-Math.PI / 2} visible={false}>
        <ringGeometry args={[0.88, 1, 40]} /><meshBasicMaterial color="#ffe066" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  ))}</>;
}

// ---------- stepper ----------
function Stepper() {
  const { camera, gl } = useThree();
  const camPos = useRef(new THREE.Vector3(0, 8, 14));
  const look = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3()), lookAt = useRef(new THREE.Vector3());
  const ready = useRef(0);
  useEffect(() => {
    // Pointer-lock mouse look: moving the mouse orbits the camera, no buttons held.
    const el = gl.domElement;
    world.canvas = el;
    const isLocked = () => document.pointerLockElement === el;
    const playing = () => { const p = useGame.getState().phase; return p === "playing" || p === "free"; };
    const dn = (e: PointerEvent) => {
      if (!playing()) return;
      if (e.button === 2) { pressed.add("MouseRight"); return; }
      if (e.button !== 0) return;
      if (isLocked()) pressed.add("MouseLeft"); // grab / fling
      else requestMouseLook();
    };
    const mv = (e: MouseEvent) => {
      if (!isLocked()) return;
      world.yawTarget -= e.movementX * ORBIT_YAW_SPEED;
      world.pitchTarget = clampPitch(world.pitchTarget + e.movementY * ORBIT_PITCH_SPEED);
    };
    const lockChange = () => useGame.getState().set({ locked: isLocked() });
    const ctx = (e: Event) => e.preventDefault();
    // release the cursor whenever an overlay (title / victory) is showing
    const unsub = useGame.subscribe((st, prev) => {
      if (st.phase !== prev.phase && st.phase !== "playing" && st.phase !== "free" && isLocked()) document.exitPointerLock();
    });
    el.addEventListener("pointerdown", dn); el.addEventListener("contextmenu", ctx);
    document.addEventListener("mousemove", mv); document.addEventListener("pointerlockchange", lockChange);
    return () => {
      unsub();
      el.removeEventListener("pointerdown", dn); el.removeEventListener("contextmenu", ctx);
      document.removeEventListener("mousemove", mv); document.removeEventListener("pointerlockchange", lockChange);
      if (world.canvas === el) world.canvas = null;
    };
  }, [gl]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = world.sim!;
    const ui = useGame.getState();
    const active = ui.phase === "playing" || ui.phase === "free";
    const { input, snap } = readInput(s.duck.swimming || s.duck.diving);
    if (active && snap) world.yawTarget = behindYaw(s.duck.yaw, world.camYaw);
    world.camYaw = dampAngle(world.camYaw, world.yawTarget, 20, dt);
    world.pitch = dampAngle(world.pitch, world.pitchTarget, 20, dt);
    stepSim(s, active ? input : { ...input, grab: false, quack: false, jump: false, reset: false, dive: false }, world.camYaw, dt, active);
    const quack = s.events.includes("quack");
    for (const e of s.events) {
      if (e === "won") {
        if (ui.mission.index !== "done") s.won = false;
        else { playSound("fanfare", 0.15); if (ui.phase === "playing") ui.set({ phase: "won", finalTime: s.elapsed }); }
      } else playSound(e);
    }
    s.events.length = 0;
    let mission = ui.mission;
    if (active) {
      const taxRoles = ["watering", "boot", "pail"] as const;
      const tax = taxRoles.flatMap((role) => {
        const p = s.props.find((q) => q.role === role);
        return p ? [{ role, inPond: inPond(p.x, p.z), airborne: !!p.flung && (!p.onGround || p.y > 0.35), x: p.x, y: p.y, z: p.z }] : [];
      });
      const hat = s.props.find((p) => p.kind === "hat")!;
      const stepped = stepMission(mission, {
        now: performance.now(), quack, duckX: s.duck.x, duckY: s.duck.y, duckZ: s.duck.z, tax,
        pumpkins: s.props.filter((p) => p.kind === "pumpkin").map((p) => ({ id: p.id, x: p.x, y: p.y, z: p.z, out: !inGarden(p.x, p.z) })),
        scareTilt: s.scarecrowTilt, scareX: SCARECROW.x, scareZ: SCARECROW.z,
        picnic: s.props.filter((p) => p.table).map((p) => ({
          id: p.id, x: p.x, y: p.y, z: p.z,
          off: p.id !== s.duck.held && p.onGround && p.y < TABLE.h - 0.22,
        })),
        hat: { attached: !!hat?.attached, inPond: !!hat && !hat.attached && inPond(hat.x, hat.z), x: hat?.x ?? 0, y: hat?.y ?? 0, z: hat?.z ?? 0 },
        chickens: s.chickens.map((c) => ({ id: c.id, x: c.x, z: c.z, inGarden: inGarden(c.x, c.z) })),
        grab: input.grab,
        duckInsideCoop: inCoopBounds(s.duck.x, s.duck.z),
        farmerInsideCoop: inCoopBounds(s.farmer.x, s.farmer.z),
        nearLatch: Math.hypot(s.duck.x - LAYOUT.latch.x, s.duck.z - LAYOUT.latch.z) < 1.7 && !inCoopBounds(s.duck.x, s.duck.z),
        bumpedLatch: Math.hypot(s.duck.x - LAYOUT.latch.x, s.duck.z - LAYOUT.latch.z) < 1.35
          && Math.hypot(s.duck.vx, s.duck.vz) > 2.4 && !inCoopBounds(s.duck.x, s.duck.z),
        score: s.score,
        lures: s.props.filter((p) => p.kind === "lure").map((p) => ({
          id: p.id,
          onDock: p.id === s.duck.held
            ? onDock(s.duck.x, s.duck.z)
            : onDock(p.x, p.z) && p.y > DOCK.y - 0.5,
        })),
        rampId: s.justRamp,
        pads: LILIES.map((_, i) => lilyAt(s.duck.x, s.duck.z) === i && s.duck.y > BIG_SURFACE),
        onIsland: onIsland(s.duck.x, s.duck.z) && s.duck.y > BIG_SURFACE,
        inBigWater: inBigPond(s.duck.x, s.duck.z) && s.duck.swimming && lilyAt(s.duck.x, s.duck.z) < 0 && !onDock(s.duck.x, s.duck.z) && !onIsland(s.duck.x, s.duck.z),
      });
      let conquered = false;
      for (const effect of stepped.effects) {
        applyMissionEffect(s, effect);
        if (effect.t === "conquer") conquered = true;
      }
      mission = stepped.state;
      if (conquered) {
        if (document.pointerLockElement) document.exitPointerLock();
        ui.set({
          phase: ui.phase === "playing" ? "won" : ui.phase,
          finalTime: s.elapsed,
          mission,
          score: s.score,
        });
      }
    }
    const prog = { pond: s.pondSet.size, pumpkin: pumpkinsOut(s) };
    const objChanged = Object.entries(s.objectives).some(([k, v]) => ui.objectives[k as keyof typeof s.objectives] !== v);
    if (mission !== ui.mission || ui.score !== s.score || prog.pond !== ui.progress.pond || prog.pumpkin !== ui.progress.pumpkin || objChanged) {
      ui.set({ mission, score: s.score, objectives: { ...s.objectives }, progress: prog });
    }
    // camera
    const d = s.duck;
    if (ui.phase === "title") {
      const a = s.time * 0.08;
      camPos.current.set(Math.sin(a) * 30, 16, Math.cos(a) * 30); look.current.set(0, 0, 0);
      camera.position.copy(camPos.current);
    } else {
      const o = orbitOffset(world.camYaw, world.pitch);
      const base = Math.max(d.y, 0) + 0.8;
      target.current.set(d.x + o.x, Math.max(0.6, base + o.y), d.z + o.z);
      camera.position.lerp(target.current, 1 - Math.exp(-10 * dt));
      look.current.lerp(lookAt.current.set(d.x, base, d.z), 1 - Math.exp(-14 * dt));
    }
    camera.lookAt(look.current);
    if (ready.current < 3 && ++ready.current === 3) gl.domElement.parentElement?.parentElement?.setAttribute("data-scene-ready", "true");
  });
  return null;
}

export default function GameScene() {
  useKeyboard();
  const token = useGame((s) => s.resetToken);
  const sim = useMemo(() => {
    const s = createSim(); world.sim = s;
    cues.rooster = 0; cues.sparkle = 0; cues.corn = true; cues.egg = true; cues.eggSpark = 0; cues.pops = []; cues.confetti = [];
    world.camYaw = world.yawTarget = 0; world.pitch = world.pitchTarget = CAM_PITCH;
    return s;
  }, [token]);
  useEffect(() => {
    const probe = {
      getYaw: () => world.sim?.duck.yaw ?? 0,
      getSpeed: () => {
        const d = world.sim?.duck;
        return d ? Math.hypot(d.vx, d.vz) : 0;
      },
      setKeys: (codes: string[]) => {
        keys.clear();
        pressed.clear();
        for (const c of codes) { keys.add(c); pressed.add(c); }
      },
    };
    (window as unknown as { __game: unknown }).__game = { world, store: useGame };
    (window as unknown as { __controlsTest: typeof probe }).__controlsTest = probe;
  }, []);
  return (
    <div className="absolute inset-0">
      <Canvas shadows camera={{ fov: 55, position: [0, 10, 20] }} dpr={[1, 1.75]}>
        <color attach="background" args={["#9fd9f5"]} />
        <fog attach="fog" args={["#bfe6f7", 40, 98]} />
        <hemisphereLight args={["#fff4d6", "#6cc24a", 0.7]} />
        <directionalLight position={[15, 25, 10]} intensity={2.2} color="#fff1c9" castShadow
          shadow-mapSize={[2048, 2048]} shadow-camera-left={-36} shadow-camera-right={36} shadow-camera-top={28} shadow-camera-bottom={-72} />
        <Environment resolution={64}>
          <Lightformer intensity={1.5} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
          <Lightformer intensity={0.8} color="#bfe6f7" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <group key={token}>
          <Farm />
          <Act2 />
          <BouncyHay />
          {sim && <><Props /><Duck /><Chickens /><Farmer /><Scarecrow /><Rings /><TutorialActors /></>}
          <Stepper />
        </group>
      </Canvas>
    </div>
  );
}
