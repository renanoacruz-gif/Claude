window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  Input.init();

  // Patch Level._hitBlock to expose last result for game.js to consume
  const _origHB = Level.prototype._hitBlock;
  Level.prototype._hitBlock = function(col, row, player) {
    const result = _origHB.call(this, col, row, player);
    if (result) this._lastBlockHit = { ...result, x: (col+0.5)*this.TS, y: row*this.TS };
    return result;
  };

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
