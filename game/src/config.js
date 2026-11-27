// Shared constants for Gobble Dash: canvas size, physics, stages, palette.

export const VIEW = { width: 960, height: 540, groundY: 462 };

export const TURKEY = {
  startX: 210,
  minX: 90,
  maxX: 560,
  runSpeed: 260, // px per second sideways
  gravity: 2100,
  jumpVelocity: -820,
  width: 64,
  height: 58,
};

export const FARMER = {
  startGap: 210, // px behind the turkey
  catchGap: 26,
  closeRate: 9, // px per second the farmer gains while running clean
  stumbleGain: 70, // px the farmer gains when the turkey trips
  cornRelief: 34, // px the farmer loses when the turkey eats corn
};

export const ESCAPE_DISTANCE = 2400; // metres to freedom

export const STAGES = [
  { name: "The Farmyard", until: 800, speed: 300, spawnEvery: 1.15, sky: ["#f9d976", "#f39f5a"], ground: "#8a5a2b" },
  { name: "The Barn", until: 1600, speed: 360, spawnEvery: 0.95, sky: ["#f6b352", "#d96f32"], ground: "#6e4520" },
  { name: "The Kitchen", until: 2400, speed: 425, spawnEvery: 0.8, sky: ["#e88ca0", "#9c4a6e"], ground: "#54331c" },
];

export const PALETTE = {
  ink: "#2b1d12",
  cream: "#fff6e0",
  red: "#b3392e",
  orange: "#e07b39",
  gold: "#f2b33d",
  brown: "#7a4a21",
  darkBrown: "#4a2c14",
  green: "#5d8a3c",
  steel: "#c9d4dc",
  steelDark: "#7d8b96",
};
