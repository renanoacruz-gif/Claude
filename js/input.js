const Input = (() => {
  const cur = {}, prev = {};

  function init() {
    const gameKeys = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
                              'Space','ShiftLeft','ShiftRight','KeyZ','KeyA',
                              'KeyD','KeyW','KeyS','KeyP','Escape','Enter']);
    window.addEventListener('keydown', e => {
      cur[e.code] = true;
      if (gameKeys.has(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { cur[e.code] = false; });

    document.querySelectorAll('[data-key]').forEach(btn => {
      const k = btn.dataset.key;
      const down = e => { e.preventDefault(); cur[k] = true; };
      const up   = e => { e.preventDefault(); cur[k] = false; };
      btn.addEventListener('touchstart', down, {passive:false});
      btn.addEventListener('touchend',   up,   {passive:false});
      btn.addEventListener('mousedown',  down);
      btn.addEventListener('mouseup',    up);
    });
  }

  function tick() { Object.assign(prev, cur); }
  const dn  = k => !!cur[k];
  const hit = k => !!cur[k] && !prev[k];

  return {
    init, tick,
    left:  () => dn('ArrowLeft')  || dn('KeyA'),
    right: () => dn('ArrowRight') || dn('KeyD'),
    jump:  () => dn('Space') || dn('ArrowUp') || dn('KeyW'),
    jumpHit: () => hit('Space') || hit('ArrowUp') || hit('KeyW'),
    run:   () => dn('ShiftLeft') || dn('ShiftRight') || dn('KeyX'),
    fire:  () => hit('KeyZ') || hit('KeyC'),
    pause: () => hit('KeyP') || hit('Escape'),
    enter: () => hit('Enter') || hit('Space'),
    dn, hit,
  };
})();
