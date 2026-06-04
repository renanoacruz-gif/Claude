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

    // Release all keys when window loses focus
    window.addEventListener('blur', () => {
      Object.keys(cur).forEach(k => { cur[k] = false; });
    });

    // Wire up touch/mouse buttons
    document.querySelectorAll('[data-key]').forEach(btn => {
      const k = btn.dataset.key;

      const press = e => {
        e.preventDefault();
        cur[k] = true;
        btn.classList.add('pressed');
      };
      const release = e => {
        e.preventDefault();
        cur[k] = false;
        btn.classList.remove('pressed');
      };
      const releaseOnLeave = e => {
        e.preventDefault();
        // Only release if no touches remain on this button
        const rect = btn.getBoundingClientRect();
        let stillOn = false;
        for (const t of e.touches) {
          if (t.clientX >= rect.left && t.clientX <= rect.right &&
              t.clientY >= rect.top  && t.clientY <= rect.bottom) {
            stillOn = true; break;
          }
        }
        if (!stillOn) { cur[k] = false; btn.classList.remove('pressed'); }
      };

      btn.addEventListener('touchstart',  press,          {passive:false});
      btn.addEventListener('touchend',    release,        {passive:false});
      btn.addEventListener('touchcancel', release,        {passive:false});
      btn.addEventListener('touchmove',   releaseOnLeave, {passive:false});
      btn.addEventListener('mousedown',   press);
      btn.addEventListener('mouseup',     release);
      btn.addEventListener('mouseleave',  release);
    });
  }

  function tick() { Object.assign(prev, cur); }
  const dn  = k => !!cur[k];
  const hit = k => !!cur[k] && !prev[k];

  return {
    init, tick,
    left:    () => dn('ArrowLeft')  || dn('KeyA'),
    right:   () => dn('ArrowRight') || dn('KeyD'),
    jump:    () => dn('Space') || dn('ArrowUp') || dn('KeyW'),
    jumpHit: () => hit('Space') || hit('ArrowUp') || hit('KeyW'),
    run:     () => dn('ShiftLeft') || dn('ShiftRight') || dn('KeyX'),
    fire:    () => hit('KeyZ') || hit('KeyC'),
    pause:   () => hit('KeyP') || hit('Escape'),
    enter:   () => hit('Enter') || hit('Space'),
    dn, hit,
  };
})();
