const Audio = (() => {
  let ctx, gain;

  function init() {
    try {
      ctx  = new (window.AudioContext || window.webkitAudioContext)();
      gain = ctx.createGain();
      gain.gain.value = 0.25;
      gain.connect(ctx.destination);
    } catch(e) { ctx = null; }
  }

  function resume() { ctx && ctx.state === 'suspended' && ctx.resume(); }

  function tone(freq, dur, type='square', vol=1, delay=0) {
    if (!ctx) return;
    resume();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(gain);
    o.type = type; o.frequency.value = freq;
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.01);
  }

  function sweep(f1, f2, dur, type='square', vol=1, delay=0) {
    if (!ctx) return;
    resume();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(gain);
    o.type = type;
    const t = ctx.currentTime + delay;
    o.frequency.setValueAtTime(f1, t);
    o.frequency.linearRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.01);
  }

  return {
    init,
    coin()      { tone(988,.05,'square',.4); tone(1319,.15,'square',.4,.05); },
    jump()      { sweep(200,550,.14,'square',.3); },
    stomp()     { tone(120,.08,'square',.5); tone(80,.12,'square',.3,.06); },
    damage()    { sweep(500,150,.2,'square',.4); },
    powerup()   { [523,659,784,1047].forEach((f,i)=>tone(f,.14,'square',.4,i*.1)); },
    star()      { [523,659,784,1047,784,659].forEach((f,i)=>tone(f,.07,'square',.35,i*.07)); },
    die()       { sweep(600,200,.3,'square',.4); sweep(200,50,.5,'square',.3,.3); },
    blockHit()  { tone(220,.1,'square',.3); },
    brickBreak(){ tone(180,.06,'sawtooth',.3); tone(100,.1,'sawtooth',.25,.04); },
    flagpole()  { [784,784,784,659,784,1047,880].forEach((f,i)=>tone(f,.2,'square',.3,i*.18)); },
    lvlClear()  { [659,659,659,523,659,784,1047].forEach((f,i)=>tone(f,.2,'square',.35,i*.18)); },
    fireball()  { sweep(700,350,.1,'sawtooth',.2); },
    oneUp()     { [988,1319,988,1319,1568,1319].forEach((f,i)=>tone(f,.13,'square',.4,i*.1)); },
  };
})();
