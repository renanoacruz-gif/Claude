window.addEventListener('DOMContentLoaded', () => {
  const canvas    = document.getElementById('canvas');
  const container = document.getElementById('game-container');
  const controls  = document.getElementById('controls');

  Input.init();

  // ── Detect touch device and show overlay controls ──────────────────────
  const isTouch = () => window.matchMedia('(pointer: coarse)').matches
                     || navigator.maxTouchPoints > 0;

  if (isTouch()) {
    controls.style.display = 'block';
  }
  window.addEventListener('touchstart', () => {
    controls.style.display = 'block';
  }, { once: true, passive: true });

  // ── Scale canvas + controls to fit viewport ────────────────────────────
  function resize() {
    const scale = Math.min(
      window.innerWidth  / 800,
      window.innerHeight / 480
    );
    container.style.transform = `scale(${scale})`;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Prevent default scroll/zoom gestures on the game area ─────────────
  document.addEventListener('touchmove', e => e.preventDefault(), {passive: false});
  document.addEventListener('contextmenu', e => e.preventDefault());

  // ── Patch Level._hitBlock to expose result for game.js ────────────────
  const _origHB = Level.prototype._hitBlock;
  Level.prototype._hitBlock = function(col, row, player) {
    const result = _origHB.call(this, col, row, player);
    if (result) this._lastBlockHit = { ...result, x: (col+0.5)*this.TS, y: row*this.TS };
    return result;
  };

  // ── Start game ──────────────────────────────────────────────────────────
  const game = new Game(canvas);

  let lastTime = 0;
  const FRAME_MS = 1000 / 60;

  function loop(ts) {
    requestAnimationFrame(loop);
    if (ts - lastTime < FRAME_MS - 1) return;
    lastTime = ts;
    game.update();
    game.draw();
  }

  requestAnimationFrame(loop);
});
