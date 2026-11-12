import { i as __toESM } from "../_runtime.mjs";
import { a as Canvas, d as require_react, n as Environment, o as useFrame, r as Html, s as useThree, t as Lightformer, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as pressed, c as ORBIT_YAW_SPEED, d as dampAngle, f as orbitOffset, g as stepMission, h as LAYOUT, i as keys, l as behindYaw, m as useGame, n as requestMouseLook, o as CAM_PITCH, p as playSound, r as world, s as ORBIT_PITCH_SPEED, u as clampPitch } from "./routes-VODU3UAr.mjs";
import { D as RepeatWrapping, N as Vector3, O as SRGBColorSpace, b as MeshBasicMaterial, o as CanvasTexture, x as MeshStandardMaterial } from "../_libs/monogrid__gainmap-js+three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Scene-DIHh4Nns.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FENCE = 23.4;
var SOUTH_GROUND = -1.8;
var BIG_SURFACE = -2.05;
var BIG_BED = -2.85;
var BIG = {
	x: 0,
	z: 56,
	rx: 13,
	rz: 11
};
var DOCK = {
	x0: -10,
	x1: -2.2,
	z0: 44.2,
	z1: 48.6,
	y: -1.32
};
var ISLAND = {
	x: 5.2,
	z: 64,
	r: 2.05,
	y: -1.22
};
var LILY_R = 1.32;
var LILY_Y = -1.48;
var LILIES = [
	{
		x: -1.2,
		z: 49.2
	},
	{
		x: 1.6,
		z: 52.2
	},
	{
		x: 3.6,
		z: 55.1
	},
	{
		x: 5,
		z: 57.8
	},
	{
		x: 5.3,
		z: 60.2
	}
];
var WAKE_RAMPS = [
	{
		id: 0,
		x: -7.2,
		z: 51.2,
		yaw: .45
	},
	{
		id: 1,
		x: -6.4,
		z: 57.6,
		yaw: -.15
	},
	{
		id: 2,
		x: 1.2,
		z: 65.4,
		yaw: 1.05
	}
];
var LURE_SPOTS = [
	{
		x: -4.6,
		z: 54.2
	},
	{
		x: 2.4,
		z: 57.4
	},
	{
		x: -1.2,
		z: 63.1
	}
];
/** Gate hinge on the south fence. The leaf extends toward +X when shut. */
var SOUTH_GATE = {
	x: -2.15,
	z: 24
};
var roadGate = { open: false };
var inRect$1 = (r, x, z, m = 0) => x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;
var inBigPond = (x, z) => {
	const dx = (x - BIG.x) / BIG.rx, dz = (z - BIG.z) / BIG.rz;
	return dx * dx + dz * dz < 1;
};
var southGroundY = (z) => {
	if (z < 25) return 0;
	if (z < 40) return SOUTH_GROUND * ((z - 25) / 15);
	return SOUTH_GROUND;
};
var roadX = (z) => Math.sin((z - 24) * .18) * 8;
var onDock = (x, z) => inRect$1(DOCK, x, z, .15);
var onIsland = (x, z) => Math.hypot(x - ISLAND.x, z - ISLAND.z) < ISLAND.r;
function lilyAt(x, z) {
	for (let i = 0; i < LILIES.length; i++) {
		const p = LILIES[i];
		if (Math.hypot(x - p.x, z - p.z) < 1.32) return i;
	}
	return -1;
}
function rampAt(x, z) {
	for (const r of WAKE_RAMPS) {
		const dx = x - r.x, dz = z - r.z;
		const c = Math.cos(r.yaw), s = Math.sin(r.yaw);
		const lx = dx * c + dz * s;
		const lz = -dx * s + dz * c;
		if (Math.abs(lx) < .85 && lz > -.3 && lz < 3.3) return r.id;
	}
	return -1;
}
/** Closed south fence is solid. Open, only the posts outside the leaf stay solid. */
function southFenceBlocks(x, z) {
	if (z < 22.95 || z > 24.25 || Math.abs(x) > 24) return false;
	if (roadGate.open && Math.abs(x - 0) < 2.25) return false;
	return true;
}
var PROP_DEFS = {
	pumpkin: {
		r: .4,
		h: .6,
		mass: 1.2
	},
	cabbage: {
		r: .3,
		h: .45,
		mass: .6
	},
	bucket: {
		r: .3,
		h: .5,
		mass: .7
	},
	can: {
		r: .3,
		h: .45,
		mass: .6
	},
	hay: {
		r: .7,
		h: .9,
		mass: 3,
		wood: true
	},
	crate: {
		r: .45,
		h: .8,
		mass: 1.5,
		wood: true
	},
	barrel: {
		r: .4,
		h: .9,
		mass: 1.6,
		wood: true
	},
	plate: {
		r: .22,
		h: .06,
		mass: .2
	},
	pie: {
		r: .25,
		h: .15,
		mass: .3
	},
	cup: {
		r: .12,
		h: .18,
		mass: .15
	},
	shovel: {
		r: .35,
		h: .15,
		mass: .6,
		wood: true
	},
	hat: {
		r: .35,
		h: .2,
		mass: .2
	},
	watering: {
		r: .28,
		h: .42,
		mass: .5
	},
	boot: {
		r: .22,
		h: .28,
		mass: .35
	},
	pail: {
		r: .28,
		h: .4,
		mass: .55,
		wood: true
	},
	thermos: {
		r: .12,
		h: .32,
		mass: .35
	},
	lure: {
		r: .16,
		h: .08,
		mass: .15
	}
};
/** Props that clatter like crockery. */
var FRAGILE = /* @__PURE__ */ new Set([
	"plate",
	"cup",
	"pie",
	"thermos"
]);
/** Upright props that tip over once knocked. */
var TIPPABLE = /* @__PURE__ */ new Set([
	"can",
	"bucket",
	"cup",
	"barrel"
]);
var FALL_MULT = 1.5;
var CUT_MULT = 2.4;
var WALK = 4.5;
var SWIM = 7.5;
var JUMP_V = 9.2;
var COYOTE = .1;
var JUMP_BUFFER = .12;
var GLIDE_FALL = -1.6;
var FLAP_EVERY = .11;
var STEP = .6;
var BOUND = FENCE;
var QUACK_RADIUS = 4.5;
var QUACK_COOLDOWN = .35;
var QUACK_ANIM = .45;
var GRAB_RANGE = 1.7;
var POND = {
	x: -12,
	z: 10,
	r: 6
};
var BARN = {
	x0: 8,
	x1: 16,
	z0: -18,
	z1: -10
};
var LOFT = {
	x0: 2,
	x1: 8,
	z0: -18,
	z1: -15.2,
	h: 2.2
};
var RAMP = {
	x0: 2,
	x1: 8,
	z0: -12,
	z1: -6
};
var HOUSE = {
	x0: -20,
	x1: -8,
	z0: -21,
	z1: -13
};
var PORCH = {
	x0: -20,
	x1: -8,
	z0: -13,
	z1: -9
};
var TABLE = {
	x0: -15.6,
	x1: -12.4,
	z0: -7.7,
	z1: -6.3,
	h: .8
};
var GARDEN = {
	x0: 4,
	x1: 14,
	z0: 4,
	z1: 14
};
var COOP = {
	x0: 16,
	x1: 20,
	z0: 15,
	z1: 19
};
var SCARECROW = {
	x: 9,
	z: 12.8
};
var SPAWN = {
	x: 11,
	z: 9
};
/** Springy hay tucked under the barn's east eave. y is the landing deck. */
var HAY_BOUNCE = {
	x: 17.15,
	z: LAYOUT.egg.z,
	r: 1.15,
	y: 1.12
};
var ROOF_Y = 6.2;
var ROOF_HALF_Z = 1.55;
/** Ridge deck runs the barn and overhangs the hay so a straight bounce lands on it. */
var ROOF_X0 = 8.05;
var ROOF_X1 = 18.35;
/** Shared with heightAt so a shut gate becomes a wall. Reset in createSim. */
var coopGate = { shut: false };
var inRect = (r, x, z, m = 0) => x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;
var inPond = (x, z) => Math.hypot(x - POND.x, z - POND.z) < POND.r - .3;
var inGarden = (x, z) => inRect(GARDEN, x, z, .3);
var onHay = (x, z) => Math.hypot(x - HAY_BOUNCE.x, z - HAY_BOUNCE.z) < HAY_BOUNCE.r;
/** Past the coop doorway, inside the pen. */
var inCoopBounds = (x, z) => x > COOP.x0 + .55 && x < COOP.x1 - .55 && z > COOP.z0 + .4 && z < COOP.z1 - .45;
var onWood = (x, z, y) => inRect(PORCH, x, z) || y > .05 && (inRect(LOFT, x, z) || inRect(RAMP, x, z) || inRect(TABLE, x, z) || inRect(BARN, x, z) && y > 4);
function heightAt(x, z, y = 0) {
	if (inRect(BARN, x, z) || x > 8.05 && x < 18.35 && Math.abs(z - LAYOUT.egg.z) <= 1.55) {
		if (x > 8.05 && x < 18.35 && Math.abs(z - LAYOUT.egg.z) <= 1.55 && y >= 5.7) return ROOF_Y;
		if (inRect(BARN, x, z)) return 50;
	}
	if (inRect(HOUSE, x, z)) return 50;
	if (inRect(COOP, x, z)) {
		const inset = .42;
		if (x > COOP.x0 + inset && x < COOP.x1 - inset && z > COOP.z0 + inset && z < COOP.z1 - inset) return 0;
		if (Math.abs(x - LAYOUT.latch.x) < .95 && z <= COOP.z0 + inset + .08 && z >= COOP.z0 - .5 && !coopGate.shut) return 0;
		return 50;
	}
	if (inPond(x, z)) return -.15;
	if (southFenceBlocks(x, z)) return 50;
	if (onDock(x, z)) return DOCK.y;
	if (onIsland(x, z)) return ISLAND.y;
	if (lilyAt(x, z) >= 0 && y > -2.05 - .15) return LILY_Y;
	const ramp = rampAt(x, z);
	if (ramp >= 0 && y > -2.25) {
		const spec = WAKE_RAMPS[ramp];
		const dx = x - spec.x, dz = z - spec.z;
		const c = Math.cos(spec.yaw), s = Math.sin(spec.yaw);
		const lz = -dx * s + dz * c;
		const t = Math.max(0, Math.min(1, (lz + .3) / 3.6));
		return BIG_SURFACE + .12 + t * .95;
	}
	if (inBigPond(x, z)) return BIG_SURFACE;
	if (z > 24.4) return southGroundY(z);
	if (inRect(LOFT, x, z)) return LOFT.h;
	if (inRect(RAMP, x, z)) return LOFT.h * ((RAMP.z1 - z) / (RAMP.z1 - RAMP.z0));
	if (inRect(TABLE, x, z)) return TABLE.h;
	if (onHay(x, z)) return HAY_BOUNCE.y;
	return 0;
}
var FARMER_PATH = [
	{
		x: -16,
		z: -11
	},
	{
		x: -8,
		z: -6
	},
	{
		x: 1,
		z: 0
	},
	{
		x: 9,
		z: 2.4
	},
	{
		x: 9,
		z: 5.4
	},
	{
		x: 0,
		z: 1
	}
];
function createSim() {
	const props = [];
	const add = (kind, x, z, y = 0, extra = {}) => {
		props.push({
			id: props.length,
			kind,
			x,
			y,
			z,
			vx: 0,
			vy: 0,
			vz: 0,
			ox: x,
			oz: z,
			yaw: props.length * 1.7 % 6.28,
			tilt: 0,
			tipped: false,
			hitCd: 0,
			onGround: true,
			disturbed: false,
			pondCounted: false,
			table: false,
			attached: false,
			...extra
		});
	};
	for (const [x, z] of [
		[5.5, 6.2],
		[7.4, 6.8],
		[6.2, 9.2],
		[8.2, 8.4],
		[5.8, 11.5],
		[7.6, 12.2]
	]) add("pumpkin", x, z);
	for (let i = 0; i < 4; i++) add("cabbage", 5.5 + i * 2.5, 10.8);
	add("crate", 3, -16.4, 2.2);
	add("crate", 3.8, -17.2, 2.2);
	add("crate", 4.6, -16.2, 2.2);
	add("barrel", 6.2, -16.8, 2.2);
	add("barrel", 7, -17.2, 2.2);
	add("crate", 6.4, -17.4, 2.2);
	add("hay", 5, -17, 2.2);
	add("hay", 5, -17, 3.1);
	add("hay", 11, -8);
	add("hay", 13, -8);
	add("hay", 12, -8, .9);
	add("bucket", -3, 4);
	add("bucket", 2, -3);
	add("can", 3, 2);
	add("can", -5, -2);
	add("shovel", 0, 8);
	add("shovel", 16, 6);
	add("bucket", 17, 12);
	add("crate", -4, -9);
	add("barrel", -6, 12.5);
	const cz = -2.5, ch = PROP_DEFS.can.h;
	add("can", -.6, cz, 0, { yaw: 0 });
	add("can", 0, cz, 0, { yaw: 0 });
	add("can", .6, cz, 0, { yaw: 0 });
	add("can", -.3, cz, ch, { yaw: 0 });
	add("can", .3, cz, ch, { yaw: 0 });
	add("can", 0, cz, ch * 2, { yaw: 0 });
	const t = (kind, x, z) => add(kind, x, z, TABLE.h, { table: true });
	t("plate", -15, -7.3);
	t("plate", -14.2, -6.85);
	t("plate", -13.1, -7.25);
	t("pie", -14.6, -6.55);
	t("thermos", -13.15, -6.55);
	add("hat", LAYOUT.chair.x, LAYOUT.chair.z, 1.15, { attached: true });
	for (const c of LAYOUT.cans) add("can", c.x, c.z, c.y, {
		role: "feed",
		pinned: true,
		yaw: 0
	});
	add("watering", LAYOUT.tax.watering.x, LAYOUT.tax.watering.z, 0, { role: "watering" });
	add("boot", LAYOUT.tax.boot.x, LAYOUT.tax.boot.z, 0, { role: "boot" });
	add("pail", LAYOUT.tax.pail.x, LAYOUT.tax.pail.z, 0, { role: "pail" });
	LURE_SPOTS.forEach((spot) => add("lure", spot.x, spot.z, BIG_BED + .06, {
		pinned: true,
		disturbed: true,
		pondCounted: true
	}));
	const chickens = [];
	[
		[16.6, 11.2],
		[17.8, 12.35],
		[19.15, 11.05],
		[18.35, 13.25],
		[16.7, 13.45]
	].forEach(([x, z], i) => {
		chickens.push({
			id: i,
			x,
			z,
			yaw: i * 1.2,
			vx: 0,
			vz: 0,
			tx: x,
			tz: z,
			flee: 0,
			hop: i,
			penned: false
		});
	});
	roadGate.open = false;
	coopGate.shut = false;
	return {
		duck: {
			x: SPAWN.x,
			y: 0,
			z: SPAWN.z,
			vx: 0,
			vy: 0,
			vz: 0,
			onGround: true,
			yaw: Math.atan2(LAYOUT.roost.x - SPAWN.x, LAYOUT.roost.z - SPAWN.z),
			glide: 0,
			swimming: false,
			held: null,
			quackCd: 0,
			flap: 0,
			coyote: 0,
			jumpBuf: 0,
			flapCd: 0,
			stepDist: 0,
			quackAnim: 0,
			quacks: 0,
			air: 4,
			diving: false,
			boosting: false,
			diveCd: 0
		},
		props,
		chickens,
		farmer: {
			x: LAYOUT.chair.x,
			z: LAYOUT.chair.z,
			yaw: .4,
			wp: 0,
			angry: 0,
			startle: 0,
			hasHat: true,
			asleep: true,
			chase: false,
			shooCd: 0,
			lure: false,
			trapped: false
		},
		scarecrowDown: false,
		scarecrowTilt: 0,
		scarecrowAV: 0,
		rings: [],
		score: 0,
		elapsed: 0,
		time: 0,
		objectives: {
			pond: false,
			pumpkin: false,
			scarecrow: false,
			picnic: false,
			hat: false
		},
		pondSet: /* @__PURE__ */ new Set(),
		events: [],
		won: false,
		herd: false,
		bounceCd: 0,
		boing: 0,
		gateShut: false,
		gateAngle: -1.15,
		scoreMul: 1,
		roadOpen: false,
		roadAngle: 0,
		justRamp: -1,
		rampLatch: -1
	};
}
/** Integrates one body; returns the landing speed if it touched down this step (else 0). */
function stepBody(b, dt, drag, o = {}) {
	const wasGround = b.onGround;
	b.vy -= (o.g ?? 22) * dt;
	const zHi = roadGate.open ? 74 : FENCE;
	const nx = Math.max(-FENCE, Math.min(FENCE, b.x + b.vx * dt));
	const nz = Math.max(-FENCE, Math.min(zHi, b.z + b.vz * dt));
	if (heightAt(nx, nz, b.y) > b.y + .6) {
		if (heightAt(nx, b.z, b.y) <= b.y + .6) {
			b.x = nx;
			b.vz *= -.2;
		} else if (heightAt(b.x, nz, b.y) <= b.y + .6) {
			b.z = nz;
			b.vx *= -.2;
		} else {
			b.vx *= -.3;
			b.vz *= -.3;
		}
	} else {
		b.x = nx;
		b.z = nz;
	}
	if (Math.abs(nx) >= 23.4 - .001) b.vx *= -.4;
	if (nz <= -23.4 + .001 || nz >= zHi - .001) b.vz *= -.4;
	b.y += b.vy * dt;
	const g = Math.min(heightAt(b.x, b.z, b.y), b.y + STEP + .01);
	let ground = g > 40 ? b.y : g;
	if (o.floor != null && ground < 0 && ground > o.floor && ground < o.floor + 1.25) ground = o.floor;
	let landed = 0;
	if (b.y <= ground) {
		if (!wasGround) landed = -b.vy;
		b.y = ground;
		b.vy = o.bounce !== false && b.vy < -4 ? -b.vy * .25 : 0;
		b.onGround = true;
		const k = Math.exp(-drag * dt);
		b.vx *= k;
		b.vz *= k;
	} else if (o.snap && wasGround && b.vy <= 0 && b.y - ground < .4) {
		b.y = ground;
		b.vy = 0;
		b.onGround = true;
	} else b.onGround = false;
	return landed;
}
var pumpkinsOut = (s) => s.props.filter((p) => p.kind === "pumpkin" && !inGarden(p.x, p.z)).length;
var impactSound = (a, b) => FRAGILE.has(a) || b && FRAGILE.has(b) ? "clatter" : PROP_DEFS[a].wood || b && PROP_DEFS[b].wood ? "thud" : "bump";
function impact(s, active, ev, ...ps) {
	if (!active || ps.some((p) => p.hitCd > 0)) return;
	for (const p of ps) p.hitCd = .25;
	s.events.push(ev);
}
function stepSim(s, input, camYaw, dt, active) {
	if (s.gateAngle == null || s.boing == null || s.roadAngle == null) {
		s.herd ??= false;
		s.bounceCd ??= 0;
		s.boing ??= 0;
		s.gateShut ??= false;
		s.gateAngle ??= -1.15;
		s.farmer.lure ??= false;
		s.farmer.trapped ??= false;
		s.chickens.forEach((c, i) => {
			c.id ??= i;
			c.penned ??= false;
		});
		s.scoreMul ??= 1;
		s.roadOpen ??= false;
		s.roadAngle ??= 0;
		s.justRamp ??= -1;
		s.rampLatch ??= -1;
		s.duck.air ??= 4;
		s.duck.diving ??= false;
		s.duck.boosting ??= false;
		s.duck.diveCd ??= 0;
		coopGate.shut = !!s.gateShut;
		roadGate.open = !!s.roadOpen;
	}
	roadGate.open = !!s.roadOpen;
	if (!s.props.some((p) => p.kind === "lure")) for (const spot of LURE_SPOTS) {
		const id = s.props.length;
		s.props.push({
			id,
			kind: "lure",
			x: spot.x,
			y: BIG_BED + .06,
			z: spot.z,
			vx: 0,
			vy: 0,
			vz: 0,
			ox: spot.x,
			oz: spot.z,
			yaw: id,
			tilt: 0,
			tipped: false,
			hitCd: 0,
			onGround: true,
			disturbed: true,
			pondCounted: true,
			table: false,
			attached: false,
			pinned: true
		});
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
		if (input.reset) {
			d.x = SPAWN.x;
			d.z = SPAWN.z;
			d.y = .5;
			d.vx = d.vy = d.vz = 0;
		}
		let mx = fwdX * input.fz + rx * input.fx, mz = fwdZ * input.fz + rz * input.fx;
		const ml = Math.hypot(mx, mz);
		if (ml > 1) {
			mx /= ml;
			mz /= ml;
		}
		const inBig = inBigPond(d.x, d.z);
		const onTop = onDock(d.x, d.z) || onIsland(d.x, d.z) || lilyAt(d.x, d.z) >= 0 || rampAt(d.x, d.z) >= 0;
		d.swimming = inPond(d.x, d.z) && d.y < .1 || inBig && !onTop && d.y < -1.65;
		wantDive = inBig && input.dive && d.air > 0 && d.diveCd <= 0 && !onTop && d.y < southGroundY(d.z) + .35;
		const grounded = d.onGround || d.swimming;
		const heldMass = d.held !== null ? PROP_DEFS[s.props[d.held].kind].mass : 0;
		const boost = input.sprint && inBig && d.swimming && !input.dive;
		const speed = (d.swimming ? boost ? 13 : SWIM : input.sprint ? 8 : WALK) / (1 + heldMass * .25);
		const a = 1 - Math.exp(-(grounded ? 14 : 6) * dt);
		d.vx += (mx * speed - d.vx) * a;
		d.vz += (mz * speed - d.vz) * a;
		if (ml > .1) {
			let diff = Math.atan2(mx, mz) - d.yaw;
			diff = Math.atan2(Math.sin(diff), Math.cos(diff));
			d.yaw += diff * Math.min(1, dt * 20);
		}
		d.coyote = grounded ? COYOTE : Math.max(0, d.coyote - dt);
		d.jumpBuf = input.jump ? JUMP_BUFFER : Math.max(0, d.jumpBuf - dt);
		if (d.jumpBuf > 0 && d.coyote > 0) {
			d.vy = JUMP_V;
			d.glide = 0;
			d.onGround = false;
			d.coyote = 0;
			d.jumpBuf = 0;
			s.events.push("jump");
		}
		if (!d.onGround && input.jumpHeld && d.vy < -1.6 && d.glide < 1.2) {
			d.vy = GLIDE_FALL;
			d.glide += dt;
			d.flap += dt * 30;
			gliding = true;
		}
		if (d.onGround) d.glide = 0;
		if (gliding) {
			d.flapCd -= dt;
			if (d.flapCd <= 0) {
				d.flapCd = FLAP_EVERY;
				s.events.push("flap");
			}
		} else d.flapCd = 0;
		d.flap += dt * (ml > .1 ? input.sprint ? 22 : 12 : 0);
	} else {
		d.vx *= .9;
		d.vz *= .9;
	}
	const rising = d.vy > 0;
	const gDuck = gliding ? 30 : rising ? active && input.jumpHeld ? 30 : 30 * CUT_MULT : 30 * FALL_MULT;
	const wasInPond = inPond(d.x, d.z);
	const landSpeed = stepBody(d, dt, 0, {
		g: gDuck,
		snap: !gliding && !wantDive,
		bounce: false,
		floor: wantDive ? BIG_BED + .32 : void 0
	});
	if (!wasInPond && inPond(d.x, d.z) && active) {
		s.events.push("splash");
		s.score += 5 * (s.scoreMul || 1);
	} else if ((inPond(d.x, d.z) || inBigPond(d.x, d.z)) && landSpeed > 6 && active && !d.diving) s.events.push("splash");
	s.bounceCd = Math.max(0, s.bounceCd - dt);
	s.boing = Math.max(0, s.boing - dt);
	d.diveCd = Math.max(0, d.diveCd - dt);
	const inBigNow = inBigPond(d.x, d.z);
	const onRampNow = rampAt(d.x, d.z) >= 0;
	d.boosting = active && input.sprint && inBigNow && !input.dive && (d.swimming || onRampNow);
	if (active && inBigNow && input.dive && d.air > 0 && d.diveCd <= 0 && d.y < southGroundY(d.z) + .2 && !onDock(d.x, d.z) && !onIsland(d.x, d.z) && lilyAt(d.x, d.z) < 0) {
		d.diving = true;
		d.boosting = false;
		d.swimming = true;
		d.air = Math.max(0, d.air - dt);
		const target = BIG_BED + .32;
		d.y += (target - d.y) * Math.min(1, dt * 7);
		d.vy = Math.min(0, d.vy);
		d.onGround = false;
		if (d.air <= 0) {
			d.diving = false;
			d.diveCd = .65;
		}
	} else {
		d.diving = false;
		if (inBigNow && d.y < -2.05 - .3) d.y += (BIG_SURFACE - d.y) * Math.min(1, dt * 4);
		if (d.swimming || d.onGround) d.air = Math.min(4, d.air + dt * 1.15);
	}
	if (active && d.boosting) {
		const rid = rampAt(d.x, d.z);
		if (rid >= 0 && d.y > -2.05 + .35 && Math.hypot(d.vx, d.vz) > 5 && s.rampLatch !== rid) {
			s.rampLatch = rid;
			s.justRamp = rid;
			d.vy = 11;
			d.onGround = false;
			d.swimming = false;
			s.events.push("splash");
		} else if (rid < 0) s.rampLatch = -1;
	} else if (rampAt(d.x, d.z) < 0) s.rampLatch = -1;
	if (active && s.bounceCd <= 0 && onHay(d.x, d.z) && landSpeed > .8) {
		d.vy = 22;
		d.onGround = false;
		d.glide = 0;
		const ax = LAYOUT.egg.x - d.x, az = LAYOUT.egg.z - d.z, al = Math.hypot(ax, az) || 1;
		const along = d.vx * (ax / al) + d.vz * (az / al);
		const aim = 1.6;
		if (along < aim) {
			d.vx += ax / al * (aim - along);
			d.vz += az / al * (aim - along);
		}
		s.bounceCd = .45;
		s.boing = .38;
		s.events.push("boing");
	}
	d.quackCd = Math.max(0, d.quackCd - dt);
	d.quackAnim = Math.max(0, d.quackAnim - dt);
	const hs = Math.hypot(d.vx, d.vz);
	if (active && hs > .8 && (d.onGround || d.swimming)) {
		if (d.swimming) {
			d.stepDist += dt;
			if (d.stepDist > .38) {
				d.stepDist = 0;
				s.events.push("paddle");
			}
		} else {
			d.stepDist += hs * dt;
			if (d.stepDist > (input.sprint ? 1.1 : .65)) {
				d.stepDist = 0;
				s.events.push(onWood(d.x, d.z, d.y) ? "stepWood" : "step");
			}
		}
	} else if (landSpeed > 4 && active && !d.swimming) s.events.push(onWood(d.x, d.z, d.y) ? "stepWood" : "step");
	const dfx = Math.sin(d.yaw), dfz = Math.cos(d.yaw);
	if (active && input.grab) {
		if (d.held !== null) {
			const p = s.props[d.held];
			const m = PROP_DEFS[p.kind].mass;
			const f = 9 / Math.sqrt(m);
			p.vx = d.vx + dfx * f;
			p.vz = d.vz + dfz * f;
			p.vy = 3.5;
			p.onGround = false;
			p.flung = true;
			d.held = null;
			s.events.push("fling");
		} else {
			let best = -1, bd = GRAB_RANGE;
			for (const p of s.props) {
				if (p.kind === "lure" && !d.diving) continue;
				const dist = Math.hypot(p.x - (d.x + dfx * .6), p.z - (d.z + dfz * .6)) - PROP_DEFS[p.kind].r * .5;
				const yGap = p.kind === "lure" ? 1.2 : 1.5;
				if (Math.abs(p.y - d.y) > yGap && !p.attached) continue;
				if (p.attached) {
					const f = s.farmer;
					if (!((d.x - f.x) * Math.sin(f.yaw) + (d.z - f.z) * Math.cos(f.yaw) < .2) || Math.hypot(d.x - f.x, d.z - f.z) > 1.8) continue;
					if (1 < bd) {
						bd = 1;
						best = p.id;
					}
					continue;
				}
				if (dist < bd) {
					bd = dist;
					best = p.id;
				}
			}
			if (best >= 0) {
				const p = s.props[best];
				if (p.attached) {
					p.attached = false;
					s.farmer.hasHat = false;
					s.farmer.angry = 2.5;
					s.score += 30;
				}
				if (p.kind === "lure") p.pinned = false;
				p.tipped = false;
				p.tilt = 0;
				d.held = best;
				s.events.push("grab");
			}
		}
	}
	if (active && input.quack && d.quackCd <= 0) {
		d.quackCd = QUACK_COOLDOWN;
		d.quackAnim = QUACK_ANIM;
		d.quacks++;
		s.events.push("quack");
		s.score += 1;
		s.rings.push({
			x: d.x + dfx * .7,
			y: d.y + .88,
			z: d.z + dfz * .7,
			yaw: d.yaw,
			t: 0
		});
		for (const p of s.props) {
			if (p.attached || p.id === d.held || p.pinned) continue;
			const dx = p.x - d.x, dz = p.z - d.z, dist = Math.hypot(dx, dz);
			if (dist < 4.5 && dist > .01) {
				const m = PROP_DEFS[p.kind].mass;
				if (m > 2) continue;
				const f = 6 * (1 - dist / QUACK_RADIUS) / m;
				p.vx += dx / dist * f;
				p.vz += dz / dist * f;
				p.vy += f * .5;
				p.onGround = false;
				if (TIPPABLE.has(p.kind)) p.tipped = true;
			}
		}
		for (const c of s.chickens) if (!c.penned && Math.hypot(c.x - d.x, c.z - d.z) < 5.2) c.flee = 2.15;
		const fdx0 = d.x - s.farmer.x, fdz0 = d.z - s.farmer.z, fd0 = Math.hypot(fdx0, fdz0);
		const ahead = fd0 > .05 ? (fdx0 * Math.sin(s.farmer.yaw) + fdz0 * Math.cos(s.farmer.yaw)) / fd0 : 1;
		if (fd0 < 1.65 && ahead < -.35) {
			const hat = s.props.find((p) => p.kind === "hat" && p.attached);
			if (hat) {
				hat.attached = false;
				hat.onGround = false;
				s.farmer.hasHat = false;
				hat.vx = -Math.sin(s.farmer.yaw) * 2.4;
				hat.vz = -Math.cos(s.farmer.yaw) * 2.4;
				hat.vy = 3.6;
				s.farmer.angry = 2.6;
				s.farmer.startle = 1.2;
			}
		}
		if (fd0 < 7) {
			s.farmer.angry = Math.max(s.farmer.angry, 2.5);
			s.farmer.startle = Math.max(s.farmer.startle, .6);
		}
		if (Math.hypot(SCARECROW.x - d.x, SCARECROW.z - d.z) < 2.3) shoveScarecrow(s, 1.6);
	}
	s.rings = s.rings.filter((r) => (r.t += dt) < .8);
	for (const p of s.props) {
		const def = PROP_DEFS[p.kind];
		p.hitCd = Math.max(0, p.hitCd - dt);
		if (p.pinned) {
			p.vx = p.vy = p.vz = 0;
			p.onGround = true;
			continue;
		}
		if (p.attached) {
			const f = s.farmer;
			p.x = f.x;
			p.z = f.z;
			p.y = f.asleep ? 1.15 : 1.75;
			p.yaw = f.yaw;
			continue;
		}
		if (p.id === d.held) {
			p.x = d.x + dfx * (.55 + def.r);
			p.z = d.z + dfz * (.55 + def.r);
			p.y = d.y + .25;
			p.vx = d.vx;
			p.vz = d.vz;
			p.vy = 0;
			p.yaw = d.yaw;
			if (heightAt(p.x, p.z) > p.y + .6) {
				p.x = d.x;
				p.z = d.z;
			}
		} else {
			const sp = Math.hypot(p.vx, p.vz);
			if (stepBody(p, dt, inPond(p.x, p.z) ? 1.2 : 3.5) > 3.5 && !inPond(p.x, p.z)) impact(s, active, impactSound(p.kind), p);
			if (p.onGround && !inPond(p.x, p.z)) p.flung = false;
			p.yaw += sp * dt * .8;
		}
		if (p.tipped) p.tilt += (Math.PI / 2 - p.tilt) * Math.min(1, dt * 8);
		if (!p.disturbed && Math.hypot(p.x - p.ox, p.z - p.oz) > .8) {
			p.disturbed = true;
			if (TIPPABLE.has(p.kind) && p.id !== d.held) p.tipped = true;
			if (active) {
				s.score += 10 * (s.scoreMul || 1);
				impact(s, active, impactSound(p.kind), p);
			}
		}
		if (!p.pondCounted && inPond(p.x, p.z) && p.id !== d.held) {
			p.pondCounted = true;
			s.pondSet.add(p.id);
			if (active) {
				s.score += 25 * (s.scoreMul || 1);
				s.events.push("splash");
			}
		}
		if (p.kind === "lure" && p.id !== d.held && !p.pinned && inBigPond(p.x, p.z) && !onDock(p.x, p.z)) {
			p.y = BIG_BED + .06;
			p.vx = p.vz = p.vy = 0;
			p.pinned = true;
			p.onGround = true;
		}
		if (!s.scarecrowDown && Math.hypot(p.x - SCARECROW.x, p.z - SCARECROW.z) < .7 && Math.hypot(p.vx, p.vz) > 2) shoveScarecrow(s, 2.4);
	}
	const DR = .4;
	for (const p of s.props) {
		if (p.attached || p.pinned || p.id === d.held) continue;
		const def = PROP_DEFS[p.kind];
		if (p.y > d.y + .8 || d.y > p.y + def.h) continue;
		const dx = p.x - d.x, dz = p.z - d.z, dist = Math.hypot(dx, dz), min = DR + def.r;
		if (dist < min && dist > 1e-4) {
			const nx = dx / dist, nz = dz / dist, push = min - dist;
			p.x += nx * push;
			p.z += nz * push;
			const rel = d.vx * nx + d.vz * nz;
			if (rel > 0) {
				const k = 1.6 / def.mass;
				p.vx += nx * rel * k;
				p.vz += nz * rel * k;
				if (rel > 4 && def.mass < 1) p.vy += 2;
				if (rel > 3) impact(s, active, impactSound(p.kind), p);
			}
		}
	}
	for (let i = 0; i < s.props.length; i++) for (let j = i + 1; j < s.props.length; j++) {
		const a = s.props[i], b = s.props[j];
		if (a.attached || b.attached || a.pinned || b.pinned || a.id === d.held || b.id === d.held) continue;
		const da = PROP_DEFS[a.kind], db = PROP_DEFS[b.kind];
		if (a.y > b.y + db.h * .9 || b.y > a.y + da.h * .9) {
			const top = a.y > b.y ? a : b, bot = top === a ? b : a, dt2 = top === a ? db : da;
			if (Math.hypot(a.x - b.x, a.z - b.z) < (da.r + db.r) * .6 && top.y < bot.y + dt2.h && top.vy <= 0) {
				if (top.vy < -3.5) impact(s, active, impactSound(a.kind, b.kind), a, b);
				top.y = bot.y + dt2.h;
				top.vy = 0;
				top.onGround = true;
				top.vx *= .9;
				top.vz *= .9;
			}
			continue;
		}
		const dx = b.x - a.x, dz = b.z - a.z, dist = Math.hypot(dx, dz), min = da.r + db.r;
		if (dist < min && dist > 1e-4) {
			const nx = dx / dist, nz = dz / dist, push = (min - dist) / 2;
			a.x -= nx * push;
			a.z -= nz * push;
			b.x += nx * push;
			b.z += nz * push;
			const rel = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
			if (rel > 0) {
				const tm = da.mass + db.mass;
				a.vx -= nx * rel * (db.mass / tm) * 1.2;
				a.vz -= nz * rel * (db.mass / tm) * 1.2;
				b.vx += nx * rel * (da.mass / tm) * 1.2;
				b.vz += nz * rel * (da.mass / tm) * 1.2;
				if (rel > 2.5) impact(s, active, impactSound(a.kind, b.kind), a, b);
			}
		}
	}
	if (!s.scarecrowDown && Math.hypot(d.x - SCARECROW.x, d.z - SCARECROW.z) < .85 && Math.hypot(d.vx, d.vz) > 2.4) shoveScarecrow(s, 3.2);
	{
		const a = s.scarecrowTilt;
		const torque = a < .7 ? -a * 7 : 11;
		s.scarecrowAV += torque * dt;
		s.scarecrowAV *= Math.exp(-1.4 * dt);
		s.scarecrowTilt = Math.max(0, Math.min(Math.PI / 2, a + s.scarecrowAV * dt));
		if (!s.scarecrowDown && s.scarecrowTilt > Math.PI / 3) {
			s.scarecrowDown = true;
			s.events.push("thud");
		}
	}
	for (const c of s.chickens) {
		const ddx = c.x - d.x, ddz = c.z - d.z, dd = Math.hypot(ddx, ddz);
		if (c.penned) c.flee = 0;
		else if (input.sprint && dd < 5.2 && Math.hypot(d.vx, d.vz) > 1.6) c.flee = Math.max(c.flee, 1.35);
		let tx, tz, sp;
		if (!c.penned && c.flee > 0) {
			c.flee -= dt;
			tx = c.x + ddx / (dd || 1) * 4;
			tz = c.z + ddz / (dd || 1) * 4;
			sp = 6.4;
		} else if (c.penned) {
			if (Math.hypot(c.tx - c.x, c.tz - c.z) < .28 || Math.random() < dt * .45) {
				c.tx = GARDEN.x0 + 1.4 + Math.random() * (GARDEN.x1 - GARDEN.x0 - 2.8);
				c.tz = GARDEN.z0 + 1.4 + Math.random() * (GARDEN.z1 - GARDEN.z0 - 2.8);
			}
			tx = c.tx;
			tz = c.tz;
			sp = .55;
		} else {
			if (Math.hypot(c.tx - c.x, c.tz - c.z) < .3 || Math.random() < dt * .15) {
				c.tx = 16.2 + Math.random() * 3.6;
				c.tz = 10.4 + Math.random() * 3.2;
			}
			tx = c.tx;
			tz = c.tz;
			sp = 1.15;
		}
		const lx = tx - c.x, lz = tz - c.z, ll = Math.hypot(lx, lz) || 1;
		c.vx += (lx / ll * sp - c.vx) * Math.min(1, dt * 6);
		c.vz += (lz / ll * sp - c.vz) * Math.min(1, dt * 6);
		const nx = Math.max(-BOUND, Math.min(BOUND, c.x + c.vx * dt));
		const nz = Math.max(-BOUND, Math.min(BOUND, c.z + c.vz * dt));
		const entering = !c.penned && inGarden(nx, nz) && !inGarden(c.x, c.z);
		const leaving = c.penned && !inGarden(nx, nz);
		const blocked = inRect(COOP, nx, nz, .2) || inPond(nx, nz);
		const h = heightAt(nx, nz);
		if (entering && !(s.herd && c.flee > 0)) {
			const cx = (GARDEN.x0 + GARDEN.x1) / 2, cz = (GARDEN.z0 + GARDEN.z1) / 2;
			const ax = c.x - cx, az = c.z - cz, al = Math.hypot(ax, az) || 1;
			c.vx = ax / al * 2.4;
			c.vz = az / al * 2.4;
			c.tx = c.x + ax;
			c.tz = c.z + az;
		} else if (leaving || blocked || !(h < .3 && h > -.1)) {
			c.vx *= -.5;
			c.vz *= -.5;
			if (c.penned) {
				c.tx = 9;
				c.tz = 9;
			} else {
				c.tx = c.x;
				c.tz = Math.min(c.z, COOP.z0 - 1.2);
			}
		} else {
			c.x = nx;
			c.z = nz;
		}
		if (Math.hypot(c.vx, c.vz) > .2) c.yaw = Math.atan2(c.vx, c.vz);
		c.hop += dt * (c.penned && Math.hypot(c.vx, c.vz) < .85 ? 9 : Math.hypot(c.vx, c.vz) * 4);
	}
	const f = s.farmer;
	f.startle = Math.max(0, f.startle - dt);
	f.shooCd = Math.max(0, f.shooCd - dt);
	const tableCx = (TABLE.x0 + TABLE.x1) / 2, tableCz = (TABLE.z0 + TABLE.z1) / 2;
	const onTable = inRect(TABLE, d.x, d.z, .05) && d.y > TABLE.h - .35;
	const toTx = tableCx - f.x, toTz = tableCz - f.z, toTd = Math.hypot(toTx, toTz) || 1;
	const facingTable = (Math.sin(f.yaw) * toTx + Math.cos(f.yaw) * toTz) / toTd > .45;
	if (!f.asleep && !f.chase && onTable && toTd < 5 && facingTable) {
		f.angry = Math.max(f.angry, .85);
		if (f.shooCd <= 0) {
			f.shooCd = 1.15;
			s.events.push("grumble");
			f.startle = Math.max(f.startle, .45);
			const ox = d.x - tableCx, oz = d.z - tableCz, ol = Math.hypot(ox, oz) || 1;
			d.vx += ox / ol * 5.5;
			d.vz += oz / ol * 5.5;
			d.vy = Math.max(d.vy, 3.2);
		}
	}
	if (f.trapped) {
		f.angry = Math.max(f.angry, 2.2);
		f.chase = false;
		f.lure = false;
		const spotX = 18, spotZ = 17.15;
		const lx = spotX - f.x, lz = spotZ - f.z, ll = Math.hypot(lx, lz);
		if (ll > .25) {
			const step = Math.min(1.5 * dt, ll);
			f.x += lx / ll * step;
			f.z += lz / ll * step;
		}
		let diff = Math.PI - f.yaw;
		diff = Math.atan2(Math.sin(diff), Math.cos(diff));
		f.yaw += diff * Math.min(1, dt * 8);
	} else if (f.lure) {
		f.chase = false;
		const linedUp = Math.abs(f.x - LAYOUT.latch.x) < .75 && f.z > COOP.z0 - .55;
		const tx = LAYOUT.latch.x;
		const tz = linedUp ? 17.2 : COOP.z0 - .15;
		const lx = tx - f.x, lz = tz - f.z, ll = Math.hypot(lx, lz);
		if (ll > .2) {
			const step = Math.min(4.2 * dt, ll);
			f.x += lx / ll * step;
			f.z += lz / ll * step;
			let diff = Math.atan2(lx, lz) - f.yaw;
			diff = Math.atan2(Math.sin(diff), Math.cos(diff));
			f.yaw += diff * Math.min(1, dt * 6);
		}
	} else if (f.asleep) {} else if (f.chase) {
		let tx = d.x, tz = d.z;
		const edge = POND.r + .45;
		if (Math.hypot(tx - POND.x, tz - POND.z) < edge) {
			const ang = Math.atan2(tz - POND.z, tx - POND.x);
			tx = POND.x + Math.cos(ang) * edge;
			tz = POND.z + Math.sin(ang) * edge;
		}
		const lx = tx - f.x, lz = tz - f.z, ll = Math.hypot(lx, lz);
		if (ll > .35) {
			const step = Math.min(3.6 * dt, ll);
			let nx = f.x + lx / ll * step, nz = f.z + lz / ll * step;
			if (Math.hypot(nx - POND.x, nz - POND.z) < edge) {
				const ang = Math.atan2(f.z - POND.z, f.x - POND.x);
				nx = POND.x + Math.cos(ang) * edge;
				nz = POND.z + Math.sin(ang) * edge;
			}
			f.x = nx;
			f.z = nz;
			let diff = Math.atan2(lx, lz) - f.yaw;
			diff = Math.atan2(Math.sin(diff), Math.cos(diff));
			f.yaw += diff * Math.min(1, dt * 8);
		}
	} else if (f.angry > 0) {
		f.angry -= dt;
		let diff = Math.atan2(d.x - f.x, d.z - f.z) - f.yaw;
		diff = Math.atan2(Math.sin(diff), Math.cos(diff));
		f.yaw += diff * Math.min(1, dt * 14);
	} else {
		const w = FARMER_PATH[f.wp];
		const lx = w.x - f.x, lz = w.z - f.z, ll = Math.hypot(lx, lz);
		if (ll < .2) f.wp = (f.wp + 1) % FARMER_PATH.length;
		else {
			const sp = 1.3 * dt;
			f.x += lx / ll * Math.min(sp, ll);
			f.z += lz / ll * Math.min(sp, ll);
			let diff = Math.atan2(lx, lz) - f.yaw;
			diff = Math.atan2(Math.sin(diff), Math.cos(diff));
			f.yaw += diff * Math.min(1, dt * 5);
		}
	}
	const gateTarget = s.gateShut || coopGate.shut ? 0 : -1.15;
	s.gateAngle += (gateTarget - s.gateAngle) * Math.min(1, dt * (s.gateShut ? 10 : 4));
	const roadTarget = s.roadOpen || roadGate.open ? -1.45 : 0;
	s.roadAngle += (roadTarget - s.roadAngle) * Math.min(1, dt * 2.4);
	const fdx = d.x - f.x, fdz = d.z - f.z, fd = Math.hypot(fdx, fdz);
	if (!f.chase && fd < .9 && fd > 1e-4 && d.y < 1.6) {
		d.x = f.x + fdx / fd * .9;
		d.z = f.z + fdz / fd * .9;
	}
}
function shoveScarecrow(s, power) {
	if (s.scarecrowTilt > Math.PI / 2 - .08) return;
	s.scarecrowAV += power;
}
var CONFETTI_N = 56;
var cues = {
	rooster: 0,
	sparkle: 0,
	corn: true,
	egg: true,
	eggSpark: 0,
	pops: [],
	seq: 1,
	confetti: []
};
var CONFETTI_COLORS = [
	"#ffd24a",
	"#ff4d6d",
	"#7ec8ea",
	"#b8f25a",
	"#fff7ea",
	"#ff9f1c"
];
var confettiMats = CONFETTI_COLORS.map((c) => new MeshBasicMaterial({ color: c }));
function spawnConfetti() {
	const bits = [];
	for (let i = 0; i < CONFETTI_N; i++) {
		const a = i / CONFETTI_N * Math.PI * 2 + Math.random() * .4;
		const r = 2 + Math.random() * 16;
		bits.push({
			x: Math.cos(a) * r * .85,
			y: 9 + Math.random() * 10,
			z: Math.sin(a) * r * .7,
			vx: Math.cos(a) * (1.2 + Math.random() * 2.2),
			vy: 3 + Math.random() * 5,
			vz: Math.sin(a) * (1.2 + Math.random() * 2.2),
			spin: Math.random() * 6,
			c: i % CONFETTI_COLORS.length,
			life: 3.2 + Math.random() * 1.6
		});
	}
	cues.confetti = bits;
}
function applyMissionEffect(s, e) {
	if (e.t === "score") s.score += e.n;
	else if (e.t === "chime") playSound("chime");
	else if (e.t === "fanfare") playSound("fanfare", .08);
	else if (e.t === "ruffle") {
		cues.rooster = 1;
		for (const c of s.chickens) c.flee = 2.2;
	} else if (e.t === "knock") {
		for (const p of s.props) if (p.role === "feed") {
			p.pinned = false;
			p.onGround = false;
			p.disturbed = true;
			p.tipped = true;
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
		const spots = [
			[16.6, 11.2],
			[17.8, 12.35],
			[19.15, 11.05],
			[18.35, 13.25],
			[16.7, 13.45]
		];
		s.chickens.forEach((c, i) => {
			if (c.penned || !inGarden(c.x, c.z)) return;
			const spot = spots[i % spots.length];
			c.x = spot[0];
			c.z = spot[1];
			c.vx = 0;
			c.vz = 0;
			c.tx = spot[0];
			c.tz = spot[1];
			c.flee = 0;
		});
	} else if (e.t === "pen") {
		const c = s.chickens.find((ch) => ch.id === e.id);
		if (c) {
			c.penned = true;
			c.flee = 0;
		}
	} else if (e.t === "egg") {
		cues.egg = false;
		cues.eggSpark = 1.2;
	} else if (e.t === "lure") {
		s.farmer.lure = true;
		s.farmer.chase = false;
		s.farmer.asleep = false;
		s.farmer.angry = Math.max(s.farmer.angry, .6);
		s.farmer.startle = Math.max(s.farmer.startle, .8);
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
		for (const p of s.props) {
			if (p.attached || p.pinned) continue;
			p.ox = p.x;
			p.oz = p.z;
			p.disturbed = false;
			if (!inPond(p.x, p.z)) p.pondCounted = false;
		}
	} else if (e.t === "confetti") spawnConfetti();
	else if (e.t === "conquer") s.scoreMul = 1;
	else if (e.t === "openRoad") {
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
			p.y = DOCK.y + .06;
			if (!onDock(p.x, p.z)) {
				p.x = (DOCK.x0 + DOCK.x1) / 2;
				p.z = (DOCK.z0 + DOCK.z1) / 2;
			}
		}
	} else if (e.t === "pop") {
		cues.pops.push({
			id: cues.seq++,
			text: e.text,
			x: e.x,
			y: e.y,
			z: e.z,
			life: 1.35
		});
		if (cues.pops.length > 6) cues.pops.shift();
	}
}
var gold = new MeshStandardMaterial({
	color: "#ffd24a",
	emissive: "#c8890a",
	emissiveIntensity: .6,
	roughness: .35
});
var crownGold = new MeshStandardMaterial({
	color: "#ffe14a",
	emissive: "#ffb000",
	emissiveIntensity: .9,
	roughness: .28,
	metalness: .62,
	flatShading: true
});
var crownJewel = new MeshStandardMaterial({
	color: "#ff3355",
	emissive: "#ff2244",
	emissiveIntensity: .75,
	roughness: .25,
	flatShading: true
});
var red = new MeshStandardMaterial({
	color: "#e23b2f",
	roughness: .5
});
/** Low-poly crown. Shared by the roof beacon and the duck once it's claimed. */
function GoldenCrown() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			material: crownGold,
			"position-y": .02,
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.18,
				.21,
				.07,
				6
			] })
		}),
		[
			0,
			1,
			2,
			3,
			4,
			5
		].map((i) => {
			const a = i / 6 * Math.PI * 2;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: crownGold,
				position: [
					Math.sin(a) * .16,
					.11,
					Math.cos(a) * .16
				],
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					.046,
					.15,
					4
				] })
			}, i);
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			material: crownJewel,
			"position-y": .2,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.05, 0] })
		})
	] });
}
function TutorialActors() {
	const ring = (0, import_react.useRef)(null);
	const roost = (0, import_react.useRef)(null);
	const corn = (0, import_react.useRef)(null);
	const egg = (0, import_react.useRef)(null);
	const sparks = (0, import_react.useRef)(null);
	const eggSparks = (0, import_react.useRef)(null);
	const hayRing = (0, import_react.useRef)(null);
	const latchRing = (0, import_react.useRef)(null);
	const crown = (0, import_react.useRef)(null);
	const crownRing = (0, import_react.useRef)(null);
	const bits = (0, import_react.useRef)([]);
	const prompt = (0, import_react.useRef)(null);
	const promptAnchor = (0, import_react.useRef)(null);
	const popG = (0, import_react.useRef)([]);
	const popL = (0, import_react.useRef)([]);
	useFrame(({ clock }, dt) => {
		const mission = useGame.getState().mission.index;
		if (ring.current) {
			const show = mission === 1;
			ring.current.visible = show;
			const s = 1 + Math.sin(clock.elapsedTime * 3) * .08;
			ring.current.scale.set(s, s, s);
			ring.current.material.opacity = show ? .45 + Math.sin(clock.elapsedTime * 3) * .2 : 0;
		}
		cues.rooster = Math.max(0, cues.rooster - dt * 1.6);
		if (roost.current) {
			const hop = Math.sin(cues.rooster * Math.PI) * .28;
			roost.current.position.y = hop;
			roost.current.rotation.z = Math.sin(cues.rooster * 18) * .2 * cues.rooster;
		}
		if (corn.current) {
			corn.current.visible = cues.corn;
			corn.current.rotation.y += dt * 1.6;
			corn.current.position.y = LAYOUT.corn.y + Math.sin(clock.elapsedTime * 2.4) * .08;
		}
		if (egg.current) {
			egg.current.visible = cues.egg;
			egg.current.rotation.y += dt * 1.8;
			egg.current.position.y = LAYOUT.egg.y + Math.sin(clock.elapsedTime * 2.2) * .1;
		}
		cues.sparkle = Math.max(0, cues.sparkle - dt);
		cues.eggSpark = Math.max(0, cues.eggSpark - dt);
		if (sparks.current) {
			sparks.current.visible = cues.sparkle > 0;
			const k = cues.sparkle / 1.2;
			sparks.current.scale.setScalar(.4 + (1 - k) * 2.2);
		}
		if (eggSparks.current) {
			eggSparks.current.visible = cues.eggSpark > 0;
			const k = cues.eggSpark / 1.2;
			eggSparks.current.scale.setScalar(.4 + (1 - k) * 2.4);
			eggSparks.current.rotation.y += dt * 2;
		}
		if (hayRing.current) {
			const show = mission === 8;
			hayRing.current.visible = show;
			const s = 1 + Math.sin(clock.elapsedTime * 3) * .06;
			hayRing.current.scale.set(s, s, s);
			hayRing.current.material.opacity = show ? .4 + Math.sin(clock.elapsedTime * 3) * .15 : 0;
		}
		const gateOpen = !world.sim?.gateShut;
		if (latchRing.current) {
			const show = mission === 9 && gateOpen;
			latchRing.current.visible = show;
			const s = 1 + Math.sin(clock.elapsedTime * 3.4) * .07;
			latchRing.current.scale.set(s, s, s);
			latchRing.current.material.opacity = show ? .5 : 0;
		}
		const missionState = useGame.getState().mission;
		if (crown.current) {
			const show = missionState.crownReady;
			crown.current.visible = show;
			crown.current.rotation.y += dt * 1.7;
			crown.current.position.y = LAYOUT.crown.y + Math.sin(clock.elapsedTime * 2.4) * .16;
		}
		if (crownRing.current) {
			const show = missionState.crownReady;
			crownRing.current.visible = show;
			const s = 1 + Math.sin(clock.elapsedTime * 3) * .08;
			crownRing.current.scale.set(s, s, s);
			crownRing.current.material.opacity = show ? .55 : 0;
		}
		for (const bit of cues.confetti) {
			if (bit.life <= 0) continue;
			bit.life -= dt;
			bit.vy -= 8 * dt;
			bit.x += bit.vx * dt;
			bit.y += bit.vy * dt;
			bit.z += bit.vz * dt;
			bit.spin += dt * 5;
			if (bit.y < .12) {
				bit.y = .12;
				bit.vy = Math.abs(bit.vy) * .35;
				bit.vx *= .7;
				bit.vz *= .7;
			}
		}
		for (let i = 0; i < CONFETTI_N; i++) {
			const mesh = bits.current[i];
			const bit = cues.confetti[i];
			if (!mesh) continue;
			if (!bit || bit.life <= 0) {
				mesh.visible = false;
				continue;
			}
			mesh.visible = true;
			mesh.position.set(bit.x, bit.y, bit.z);
			mesh.rotation.set(bit.spin, bit.spin * .6, 0);
			mesh.scale.setScalar(bit.life < .4 ? bit.life / .4 : 1);
		}
		const duck = world.sim?.duck;
		let showPrompt = false;
		let promptText = "";
		if (duck && world.sim) {
			if (mission === 2) {
				let best = null;
				for (const p of world.sim.props) {
					if (p.role !== "watering" && p.role !== "boot" && p.role !== "pail") continue;
					if (inPond(p.x, p.z) || p.id === duck.held) continue;
					const d = Math.hypot(p.x - duck.x, p.z - duck.z);
					if (d < 2.1 && (!best || d < best.d)) best = {
						x: p.x,
						y: p.y,
						z: p.z,
						d
					};
				}
				if (best && promptAnchor.current) {
					showPrompt = true;
					promptText = "Grab";
					promptAnchor.current.position.set(best.x, best.y + .8, best.z);
				}
			} else if (mission === 9 && !world.sim.gateShut) {
				if (Math.hypot(duck.x - LAYOUT.latch.x, duck.z - LAYOUT.latch.z) < 2.4 && promptAnchor.current) {
					showPrompt = true;
					promptText = world.sim.farmer.lure ? "Shut gate" : "Quack inside first";
					promptAnchor.current.position.set(LAYOUT.latch.x, 1.5, LAYOUT.latch.z);
				}
			}
		}
		if (prompt.current) {
			prompt.current.style.opacity = showPrompt ? "1" : "0";
			if (showPrompt) prompt.current.innerHTML = promptText === "Grab" ? "Grab <kbd class=\"kbd\">Left-Click</kbd> / <kbd class=\"kbd\">E</kbd>" : promptText === "Shut gate" ? "Latch <kbd class=\"kbd\">Left-Click</kbd> / <kbd class=\"kbd\">E</kbd>" : "Quack inside the coop first";
		}
		for (const pop of cues.pops) pop.life -= dt;
		cues.pops = cues.pops.filter((pop) => pop.life > 0);
		for (let i = 0; i < 6; i++) {
			const g = popG.current[i];
			const el = popL.current[i];
			const pop = cues.pops[i];
			if (!g || !el) continue;
			g.visible = !!pop;
			if (!pop) continue;
			g.position.set(pop.x, pop.y + (1.35 - pop.life) * .7, pop.z);
			el.style.opacity = String(Math.min(1, pop.life * 1.6));
			el.textContent = pop.text;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: ring,
			position: [
				LAYOUT.guide.x,
				.06,
				LAYOUT.guide.z
			],
			"rotation-x": -Math.PI / 2,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				.7,
				1.05,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#ffd24a",
				transparent: true,
				depthWrite: false,
				side: 2
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				LAYOUT.chair.x,
				0,
				LAYOUT.chair.z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.28,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.7,
					.12,
					.7
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8a5a35" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.7,
					-.28
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.7,
					.7,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8a5a35" })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				LAYOUT.roost.x,
				0,
				LAYOUT.roost.z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"position-y": .55,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.08,
					.1,
					1.1,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: roost,
				"position-y": 1.15,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						castShadow: true,
						material: red,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.28,
							10,
							8
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						position: [
							0,
							.22,
							.05
						],
						material: red,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.06,
							.16,
							.12
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.05,
							.28
						],
						"rotation-x": Math.PI / 2,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
							.06,
							.16,
							5
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f5b51b" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							.22,
							.05,
							-.05
						],
						"rotation-z": -.6,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.28,
							.05,
							.16
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#b42318" })]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: corn,
			position: [
				LAYOUT.corn.x,
				LAYOUT.corn.y,
				LAYOUT.corn.z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				"rotation-z": .4,
				material: gold,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.12,
					.38,
					4,
					8
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				color: "#ffd24a",
				intensity: 4,
				distance: 4
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: sparks,
			position: [
				LAYOUT.corn.x,
				LAYOUT.corn.y,
				LAYOUT.corn.z
			],
			visible: false,
			children: [
				0,
				1,
				2,
				3,
				4,
				5
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					Math.cos(i) * .45,
					i % 3 * .2,
					Math.sin(i) * .45
				],
				material: gold,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.06,
					6,
					6
				] })
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: egg,
			position: [
				LAYOUT.egg.x,
				LAYOUT.egg.y,
				LAYOUT.egg.z
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					scale: [
						.85,
						1.15,
						.85
					],
					material: gold,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.28,
						12,
						10
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					"position-y": .34,
					material: gold,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.08,
						8,
						6
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					color: "#ffe27a",
					intensity: 6,
					distance: 6
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: eggSparks,
			position: [
				LAYOUT.egg.x,
				LAYOUT.egg.y,
				LAYOUT.egg.z
			],
			visible: false,
			children: [
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					Math.cos(i) * .55,
					i % 3 * .22,
					Math.sin(i) * .55
				],
				material: gold,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.07,
					6,
					6
				] })
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: hayRing,
			position: [
				HAY_BOUNCE.x,
				.08,
				HAY_BOUNCE.z
			],
			"rotation-x": -Math.PI / 2,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				1.25,
				1.55,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#ffd24a",
				transparent: true,
				depthWrite: false,
				side: 2
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: latchRing,
			position: [
				LAYOUT.latch.x,
				.07,
				LAYOUT.latch.z
			],
			"rotation-x": -Math.PI / 2,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				.55,
				.85,
				28
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#ffd24a",
				transparent: true,
				depthWrite: false,
				side: 2
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: crown,
			position: [
				LAYOUT.crown.x,
				LAYOUT.crown.y,
				LAYOUT.crown.z
			],
			visible: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldenCrown, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				color: "#ffe27a",
				intensity: 10,
				distance: 16
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: crownRing,
			position: [
				LAYOUT.crown.x,
				ROOF_Y + .1,
				LAYOUT.crown.z
			],
			"rotation-x": -Math.PI / 2,
			visible: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				.7,
				1.15,
				32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#ffe14a",
				transparent: true,
				depthWrite: false,
				side: 2
			})]
		}),
		Array.from({ length: CONFETTI_N }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			ref: (el) => {
				bits.current[i] = el;
			},
			visible: false,
			material: confettiMats[i % confettiMats.length],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.16,
				.08,
				.04
			] })
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: promptAnchor,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				center: true,
				zIndexRange: [14, 0],
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: prompt,
					className: "hud-pill px-2 py-1 text-xs font-bold",
					style: { opacity: 0 },
					children: [
						"Grab ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd",
							children: "Left-Click"
						}),
						" / ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd",
							children: "E"
						})
					]
				})
			})
		}),
		[
			0,
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: (el) => {
				popG.current[i] = el;
			},
			visible: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				center: true,
				zIndexRange: [16, 0],
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: (el) => {
						popL.current[i] = el;
					},
					className: "quack-pop",
					style: {
						fontSize: "1.15rem",
						opacity: 0
					}
				})
			})
		}, i))
	] });
}
function useKeyboard() {
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if ([
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight"
			].includes(e.code)) e.preventDefault();
			if (!keys.has(e.code)) pressed.add(e.code);
			keys.add(e.code);
		};
		const up = (e) => keys.delete(e.code);
		const blur = () => keys.clear();
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("blur", blur);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			window.removeEventListener("blur", blur);
		};
	}, []);
}
function readInput(inWater = false) {
	const k = (c) => keys.has(c);
	const dive = k("KeyC") || k("ControlLeft") || k("ControlRight");
	const inp = {
		fx: (k("KeyD") || k("ArrowRight") ? 1 : 0) - (k("KeyA") || k("ArrowLeft") ? 1 : 0),
		fz: (k("KeyW") || k("ArrowUp") ? 1 : 0) - (k("KeyS") || k("ArrowDown") ? 1 : 0),
		sprint: k("ShiftLeft") || k("ShiftRight"),
		jumpHeld: k("Space"),
		jump: pressed.has("Space"),
		grab: pressed.has("KeyE") || pressed.has("MouseLeft"),
		quack: pressed.has("KeyF") || pressed.has("MouseRight"),
		reset: pressed.has("KeyR"),
		dive
	};
	const snap = pressed.has("KeyQ") || pressed.has("KeyC") && !inWater;
	pressed.clear();
	return {
		input: inp,
		snap
	};
}
function makeTex(base, spots, n, repeat) {
	const c = document.createElement("canvas");
	c.width = c.height = 256;
	const g = c.getContext("2d");
	g.fillStyle = base;
	g.fillRect(0, 0, 256, 256);
	for (let i = 0; i < n; i++) {
		g.fillStyle = spots[i % spots.length];
		const x = Math.random() * 256, y = Math.random() * 256;
		g.fillRect(x, y, 2 + Math.random() * 3, 4 + Math.random() * 6);
	}
	const t = new CanvasTexture(c);
	t.wrapS = t.wrapT = RepeatWrapping;
	t.repeat.set(repeat, repeat);
	t.colorSpace = SRGBColorSpace;
	return t;
}
function signBoard(label) {
	const c = document.createElement("canvas");
	c.width = 512;
	c.height = 160;
	const g = c.getContext("2d");
	g.fillStyle = "#e7d3a1";
	g.fillRect(0, 0, 512, 160);
	g.strokeStyle = "#6b4423";
	g.lineWidth = 14;
	g.strokeRect(10, 10, 492, 140);
	g.fillStyle = "#3a2412";
	g.font = "700 68px Georgia, serif";
	g.textAlign = "center";
	g.textBaseline = "middle";
	g.fillText(label, 256, 84);
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	return t;
}
function planksTex() {
	const c = document.createElement("canvas");
	c.width = c.height = 128;
	const g = c.getContext("2d");
	for (let i = 0; i < 8; i++) {
		g.fillStyle = i % 2 ? "#c0392b" : "#b5332a";
		g.fillRect(i * 16, 0, 16, 128);
		g.fillStyle = "#7e2018";
		g.fillRect(i * 16, 0, 1.5, 128);
	}
	const t = new CanvasTexture(c);
	t.wrapS = t.wrapT = RepeatWrapping;
	t.repeat.set(3, 2);
	t.colorSpace = SRGBColorSpace;
	return t;
}
function BouncyHay() {
	const g = (0, import_react.useRef)(null);
	useFrame(() => {
		const s = world.sim;
		if (!g.current || !s) return;
		const k = Math.min(1, s.boing * 3.2);
		g.current.scale.set(1 + k * .16, 1 - k * .42, 1 + k * .16);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: g,
		position: [
			HAY_BOUNCE.x,
			0,
			HAY_BOUNCE.z
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"position-y": .42,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					1.28,
					1.4,
					.84,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e2b340" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"position-y": .9,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					1.05,
					1.18,
					.5,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f3d56a" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"position-y": 1.12,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.72,
					.05,
					6,
					14
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c9842a" })]
			})
		]
	});
}
function SouthGate() {
	const g = (0, import_react.useRef)(null);
	useFrame(() => {
		if (g.current && world.sim) g.current.rotation.y = world.sim.roadAngle;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: g,
		position: [
			SOUTH_GATE.x,
			0,
			SOUTH_GATE.z
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					2.05,
					.95,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					4.1,
					1.7,
					.12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8d5a32" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					2.05,
					.55,
					.02
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					4.1,
					.1,
					.14
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6a4122" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					2.05,
					1.35,
					.02
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					4.1,
					.1,
					.14
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6a4122" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.12,
					.95,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.16,
					1.7,
					.16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#5c381c" })]
			})
		]
	});
}
function Act2() {
	const dirt = (0, import_react.useMemo)(() => makeTex("#b08968", [
		"#8d6e53",
		"#c4a484",
		"#6e5340"
	], 900, 4), []);
	const sign = (0, import_react.useMemo)(() => signBoard("Big Pond →"), []);
	const slopeAng = Math.atan2(1.8, 15);
	const pads = (0, import_react.useRef)([]);
	const flowers = (0, import_react.useMemo)(() => {
		const out = [];
		for (let z = 27; z <= 42; z += 2.4) {
			const cx = roadX(z);
			out.push({
				x: cx - 2.4,
				z,
				c: z % 2 ? "#f2d34a" : "#e86b8a",
				h: .35 + z % 3 * .08
			});
			out.push({
				x: cx + 2.5,
				z: z + .6,
				c: z % 2 ? "#f7f3ea" : "#7ec8ea",
				h: .28
			});
		}
		return out;
	}, []);
	const reeds = (0, import_react.useMemo)(() => {
		const out = [];
		for (let i = 0; i < 18; i++) {
			const a = i / 18 * Math.PI * 2;
			out.push([BIG.x + Math.cos(a) * (BIG.rx + .4), BIG.z + Math.sin(a) * (BIG.rz + .35)]);
		}
		return out;
	}, []);
	useFrame(({ clock }) => {
		const d = world.sim?.duck;
		pads.current.forEach((g, i) => {
			if (!g) return;
			const p = LILIES[i];
			const near = d && Math.hypot(d.x - p.x, d.z - p.z) < 1.32 && d.y > -2.05;
			const tx = near ? (d.x - p.x) * .12 : Math.sin(clock.elapsedTime * 1.4 + i) * .03;
			const tz = near ? (d.z - p.z) * .12 : Math.cos(clock.elapsedTime * 1.1 + i) * .03;
			g.rotation.z += (tx - g.rotation.z) * .15;
			g.rotation.x += (tz - g.rotation.x) * .15;
			g.position.y = LILY_Y + Math.sin(clock.elapsedTime * 1.6 + i) * .04;
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.9,
				32.5
			],
			"rotation-x": slopeAng,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				48,
				.25,
				15.1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#7dba55" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"rotation-x": -Math.PI / 2,
			position: [
				0,
				SOUTH_GROUND,
				57
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [48, 36] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6eaf62" })]
		}),
		Array.from({ length: 11 }, (_, i) => {
			const z = 26 + i * 2.05;
			const x = roadX(z);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"rotation-x": -Math.PI / 2,
				position: [
					x,
					southGroundY(z) + .04,
					z
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [3.4, 2.5] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: dirt })]
			}, i);
		}),
		[
			28,
			34,
			40,
			46
		].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				roadX(z) - 1.8,
				southGroundY(z) + .45,
				z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				.9,
				.12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				roadX(z) + 1.8,
				southGroundY(z) + .45,
				z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				.9,
				.12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
		})] }, z)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				roadX(31),
				southGroundY(31),
				31
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					1.6,
					.7,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.08,
					1.3,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6b4423" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					1.6,
					1.25,
					0
				],
				"rotation-y": Math.PI,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.2,
					.48,
					.06
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: sign })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				roadX(42),
				southGroundY(42),
				42
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-1.7,
					.7,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.08,
					1.3,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6b4423" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-1.7,
					1.25,
					0
				],
				"rotation-y": Math.PI,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.2,
					.48,
					.06
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: sign })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"rotation-x": -Math.PI / 2,
			position: [
				BIG.x,
				BIG_SURFACE + .08,
				BIG.z
			],
			scale: [
				BIG.rx + 1.5,
				BIG.rz + 1.3,
				1
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [1, 40] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c4a574" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"rotation-x": -Math.PI / 2,
			position: [
				BIG.x,
				BIG_SURFACE + .16,
				BIG.z
			],
			scale: [
				BIG.rx,
				BIG.rz,
				1
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [1, 40] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3a9ad4",
				roughness: .12,
				metalness: .15,
				transparent: true,
				opacity: .55,
				depthWrite: false
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				(DOCK.x0 + DOCK.x1) / 2,
				DOCK.y,
				(DOCK.z0 + DOCK.z1) / 2
			],
			receiveShadow: true,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				DOCK.x1 - DOCK.x0,
				.12,
				DOCK.z1 - DOCK.z0
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#b58449" })]
		}),
		[
			[DOCK.x0 + .3, DOCK.z0 + .3],
			[DOCK.x1 - .3, DOCK.z0 + .3],
			[DOCK.x0 + .3, DOCK.z1 - .3],
			[DOCK.x1 - .3, DOCK.z1 - .3]
		].map(([x, z], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				DOCK.y - .45,
				z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				.9,
				.12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6b4423" })]
		}, i)),
		WAKE_RAMPS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				r.x,
				BIG_SURFACE + .45,
				r.z
			],
			"rotation-y": r.yaw,
			"rotation-x": -.28,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.5,
						.12,
						3.2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c49a6c" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.7,
						.08,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.06,
						.16,
						3.2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8a5a32" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.7,
						.08,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.06,
						.16,
						3.2
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8a5a32" })]
				})
			]
		}, r.id)),
		LILIES.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: (el) => {
				pads.current[i] = el;
			},
			position: [
				p.x,
				LILY_Y,
				p.z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"rotation-x": -Math.PI / 2,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [LILY_R, 8] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3f9a45" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.2,
					.05,
					.1
				],
				"rotation-x": -Math.PI / 2,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.16, 8] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2e27a" })]
			})]
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				ISLAND.x,
				ISLAND.y,
				ISLAND.z
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						ISLAND.r,
						ISLAND.r + .3,
						.45,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c4a574" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					"position-y": .28,
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						ISLAND.r * .82,
						ISLAND.r * .9,
						.12,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6eaf62" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.55,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.45,
						.5,
						.08,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e05a47" })]
				})
			]
		}),
		reeds.map(([x, z], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				x,
				SOUTH_GROUND,
				z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"position-y": .7,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.03,
					.04,
					1.3,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3f7d32" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.08,
					1.25,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.08,
					6,
					5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6b4a2a" })]
			})]
		}, i)),
		flowers.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				f.x,
				southGroundY(f.z),
				f.z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"position-y": f.h * .5,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.02,
					.02,
					f.h,
					4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3f7d32" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"position-y": f.h,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.09,
					6,
					5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: f.c })]
			})]
		}, i))
	] });
}
function CoopGate() {
	const g = (0, import_react.useRef)(null);
	useFrame(() => {
		if (g.current && world.sim) g.current.rotation.y = world.sim.gateAngle;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: g,
		position: [
			LAYOUT.latch.x - .92,
			0,
			COOP.z0 + .2
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.9,
					.95,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.8,
					1.75,
					.1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8d5a32" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.9,
					.5,
					.02
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.8,
					.08,
					.12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6a4122" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.9,
					1.4,
					.02
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.8,
					.08,
					.12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6a4122" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.22,
					.95,
					.04
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.08,
					1.75,
					.12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#5c381c" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					1.62,
					1.05,
					.12
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.14,
					.2,
					.14
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#f0cc4a",
					emissive: "#c89612",
					emissiveIntensity: .55
				})]
			})
		]
	});
}
var box = (r) => ({
	pos: [(r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2],
	size: [r.x1 - r.x0, r.z1 - r.z0]
});
function Farm() {
	const grass = (0, import_react.useMemo)(() => makeTex("#6cc24a", [
		"#5bb03c",
		"#7fd35a",
		"#4f9e33"
	], 2200, 14), []);
	const soil = (0, import_react.useMemo)(() => makeTex("#8a5a35", ["#6e4527", "#9c6a42"], 1500, 3), []);
	const planks = (0, import_react.useMemo)(() => planksTex(), []);
	const barn = box(BARN), house = box(HOUSE), loft = box(LOFT), garden = box(GARDEN), table = box(TABLE);
	const rampLen = Math.hypot(RAMP.z1 - RAMP.z0, LOFT.h), rampAng = Math.atan2(LOFT.h, RAMP.z1 - RAMP.z0);
	const posts = (0, import_react.useMemo)(() => {
		const p = [];
		for (let i = -24; i <= 24; i += 2) {
			p.push([i, -24], [-24, i], [24, i]);
			if (Math.abs(i) >= 2) p.push([i, 24]);
		}
		return p;
	}, []);
	const trees = (0, import_react.useMemo)(() => Array.from({ length: 26 }, (_, i) => {
		const a = i / 26 * Math.PI * 2, r = 29 + i % 3 * 3;
		return [
			Math.cos(a) * r,
			Math.sin(a) * r,
			1 + i % 4 * .25
		];
	}).map(([x, z, s]) => {
		if (z > 22 && Math.abs(x) < 16) return [
			x + (x < 0 ? -12 : 12),
			z,
			s
		];
		return [
			x,
			z,
			s
		];
	}), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"rotation-x": -Math.PI / 2,
			position: [
				0,
				0,
				-18
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [120, 84] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: grass })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"rotation-x": -Math.PI / 2,
			position: [
				POND.x,
				.02,
				POND.z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [POND.r + .5, 40] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#d9c48a" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"rotation-x": -Math.PI / 2,
			position: [
				POND.x,
				.05,
				POND.z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [POND.r, 40] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3fa7d6",
				roughness: .1,
				metalness: .2,
				transparent: true,
				opacity: .88
			})]
		}),
		[
			0,
			1,
			2,
			3,
			4
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				POND.x + Math.cos(i * 1.3) * (POND.r + .3),
				.2,
				POND.z + Math.sin(i * 1.3) * (POND.r + .3)
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.05,
				.05,
				1 + i % 2 * .4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#4a7d2a" })]
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				barn.pos[0],
				3,
				barn.pos[1]
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				barn.size[0],
				6,
				barn.size[1]
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: planks })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				12,
				6.75,
				LAYOUT.egg.z
			],
			"rotation-z": Math.PI / 2,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				1.15,
				1.15,
				8.1,
				3
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6e3428" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				(ROOF_X0 + ROOF_X1) / 2,
				ROOF_Y,
				LAYOUT.egg.z
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				ROOF_X1 - ROOF_X0,
				.16,
				ROOF_HALF_Z * 2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8e2a20" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				barn.pos[0],
				2,
				BARN.z1 + .02
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [3.5, 4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f4ead5" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				barn.pos[0],
				2,
				BARN.z1 + .04
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [3, 3.5] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8e2a20" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				loft.pos[0],
				LOFT.h / 2,
				loft.pos[1]
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				loft.size[0],
				LOFT.h,
				loft.size[1]
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#c99a5b" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				(RAMP.x0 + RAMP.x1) / 2,
				LOFT.h / 2 - .1,
				(RAMP.z0 + RAMP.z1) / 2
			],
			"rotation-x": rampAng,
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				RAMP.x1 - RAMP.x0,
				.2,
				rampLen
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#b58449" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				house.pos[0],
				2.5,
				house.pos[1]
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				house.size[0],
				5,
				house.size[1]
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f3e3c3" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				house.pos[0],
				6,
				house.pos[1]
			],
			"rotation-y": Math.PI / 4,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				9,
				3,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3d6e8f" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				house.pos[0],
				.08,
				HOUSE.z1 + 2
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				house.size[0],
				.16,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#b98b5e" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				house.pos[0] + 2,
				1.6,
				HOUSE.z1 + .02
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.4, 2.6] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6b3e26" })]
		}),
		[
			-4,
			0,
			4
		].map((dx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				house.pos[0] + dx - 2,
				3,
				HOUSE.z1 + .02
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.4, 1.2] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#9fd4ea" })]
		}, dx)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				table.pos[0],
				TABLE.h - .05,
				table.pos[1]
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				table.size[0],
				.1,
				table.size[1]
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e05a47" })]
		}),
		[
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		].map(([a, b], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				table.pos[0] + a * (table.size[0] / 2 - .2),
				TABLE.h / 2 - .05,
				table.pos[1] + b * (table.size[1] / 2 - .15)
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				TABLE.h - .1,
				.12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8a5a35" })]
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"rotation-x": -Math.PI / 2,
			position: [
				garden.pos[0],
				.03,
				garden.pos[1]
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [garden.size[0], garden.size[1]] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { map: soil })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [[
			[
				GARDEN.x0,
				GARDEN.z0,
				GARDEN.x1,
				GARDEN.z0
			],
			[
				GARDEN.x0,
				GARDEN.z1,
				GARDEN.x1,
				GARDEN.z1
			],
			[
				GARDEN.x0,
				GARDEN.z0,
				GARDEN.x0,
				GARDEN.z1
			],
			[
				GARDEN.x1,
				GARDEN.z0,
				GARDEN.x1,
				(GARDEN.z0 + GARDEN.z1) / 2 - 1.4
			],
			[
				GARDEN.x1,
				(GARDEN.z0 + GARDEN.z1) / 2 + 1.4,
				GARDEN.x1,
				GARDEN.z1
			]
		].map(([x0, z0, x1, z1], i) => {
			const len = Math.hypot(x1 - x0, z1 - z0);
			const yaw = Math.atan2(x1 - x0, z1 - z0);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					(x0 + x1) / 2,
					0,
					(z0 + z1) / 2
				],
				"rotation-y": yaw,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					"position-y": .38,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.08,
						.1,
						len
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					"position-y": .72,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.08,
						.1,
						len
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
				})]
			}, i);
		}), [
			[GARDEN.x0, GARDEN.z0],
			[GARDEN.x1, GARDEN.z0],
			[GARDEN.x0, GARDEN.z1],
			[GARDEN.x1, GARDEN.z1],
			[(GARDEN.x0 + GARDEN.x1) / 2, GARDEN.z0],
			[(GARDEN.x0 + GARDEN.x1) / 2, GARDEN.z1],
			[GARDEN.x0, (GARDEN.z0 + GARDEN.z1) / 2]
		].map(([x, z], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				.55,
				z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				1.1,
				.12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
		}, i))] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"rotation-x": -Math.PI / 2,
			position: [
				18,
				.03,
				17.15
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [3.15, 3.2] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e4c15a" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				16.2,
				1.05,
				17
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.4,
				2.1,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e8b04b" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				19.8,
				1.05,
				17
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.4,
				2.1,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e8b04b" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				18,
				1.05,
				18.8
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				4,
				2.1,
				.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e8b04b" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				16.52,
				1.05,
				15.2
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.04,
				2.1,
				.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e8b04b" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				19.48,
				1.05,
				15.2
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.04,
				2.1,
				.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e8b04b" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				18,
				2.65,
				17
			],
			"rotation-y": Math.PI / 4,
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				3.05,
				1.15,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#a63d2f" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoopGate, {}),
		posts.map(([x, z], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				.6,
				z
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.2,
				1.2,
				.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
		}, i)),
		[
			[
				0,
				-24,
				48,
				0
			],
			[
				-24,
				0,
				48,
				1
			],
			[
				24,
				0,
				48,
				1
			]
		].map(([x, z, l, r], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				x,
				0,
				z
			],
			"rotation-y": r ? Math.PI / 2 : 0,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					l,
					.12,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.95,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					l,
					.12,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
			})]
		}, i)),
		[[
			-13.1,
			24,
			21.8
		], [
			13.1,
			24,
			21.8
		]].map(([x, z, l], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				x,
				0,
				z
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					l,
					.12,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.95,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					l,
					.12,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f2efe6" })]
			})]
		}, `s${i}`)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SouthGate, {}),
		trees.map(([x, z, s], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				x,
				0,
				z
			],
			scale: s,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.8,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.25,
					.35,
					1.6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#7a5232" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					2.8,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					1.6,
					3.4,
					7
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: i % 2 ? "#2f8f4e" : "#3fa35a",
					flatShading: true
				})]
			})]
		}, i))
	] });
}
var M = (c, rough = .7) => new MeshStandardMaterial({
	color: c,
	roughness: rough
});
var mats = {
	pumpkin: M("#f28a1c"),
	stem: M("#4c7a22"),
	cabbage: M("#8fd16a"),
	metal: M("#9fb0b8", .35),
	can: M("#3f9d7a", .4),
	hay: M("#e8c25a"),
	crate: M("#c48a4a"),
	barrel: M("#9a5d32"),
	band: M("#4a4a4a"),
	plate: M("#f8f6f0", .3),
	pie: M("#d99a4e"),
	cup: M("#3a7bd5"),
	wood: M("#8b5a2b"),
	hat: M("#f0d27a"),
	hatBand: M("#c0392b"),
	watering: M("#e23b2f", .45),
	boot: M("#f2c14e", .55),
	pail: M("#c48a4a", .7)
};
function PropMesh({ kind }) {
	const d = PROP_DEFS[kind];
	switch (kind) {
		case "pumpkin": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .3,
			scale: [
				1,
				.75,
				1
			],
			castShadow: true,
			material: mats.pumpkin,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.4,
				10,
				8
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .65,
			material: mats.stem,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.04,
				.06,
				.15
			] })
		})] });
		case "cabbage": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .22,
			castShadow: true,
			material: mats.cabbage,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("icosahedronGeometry", { args: [.28, 0] })
		});
		case "bucket": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .25,
			castShadow: true,
			material: mats.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.3,
				.22,
				.5,
				10
			] })
		});
		case "can": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .22,
			castShadow: true,
			material: mats.can,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.22,
				.25,
				.45,
				10
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				.3,
				.3,
				0
			],
			"rotation-z": -.8,
			material: mats.can,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.04,
				.05,
				.4
			] })
		})] });
		case "hay": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .45,
			castShadow: true,
			material: mats.hay,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.2,
				.9,
				.8
			] })
		});
		case "crate": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .4,
			castShadow: true,
			material: mats.crate,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.8,
				.8,
				.8
			] })
		});
		case "barrel": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .45,
			castShadow: true,
			material: mats.barrel,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.36,
				.36,
				.9,
				12
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .45,
			material: mats.band,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.38,
				.38,
				.08,
				12
			] })
		})] });
		case "plate": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .03,
			castShadow: true,
			material: mats.plate,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.22,
				.18,
				.05,
				14
			] })
		});
		case "pie": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .07,
			castShadow: true,
			material: mats.pie,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.25,
				.22,
				.14,
				14
			] })
		});
		case "cup": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .09,
			castShadow: true,
			material: mats.cup,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.1,
				.08,
				.18,
				10
			] })
		});
		case "shovel": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			"rotation-z": Math.PI / 2,
			"position-y": .08,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: mats.wood,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.04,
					.04,
					1
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				"position-y": -.6,
				material: mats.metal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.25,
					.3,
					.04
				] })
			})]
		});
		case "hat": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				"position-y": .02,
				castShadow: true,
				material: mats.hat,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.45,
					.45,
					.04,
					16
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				"position-y": .14,
				material: mats.hat,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.2,
					.24,
					.22,
					12
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				"position-y": .07,
				material: mats.hatBand,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.245,
					.245,
					.06,
					12
				] })
			})
		] });
		case "watering": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .16,
			castShadow: true,
			material: mats.watering,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.16,
				.2,
				.32,
				10
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				.18,
				.28,
				0
			],
			"rotation-z": -.9,
			material: mats.watering,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.035,
				.04,
				.36
			] })
		})] });
		case "boot": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			"position-y": .08,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				"rotation-z": Math.PI / 2,
				material: mats.boot,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.1,
					.28,
					4,
					8
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					.12,
					.12,
					0
				],
				material: mats.boot,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.16,
					.2,
					.18
				] })
			})]
		});
		case "pail": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .2,
			castShadow: true,
			material: mats.pail,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.22,
				.18,
				.36,
				10
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .36,
			material: mats.band,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.2,
				.015,
				6,
				12
			] })
		})] });
		case "thermos": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .16,
			castShadow: true,
			material: mats.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.07,
				.09,
				.28,
				10
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			"position-y": .32,
			material: mats.cup,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.08,
				.07,
				.06,
				10
			] })
		})] });
		case "lure": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				"position-y": .05,
				"rotation-x": Math.PI / 2,
				material: mats.metal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.07,
					.016,
					6,
					12
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					.09,
					.06,
					0
				],
				"rotation-z": -.7,
				material: mats.metal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					.028,
					.12,
					6
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				"position-y": .1,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.045,
					8,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#ffe56a",
					emissive: "#ffcc33",
					emissiveIntensity: 1.6
				})]
			})
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
		d.r,
		d.h,
		d.r
	] }) });
}
function Props() {
	const sim = world.sim;
	const refs = (0, import_react.useRef)([]);
	useFrame(() => {
		world.sim.props.forEach((p, i) => {
			const g = refs.current[i];
			if (!g) return;
			g.position.set(p.x, p.y + Math.sin(p.tilt) * PROP_DEFS[p.kind].r * .85, p.z);
			g.rotation.set(p.tilt, p.yaw, 0, "YXZ");
			const glow = g.children[1];
			if (glow) glow.visible = useGame.getState().mission.index === 2 && (p.role === "watering" || p.role === "boot" || p.role === "pail") && !inPond(p.x, p.z);
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: sim.props.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: (el) => {
			refs.current[i] = el;
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropMesh, { kind: p.kind }), (p.role === "watering" || p.role === "boot" || p.role === "pail") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			"position-y": .22,
			scale: 1.25,
			visible: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				PROP_DEFS[p.kind].r,
				10,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#ffe14a",
				transparent: true,
				opacity: .28,
				depthWrite: false
			})]
		})]
	}, p.id)) });
}
var duckMat = {
	body: M("#fbfaf4", .6),
	beak: M("#ff9f1c", .5),
	eye: M("#1b1b1b", .2),
	cap: M("#2f9e5c", .5)
};
function Duck() {
	const g = (0, import_react.useRef)(null), wl = (0, import_react.useRef)(null), wr = (0, import_react.useRef)(null), body = (0, import_react.useRef)(null);
	const head = (0, import_react.useRef)(null), jaw = (0, import_react.useRef)(null), pop = (0, import_react.useRef)(null);
	const crown = (0, import_react.useRef)(null), breath = (0, import_react.useRef)(null);
	const bubbles = (0, import_react.useRef)([]);
	const wake = (0, import_react.useRef)([]);
	useFrame(({ clock }) => {
		const d = world.sim.duck;
		const q = d.quackAnim / QUACK_ANIM;
		const open = q > 0 ? Math.sin(Math.min(1, (1 - q) * 2.2) * Math.PI) : 0;
		jaw.current.rotation.x = open * .7;
		head.current.rotation.x = -open * .35;
		head.current.position.y = open * .06;
		if (pop.current) {
			const el = pop.current;
			if (q > 0) {
				const rot = d.quacks * 37 % 30 - 15;
				el.style.opacity = String(Math.min(1, q * 2.5));
				el.style.transform = `translate(-50%, ${-(1 - q) * 46}px) rotate(${rot}deg) scale(${.7 + Math.min(1, (1 - q) * 5) * .4})`;
			} else el.style.opacity = "0";
		}
		g.current.position.set(d.x, d.y, d.z);
		g.current.rotation.y = d.yaw;
		const waddle = Math.sin(d.flap) * .12;
		body.current.rotation.z = d.onGround ? waddle : 0;
		body.current.position.y = d.diving ? -.22 : d.swimming ? -.15 : Math.abs(Math.sin(d.flap)) * .05;
		const flap = d.onGround ? .15 : .6 + Math.sin(d.flap) * .6;
		wl.current.rotation.z = flap;
		wr.current.rotation.z = -flap;
		if (crown.current) crown.current.visible = useGame.getState().mission.crowned;
		bubbles.current.forEach((m, i) => {
			if (!m) return;
			m.visible = d.diving;
			if (!d.diving) return;
			const t = clock.elapsedTime * 1.7 + i * .7;
			m.position.set(Math.sin(t) * .22, .15 + t * .35 % 1.5, -.05 + Math.cos(t * .8) * .12);
			m.scale.setScalar(.45 + i % 3 * .28);
		});
		wake.current.forEach((m, i) => {
			if (!m) return;
			const on = d.boosting && d.swimming;
			m.visible = on;
			if (!on) return;
			m.position.set((i - 2) * .16, .06, -.45 - i * .26);
			m.scale.setScalar(.55 + i * .22);
		});
		if (breath.current) {
			const show = inBigPond(d.x, d.z) && (d.diving || d.air < 3.92);
			breath.current.style.display = show ? "block" : "none";
			const deg = Math.max(0, Math.min(1, d.air / 4)) * 360;
			breath.current.style.background = `conic-gradient(#7ee7ff ${deg}deg, rgba(12, 28, 40, 0.45) 0deg)`;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: g,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: body,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						position: [
							0,
							.42,
							0
						],
						scale: [
							.9,
							.75,
							1.2
						],
						castShadow: true,
						material: duckMat.body,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.42,
							14,
							10
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						position: [
							0,
							.45,
							-.48
						],
						"rotation-x": .6,
						material: duckMat.body,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
							.18,
							.35,
							8
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
						position: [
							0,
							.72,
							.32
						],
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
							ref: head,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
								position: [
									0,
									-.72,
									-.32
								],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
										position: [
											0,
											.9,
											.35
										],
										castShadow: true,
										material: duckMat.body,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
											.26,
											12,
											10
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
										position: [
											0,
											.895,
											.66
										],
										material: duckMat.beak,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
											.26,
											.06,
											.3
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
										ref: jaw,
										position: [
											0,
											.86,
											.52
										],
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
											position: [
												0,
												0,
												.13
											],
											material: duckMat.beak,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
												.23,
												.045,
												.26
											] })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
										position: [
											.13,
											.98,
											.52
										],
										material: duckMat.eye,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
											.045,
											8,
											6
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
										position: [
											-.13,
											.98,
											.52
										],
										material: duckMat.eye,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
											.045,
											8,
											6
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
										ref: crown,
										position: [
											0,
											1.16,
											.35
										],
										scale: .72,
										visible: false,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldenCrown, {})
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						ref: wl,
						position: [
							.36,
							.5,
							0
						],
						scale: [
							.2,
							.6,
							1
						],
						material: duckMat.body,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.32,
							8,
							6
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						ref: wr,
						position: [
							-.36,
							.5,
							0
						],
						scale: [
							.2,
							.6,
							1
						],
						material: duckMat.body,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.32,
							8,
							6
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						position: [
							.15,
							.04,
							.05
						],
						material: duckMat.beak,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.16,
							.06,
							.22
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						position: [
							-.15,
							.04,
							.05
						],
						material: duckMat.beak,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.16,
							.06,
							.22
						] })
					})
				]
			}),
			[
				0,
				1,
				2,
				3,
				4,
				5
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: (el) => {
					bubbles.current[i] = el;
				},
				visible: false,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.07,
					6,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#e7fbff",
					transparent: true,
					opacity: .7,
					depthWrite: false
				})]
			}, `b${i}`)),
			[
				0,
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: (el) => {
					wake.current[i] = el;
				},
				"rotation-x": -Math.PI / 2,
				visible: false,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.16, 8] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#f4fbff",
					transparent: true,
					opacity: .72,
					depthWrite: false
				})]
			}, `w${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					.85,
					1.15,
					0
				],
				center: true,
				zIndexRange: [14, 0],
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: breath,
					style: {
						display: "none",
						width: 42,
						height: 42,
						borderRadius: "50%",
						boxShadow: "0 0 0 3px #163044"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				position: [
					0,
					1.55,
					0
				],
				zIndexRange: [15, 0],
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: pop,
					className: "quack-pop",
					style: { opacity: 0 },
					children: "QUACK!"
				})
			})
		]
	});
}
var chickMat = {
	body: M("#fff8ec"),
	comb: M("#e63b2e"),
	beak: M("#f5b51b")
};
function Chickens() {
	const refs = (0, import_react.useRef)([]);
	useFrame(() => world.sim.chickens.forEach((c, i) => {
		const g = refs.current[i];
		if (!g) return;
		const sp = Math.hypot(c.vx, c.vz);
		const peck = c.penned && sp < .9;
		g.position.set(c.x, peck ? 0 : Math.abs(Math.sin(c.hop)) * (c.flee > 0 ? .45 : .12), c.z);
		g.rotation.y = c.yaw;
		g.rotation.x = peck ? Math.sin(c.hop * 2.2) * .55 : 0;
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: world.sim.chickens.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: (el) => {
			refs.current[i] = el;
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				"position-y": .3,
				scale: [
					.8,
					.8,
					1
				],
				castShadow: true,
				material: chickMat.body,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.25,
					10,
					8
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.55,
					.15
				],
				material: chickMat.body,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.13,
					8,
					6
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.7,
					.15
				],
				material: chickMat.comb,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.04,
					.1,
					.14
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.54,
					.3
				],
				"rotation-x": Math.PI / 2,
				material: chickMat.beak,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					.04,
					.1,
					5
				] })
			})
		]
	}, i)) });
}
var farmerMat = {
	skin: M("#f1c27d"),
	shirt: M("#d64933"),
	pants: M("#3b5ba5"),
	boot: M("#4a3426")
};
function Farmer() {
	const g = (0, import_react.useRef)(null), arm = (0, import_react.useRef)(null), armL = (0, import_react.useRef)(null), bang = (0, import_react.useRef)(null), yell = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		const f = world.sim.farmer;
		const hop = f.startle > 0 ? Math.sin((1 - Math.min(1, f.startle / 1.4)) * Math.PI) * .35 : 0;
		const sit = f.asleep ? -.42 : 0;
		g.current.position.set(f.x, hop + sit, f.z);
		g.current.rotation.set(f.asleep ? .4 : 0, f.yaw, 0);
		const flail = f.trapped || f.angry > .5;
		arm.current.rotation.x = f.asleep ? .6 : flail ? -2.4 + Math.sin(clock.elapsedTime * (f.trapped ? 22 : 18)) * .5 : Math.sin(clock.elapsedTime * 3) * .3;
		if (armL.current) armL.current.rotation.x = f.trapped ? -2.15 + Math.sin(clock.elapsedTime * 22 + 1.2) * .55 : f.asleep ? .5 : .12;
		if (bang.current) bang.current.style.opacity = f.startle > .05 && f.hasHat ? "1" : "0";
		if (yell.current) {
			yell.current.textContent = f.trapped ? "HEY! LET ME OUT!" : "HEY! MY HAT!";
			yell.current.style.opacity = f.trapped || f.chase && !f.hasHat ? "1" : "0";
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: g,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					.15,
					.4,
					0
				],
				castShadow: true,
				material: farmerMat.pants,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.22,
					.8,
					.25
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					-.15,
					.4,
					0
				],
				castShadow: true,
				material: farmerMat.pants,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.22,
					.8,
					.25
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					1.1,
					0
				],
				castShadow: true,
				material: farmerMat.shirt,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.6,
					.65,
					.35
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					1.6,
					0
				],
				castShadow: true,
				material: farmerMat.skin,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.22,
					12,
					10
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					1.55,
					.2
				],
				material: farmerMat.skin,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.06,
					6,
					6
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: armL,
				position: [
					-.4,
					1.35,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						-.3,
						0
					],
					material: farmerMat.shirt,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.15,
						.6,
						.15
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						-.65,
						0
					],
					material: farmerMat.skin,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.09,
						8,
						6
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: arm,
				position: [
					.4,
					1.35,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						-.3,
						0
					],
					material: farmerMat.shirt,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.15,
						.6,
						.15
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						-.65,
						0
					],
					material: farmerMat.skin,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.09,
						8,
						6
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
				position: [
					0,
					2.15,
					0
				],
				center: true,
				zIndexRange: [12, 0],
				style: { pointerEvents: "none" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: bang,
					className: "quack-pop",
					style: {
						opacity: 0,
						fontSize: "2.4rem"
					},
					children: "!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: yell,
					className: "quack-pop",
					style: {
						opacity: 0,
						fontSize: "1rem"
					},
					children: "HEY! MY HAT!"
				})]
			})
		]
	});
}
var scareMat = {
	pole: M("#7a5232"),
	shirt: M("#4f7cac"),
	head: M("#e8c25a"),
	hat: M("#6b4a2e")
};
function Scarecrow() {
	const g = (0, import_react.useRef)(null);
	useFrame(() => {
		g.current.rotation.x = world.sim.scarecrowTilt;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			SCARECROW.x,
			0,
			SCARECROW.z
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: g,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					"position-y": 1.35,
					castShadow: true,
					material: scareMat.pole,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.07,
						.08,
						2.7
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					"position-y": 1.85,
					castShadow: true,
					material: scareMat.shirt,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.6,
						.55,
						.28
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					"position-y": 2.45,
					castShadow: true,
					material: scareMat.head,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.28,
						10,
						8
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					"position-y": 2.8,
					material: scareMat.hat,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
						.4,
						.48,
						10
					] })
				})
			]
		})
	});
}
function Rings() {
	const beak = (0, import_react.useRef)([]), ground = (0, import_react.useRef)([]);
	useFrame(() => {
		const r = world.sim.rings;
		for (let i = 0; i < 4; i++) {
			const b = beak.current[i], g = ground.current[i];
			if (!b || !g) continue;
			const ring = r[i];
			b.visible = g.visible = !!ring;
			if (!ring) continue;
			const k = ring.t / .8, fx = Math.sin(ring.yaw), fz = Math.cos(ring.yaw);
			const sb = .25 + Math.pow(k, .6) * 2.2;
			b.position.set(ring.x + fx * k * 1.6, ring.y, ring.z + fz * k * 1.6);
			b.rotation.set(0, ring.yaw, 0);
			b.scale.set(sb, sb, sb);
			b.material.opacity = (1 - k) * .95;
			const sg = .5 + Math.pow(k, .7) * 4.2;
			g.position.set(ring.x, Math.max(.08, ring.y - .8), ring.z);
			g.scale.set(sg, sg, sg);
			g.material.opacity = (1 - k) * .7;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: [
		0,
		1,
		2,
		3
	].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: (el) => {
			beak.current[i] = el;
		},
		visible: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
			.72,
			1,
			32
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#fffbe6",
			transparent: true,
			depthWrite: false,
			side: 2
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: (el) => {
			ground.current[i] = el;
		},
		"rotation-x": -Math.PI / 2,
		visible: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
			.88,
			1,
			40
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#ffe066",
			transparent: true,
			depthWrite: false,
			side: 2
		})]
	})] }, i)) });
}
function Stepper() {
	const { camera, gl } = useThree();
	const camPos = (0, import_react.useRef)(new Vector3(0, 8, 14));
	const look = (0, import_react.useRef)(new Vector3());
	const target = (0, import_react.useRef)(new Vector3()), lookAt = (0, import_react.useRef)(new Vector3());
	const ready = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const el = gl.domElement;
		world.canvas = el;
		const isLocked = () => document.pointerLockElement === el;
		const playing = () => {
			const p = useGame.getState().phase;
			return p === "playing" || p === "free";
		};
		const dn = (e) => {
			if (!playing()) return;
			if (e.button === 2) {
				pressed.add("MouseRight");
				return;
			}
			if (e.button !== 0) return;
			if (isLocked()) pressed.add("MouseLeft");
			else requestMouseLook();
		};
		const mv = (e) => {
			if (!isLocked()) return;
			world.yawTarget -= e.movementX * ORBIT_YAW_SPEED;
			world.pitchTarget = clampPitch(world.pitchTarget + e.movementY * ORBIT_PITCH_SPEED);
		};
		const lockChange = () => useGame.getState().set({ locked: isLocked() });
		const ctx = (e) => e.preventDefault();
		const unsub = useGame.subscribe((st, prev) => {
			if (st.phase !== prev.phase && st.phase !== "playing" && st.phase !== "free" && isLocked()) document.exitPointerLock();
		});
		el.addEventListener("pointerdown", dn);
		el.addEventListener("contextmenu", ctx);
		document.addEventListener("mousemove", mv);
		document.addEventListener("pointerlockchange", lockChange);
		return () => {
			unsub();
			el.removeEventListener("pointerdown", dn);
			el.removeEventListener("contextmenu", ctx);
			document.removeEventListener("mousemove", mv);
			document.removeEventListener("pointerlockchange", lockChange);
			if (world.canvas === el) world.canvas = null;
		};
	}, [gl]);
	useFrame((_, delta) => {
		const dt = Math.min(delta, .05);
		const s = world.sim;
		const ui = useGame.getState();
		const active = ui.phase === "playing" || ui.phase === "free";
		const { input, snap } = readInput(s.duck.swimming || s.duck.diving);
		if (active && snap) world.yawTarget = behindYaw(s.duck.yaw, world.camYaw);
		world.camYaw = dampAngle(world.camYaw, world.yawTarget, 20, dt);
		world.pitch = dampAngle(world.pitch, world.pitchTarget, 20, dt);
		stepSim(s, active ? input : {
			...input,
			grab: false,
			quack: false,
			jump: false,
			reset: false,
			dive: false
		}, world.camYaw, dt, active);
		const quack = s.events.includes("quack");
		for (const e of s.events) if (e === "won") {
			if (ui.mission.index !== "done") s.won = false;
			else {
				playSound("fanfare", .15);
				if (ui.phase === "playing") ui.set({
					phase: "won",
					finalTime: s.elapsed
				});
			}
		} else playSound(e);
		s.events.length = 0;
		let mission = ui.mission;
		if (active) {
			const tax = [
				"watering",
				"boot",
				"pail"
			].flatMap((role) => {
				const p = s.props.find((q) => q.role === role);
				return p ? [{
					role,
					inPond: inPond(p.x, p.z),
					airborne: !!p.flung && (!p.onGround || p.y > .35),
					x: p.x,
					y: p.y,
					z: p.z
				}] : [];
			});
			const hat = s.props.find((p) => p.kind === "hat");
			const stepped = stepMission(mission, {
				now: performance.now(),
				quack,
				duckX: s.duck.x,
				duckY: s.duck.y,
				duckZ: s.duck.z,
				tax,
				pumpkins: s.props.filter((p) => p.kind === "pumpkin").map((p) => ({
					id: p.id,
					x: p.x,
					y: p.y,
					z: p.z,
					out: !inGarden(p.x, p.z)
				})),
				scareTilt: s.scarecrowTilt,
				scareX: SCARECROW.x,
				scareZ: SCARECROW.z,
				picnic: s.props.filter((p) => p.table).map((p) => ({
					id: p.id,
					x: p.x,
					y: p.y,
					z: p.z,
					off: p.id !== s.duck.held && p.onGround && p.y < TABLE.h - .22
				})),
				hat: {
					attached: !!hat?.attached,
					inPond: !!hat && !hat.attached && inPond(hat.x, hat.z),
					x: hat?.x ?? 0,
					y: hat?.y ?? 0,
					z: hat?.z ?? 0
				},
				chickens: s.chickens.map((c) => ({
					id: c.id,
					x: c.x,
					z: c.z,
					inGarden: inGarden(c.x, c.z)
				})),
				grab: input.grab,
				duckInsideCoop: inCoopBounds(s.duck.x, s.duck.z),
				farmerInsideCoop: inCoopBounds(s.farmer.x, s.farmer.z),
				nearLatch: Math.hypot(s.duck.x - LAYOUT.latch.x, s.duck.z - LAYOUT.latch.z) < 1.7 && !inCoopBounds(s.duck.x, s.duck.z),
				bumpedLatch: Math.hypot(s.duck.x - LAYOUT.latch.x, s.duck.z - LAYOUT.latch.z) < 1.35 && Math.hypot(s.duck.vx, s.duck.vz) > 2.4 && !inCoopBounds(s.duck.x, s.duck.z),
				score: s.score,
				lures: s.props.filter((p) => p.kind === "lure").map((p) => ({
					id: p.id,
					onDock: p.id === s.duck.held ? onDock(s.duck.x, s.duck.z) : onDock(p.x, p.z) && p.y > DOCK.y - .5
				})),
				rampId: s.justRamp,
				pads: LILIES.map((_, i) => lilyAt(s.duck.x, s.duck.z) === i && s.duck.y > -2.05),
				onIsland: onIsland(s.duck.x, s.duck.z) && s.duck.y > -2.05,
				inBigWater: inBigPond(s.duck.x, s.duck.z) && s.duck.swimming && lilyAt(s.duck.x, s.duck.z) < 0 && !onDock(s.duck.x, s.duck.z) && !onIsland(s.duck.x, s.duck.z)
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
					score: s.score
				});
			}
		}
		const prog = {
			pond: s.pondSet.size,
			pumpkin: pumpkinsOut(s)
		};
		const objChanged = Object.entries(s.objectives).some(([k, v]) => ui.objectives[k] !== v);
		if (mission !== ui.mission || ui.score !== s.score || prog.pond !== ui.progress.pond || prog.pumpkin !== ui.progress.pumpkin || objChanged) ui.set({
			mission,
			score: s.score,
			objectives: { ...s.objectives },
			progress: prog
		});
		const d = s.duck;
		if (ui.phase === "title") {
			const a = s.time * .08;
			camPos.current.set(Math.sin(a) * 30, 16, Math.cos(a) * 30);
			look.current.set(0, 0, 0);
			camera.position.copy(camPos.current);
		} else {
			const o = orbitOffset(world.camYaw, world.pitch);
			const base = Math.max(d.y, 0) + .8;
			target.current.set(d.x + o.x, Math.max(.6, base + o.y), d.z + o.z);
			camera.position.lerp(target.current, 1 - Math.exp(-10 * dt));
			look.current.lerp(lookAt.current.set(d.x, base, d.z), 1 - Math.exp(-14 * dt));
		}
		camera.lookAt(look.current);
		if (ready.current < 3 && ++ready.current === 3) gl.domElement.parentElement?.parentElement?.setAttribute("data-scene-ready", "true");
	});
	return null;
}
function GameScene() {
	useKeyboard();
	const token = useGame((s) => s.resetToken);
	const sim = (0, import_react.useMemo)(() => {
		const s = createSim();
		world.sim = s;
		cues.rooster = 0;
		cues.sparkle = 0;
		cues.corn = true;
		cues.egg = true;
		cues.eggSpark = 0;
		cues.pops = [];
		cues.confetti = [];
		world.camYaw = world.yawTarget = 0;
		world.pitch = world.pitchTarget = CAM_PITCH;
		return s;
	}, [token]);
	(0, import_react.useEffect)(() => {
		const probe = {
			getYaw: () => world.sim?.duck.yaw ?? 0,
			getSpeed: () => {
				const d = world.sim?.duck;
				return d ? Math.hypot(d.vx, d.vz) : 0;
			},
			setKeys: (codes) => {
				keys.clear();
				pressed.clear();
				for (const c of codes) {
					keys.add(c);
					pressed.add(c);
				}
			}
		};
		window.__game = {
			world,
			store: useGame
		};
		window.__controlsTest = probe;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			camera: {
				fov: 55,
				position: [
					0,
					10,
					20
				]
			},
			dpr: [1, 1.75],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
					attach: "background",
					args: ["#9fd9f5"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
					attach: "fog",
					args: [
						"#bfe6f7",
						40,
						98
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
					"#fff4d6",
					"#6cc24a",
					.7
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						15,
						25,
						10
					],
					intensity: 2.2,
					color: "#fff1c9",
					castShadow: true,
					"shadow-mapSize": [2048, 2048],
					"shadow-camera-left": -36,
					"shadow-camera-right": 36,
					"shadow-camera-top": 28,
					"shadow-camera-bottom": -72
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Environment, {
					resolution: 64,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
						intensity: 1.5,
						position: [
							0,
							5,
							0
						],
						scale: [
							10,
							10,
							1
						],
						"rotation-x": Math.PI / 2
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
						intensity: .8,
						color: "#bfe6f7",
						position: [
							-5,
							1,
							-1
						],
						"rotation-y": Math.PI / 2,
						scale: [
							20,
							1,
							1
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Farm, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act2, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BouncyHay, {}),
					sim && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Props, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Duck, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chickens, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Farmer, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scarecrow, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rings, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialActors, {})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {})
				] }, token)
			]
		})
	});
}
//#endregion
export { GameScene as default };
