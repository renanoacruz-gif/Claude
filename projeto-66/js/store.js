/* =============================================================
   PROJETO 66 — Store: estado, persistência (localStorage) e
   todas as estatísticas derivadas (streaks, XP, áreas, séries).
   ============================================================= */
'use strict';

P66.Store = {
  KEY: 'p66_state_v1',
  state: null,

  /* ---------- ciclo de vida ---------- */
  init() {
    try {
      const raw = localStorage.getItem(this.KEY);
      this.state = raw ? JSON.parse(raw) : null;
    } catch (e) { this.state = null; }
    if (!this.state || this.state.version !== 1) this.state = this._defaultState();
    this._ensureDay(this.today());
    this.save();
  },

  _defaultState() {
    return {
      version: 1,
      profile: { name: 'Renan', cycleStart: this.today() },
      settings: { sound: true, onboarded: false },
      habits: JSON.parse(JSON.stringify(P66.DEFAULT_HABITS)),
      log: {},            // 'YYYY-MM-DD' -> { total, habits:{id:iso}, missions:{id:iso}, extraMissions:[{id,name,xp}] }
      failures: {},       // 'YYYY-MM-DD' -> { motivo, plano }
      journal: {},        // 'YYYY-MM-DD' -> { bem, falha, melhorar, vitoria, deus, ts }
      whys: [],           // [{id, type, text, img?, createdAt}]
      achievements: {},   // id -> dateKey
      xp: 0,
      recentQuotes: [],
      warSessions: [],    // [{date, seconds}]
    };
  },

  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.state)); }
    catch (e) { console.warn('P66: falha ao salvar', e); }
  },

  _emit() {
    this.save();
    document.dispatchEvent(new CustomEvent('p66:change'));
  },

  /* ---------- datas ---------- */
  dkey(d) {
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  },
  today() { return this.dkey(new Date()); },
  parseKey(k) {
    const [y, m, d] = k.split('-').map(Number);
    return new Date(y, m - 1, d);
  },
  addDays(k, n) {
    const d = this.parseKey(k);
    d.setDate(d.getDate() + n);
    return this.dkey(d);
  },
  diffDays(a, b) { return Math.round((this.parseKey(b) - this.parseKey(a)) / 864e5); },
  weekdayShort(k) { return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][this.parseKey(k).getDay()]; },
  fmtDate(k) {
    const d = this.parseKey(k);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  },
  fmtDateLong(k) {
    const d = this.parseKey(k);
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  },

  /* ---------- ciclo de 66 dias ---------- */
  cycleStart() { return this.state.profile.cycleStart; },
  _elapsed() { return Math.max(0, this.diffDays(this.cycleStart(), this.today())); },
  cycleNumber() { return Math.floor(this._elapsed() / P66.CYCLE_DAYS) + 1; },
  dayNumber() { return (this._elapsed() % P66.CYCLE_DAYS) + 1; },
  daysLeft() { return P66.CYCLE_DAYS - this.dayNumber(); },
  currentCycleStartKey() {
    return this.addDays(this.cycleStart(), (this.cycleNumber() - 1) * P66.CYCLE_DAYS);
  },
  restartCycle() {
    this.state.profile.cycleStart = this.today();
    this._emit();
  },

  /* ---------- dia / hábitos ---------- */
  habits() { return this.state.habits.filter(h => h.active !== false); },
  habitById(id) { return this.state.habits.find(h => h.id === id); },

  _ensureDay(k) {
    if (!this.state.log[k]) {
      this.state.log[k] = { total: this.habits().length, habits: {}, missions: {}, extraMissions: [] };
    }
    return this.state.log[k];
  },
  day(k) { return this.state.log[k] || null; },

  isDone(id, k) {
    const e = this.day(k || this.today());
    return !!(e && e.habits[id]);
  },
  doneAt(id, k) {
    const e = this.day(k || this.today());
    return e ? e.habits[id] || null : null;
  },

  completeHabit(id) {
    const k = this.today();
    const e = this._ensureDay(k);
    if (e.habits[id]) return null;
    const h = this.habitById(id);
    if (!h) return null;
    e.habits[id] = new Date().toISOString();
    this.state.xp += h.xp;
    const before = this.levelInfo(this.state.xp - h.xp).level;
    const after = this.levelInfo().level;
    const unlocked = this.checkAchievements();
    const c = this.completionForDay(k);
    this._emit();
    return { xp: h.xp, pct: c.pct, dayComplete: c.pct === 100, levelUp: after > before ? this.levelInfo() : null, unlocked };
  },

  undoHabit(id) {
    const k = this.today();
    const e = this.day(k);
    if (!e || !e.habits[id]) return;
    delete e.habits[id];
    const h = this.habitById(id);
    if (h) this.state.xp = Math.max(0, this.state.xp - h.xp);
    this._emit();
  },

  completionForDay(k) {
    const e = this.day(k);
    const total = e ? (e.total || this.habits().length) : this.habits().length;
    const done = e ? Object.keys(e.habits).length : 0;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  },

  isPerfect(k) {
    const c = this.completionForDay(k);
    return c.total > 0 && c.done >= c.total;
  },

  /* hábitos de hoje cujo horário já passou e não foram concluídos */
  lateHabitsToday() {
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    return this.habits().filter(h => {
      if (this.isDone(h.id)) return false;
      const [hh, mm] = h.time.split(':').map(Number);
      return hh * 60 + mm < cur;
    });
  },

  nextHabit() {
    const pending = this.habits().filter(h => !this.isDone(h.id))
      .sort((a, b) => a.time.localeCompare(b.time));
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const upcoming = pending.find(h => {
      const [hh, mm] = h.time.split(':').map(Number);
      return hh * 60 + mm >= cur;
    });
    return upcoming || pending[0] || null;
  },

  /* ---------- missões ---------- */
  _hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  },
  _dailyMissionPool(k) {
    const pool = [...P66.MISSIONS];
    let seed = this._hash('p66' + k);
    const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, P66.MISSIONS_PER_DAY);
  },
  missionsForDay(k) {
    k = k || this.today();
    const e = this.day(k);
    return this._dailyMissionPool(k).concat((e && e.extraMissions) || []);
  },
  missionDone(id, k) {
    const e = this.day(k || this.today());
    return !!(e && e.missions[id]);
  },
  completeMission(id) {
    const k = this.today();
    const e = this._ensureDay(k);
    if (e.missions[id]) return null;
    const m = this.missionsForDay(k).find(x => x.id === id);
    if (!m) return null;
    e.missions[id] = new Date().toISOString();
    this.state.xp += m.xp;
    const before = this.levelInfo(this.state.xp - m.xp).level;
    const after = this.levelInfo().level;
    const unlocked = this.checkAchievements();
    this._emit();
    return { xp: m.xp, levelUp: after > before ? this.levelInfo() : null, unlocked };
  },
  undoMission(id) {
    const k = this.today();
    const e = this.day(k);
    if (!e || !e.missions[id]) return;
    const m = this.missionsForDay(k).find(x => x.id === id);
    delete e.missions[id];
    if (m) this.state.xp = Math.max(0, this.state.xp - m.xp);
    this._emit();
  },
  addCustomMission(name, xp) {
    const e = this._ensureDay(this.today());
    e.extraMissions.push({ id: 'mx_' + Date.now(), name, xp: xp || 40, icon: 'flag', areas: [] });
    this._emit();
  },

  /* ---------- streaks & contadores ---------- */
  currentStreak() {
    let k = this.today();
    let n = 0;
    if (this.isPerfect(k)) { n = 1; }
    k = this.addDays(k, -1);
    while (this.day(k) && this.isPerfect(k)) { n++; k = this.addDays(k, -1); }
    return n;
  },
  bestStreak() {
    const keys = Object.keys(this.state.log).sort();
    let best = 0, run = 0, prev = null;
    for (const k of keys) {
      if (this.isPerfect(k)) {
        run = (prev && this.diffDays(prev, k) === 1) ? run + 1 : 1;
        prev = k;
        if (run > best) best = run;
      } else { run = 0; prev = null; }
    }
    return best;
  },
  perfectDays() {
    return Object.keys(this.state.log).filter(k => this.isPerfect(k)).length;
  },
  brokenDays() {
    // dias já encerrados do ciclo atual com menos de 100%
    const start = this.currentCycleStartKey();
    const today = this.today();
    let n = 0;
    for (let k = start; k < today; k = this.addDays(k, 1)) {
      if (!this.isPerfect(k)) n++;
    }
    return n;
  },
  totalCompletions() {
    return Object.values(this.state.log).reduce((s, e) => s + Object.keys(e.habits).length, 0);
  },
  habitCount(id) {
    return Object.values(this.state.log).reduce((s, e) => s + (e.habits[id] ? 1 : 0), 0);
  },
  missionsCount() {
    return Object.values(this.state.log).reduce((s, e) => s + Object.keys(e.missions).length, 0);
  },
  journalCount() { return Object.keys(this.state.journal).length; },
  flawlessCycle() {
    return this.dayNumber() === P66.CYCLE_DAYS && this.brokenDays() === 0 && this.isPerfect(this.today());
  },
  overallRate() {
    const start = this.currentCycleStartKey();
    const today = this.today();
    let done = 0, total = 0;
    for (let k = start; k <= today; k = this.addDays(k, 1)) {
      const c = this.completionForDay(k);
      done += c.done; total += c.total;
    }
    return total ? Math.round((done / total) * 100) : 0;
  },
  lastFailure() {
    let k = this.addDays(this.today(), -1);
    const start = this.cycleStart();
    while (k >= start) {
      if (this.day(k) && !this.isPerfect(k)) {
        const e = this.day(k);
        const missed = this.habits().filter(h => !e.habits[h.id]).map(h => h.name);
        return { key: k, missed, note: this.state.failures[k] || null };
      }
      k = this.addDays(k, -1);
    }
    return null;
  },
  setFailureNote(k, motivo, plano) {
    this.state.failures[k] = { motivo, plano };
    this._emit();
  },

  /* ---------- séries para gráficos ---------- */
  firstLogKey() {
    return Object.keys(this.state.log).sort()[0] || this.today();
  },
  weeklySeries() {
    // não plota dias anteriores ao primeiro registro (0% falso)
    const first = this.firstLogKey();
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const k = this.addDays(this.today(), -i);
      if (k < first) continue;
      const c = this.completionForDay(k);
      out.push({ key: k, label: this.weekdayShort(k), ...c });
    }
    return out;
  },
  monthlySeries(days = 30) {
    const first = this.firstLogKey();
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const k = this.addDays(this.today(), -i);
      if (k < first) continue;
      const c = this.completionForDay(k);
      out.push({ key: k, label: this.fmtDate(k), ...c });
    }
    return out;
  },
  heatmapCycle() {
    const start = this.currentCycleStartKey();
    const today = this.today();
    const cells = [];
    for (let i = 0; i < P66.CYCLE_DAYS; i++) {
      const k = this.addDays(start, i);
      const c = this.completionForDay(k);
      cells.push({
        key: k, dayNum: i + 1, pct: c.pct,
        state: k > today ? 'future' : (k === today ? 'today' : 'past'),
      });
    }
    return cells;
  },
  hourHistogram() {
    const hours = new Array(24).fill(0);
    Object.values(this.state.log).forEach(e => {
      Object.values(e.habits).forEach(iso => {
        const d = new Date(iso);
        if (!isNaN(d)) hours[d.getHours()]++;
      });
    });
    return hours;
  },
  habitStrength() {
    const start = this.currentCycleStartKey();
    const today = this.today();
    const opp = this.diffDays(start, today) + 1;
    return this.habits().map(h => {
      let done = 0, lateSum = 0, lateN = 0;
      for (let k = start; k <= today; k = this.addDays(k, 1)) {
        const iso = this.doneAt(h.id, k);
        if (iso) {
          done++;
          const d = new Date(iso);
          const [hh, mm] = h.time.split(':').map(Number);
          const delta = (d.getHours() * 60 + d.getMinutes()) - (hh * 60 + mm);
          if (!isNaN(delta)) { lateSum += delta; lateN++; }
        }
      }
      return { habit: h, done, opp, rate: opp ? Math.round((done / opp) * 100) : 0, avgDelay: lateN ? Math.round(lateSum / lateN) : 0 };
    }).sort((a, b) => b.rate - a.rate);
  },
  weekdayRates() {
    // taxa média de conclusão por dia da semana (histórico todo)
    const sums = new Array(7).fill(0), counts = new Array(7).fill(0);
    Object.keys(this.state.log).forEach(k => {
      if (k > this.today()) return;
      const wd = this.parseKey(k).getDay();
      sums[wd] += this.completionForDay(k).pct;
      counts[wd]++;
    });
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((label, i) => ({
      label, pct: counts[i] ? Math.round(sums[i] / counts[i]) : 0, n: counts[i],
    }));
  },
  minutesInvested() {
    let min = 0;
    Object.values(this.state.log).forEach(e => {
      Object.keys(e.habits).forEach(id => {
        const h = this.habitById(id);
        if (h) min += h.min;
      });
    });
    return min;
  },
  rateBetween(fromKey, toKey) {
    let done = 0, total = 0;
    for (let k = fromKey; k <= toKey; k = this.addDays(k, 1)) {
      if (!this.day(k)) continue;
      const c = this.completionForDay(k);
      done += c.done; total += c.total;
    }
    return total ? Math.round((done / total) * 100) : null;
  },

  /* ---------- Homem Integral (0–100 por área) ---------- */
  areaScores(windowDays = 14) {
    const scores = {};
    const from = this.addDays(this.today(), -(windowDays - 1));
    Object.keys(P66.AREAS).forEach(a => { scores[a] = { done: 0, opp: 0, missions: 0 }; });
    for (let k = from; k <= this.today(); k = this.addDays(k, 1)) {
      const e = this.day(k);
      this.habits().forEach(h => {
        h.areas.forEach(a => {
          if (!scores[a]) return;
          scores[a].opp++;
          if (e && e.habits[h.id]) scores[a].done++;
        });
      });
      if (e) {
        this.missionsForDay(k).forEach(m => {
          if (e.missions[m.id]) m.areas.forEach(a => { if (scores[a]) scores[a].missions++; });
        });
      }
    }
    return Object.keys(P66.AREAS).map(a => {
      const s = scores[a];
      const base = s.opp ? (s.done / s.opp) * 100 : 0;
      const bonus = Math.min(18, s.missions * 3);
      return { area: a, ...P66.AREAS[a], score: Math.min(100, Math.round(s.opp ? base * 0.9 + bonus : Math.min(100, s.missions * 12))) };
    });
  },

  /* ---------- XP / patentes ---------- */
  levelInfo(xp) {
    const total = xp === undefined ? this.state.xp : xp;
    let cur = P66.RANKS[0], next = null;
    for (const r of P66.RANKS) {
      if (total >= r.xp) cur = r; else { next = r; break; }
    }
    const span = next ? next.xp - cur.xp : 1;
    const into = next ? total - cur.xp : 1;
    return { level: cur.level, name: cur.name, xp: total, next, pct: next ? Math.min(100, Math.round((into / span) * 100)) : 100 };
  },

  /* ---------- conquistas ---------- */
  checkAchievements() {
    const fresh = [];
    P66.ACHIEVEMENTS.forEach(a => {
      if (!this.state.achievements[a.id] && a.check(this)) {
        this.state.achievements[a.id] = this.today();
        fresh.push(a);
      }
    });
    return fresh;
  },

  /* ---------- reflexão / diário ---------- */
  saveJournal(k, entry) {
    this.state.journal[k] = { ...entry, ts: new Date().toISOString() };
    this.checkAchievements();
    this._emit();
  },
  searchJournal(q) {
    const term = (q || '').toLowerCase().trim();
    return Object.keys(this.state.journal).sort().reverse()
      .map(k => ({ key: k, ...this.state.journal[k] }))
      .filter(e => !term || ['bem', 'falha', 'melhorar', 'vitoria', 'deus']
        .some(f => (e[f] || '').toLowerCase().includes(term)));
  },

  /* ---------- "Por que continuo?" ---------- */
  addWhy(type, text, img) {
    this.state.whys.push({ id: 'w_' + Date.now(), type, text, img: img || null, createdAt: this.today() });
    this._emit();
  },
  removeWhy(id) {
    this.state.whys = this.state.whys.filter(w => w.id !== id);
    this._emit();
  },

  /* ---------- frases ---------- */
  nextQuote() {
    const idx = P66.pickQuote(this.state.recentQuotes);
    this.state.recentQuotes.push(idx);
    if (this.state.recentQuotes.length > 40) this.state.recentQuotes.shift();
    this.save();
    return P66.QUOTES[idx];
  },

  /* ---------- backup ---------- */
  exportJSON() { return JSON.stringify(this.state, null, 2); },
  importJSON(text) {
    const obj = JSON.parse(text);
    if (!obj || obj.version !== 1 || !obj.profile || !obj.log) throw new Error('Arquivo de backup inválido.');
    this.state = obj;
    this._ensureDay(this.today());
    this._emit();
  },
  resetAll() {
    this.state = this._defaultState();
    this.state.settings.onboarded = true;
    this._emit();
  },

  /* ---------- dados de demonstração (16 dias -> hoje é o Dia 17) ---------- */
  seedDemo() {
    const s = this._defaultState();
    s.settings.onboarded = true;
    s.profile.name = this.state.profile.name || 'Renan';
    s.profile.cycleStart = this.addDays(this.today(), -16);
    let seed = this._hash('demo' + s.profile.cycleStart);
    const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    // perfil de cada dia: maioria forte, 3 dias quebrados (2, 9 e 13)
    const brokenAt = new Set([2, 9, 13]);
    for (let i = 0; i < 16; i++) {
      const k = this.addDays(s.profile.cycleStart, i);
      const e = { total: s.habits.length, habits: {}, missions: {}, extraMissions: [] };
      const missCount = brokenAt.has(i) ? 2 + Math.floor(rnd() * 3) : 0;
      const missIdx = new Set();
      while (missIdx.size < missCount) missIdx.add(Math.floor(rnd() * s.habits.length));
      s.habits.forEach((h, hi) => {
        if (missIdx.has(hi)) return;
        const [hh, mm] = h.time.split(':').map(Number);
        const delay = Math.floor(rnd() * 50) - 10; // -10..+40 min do horário planejado
        const d = this.parseKey(k);
        d.setHours(hh, mm + Math.max(-15, delay), Math.floor(rnd() * 60));
        e.habits[h.id] = d.toISOString();
        s.xp += h.xp;
      });
      // 1 a 3 missões por dia
      const mN = 1 + Math.floor(rnd() * 3);
      this._dailyMissionPool(k).slice(0, mN).forEach(m => {
        const d = this.parseKey(k); d.setHours(12 + Math.floor(rnd() * 9), Math.floor(rnd() * 60));
        e.missions[m.id] = d.toISOString();
        s.xp += m.xp;
      });
      s.log[k] = e;
    }
    s.failures[this.addDays(s.profile.cycleStart, 9)] = { motivo: 'Dormi tarde na véspera e o dia começou atrasado.', plano: 'Protocolo do sono às 21h30 sem exceção; celular fora do quarto.' };
    s.failures[this.addDays(s.profile.cycleStart, 13)] = { motivo: 'Compromisso imprevisto à noite engoliu o planejamento.', plano: 'Antecipar leitura e planejamento para a hora do almoço quando houver agenda à noite.' };
    const j = (k, o) => { s.journal[k] = { ...o, ts: this.parseKey(k).toISOString() }; };
    j(this.addDays(s.profile.cycleStart, 14), { bem: 'Treino completo e devocional sem pressa.', falha: 'Peguei o celular antes do devocional.', melhorar: 'Deixar a Bíblia aberta na mesa na véspera.', vitoria: 'Terminei a proposta do cliente antes do prazo.', deus: 'Paciência se treina nas filas e nos imprevistos.' },
    );
    j(this.addDays(s.profile.cycleStart, 15), { bem: 'Dia 100% e ainda liguei para meus pais.', falha: 'Quase pulei a pausa da tarde.', melhorar: 'Alarme silencioso às 15h para a pausa.', vitoria: 'Minha esposa comentou que me viu mais presente.', deus: 'Constância vale mais que intensidade.' },
    );
    s.recentQuotes = this.state.recentQuotes || [];
    this.state = s;
    this._ensureDay(this.today());
    this.checkAchievements();
    this._emit();
  },
};
