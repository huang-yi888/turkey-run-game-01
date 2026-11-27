// Gobble Dash entry point: wires input, world, rendering and sound into
// the animation loop, and freezes a pose when a screenshot is requested.

import { createInput } from "./input.js";
import { makeRandom } from "./random.js";
import { createWorld, startRun, updateWorld } from "./world.js";
import { render } from "./render.js";
import { sfx } from "./audio.js";
import { shotFromQuery, poseForShot } from "./shots.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(location.search);
const seed = Number(params.get("seed") ?? 7) || 7;
const world = createWorld(makeRandom(seed));
const shot = shotFromQuery();

function begin() {
  if (world.mode === "title" || world.mode === "end") startRun(world);
}

const input = createInput(canvas, begin);

if (shot) {
  poseForShot(world, shot);
  render(ctx, world);
} else {
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    updateWorld(world, input, dt);
    for (const event of world.events.splice(0)) sfx[event]?.();
    render(ctx, world);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
