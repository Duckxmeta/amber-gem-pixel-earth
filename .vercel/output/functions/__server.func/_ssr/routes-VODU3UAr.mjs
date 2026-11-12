import { i as __toESM } from "../_runtime.mjs";
import { d as require_react, u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-VODU3UAr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var LAYOUT = {
	spawn: {
		x: 11,
		z: 9
	},
	roost: {
		x: 18.15,
		z: 14.15
	},
	guide: {
		x: 16.4,
		z: 12.6
	},
	near: 6,
	chair: {
		x: -14,
		z: -11
	},
	corn: {
		x: 5,
		y: 4.2,
		z: -17
	},
	/** Feed cans perched on the coop fence post. y is the pinned rest height. */
	cans: [
		{
			x: 17.15,
			z: 14.05,
			y: 1.05
		},
		{
			x: 17.55,
			z: 14.05,
			y: 1.05
		},
		{
			x: 17.35,
			z: 14.05,
			y: 1.5
		}
	],
	tax: {
		watering: {
			x: 6,
			z: 13.2
		},
		boot: {
			x: 9.2,
			z: 15.2
		},
		pail: {
			x: 4.2,
			z: 16.4
		}
	},
	/** Golden trophy egg on the barn ridge. y is the visual height; the duck collects it from the roof deck. */
	egg: {
		x: 12,
		y: 8.05,
		z: -14.35
	},
	/** Grand-finale crown, floating on the same barn peak the hay bounce launches toward. */
	crown: {
		x: 12,
		y: 8.35,
		z: -14.35
	},
	/** Coop gate latch, just south of the doorway. */
	latch: {
		x: 18,
		z: 14.15
	}
};
var MISSIONS = [
	{
		index: 1,
		title: "Rise & Scream",
		goal: 3,
		hint: [
			{ text: "Look around with your " },
			{ kbd: "Mouse" },
			{ text: ", waddle to the Coop (" },
			{ kbd: "WASD" },
			{ text: "), and Quack 3 times (" },
			{ kbd: "Right-Click" },
			{ text: " or " },
			{ kbd: "F" },
			{ text: ") to wake the farm!" }
		]
	},
	{
		index: 2,
		title: "Pond Tax",
		goal: 3,
		hint: [
			{ text: "Grab 3 farm items (" },
			{ kbd: "Left-Click" },
			{ text: " or " },
			{ kbd: "E" },
			{ text: ") and drop or fling them into the Pond!" }
		]
	},
	{
		index: 3,
		title: "Hayloft Heist",
		goal: 1,
		hint: [
			{ text: "Hold " },
			{ kbd: "Shift" },
			{ text: " to sprint up the barn ramp, press " },
			{ kbd: "Space" },
			{ text: " to jump, and hold " },
			{ kbd: "Space" },
			{ text: " to flutter-glide to the Golden Corn!" }
		]
	},
	{
		index: 4,
		title: "Garden Menace",
		goal: 5,
		hint: [{ text: "Wreck the garden! Knock 5 pumpkins out of the garden patch and topple the Scarecrow!" }]
	},
	{
		index: 5,
		title: "Picnic Sabotage",
		goal: 5,
		hint: [{ text: "Clear all 5 items off the farmhouse picnic table! Watch out for the Farmer!" }]
	},
	{
		index: 6,
		title: "The Great Hat Heist",
		goal: 1,
		hint: [
			{ text: "Sneak behind the Farmer and snatch his hat (" },
			{ kbd: "Left-Click" },
			{ text: " or " },
			{ kbd: "E" },
			{ text: "), or quack at his ankles (" },
			{ kbd: "Right-Click" },
			{ text: " or " },
			{ kbd: "F" },
			{ text: "), then get the hat into the Pond!" }
		]
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
			{ text: ")!" }
		]
	},
	{
		index: 8,
		title: "Barn Roof Launch",
		goal: 1,
		hint: [
			{ text: "Bounce off the springy hay pile by the barn and flutter-glide (" },
			{ kbd: "Hold Space" },
			{ text: ") onto the roof to grab the Golden Egg!" }
		]
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
			{ text: ") behind him!" }
		]
	},
	{
		index: 10,
		title: "The Golden Duck Throne",
		goal: 1,
		hint: [{ text: "Bounce up to the Barn Roof and claim your Golden Crown!" }]
	},
	{
		index: 11,
		title: "Bottom Feeder",
		goal: 3,
		hint: [
			{ text: "Press " },
			{ kbd: "C" },
			{ text: " (or " },
			{ kbd: "Ctrl" },
			{ text: ") while swimming in the Big Pond to dive underwater and bring 3 sunken lures onto the Fishing Dock!" }
		]
	},
	{
		index: 12,
		title: "Wake Jumper",
		goal: 3,
		hint: [
			{ text: "Hold " },
			{ kbd: "Shift" },
			{ text: " while swimming to Hydro-Boost off all 3 floating wooden ramps in the Big Pond!" }
		]
	},
	{
		index: 13,
		title: "Lily Pad Parkour",
		goal: 5,
		hint: [
			{ text: "Hop and flutter-glide (" },
			{ kbd: "Space" },
			{ text: ") across the 5 giant lily pads without touching the water to reach Picnic Island!" }
		]
	}
];
function createMissionState() {
	return {
		index: 1,
		quacks: 0,
		pond: {
			watering: false,
			boot: false,
			pail: false
		},
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
		advanceAt: null
	};
}
var BANNER_MS = 2e3;
var SCARE_DOWN = Math.PI / 3;
var COMPLETE = "Mission Complete! +250 Chaos";
var FINALE = "All 9 Missions Complete! Ready for the Finale!";
var ROAD = "New Area Unlocked: Down the Road to the Big Pond!";
var POND_CLEAR = "The Big Pond is yours!";
function missionView(s, score = 0) {
	if (s.index === "done") return null;
	const def = MISSIONS[s.index - 1];
	if (s.index === 10) {
		if (s.crownReady) return {
			index: 10,
			title: def.title,
			goal: 1,
			progress: 0,
			hint: def.hint,
			detail: null
		};
		const target = s.chaosTarget ?? score + 600;
		const current = Math.min(score, target);
		return {
			index: 10,
			title: def.title,
			goal: target,
			progress: current,
			hint: [{ text: `The Farmer is locked up! Wreck the yard to reach the Finale Chaos Goal! (${current} / ${target})` }],
			detail: null
		};
	}
	const progress = s.index === 1 ? s.quacks : s.index === 2 ? Number(s.pond.watering) + Number(s.pond.boot) + Number(s.pond.pail) : s.index === 4 ? s.pumpOut.length : s.index === 5 ? s.picnicOff.length : s.index === 6 && s.hatPond ? 1 : s.index === 7 ? s.chickensIn.length : s.index === 8 && s.egg ? 1 : s.index === 9 && s.gateShut ? 1 : s.index === 11 ? s.luresDocked.length : s.index === 12 ? s.rampsJumped.length : s.index === 13 ? s.padsStepped.length : 0;
	const detail = s.index === 4 ? s.scare ? "Scarecrow down" : "Scarecrow still standing" : s.index === 6 ? "Hat in the pond" : s.index === 9 ? s.gateShut ? "Gate locked" : s.lured ? "Farmer is heading for the coop" : "Quack inside the coop" : s.index === 13 ? s.padsStepped.length >= 5 ? "Now land on Picnic Island" : "Don't touch the water" : null;
	return {
		index: s.index,
		title: def.title,
		goal: def.goal,
		progress: Math.min(def.goal, progress),
		hint: def.hint,
		detail
	};
}
function stepMission(prev, f) {
	const effects = [];
	let state = prev;
	let changed = false;
	const patch = (p) => {
		state = {
			...state,
			...p
		};
		changed = true;
	};
	const finish = (extra, banner = COMPLETE) => {
		effects.push({
			t: "score",
			n: 250
		}, { t: "chime" });
		patch({
			...extra,
			banner,
			advanceAt: f.now + BANNER_MS
		});
	};
	if (state.advanceAt != null && f.now >= state.advanceAt) {
		if (state.index === 1) patch({
			index: 2,
			quacks: 0,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 2) patch({
			index: 3,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 3) patch({
			index: 4,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 4) patch({
			index: 5,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 5) patch({
			index: 6,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 6) patch({
			index: 7,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 7) patch({
			index: 8,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 8) patch({
			index: 9,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 9) {
			effects.push({ t: "rampage" });
			patch({
				index: 10,
				banner: null,
				advanceAt: null,
				chaosTarget: f.score + 600,
				rampage: true,
				crownReady: false,
				crowned: false
			});
		} else if (state.index === 10) patch({
			index: 11,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 11) patch({
			index: 12,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 12) patch({
			index: 13,
			banner: null,
			advanceAt: null
		});
		else if (state.index === 13) patch({
			index: "done",
			banner: POND_CLEAR,
			advanceAt: null
		});
	}
	if (state.advanceAt != null || state.index === "done") return {
		state,
		effects,
		changed
	};
	if (state.index === 1 && f.quack && Math.hypot(f.duckX - LAYOUT.roost.x, f.duckZ - LAYOUT.roost.z) <= LAYOUT.near) {
		const q = state.quacks + 1;
		effects.push({ t: "ruffle" });
		if (q >= 3) {
			effects.push({ t: "knock" }, { t: "wake" }, {
				t: "score",
				n: 250
			}, { t: "chime" });
			patch({
				quacks: 3,
				banner: COMPLETE,
				advanceAt: f.now + BANNER_MS
			});
		} else patch({ quacks: q });
	}
	if (state.index === 2) {
		let pond = state.pond;
		let hit = false;
		for (const item of f.tax) {
			if (!item.inPond || pond[item.role]) continue;
			pond = {
				...pond,
				[item.role]: true
			};
			hit = true;
			const style = item.airborne;
			effects.push({
				t: "pop",
				text: style ? "+100 Pond Tax  +50 Style Fling!" : "+100 Pond Tax",
				x: item.x,
				y: Math.max(item.y, .4) + .7,
				z: item.z
			});
			effects.push({
				t: "score",
				n: style ? 150 : 100
			});
		}
		if (hit) {
			if (pond.watering && pond.boot && pond.pail) finish({ pond });
			else patch({ pond });
		}
	}
	if (state.index === 3) {
		const c = LAYOUT.corn;
		if (Math.hypot(f.duckX - c.x, f.duckZ - c.z) < 1.15 && f.duckY > 1.4) {
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
			effects.push({
				t: "pop",
				text: "+50 Chaos",
				x: p.x,
				y: p.y + .8,
				z: p.z
			});
			effects.push({
				t: "score",
				n: 50
			});
		}
		if (!scare && f.scareTilt > SCARE_DOWN) {
			scare = true;
			hit = true;
			effects.push({
				t: "pop",
				text: "+150 Scarecrow Down!",
				x: f.scareX,
				y: 2.2,
				z: f.scareZ
			});
			effects.push({
				t: "score",
				n: 150
			}, { t: "thud" });
		}
		if (hit) {
			if (outs.length >= 5 && scare) finish({
				pumpOut: outs,
				scare
			});
			else patch({
				pumpOut: outs,
				scare
			});
		}
	}
	if (state.index === 5) {
		let off = state.picnicOff;
		let hit = false;
		for (const item of f.picnic) {
			if (!item.off || off.includes(item.id)) continue;
			off = [...off, item.id];
			hit = true;
			effects.push({
				t: "pop",
				text: "+60 Chaos",
				x: item.x,
				y: Math.max(item.y, .3) + .55,
				z: item.z
			});
			effects.push({
				t: "score",
				n: 60
			}, { t: "clatter" });
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
				t: "pop",
				text: "+500 Master Thief!",
				x: f.hat.x,
				y: Math.max(f.hat.y, .3) + .8,
				z: f.hat.z
			});
			effects.push({
				t: "score",
				n: 500
			}, { t: "fanfare" });
			finish({
				hatPond: true,
				chasing: true
			});
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
				effects.push({
					t: "pop",
					text: "+100 Cluck Chaos!",
					x: c.x,
					y: 1.15,
					z: c.z
				});
				effects.push({
					t: "score",
					n: 100
				}, {
					t: "pen",
					id: c.id
				});
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
			effects.push({
				t: "pop",
				text: "+400 Sky Duck!",
				x: e.x,
				y: e.y + .45,
				z: e.z
			});
			effects.push({
				t: "score",
				n: 400
			}, { t: "fanfare" }, { t: "egg" });
			finish({ egg: true });
		}
	}
	if (state.index === 9 && !state.gateShut) {
		if (!state.lured && f.quack && f.duckInsideCoop) {
			effects.push({ t: "lure" });
			patch({ lured: true });
		}
		if (state.lured && f.farmerInsideCoop && !f.duckInsideCoop && f.nearLatch && (f.grab || f.quack || f.bumpedLatch)) {
			effects.push({ t: "latch" });
			effects.push({
				t: "pop",
				text: "+500 Mastermind!",
				x: LAYOUT.latch.x,
				y: 2.1,
				z: LAYOUT.latch.z
			});
			effects.push({
				t: "score",
				n: 500
			}, { t: "fanfare" });
			patch({
				gateShut: true,
				banner: FINALE,
				advanceAt: f.now + BANNER_MS
			});
		}
	}
	if (state.index === 10 && state.chaosTarget != null) {
		if (state.rampage && !state.crownReady && f.score >= state.chaosTarget) {
			const c = LAYOUT.crown;
			effects.push({ t: "chime" }, {
				t: "pop",
				text: "Golden Crown!",
				x: c.x,
				y: c.y,
				z: c.z
			});
			patch({
				rampage: false,
				crownReady: true
			});
		} else if (state.crownReady && !state.crowned) {
			const c = LAYOUT.crown;
			if (Math.hypot(f.duckX - c.x, f.duckZ - c.z) < 1.35 && f.duckY > 5.4) {
				effects.push({ t: "fanfare" }, { t: "confetti" }, { t: "openRoad" });
				patch({
					crowned: true,
					crownReady: false,
					rampage: false,
					banner: ROAD,
					advanceAt: f.now + BANNER_MS
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
			effects.push({
				t: "pinLure",
				id: lure.id
			});
			effects.push({
				t: "pop",
				text: "+150 Bottom Feeder!",
				x: f.duckX,
				y: f.duckY + .8,
				z: f.duckZ
			});
			effects.push({
				t: "score",
				n: 150
			});
		}
		if (hit) {
			if (docked.length >= 3) finish({ luresDocked: docked });
			else patch({ luresDocked: docked });
		}
	}
	if (state.index === 12 && f.rampId >= 0 && !(state.rampsJumped ?? []).includes(f.rampId)) {
		const jumped = [...state.rampsJumped ?? [], f.rampId];
		effects.push({
			t: "pop",
			text: "+120 Wake Jump!",
			x: f.duckX,
			y: f.duckY + .9,
			z: f.duckZ
		});
		effects.push({
			t: "score",
			n: 120
		});
		if (jumped.length >= 3) finish({ rampsJumped: jumped });
		else patch({ rampsJumped: jumped });
	}
	if (state.index === 13) {
		let pads = state.padsStepped ?? [];
		if (f.inBigWater && pads.length > 0 && !f.onIsland) {
			effects.push({
				t: "pop",
				text: "Splash! Back to the pads",
				x: f.duckX,
				y: f.duckY + .8,
				z: f.duckZ
			});
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
	return {
		state,
		effects,
		changed
	};
}
var useGame = create((set) => ({
	phase: "title",
	score: 0,
	muted: false,
	finalTime: 0,
	objectives: {
		pond: false,
		pumpkin: false,
		scarecrow: false,
		picnic: false,
		hat: false
	},
	progress: {
		pond: 0,
		pumpkin: 0
	},
	resetToken: 0,
	locked: false,
	mission: createMissionState(),
	summary: false,
	set: (p) => set(p)
}));
var VOLUME = .5;
var ctx = null;
var master = null;
var sfx = null;
var muted = false;
var last = {};
/** Minimum seconds between repeats, so piles of crashing props don't turn into noise. */
var MIN_GAP = {
	thud: .06,
	clatter: .07,
	bump: .06,
	step: .05,
	stepWood: .05,
	flap: .05,
	boing: .2,
	latch: .2
};
function ac() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		ctx = new (window.AudioContext ?? window.webkitAudioContext)({ latencyHint: "interactive" });
		sfx = ctx.createGain();
		master = ctx.createGain();
		master.gain.value = muted ? 0 : VOLUME;
		sfx.connect(master);
		master.connect(ctx.destination);
	}
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
/** Master mute. Ramped so flipping the HUD button doesn't click. */
function setMuted(m) {
	muted = m;
	const c = ac();
	if (!c || !master) return;
	master.gain.setTargetAtTime(m ? 0 : VOLUME, c.currentTime, .015);
}
/** Create/resume the context. Call synchronously inside a click or key handler. */
function unlockAudio() {
	const c = ac();
	if (c && c.state === "suspended") c.resume();
}
/** Unlocks audio on the first pointer or key, and resumes after the tab is backgrounded. */
function installAudioUnlock() {
	const go = () => {
		unlockAudio();
		off();
	};
	const off = () => {
		window.removeEventListener("pointerdown", go);
		window.removeEventListener("keydown", go);
	};
	window.addEventListener("pointerdown", go);
	window.addEventListener("keydown", go);
	const onVis = () => {
		if (document.visibilityState === "visible") unlockAudio();
	};
	window.addEventListener("focus", unlockAudio);
	document.addEventListener("visibilitychange", onVis);
	return () => {
		off();
		window.removeEventListener("focus", unlockAudio);
		document.removeEventListener("visibilitychange", onVis);
	};
}
var rnd = (a, b) => a + Math.random() * (b - a);
function noise(c, dur) {
	const b = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
	const d = b.getChannelData(0);
	for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
	const s = c.createBufferSource();
	s.buffer = b;
	return s;
}
/** Gain envelope starting at `st` (attack a, release r), routed to master. */
function env(c, peak, st, a, r) {
	const g = c.createGain();
	g.gain.setValueAtTime(0, st);
	g.gain.linearRampToValueAtTime(peak, st + a);
	g.gain.exponentialRampToValueAtTime(1e-4, st + a + r);
	g.connect(sfx);
	return g;
}
function filter(c, type, freq, q = 1) {
	const f = c.createBiquadFilter();
	f.type = type;
	f.frequency.value = freq;
	f.Q.value = q;
	return f;
}
function tone(c, type, f0, f1, st, dur, peak, a = .005, through) {
	const o = c.createOscillator();
	o.type = type;
	o.frequency.setValueAtTime(f0, st);
	if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, st + dur);
	const g = env(c, peak, st, a, dur);
	if (through) {
		o.connect(through);
		through.connect(g);
	} else o.connect(g);
	o.start(st);
	o.stop(st + a + dur + .02);
}
function burst(c, st, dur, peak, f, sweepTo) {
	const n = noise(c, dur + .02);
	if (sweepTo) {
		f.frequency.setValueAtTime(f.frequency.value, st);
		f.frequency.exponentialRampToValueAtTime(sweepTo, st + dur);
	}
	n.connect(f).connect(env(c, peak, st, .004, dur));
	n.start(st);
}
var SOUNDS = {
	quack(c, t) {
		const p = rnd(.88, 1.15);
		const gap = rnd(.12, .16);
		for (let k = 0; k < 2; k++) {
			const st = t + k * gap, base = (k ? 380 : 440) * p, len = k ? .15 : .12;
			const bp = filter(c, "bandpass", 1150 * p, 3.5);
			bp.frequency.setValueAtTime(1500 * p, st);
			bp.frequency.exponentialRampToValueAtTime(800 * p, st + len);
			const g = env(c, .75, st, .008, len);
			bp.connect(g);
			for (const [type, mul, lvl] of [[
				"sawtooth",
				1,
				1
			], [
				"triangle",
				.5,
				.6
			]]) {
				const o = c.createOscillator();
				o.type = type;
				o.frequency.setValueAtTime(base * mul * 1.08, st);
				o.frequency.exponentialRampToValueAtTime(base * mul * .6, st + len);
				const lg = c.createGain();
				lg.gain.value = lvl;
				o.connect(lg).connect(bp);
				o.start(st);
				o.stop(st + len + .03);
			}
		}
	},
	splash(c, t) {
		burst(c, t, .55, .55, filter(c, "lowpass", 3200), 280);
		for (let i = 0; i < 4; i++) tone(c, "sine", rnd(500, 900), rnd(1200, 1800), t + .05 + i * rnd(.04, .07), .05, .12);
	},
	step(c, t) {
		burst(c, t, .05, rnd(.12, .18), filter(c, "lowpass", rnd(700, 1e3)));
		tone(c, "sine", rnd(140, 170), 70, t, .05, .12);
	},
	stepWood(c, t) {
		tone(c, "triangle", rnd(260, 300), 180, t, .06, .2, .002, filter(c, "bandpass", 500, 5));
		burst(c, t, .03, .08, filter(c, "bandpass", 1800, 2));
	},
	paddle(c, t) {
		burst(c, t, .18, .22, filter(c, "bandpass", rnd(600, 900), 1.2), 300);
		for (let i = 0; i < 3; i++) tone(c, "sine", rnd(300, 500), rnd(800, 1300), t + i * rnd(.03, .06), .04, .1);
	},
	jump(c, t) {
		tone(c, "sine", 480, 1150, t, .16, .22, .01);
		burst(c, t, .2, .18, filter(c, "bandpass", 600, 1.5), 2600);
	},
	flap(c, t) {
		burst(c, t, .06, rnd(.1, .15), filter(c, "lowpass", rnd(500, 800)));
	},
	grab(c, t) {
		tone(c, "sine", 320, 950, t, .06, .4, .002);
		burst(c, t, .015, .2, filter(c, "highpass", 2500));
	},
	fling(c, t) {
		tone(c, "sine", 900, 260, t, .08, .35, .002);
		burst(c, t + .02, .18, .2, filter(c, "bandpass", 2400, 1.5), 500);
	},
	thud(c, t) {
		tone(c, "sine", rnd(120, 150), 50, t, .22, .6, .002);
		tone(c, "triangle", rnd(210, 250), 160, t, .12, .3, .002, filter(c, "bandpass", 230, 8));
		burst(c, t, .08, .25, filter(c, "lowpass", 900));
	},
	clatter(c, t) {
		const n = 3 + Math.floor(Math.random() * 3);
		for (let i = 0; i < n; i++) {
			const st = t + i * rnd(.025, .06), f = rnd(2300, 4200);
			tone(c, "triangle", f, f * .97, st, rnd(.06, .14), .16, .001);
		}
		burst(c, t, .1, .12, filter(c, "highpass", 3e3));
	},
	bump(c, t) {
		tone(c, "sine", rnd(170, 210), 80, t, .1, .35, .002);
		burst(c, t, .05, .12, filter(c, "lowpass", 600));
	},
	chime(c, t) {
		[
			523.25,
			659.25,
			783.99
		].forEach((f, i) => {
			tone(c, "triangle", f, f, t + i * .1, .45, .3, .008);
			tone(c, "sine", f * 2, f * 2, t + i * .1, .3, .08, .008);
		});
	},
	fanfare(c, t) {
		for (const [f, at, len] of [
			[
				392,
				0,
				.12
			],
			[
				523.25,
				.13,
				.12
			],
			[
				659.25,
				.26,
				.12
			],
			[
				783.99,
				.39,
				.7
			]
		]) {
			tone(c, "square", f, f, t + at, len, .12, .01, filter(c, "lowpass", 2600));
			tone(c, "triangle", f, f, t + at, len, .22, .01);
		}
		for (const f of [
			261.63,
			329.63,
			392,
			523.25
		]) tone(c, "triangle", f, f, t + .39, 1.1, .12, .03);
	},
	grumble(c, t) {
		tone(c, "sawtooth", 140, 90, t, .18, .2, .01, filter(c, "lowpass", 420, 1.2));
		tone(c, "triangle", 220, 130, t + .16, .22, .16, .01, filter(c, "bandpass", 380, 2));
	},
	boing(c, t) {
		tone(c, "sine", 160, 620, t, .2, .42, .004);
		tone(c, "triangle", 80, 340, t, .24, .28, .004);
		tone(c, "sine", 480, 200, t + .12, .16, .18, .004);
	},
	latch(c, t) {
		tone(c, "sine", 96, 38, t, .32, .7, .002);
		tone(c, "triangle", 170, 64, t, .18, .38, .002);
		tone(c, "square", 72, 48, t + .04, .12, .14, .002, filter(c, "lowpass", 240));
		burst(c, t, .14, .42, filter(c, "lowpass", 480));
	}
};
function playSound(name, delay = 0) {
	const c = ac();
	if (!c || muted || !master || !sfx) return;
	const now = c.currentTime;
	const gap = MIN_GAP[name];
	if (gap && last[name] !== void 0 && now - last[name] < gap) return;
	last[name] = now;
	SOUNDS[name](c, now + delay);
}
var CAM_DIST = 7.6;
var CAM_PITCH = .42;
var PITCH_MIN = .08;
var PITCH_MAX = 1.4;
var ORBIT_YAW_SPEED = .0025;
var ORBIT_PITCH_SPEED = .002;
var wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
/** Camera yaw that sits directly behind a duck facing `duckYaw`, picked as the nearest equivalent angle to `currentYaw`. */
function behindYaw(duckYaw, currentYaw) {
	return currentYaw + wrap(duckYaw + Math.PI - currentYaw);
}
/** Moves `from` toward `to` along the shortest arc with exponential smoothing. */
function dampAngle(from, to, rate, dt) {
	return from + (to - from) * (1 - Math.exp(-rate * dt));
}
var clampPitch = (p) => Math.max(PITCH_MIN, Math.min(PITCH_MAX, p));
/** Offset from the duck to the camera for a given orbit yaw/pitch. */
function orbitOffset(yaw, pitch, dist = CAM_DIST) {
	const h = Math.cos(pitch) * dist;
	return {
		x: Math.sin(yaw) * h,
		y: Math.sin(pitch) * dist,
		z: Math.cos(yaw) * h
	};
}
var keys = /* @__PURE__ */ new Set();
var pressed = /* @__PURE__ */ new Set();
/** Touch / QA: hold or release a KeyboardEvent.code. Edge presses land in `pressed`. */
function holdKey(code, down) {
	if (down) {
		if (!keys.has(code)) pressed.add(code);
		keys.add(code);
	} else keys.delete(code);
}
var world = {
	sim: null,
	camYaw: 0,
	yawTarget: 0,
	pitch: CAM_PITCH,
	pitchTarget: CAM_PITCH,
	canvas: null
};
/** Engage pointer lock on the game canvas. Must be called from a click or keypress. */
function requestMouseLook() {
	const el = world.canvas;
	if (!el || document.pointerLockElement === el) return;
	try {
		const r = el.requestPointerLock();
		if (r && typeof r.catch === "function") r.catch(() => {});
	} catch {}
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Game });
var GameScene = (0, import_react.lazy)(() => import("./Scene-DIHh4Nns.mjs"));
var CONTROLS = [
	["WASD / Arrows", "Move"],
	["Mouse", "Look around"],
	["Space", "Jump · hold to glide"],
	["Shift", "Sprint · Hydro-Boost in the pond"],
	["Left-Click / E", "Grab / fling"],
	["Right-Click / F", "QUACK"],
	["Q", "Camera behind duck"],
	["C", "Camera on land · Dive in the pond"],
	["Ctrl", "Dive"],
	["R", "Reset duck"],
	["Esc", "Unlock cursor"]
];
var PILL = [
	"WASD Move",
	"Mouse Look",
	"Space Jump/Glide",
	"Shift Sprint/Boost",
	"C/Ctrl Dive",
	"Left-Click / E Grab",
	"Right-Click / F Quack",
	"Q Camera"
];
var fmt = (t) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
function pad(code, label) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "touch-btn",
		onPointerDown: (e) => {
			e.preventDefault();
			holdKey(code, true);
		},
		onPointerUp: () => holdKey(code, false),
		onPointerLeave: () => holdKey(code, false),
		onPointerCancel: () => holdKey(code, false),
		children: label
	});
}
function ClientScene() {
	const [on, setOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setOn(true), []);
	if (!on) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full place-items-center text-2xl text-foreground",
		children: "Hatching the farm…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-full place-items-center text-2xl text-foreground",
			children: "Hatching the farm…"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScene, {})
	});
}
function Game() {
	const { phase, score, muted, finalTime, locked, mission, summary, set } = useGame();
	const [time, setTime] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const i = setInterval(() => setTime(world.sim?.elapsed ?? 0), 500);
		return () => clearInterval(i);
	}, []);
	(0, import_react.useEffect)(() => installAudioUnlock(), []);
	const start = () => {
		unlockAudio();
		set({
			phase: "playing",
			mission: createMissionState(),
			summary: false
		});
		requestMouseLook();
	};
	const restart = () => {
		unlockAudio();
		set({
			phase: "playing",
			resetToken: useGame.getState().resetToken + 1,
			score: 0,
			mission: createMissionState(),
			summary: false
		});
		requestMouseLook();
	};
	const keepCrown = () => {
		set({
			phase: "free",
			summary: false
		});
	};
	const card = missionView(mission, score);
	const playing = phase === "playing" || phase === "free";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-screen w-screen overflow-hidden bg-background font-game select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientScene, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					const next = !muted;
					setMuted(next);
					set({ muted: next });
				},
				"aria-label": muted ? "Unmute" : "Mute",
				className: "hud-panel absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center text-2xl",
				children: muted ? "🔇" : "🔊"
			}),
			phase !== "title" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				card && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "hud-panel absolute left-3 top-3 z-10 w-[min(20rem,calc(100vw-6.75rem))] p-3 lg:left-4 lg:top-4 lg:w-80 lg:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: [
								"Mission ",
								card.index,
								" of 13"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-primary",
							children: card.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-snug text-foreground",
							children: card.hint.map((part, i) => part.kbd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "kbd",
								children: part.kbd
							}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part.text }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-sm font-bold text-accent-foreground",
							children: [
								card.progress,
								" / ",
								card.goal
							]
						}),
						card.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: card.detail
						})
					]
				}),
				mission.banner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute left-1/2 top-[38%] z-20 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 text-center lg:top-28",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mission-banner px-4 py-3 text-lg",
						children: mission.banner
					}), mission.index === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto mt-2 flex justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-ghost-game",
							onClick: () => set({ mission: {
								...mission,
								banner: null
							} }),
							children: "Keep roaming"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-game",
							onClick: () => set({ summary: true }),
							children: "Summary"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel absolute right-3 top-20 z-10 px-3 py-1.5 text-center lg:left-1/2 lg:right-auto lg:top-4 lg:-translate-x-1/2 lg:px-6 lg:py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "Chaos Score"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl font-bold text-accent-foreground",
							children: score
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: phase === "free" ? "Free Play" : fmt(time)
						})
					]
				}),
				playing && !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hud-pill pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 px-5 py-2 text-sm font-semibold md:block",
					children: "Click canvas to resume mouse look"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "controls-pill pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 md:flex",
					children: PILL.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "opacity-50",
						children: "•"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c })] }, c))
				}),
				playing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "touch-controls",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
							pad("KeyW", "W"),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
							pad("KeyA", "A"),
							pad("KeyS", "S"),
							pad("KeyD", "D")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							pad("Space", "Jump"),
							pad("ShiftLeft", "Boost"),
							pad("ControlLeft", "Dive"),
							pad("KeyE", "Grab"),
							pad("KeyF", "QUACK")
						]
					})]
				})
			] }),
			phase === "title" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 grid place-items-center bg-overlay p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel max-w-md p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "title-wobble text-5xl font-bold text-primary",
							children: "Duck Chaos Farm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: "You are a duck. The farm is not ready."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: start,
							className: "btn-game mt-6 w-full text-2xl",
							children: "Play Game"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-6 hidden grid-cols-2 gap-x-4 gap-y-1 text-left text-sm sm:grid",
							children: CONTROLS.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-bold text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
									className: "kbd",
									children: k
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted-foreground",
								children: v
							})] }, k))
						})
					]
				})
			}),
			summary && phase !== "title" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 grid place-items-center bg-overlay p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel max-w-sm p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-5xl",
							children: "🌽"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-3xl font-bold text-primary",
							children: "The Big Pond is yours"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: "Thirteen missions down. The crown stays on."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-lg",
							children: ["Chaos Score: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: score })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								set({ summary: false });
								requestMouseLook();
							},
							className: "btn-game mt-6 w-full",
							children: "Back to the farm"
						})
					]
				})
			}),
			phase === "won" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 grid place-items-center bg-overlay p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel max-w-sm p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-6xl",
							children: "🦆👑"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-4xl font-bold text-primary",
							children: "Farm Conquered!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-lg",
							children: ["Final Chaos Score: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: score })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: ["Total Completion Time: ", fmt(finalTime)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: keepCrown,
							className: "btn-game mt-6 w-full",
							children: "Free Roam (Keep Crown)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: restart,
							className: "btn-ghost-game mt-3 w-full",
							children: "Play Again (Reset Farm)"
						})
					]
				})
			})
		]
	});
}
//#endregion
export { pressed as a, ORBIT_YAW_SPEED as c, dampAngle as d, orbitOffset as f, stepMission as g, LAYOUT as h, keys as i, behindYaw as l, useGame as m, requestMouseLook as n, CAM_PITCH as o, playSound as p, world as r, ORBIT_PITCH_SPEED as s, routes_exports as t, clampPitch as u };
