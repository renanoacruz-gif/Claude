/* =============================================================
   PROJETO 66 — Sons de vitória (Web Audio, sem assets externos)
   Sfx.init() precisa ser chamado após o primeiro gesto do usuário.
   ============================================================= */
'use strict';

P66.Sfx = {
  ctx: null,
  enabled: true,

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) this.ctx = new AC();
  },

  _tone(freq, t0, dur, type = 'sine', gain = 0.12) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  },

  _play(notes, type = 'sine', gain = 0.12) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    notes.forEach(([f, at, dur]) => this._tone(f, now + at, dur, type, gain));
  },

  /* hábito concluído — dois toques secos e limpos */
  win()     { this._play([[660, 0, 0.10], [990, 0.09, 0.22]], 'triangle', 0.14); },
  /* missão extra concluída */
  mission() { this._play([[520, 0, 0.09], [780, 0.08, 0.16]], 'triangle', 0.11); },
  /* dia 100% — pequena fanfarra */
  fanfare() { this._play([[523, 0, 0.14], [659, 0.12, 0.14], [784, 0.24, 0.14], [1047, 0.38, 0.42]], 'triangle', 0.15); },
  /* subiu de nível */
  levelUp() { this._play([[392, 0, 0.12], [523, 0.11, 0.12], [659, 0.22, 0.12], [784, 0.33, 0.3], [1047, 0.46, 0.5]], 'triangle', 0.16); },
  /* conquista desbloqueada */
  badge()   { this._play([[880, 0, 0.1], [1174, 0.1, 0.3]], 'sine', 0.12); },
  /* desfazer / neutro */
  tick()    { this._play([[440, 0, 0.06]], 'sine', 0.07); },
};
