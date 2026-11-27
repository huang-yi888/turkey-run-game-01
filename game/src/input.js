// Keyboard and mouse input: movement, jump, duck, start and restart.

export function createInput(canvas, onStart) {
  const keys = new Set();
  let jumpQueued = false;

  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) {
      event.preventDefault();
    }
    if (event.code === "Enter") onStart();
    if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
      if (!event.repeat) jumpQueued = true;
    }
    keys.add(event.code);
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  canvas.addEventListener("mousedown", () => {
    onStart();
    jumpQueued = true;
  });

  return {
    get left() { return keys.has("ArrowLeft") || keys.has("KeyA"); },
    get right() { return keys.has("ArrowRight") || keys.has("KeyD"); },
    get duck() { return keys.has("ArrowDown") || keys.has("KeyS"); },
    takeJump() {
      const queued = jumpQueued;
      jumpQueued = false;
      return queued;
    },
  };
}
