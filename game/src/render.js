// All drawing: autumn backdrops per stage, the turkey, the farmer with his
// net, fences, rolling pins, the oven, falling carving knives, corn, the
// HUD, and the title and end screens.

import { VIEW, PALETTE } from "./config.js";
import { stageFor } from "./world.js";

function sky(ctx, stage) {
  const grad = ctx.createLinearGradient(0, 0, 0, VIEW.height);
  grad.addColorStop(0, stage.sky[0]);
  grad.addColorStop(1, stage.sky[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  // Low sun.
  ctx.fillStyle = "rgba(255, 244, 200, 0.9)";
  ctx.beginPath();
  ctx.arc(820, 92, 42, 0, Math.PI * 2);
  ctx.fill();
}

function backdrop(ctx, world, stage) {
  const scroll = world.scroll % 480;
  ctx.fillStyle = "rgba(43, 29, 18, 0.35)";
  for (let i = -1; i < 3; i++) {
    const x = i * 480 - scroll;
    if (stage.name === "The Farmyard") {
      // Fence line and a distant barn.
      ctx.fillRect(x + 40, VIEW.groundY - 150, 150, 150);
      ctx.beginPath();
      ctx.moveTo(x + 28, VIEW.groundY - 150);
      ctx.lineTo(x + 115, VIEW.groundY - 205);
      ctx.lineTo(x + 202, VIEW.groundY - 150);
      ctx.closePath();
      ctx.fill();
      for (let f = 0; f < 5; f++) ctx.fillRect(x + 240 + f * 44, VIEW.groundY - 66, 9, 66);
      ctx.fillRect(x + 232, VIEW.groundY - 52, 230, 8);
    } else if (stage.name === "The Barn") {
      // Hay bales and rafters.
      ctx.beginPath();
      ctx.arc(x + 120, VIEW.groundY - 44, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 330, VIEW.groundY - 34, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x, 60, 480, 14);
      for (let b = 0; b < 4; b++) ctx.fillRect(x + 40 + b * 120, 60, 12, 90);
    } else {
      // Kitchen shelves, hanging pans and a window.
      ctx.fillRect(x + 30, 110, 190, 12);
      ctx.fillRect(x + 280, 150, 170, 12);
      for (let p = 0; p < 3; p++) {
        ctx.beginPath();
        ctx.arc(x + 70 + p * 60, 150, 20, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillRect(x + 330, 210, 90, 120);
    }
  }
  // Ground.
  ctx.fillStyle = stage.ground;
  ctx.fillRect(0, VIEW.groundY, VIEW.width, VIEW.height - VIEW.groundY);
  ctx.fillStyle = "rgba(255, 246, 224, 0.25)";
  const dash = world.scroll % 64;
  for (let x = -dash; x < VIEW.width; x += 64) ctx.fillRect(x, VIEW.groundY + 26, 34, 5);
}

function drawTurkey(ctx, world) {
  const t = world.turkey;
  const duck = t.ducking ? 0.68 : 1;
  ctx.save();
  ctx.translate(t.x, t.y);
  if (t.invincible > 0 && Math.floor(world.time * 14) % 2 === 0) ctx.globalAlpha = 0.45;
  ctx.scale(1, duck);
  // Tail fan.
  const featherColors = [PALETTE.red, PALETTE.orange, PALETTE.gold, PALETTE.brown, PALETTE.orange, PALETTE.red];
  featherColors.forEach((color, i) => {
    ctx.save();
    ctx.translate(-22, -26);
    ctx.rotate(-0.9 + i * 0.3);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, -20, 8, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  // Body and wing.
  ctx.fillStyle = PALETTE.brown;
  ctx.beginPath();
  ctx.ellipse(0, -24, 30, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.darkBrown;
  ctx.beginPath();
  ctx.ellipse(-4, -22, 17, 12, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // Head, beak, wattle.
  ctx.fillStyle = "#8a5a33";
  ctx.beginPath();
  ctx.arc(28, -46, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.moveTo(37, -48);
  ctx.lineTo(50, -44);
  ctx.lineTo(37, -41);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PALETTE.red;
  ctx.beginPath();
  ctx.ellipse(36, -34, 4, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.ink;
  ctx.beginPath();
  ctx.arc(30, -49, 2.2, 0, Math.PI * 2);
  ctx.fill();
  // Legs.
  ctx.strokeStyle = PALETTE.orange;
  ctx.lineWidth = 3;
  const stride = t.grounded ? Math.sin(t.legPhase) * 9 : 5;
  ctx.beginPath();
  ctx.moveTo(-6, -6); ctx.lineTo(-6 + stride, 0);
  ctx.moveTo(8, -6); ctx.lineTo(8 - stride, 0);
  ctx.stroke();
  ctx.restore();
}

function drawFarmer(ctx, world) {
  const x = world.turkey.x - world.gap;
  const y = VIEW.groundY;
  const bob = Math.abs(Math.sin(world.time * 9)) * 5;
  ctx.save();
  ctx.translate(x, y - bob);
  // Legs and boots.
  ctx.fillStyle = "#33506e";
  ctx.fillRect(-14, -46, 11, 42);
  ctx.fillRect(4, -46, 11, 42);
  ctx.fillStyle = PALETTE.ink;
  ctx.fillRect(-16, -6, 15, 6);
  ctx.fillRect(3, -6, 15, 6);
  // Overalls and shirt.
  ctx.fillStyle = "#3f6d9e";
  ctx.fillRect(-17, -86, 34, 44);
  ctx.fillStyle = "#c94f42";
  ctx.fillRect(-17, -102, 34, 18);
  // Head and straw hat.
  ctx.fillStyle = "#e8b48a";
  ctx.beginPath();
  ctx.arc(0, -112, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.gold;
  ctx.fillRect(-22, -124, 44, 6);
  ctx.fillRect(-11, -136, 22, 13);
  // Arm reaching with a net.
  ctx.strokeStyle = "#c94f42";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(14, -94);
  ctx.lineTo(42, -78);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.darkBrown;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(42, -78);
  ctx.lineTo(66, -66);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,246,224,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(78, -62, 17, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(62, -70); ctx.lineTo(94, -54);
  ctx.moveTo(62, -54); ctx.lineTo(94, -70);
  ctx.stroke();
  ctx.restore();
}

function drawObstacle(ctx, obstacle, time) {
  const ground = VIEW.groundY;
  if (obstacle.kind === "fence") {
    ctx.fillStyle = PALETTE.darkBrown;
    ctx.fillRect(obstacle.x - 26, ground - 46, 9, 46);
    ctx.fillRect(obstacle.x + 17, ground - 46, 9, 46);
    ctx.fillStyle = PALETTE.brown;
    ctx.fillRect(obstacle.x - 30, ground - 42, 60, 9);
    ctx.fillRect(obstacle.x - 30, ground - 22, 60, 9);
  } else if (obstacle.kind === "pin") {
    // A rolling pin swinging on a rope at head height.
    const swing = Math.sin(time * 5 + obstacle.x * 0.02) * 6;
    ctx.strokeStyle = PALETTE.darkBrown;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(obstacle.x, 120);
    ctx.lineTo(obstacle.x + swing, ground - 66);
    ctx.stroke();
    ctx.save();
    ctx.translate(obstacle.x + swing, ground - 58);
    ctx.fillStyle = "#d9a066";
    ctx.beginPath();
    ctx.roundRect(-36, -11, 72, 22, 11);
    ctx.fill();
    ctx.fillStyle = PALETTE.brown;
    ctx.fillRect(-46, -4, 12, 8);
    ctx.fillRect(34, -4, 12, 8);
    ctx.restore();
  } else if (obstacle.kind === "oven") {
    // An open oven with flames licking out.
    ctx.fillStyle = "#3a3f46";
    ctx.fillRect(obstacle.x - 42, ground - 92, 84, 92);
    ctx.fillStyle = "#14181d";
    ctx.fillRect(obstacle.x - 32, ground - 80, 64, 56);
    const flicker = Math.sin(time * 18 + obstacle.x) * 4;
    ctx.fillStyle = PALETTE.orange;
    ctx.beginPath();
    ctx.moveTo(obstacle.x - 28, ground - 24);
    ctx.lineTo(obstacle.x - 12, ground - 52 - flicker);
    ctx.lineTo(obstacle.x + 2, ground - 26);
    ctx.lineTo(obstacle.x + 14, ground - 56 + flicker);
    ctx.lineTo(obstacle.x + 28, ground - 24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PALETTE.gold;
    ctx.beginPath();
    ctx.moveTo(obstacle.x - 16, ground - 24);
    ctx.lineTo(obstacle.x, ground - 42 - flicker);
    ctx.lineTo(obstacle.x + 16, ground - 24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PALETTE.steelDark;
    ctx.fillRect(obstacle.x - 42, ground - 24, 84, 10);
  } else if (obstacle.kind === "knife") {
    // A warning shadow, then the carving knife itself.
    if (obstacle.y < 0) {
      ctx.fillStyle = "rgba(43,29,18,0.3)";
      ctx.beginPath();
      ctx.ellipse(obstacle.x, ground + 6, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.red;
      ctx.font = "bold 20px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("!", obstacle.x, 44);
    } else {
      ctx.save();
      ctx.translate(obstacle.x, obstacle.y);
      ctx.fillStyle = PALETTE.steel;
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(5, 0);
      ctx.lineTo(3, 34);
      ctx.lineTo(0, 46);
      ctx.lineTo(-3, 34);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = PALETTE.darkBrown;
      ctx.fillRect(-4, -20, 8, 20);
      ctx.restore();
    }
  }
}

function drawCorn(ctx, corn) {
  ctx.save();
  ctx.translate(corn.x, corn.y);
  ctx.rotate(0.5);
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = PALETTE.orange;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-8, -5); ctx.lineTo(8, -5);
  ctx.moveTo(-8, 2); ctx.lineTo(8, 2);
  ctx.moveTo(-7, 9); ctx.lineTo(7, 9);
  ctx.stroke();
  ctx.fillStyle = PALETTE.green;
  ctx.beginPath();
  ctx.moveTo(-8, 10);
  ctx.lineTo(-16, 20);
  ctx.lineTo(-4, 14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHud(ctx, world, stage) {
  ctx.fillStyle = "rgba(43, 29, 18, 0.55)";
  ctx.fillRect(0, 0, VIEW.width, 52);
  ctx.fillStyle = PALETTE.cream;
  ctx.font = "bold 20px Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText(`Score ${world.score}`, 16, 33);
  ctx.fillText(`Distance ${Math.floor(world.distance)} m`, 210, 33);
  ctx.fillText(stage.name, 430, 33);
  // Feathers (lives).
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(660 + i * 30, 26);
    ctx.rotate(0.5);
    ctx.fillStyle = i < world.feathers ? PALETTE.orange : "rgba(255,246,224,0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Farmer gap bar: full is safe, empty is caught.
  ctx.fillStyle = PALETTE.cream;
  ctx.font = "bold 15px Georgia, serif";
  ctx.fillText("Farmer", 776, 22);
  ctx.strokeStyle = PALETTE.cream;
  ctx.strokeRect(776, 28, 160, 12);
  const ratio = Math.max(0, Math.min(1, (world.gap - 26) / 260));
  ctx.fillStyle = ratio < 0.3 ? PALETTE.red : PALETTE.gold;
  ctx.fillRect(778, 30, 156 * ratio, 8);
}

function centeredText(ctx, text, y, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, VIEW.width / 2, y);
}

function drawTitle(ctx, world) {
  centeredText(ctx, "GOBBLE DASH", 150, "bold 72px Georgia, serif", PALETTE.ink);
  centeredText(ctx, "The Great Escape", 196, "italic 30px Georgia, serif", PALETTE.red);
  centeredText(ctx, "Thanksgiving is coming. You are not dinner.", 252, "22px Georgia, serif", PALETTE.ink);
  centeredText(ctx, "Outrun the farmer, dodge the oven and the carving knives,", 290, "20px Georgia, serif", PALETTE.ink);
  centeredText(ctx, "eat corn for speed, and reach the far fence to escape.", 318, "20px Georgia, serif", PALETTE.ink);
  centeredText(ctx, "Press Enter or click to run", 386, "bold 24px Georgia, serif", PALETTE.red);
  centeredText(ctx, "Move: arrows / A,D    Jump: Space / W / click    Duck: Down / S", 500, "17px Georgia, serif", PALETTE.ink);
}

function drawEnd(ctx, world) {
  ctx.fillStyle = "rgba(43, 29, 18, 0.45)";
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  if (world.outcome === "escaped") {
    centeredText(ctx, "ESCAPED!", 190, "bold 64px Georgia, serif", PALETTE.gold);
    centeredText(ctx, "Over the far fence and into the autumn woods.", 240, "22px Georgia, serif", PALETTE.cream);
    centeredText(ctx, "Dinner is cancelled. The turkey lives.", 270, "22px Georgia, serif", PALETTE.cream);
  } else {
    centeredText(ctx, "CAUGHT!", 190, "bold 64px Georgia, serif", PALETTE.red);
    centeredText(ctx, "The farmer's net wins this round.", 240, "22px Georgia, serif", PALETTE.cream);
    centeredText(ctx, "The oven preheats at 350 degrees...", 270, "22px Georgia, serif", PALETTE.cream);
  }
  centeredText(ctx, `Final score ${world.score}   ·   Distance ${Math.floor(world.distance)} m`, 330, "bold 24px Georgia, serif", PALETTE.cream);
  centeredText(ctx, "Press Enter or click to run again", 396, "bold 22px Georgia, serif", PALETTE.gold);
}

export function render(ctx, world) {
  const stage = stageFor(world.distance);
  ctx.save();
  if (world.shake > 0) {
    ctx.translate((Math.random() - 0.5) * 10 * world.shake * 3, (Math.random() - 0.5) * 8 * world.shake * 3);
  }
  sky(ctx, stage);
  backdrop(ctx, world, stage);
  for (const corn of world.corns) drawCorn(ctx, corn);
  for (const obstacle of world.obstacles) drawObstacle(ctx, obstacle, world.time);
  drawFarmer(ctx, world);
  drawTurkey(ctx, world);
  if (world.flash > 0) {
    ctx.fillStyle = `rgba(179, 57, 46, ${world.flash * 1.2})`;
    ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  }
  ctx.restore();
  if (world.mode === "play" || world.mode === "end") drawHud(ctx, world, stage);
  if (world.mode === "title") drawTitle(ctx, world);
  if (world.mode === "end") drawEnd(ctx, world);
}
