// The running world: turkey physics, the chasing farmer, obstacles, corn,
// stages and the caught / escaped endings.

import { VIEW, TURKEY, FARMER, STAGES, ESCAPE_DISTANCE } from "./config.js";
import { pick } from "./random.js";

export function stageFor(distance) {
  return STAGES.find((stage) => distance < stage.until) ?? STAGES[STAGES.length - 1];
}

export function createWorld(random) {
  return {
    mode: "title", // title | play | end
    outcome: null, // caught | escaped
    time: 0,
    distance: 0,
    score: 0,
    feathers: 3,
    gap: FARMER.startGap,
    scroll: 0,
    spawnTimer: 0.8,
    cornTimer: 1.6,
    shake: 0,
    flash: 0,
    turkey: { x: TURKEY.startX, y: VIEW.groundY, vy: 0, ducking: false, grounded: true, invincible: 0, legPhase: 0 },
    obstacles: [], // { kind: fence|pin|oven|knife, x, y, vy, warned }
    corns: [], // { x, y, taken }
    events: [], // sound cues for main.js: jump, corn, trip, gobble, caught, escaped
    random,
  };
}

export function startRun(world) {
  const random = world.random;
  Object.assign(world, createWorld(random));
  world.mode = "play";
  world.events.push("gobble");
}

function spawnObstacle(world, stage) {
  const kind = pick(world.random, ["fence", "pin", "oven", "knife", "fence", "knife"]);
  if (kind === "knife") {
    world.obstacles.push({ kind, x: 120 + world.random() * 420, y: -30, vy: 0, warned: 0 });
  } else {
    world.obstacles.push({ kind, x: VIEW.width + 60, y: VIEW.groundY, vy: 0, warned: 0 });
  }
  world.spawnTimer = stage.spawnEvery * (0.8 + world.random() * 0.5);
}

function turkeyBox(world) {
  const t = world.turkey;
  const height = t.ducking ? TURKEY.height * 0.62 : TURKEY.height;
  return { left: t.x - TURKEY.width / 2 + 8, right: t.x + TURKEY.width / 2 - 6, top: t.y - height, bottom: t.y };
}

function hits(world, obstacle) {
  const box = turkeyBox(world);
  if (obstacle.kind === "fence") {
    return box.right > obstacle.x - 26 && box.left < obstacle.x + 26 && box.bottom > VIEW.groundY - 44;
  }
  if (obstacle.kind === "pin") {
    // A rolling pin swings at head height: duck under it.
    return box.right > obstacle.x - 34 && box.left < obstacle.x + 34 && box.top < VIEW.groundY - 34;
  }
  if (obstacle.kind === "oven") {
    // The open oven door and its flame: jump over the heat.
    return box.right > obstacle.x - 40 && box.left < obstacle.x + 40 && box.bottom > VIEW.groundY - 58;
  }
  // knife: a carving knife drops from above; be somewhere else.
  return box.right > obstacle.x - 12 && box.left < obstacle.x + 12 && box.top < obstacle.y + 46 && box.bottom > obstacle.y;
}

function trip(world) {
  world.feathers -= 1;
  world.gap = Math.max(FARMER.catchGap, world.gap - FARMER.stumbleGain);
  world.shake = 0.35;
  world.flash = 0.25;
  world.turkey.invincible = 1.1;
  world.events.push("trip");
  if (world.feathers <= 0) endRun(world, "caught");
}

function endRun(world, outcome) {
  world.mode = "end";
  world.outcome = outcome;
  world.events.push(outcome);
}

export function updateWorld(world, input, dt) {
  if (world.mode !== "play") return;
  const stage = stageFor(world.distance);
  const t = world.turkey;
  world.time += dt;
  world.shake = Math.max(0, world.shake - dt);
  world.flash = Math.max(0, world.flash - dt);
  t.invincible = Math.max(0, t.invincible - dt);

  // Sideways movement and jumping.
  if (input.left) t.x -= TURKEY.runSpeed * dt;
  if (input.right) t.x += TURKEY.runSpeed * dt;
  t.x = Math.min(TURKEY.maxX, Math.max(TURKEY.minX, t.x));
  t.ducking = input.duck && t.grounded;
  if (input.takeJump() && t.grounded) {
    t.vy = TURKEY.jumpVelocity;
    t.grounded = false;
    world.events.push("jump");
  }
  t.vy += TURKEY.gravity * dt;
  t.y += t.vy * dt;
  if (t.y >= VIEW.groundY) {
    t.y = VIEW.groundY;
    t.vy = 0;
    t.grounded = true;
  }
  t.legPhase += dt * (t.grounded ? 14 : 3);

  // Forward progress and the farmer behind.
  const speed = stage.speed;
  world.distance += (speed * dt) / 12;
  world.score += Math.round(speed * dt * 0.06);
  world.scroll += speed * dt;
  world.gap -= FARMER.closeRate * dt;
  if (world.gap <= FARMER.catchGap) return endRun(world, "caught");
  if (world.distance >= ESCAPE_DISTANCE) return endRun(world, "escaped");

  // Spawning.
  world.spawnTimer -= dt;
  if (world.spawnTimer <= 0) spawnObstacle(world, stage);
  world.cornTimer -= dt;
  if (world.cornTimer <= 0) {
    world.corns.push({ x: VIEW.width + 40, y: VIEW.groundY - 26 - world.random() * 70, taken: false });
    world.cornTimer = 1.4 + world.random() * 1.6;
  }

  // Obstacles move with the world; knives fall.
  for (const obstacle of world.obstacles) {
    if (obstacle.kind === "knife") {
      obstacle.warned += dt;
      if (obstacle.warned > 0.55) {
        obstacle.vy += 2600 * dt;
        obstacle.y += obstacle.vy * dt;
      }
      if (obstacle.y > VIEW.groundY) obstacle.y = VIEW.groundY + 200; // stuck in the ground, gone
    } else {
      obstacle.x -= speed * dt;
    }
    if (t.invincible <= 0 && hits(world, obstacle)) trip(world);
  }
  world.obstacles = world.obstacles.filter((o) => o.x > -90 && o.y < VIEW.groundY + 150);

  // Corn: score, and a little breathing room from the farmer.
  const box = turkeyBox(world);
  for (const corn of world.corns) {
    corn.x -= speed * dt;
    if (!corn.taken && corn.x > box.left - 14 && corn.x < box.right + 14 && corn.y > box.top - 16 && corn.y < box.bottom + 10) {
      corn.taken = true;
      world.score += 50;
      world.gap = Math.min(320, world.gap + FARMER.cornRelief);
      world.events.push("corn");
    }
  }
  world.corns = world.corns.filter((c) => !c.taken && c.x > -40);
}
