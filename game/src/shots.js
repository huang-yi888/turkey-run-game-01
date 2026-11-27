// Screenshot poses: ?shot=start|play|end&seed=1 freezes the game in a
// representative state so screenshots are real renders of this code.

import { VIEW } from "./config.js";
import { startRun } from "./world.js";

export function shotFromQuery() {
  const params = new URLSearchParams(location.search);
  const shot = params.get("shot");
  return ["start", "play", "end"].includes(shot) ? shot : null;
}

export function poseForShot(world, shot) {
  if (shot === "start") {
    world.mode = "title";
    world.time = 1.2;
    world.scroll = 120;
    return;
  }
  startRun(world);
  world.events.length = 0;
  if (shot === "play") {
    world.time = 6.4;
    world.distance = 1180; // The Barn stage
    world.score = 1450;
    world.feathers = 2;
    world.gap = 150;
    world.scroll = 2600;
    world.turkey.x = 300;
    world.turkey.y = VIEW.groundY - 66; // mid-jump over the oven
    world.turkey.grounded = false;
    world.turkey.legPhase = 3;
    world.obstacles = [
      { kind: "oven", x: 330, y: VIEW.groundY, vy: 0, warned: 0 },
      { kind: "knife", x: 520, y: 150, vy: 900, warned: 1 },
      { kind: "fence", x: 760, y: VIEW.groundY, vy: 0, warned: 0 },
      { kind: "pin", x: 880, y: VIEW.groundY, vy: 0, warned: 0 },
    ];
    world.corns = [
      { x: 430, y: VIEW.groundY - 92, taken: false },
      { x: 640, y: VIEW.groundY - 40, taken: false },
    ];
    return;
  }
  // end: the escaped screen
  world.mode = "end";
  world.outcome = "escaped";
  world.time = 9;
  world.distance = 2400;
  world.score = 3280;
  world.feathers = 2;
  world.gap = 190;
  world.scroll = 5200;
  world.turkey.x = 360;
}
