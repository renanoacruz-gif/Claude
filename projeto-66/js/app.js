/* =============================================================
   PROJETO 66 — App: roteador, eventos, overlays e inicialização.
   ============================================================= */
'use strict';

(() => {
  const S = P66.Store;
  const V = P66.Views;
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  const ROUTES = ['dashboard', 'hoje', 'missoes', 'guerra', 'evolucao', 'integral', 'claudi', 'conquistas', 'reflexao', 'responsabilidade', 'porque', 'config'];
  const KEY_ROUTES = { '1': 'dashboard', '2': 'hoje', '3': 'missoes', '4': 'guerra', '5': 'evolucao', '6': 'integral', '7': 'claudi', '8': 'conquistas', '9': 'reflexao', '0': 'responsabilidade' };

  let currentRoute = 'dashboard';
  let reflexNudged = false;

  /* ================= Router ================= */
  function route() {
    const h = location.hash.replace('#/', '') || 'dashboard';
    return ROUTES.includes(h) ? h : 'dashboard';
  }
  function render() {
    currentRoute = route();
    const view = $('#view');
    view.innerHTML = V[currentRoute].render();
    V[currentRoute].mount(view);
    document.querySelectorAll('#sidebar a[data-route]').forEach(a =>
      a.classList.toggle('active', a.dataset.route === currentRoute));
    renderSidebarLevel();
    view.scrollTop = 0;
    closeSidebar();
  }
  function go(r) { location.hash = '#/' + r; }

  function renderSidebarLevel() {
    const lvl = S.levelInfo();
    $('#sidebar-level').innerHTML = `
      <div class="lvl-head"><strong>Nv ${lvl.level} · ${lvl.name}</strong><span>${lvl.xp.toLocaleString('pt-BR')} XP</span></div>
      <div class="lvl-bar"><i style="width:${lvl.pct}%"></i></div>
      ${lvl.next ? `<span class="lvl-next">${lvl.next.xp - lvl.xp} XP até ${lvl.next.name}</span>` : '<span class="lvl-next">Patente máxima</span>'}`;
  }

  /* ================= Toasts ================= */
  function toast(html, tone = '', ms = 3400) {
    const t = document.createElement('div');
    t.className = 'toast ' + tone;
    t.innerHTML = html;
    $('#toasts').appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, ms);
  }

  /* ================= Frases ================= */
  function showQuote() {
    const q = S.nextQuote();
    $('#topbar-quote').innerHTML = `<span class="q-text">"${esc(q.t)}"</span>${q.a ? `<span class="q-author">— ${esc(q.a)}</span>` : ''}`;
  }

  /* ================= Relógio ================= */
  function tickClock() {
    const now = new Date();
    $('#topbar-clock').textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    // virada de dia com o app aberto
    if (!S.day(S.today())) { S._ensureDay(S.today()); S.save(); render(); }
    // lembrete de reflexão à noite
    if (!reflexNudged && now.getHours() >= 20 && !S.state.journal[S.today()] && currentRoute !== 'reflexao') {
      reflexNudged = true;
      toast(`${P66.icon('pen')} Fim de dia: registre sua <a href="#/reflexao">reflexão</a>.`, 'info', 6000);
    }
  }

  /* ================= Celebrações ================= */
  function celebrate(title, sub, extra = '') {
    const o = $('#celebrate-overlay');
    o.innerHTML = `<div class="celebrate">
      <div class="celebrate-ring">${P66.icon('check')}</div>
      <h1>${title}</h1>
      <p>${sub}</p>${extra}
      <button class="btn btn-primary" data-action="close-celebrate">Continuar</button>
    </div><div class="confetti">${Array.from({ length: 24 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>`;
    o.hidden = false;
  }
  function celebrateLevel(lvl) {
    celebrate('PROMOÇÃO', `Você alcançou o nível ${lvl.level}.`, `<div class="rank-name">${lvl.name}</div>`);
    P66.Sfx.levelUp();
  }
  function handleResult(res) {
    if (!res) return;
    if (res.xp) toast(`${P66.icon('arrowUp')} <strong>+${res.xp} XP</strong>`, 'good', 2200);
    if (res.dayComplete) { celebrate('MISSÃO CONCLUÍDA', 'Hoje você venceu.'); P66.Sfx.fanfare(); }
    if (res.levelUp) setTimeout(() => celebrateLevel(res.levelUp), res.dayComplete ? 1200 : 0);
    (res.unlocked || []).forEach((a, i) =>
      setTimeout(() => { toast(`${P66.icon(a.icon)} Conquista desbloqueada: <strong>${a.name}</strong>`, 'good', 5000); P66.Sfx.badge(); }, 600 + i * 700));
  }

  /* ================= "Por que continuo?" automático ================= */
  function maybeShowWhy() {
    const whys = S.state.whys;
    if (!whys.length) return;
    if (S.state.settings.lastWhyShown === S.today()) return;
    const late = S.lateHabitsToday().length >= 3;
    const y1 = S.addDays(S.today(), -1), y2 = S.addDays(S.today(), -2);
    const twoBroken = S.day(y1) && S.day(y2) && !S.isPerfect(y1) && !S.isPerfect(y2);
    if (!late && !twoBroken) return;
    S.state.settings.lastWhyShown = S.today();
    S.save();
    const picks = [...whys].sort(() => Math.random() - 0.5).slice(0, 3);
    openModal(`
      <h2 class="modal-title">Por que você continua?</h2>
      <p class="modal-sub">A execução caiu. Antes de qualquer desculpa, lembre-se do que está em jogo:</p>
      ${picks.map(w => `<div class="why-remind">${w.img ? `<img src="${w.img}" alt="">` : ''}<p>${esc(w.text)}</p></div>`).join('')}
      <button class="btn btn-primary" data-action="close-modal">De volta à luta</button>`);
  }

  /* ================= Modais genéricos ================= */
  function openModal(html) {
    const o = $('#modal-overlay');
    o.innerHTML = `<div class="modal">${html}</div>`;
    o.hidden = false;
  }
  function closeModal() { $('#modal-overlay').hidden = true; }

  function helpModal() {
    openModal(`
      <h2 class="modal-title">Atalhos de teclado</h2>
      <div class="help-grid">
        ${Object.entries(KEY_ROUTES).map(([k, r]) => `<span><kbd>${k}</kbd></span><span>${r.charAt(0).toUpperCase() + r.slice(1)}</span>`).join('')}
        <span><kbd>G</kbd></span><span>Modo Guerra</span>
        <span><kbd>Esc</kbd></span><span>Fechar overlays</span>
        <span><kbd>?</kbd></span><span>Esta ajuda</span>
      </div>
      <button class="btn btn-primary" data-action="close-modal">Fechar</button>`);
  }

  function onboarding() {
    openModal(`
      <div class="onboard-mark">66</div>
      <h2 class="modal-title">PROJETO 66</h2>
      <p class="modal-sub">66 dias para transformar objetivos em identidade. Gestão à vista, disciplina militar e melhoria contínua — a sua vida gerida como o projeto mais importante que existe.</p>
      <label class="field"><span>Como devo te chamar?</span>
        <input type="text" id="ob-name" value="${esc(S.state.profile.name)}" maxlength="30">
      </label>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="ob-start">Começar o Dia 1</button>
        <button class="btn btn-ghost" data-action="ob-demo">Explorar com dados de exemplo</button>
      </div>`);
  }

  /* ================= Modo Guerra ================= */
  const War = {
    timer: null, seconds: 0, running: false,
    open() {
      const o = $('#war-overlay');
      o.hidden = false;
      document.body.classList.add('war-active');
      this.seconds = 0; this.running = false;
      this.renderInner();
    },
    close() {
      clearInterval(this.timer); this.timer = null;
      $('#war-overlay').hidden = true;
      document.body.classList.remove('war-active');
      render();
    },
    current() { return S.nextHabit(); },
    renderInner() {
      const h = this.current();
      const o = $('#war-overlay');
      if (!h) {
        o.innerHTML = `<div class="war">
          <p class="war-kicker">MODO GUERRA</p>
          <h1 class="war-title">Nenhuma batalha pendente.</h1>
          <p class="war-next">Todos os hábitos de hoje foram concluídos.</p>
          <button class="btn btn-primary" data-action="exit-war">Sair</button>
        </div>`;
        return;
      }
      const pending = S.habits().filter(x => !S.isDone(x.id)).sort((a, b) => a.time.localeCompare(b.time));
      const next = pending.find(x => x.id !== h.id);
      o.innerHTML = `<div class="war">
        <p class="war-kicker">MODO GUERRA · MISSÃO ATUAL</p>
        <h1 class="war-title">${esc(h.name)}</h1>
        <p class="war-goal">${esc(h.goal)}${h.min ? ` · ${h.min} min` : ''} · +${h.xp} XP</p>
        <div class="war-clock" id="war-clock">00:00</div>
        <div class="btn-row war-controls">
          <button class="btn btn-secondary" data-action="war-toggle" id="war-toggle">${P66.icon('play')} Iniciar</button>
          <button class="btn btn-ghost" data-action="war-reset">${P66.icon('reset')} Zerar</button>
          <button class="btn btn-primary" data-action="war-complete" data-id="${h.id}">${P66.icon('check')} Missão cumprida</button>
        </div>
        <p class="war-next">${next ? `Próximo hábito: <strong>${esc(next.name)}</strong> às ${next.time}` : 'Última batalha do dia.'}</p>
        <button class="war-exit" data-action="exit-war" title="Sair (Esc)">${P66.icon('x')}</button>
      </div>`;
      this.paint();
    },
    paint() {
      const el = $('#war-clock');
      if (!el) return;
      const m = String(Math.floor(this.seconds / 60)).padStart(2, '0');
      const s = String(this.seconds % 60).padStart(2, '0');
      el.textContent = `${m}:${s}`;
    },
    toggle() {
      this.running = !this.running;
      const btn = $('#war-toggle');
      if (this.running) {
        btn.innerHTML = `${P66.icon('pause')} Pausar`;
        this.timer = setInterval(() => { this.seconds++; this.paint(); }, 1000);
      } else {
        btn.innerHTML = `${P66.icon('play')} Retomar`;
        clearInterval(this.timer);
      }
    },
    reset() { this.seconds = 0; this.paint(); },
    complete(id) {
      if (this.seconds > 30) {
        S.state.warSessions.push({ date: S.today(), seconds: this.seconds });
      }
      const res = S.completeHabit(id);
      P66.Sfx.win();
      clearInterval(this.timer); this.timer = null;
      this.seconds = 0; this.running = false;
      if (res && res.dayComplete) { this.close(); handleResult(res); return; }
      handleResult({ ...res, dayComplete: false });
      this.renderInner();
    },
  };

  /* ================= Exportações ================= */
  function download(name, text, type = 'application/json') {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  function exportPDF() {
    let box = $('#print-report');
    if (!box) {
      box = document.createElement('div');
      box.id = 'print-report';
      document.body.appendChild(box);
    }
    const lvl = S.levelInfo();
    const strength = S.habitStrength();
    box.innerHTML = `
      <h1>PROJETO 66 — Relatório de Execução</h1>
      <p>${esc(S.state.profile.name)} · Ciclo ${S.cycleNumber()} · Dia ${S.dayNumber()} de 66 · gerado em ${new Date().toLocaleString('pt-BR')}</p>
      <table><tr>
        <td>Execução geral<br><strong>${S.overallRate()}%</strong></td>
        <td>Dias perfeitos<br><strong>${S.perfectDays()}</strong></td>
        <td>Dias quebrados<br><strong>${S.brokenDays()}</strong></td>
        <td>Maior sequência<br><strong>${S.bestStreak()}</strong></td>
        <td>XP<br><strong>${lvl.xp} (Nv ${lvl.level} · ${lvl.name})</strong></td>
      </tr></table>
      <h2>Força dos hábitos (ciclo atual)</h2>
      <table>${strength.map(x => `<tr><td>${esc(x.habit.name)}</td><td>${x.done}/${x.opp}</td><td>${x.rate}%</td></tr>`).join('')}</table>
      <h2>Conquistas</h2>
      <p>${Object.keys(S.state.achievements).map(id => { const a = P66.ACHIEVEMENTS.find(x => x.id === id); return a ? a.name : ''; }).filter(Boolean).join(' · ') || 'Nenhuma ainda.'}</p>`;
    window.print();
  }

  /* foto do "porquê": reduz para caber no localStorage */
  function shrinkImage(file, cb) {
    const img = new Image();
    img.onload = () => {
      const max = 480;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * scale);
      cv.height = Math.round(img.height * scale);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      cb(cv.toDataURL('image/jpeg', 0.72));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }

  /* ================= Sidebar (mobile) ================= */
  function closeSidebar() { document.body.classList.remove('sidebar-open'); }

  /* ================= Ações delegadas ================= */
  const actions = {
    'complete-habit': el => { const res = S.completeHabit(el.dataset.id); if (res) { P66.Sfx.win(); handleResult(res); } render(); },
    'undo-habit': el => { S.undoHabit(el.dataset.id); P66.Sfx.tick(); render(); },
    'complete-mission': el => { const res = S.completeMission(el.dataset.id); if (res) { P66.Sfx.mission(); handleResult(res); } render(); },
    'undo-mission': el => { S.undoMission(el.dataset.id); P66.Sfx.tick(); render(); },
    'add-mission': () => {
      const inp = $('#new-mission-name');
      if (inp && inp.value.trim()) { S.addCustomMission(inp.value.trim()); render(); }
    },
    'save-journal': () => {
      const entry = {};
      ['bem', 'falha', 'melhorar', 'vitoria', 'deus'].forEach(f => { const t = $('#jr-' + f); if (t) entry[f] = t.value.trim(); });
      S.saveJournal(S.today(), entry);
      toast(`${P66.icon('check')} Reflexão salva no diário.`, 'good');
      render();
    },
    'save-failure': el => {
      S.setFailureNote(el.dataset.key, $('#fail-motivo').value.trim(), $('#fail-plano').value.trim());
      toast(`${P66.icon('shield')} Prestação de contas registrada.`, 'good');
      render();
    },
    'add-why': () => {
      const type = $('#why-type').value, text = $('#why-text').value.trim();
      if (!text) { toast('Escreva o seu porquê antes de adicionar.', 'warn'); return; }
      const file = $('#why-photo').files[0];
      if (file) shrinkImage(file, img => { S.addWhy(type, text, img); render(); });
      else { S.addWhy(type, text); render(); }
    },
    'remove-why': el => { if (confirm('Remover este porquê?')) { S.removeWhy(el.dataset.id); render(); } },
    'save-name': () => {
      const v = $('#cfg-name').value.trim();
      if (v) { S.state.profile.name = v; S.save(); toast('Nome atualizado.', 'good'); render(); }
    },
    'seed-demo': () => {
      if (confirm('Substituir os dados atuais por 16 dias de demonstração?')) { S.seedDemo(); toast('Dados de demonstração carregados — hoje é o Dia 17.', 'good'); go('dashboard'); render(); }
    },
    'reset-all': () => {
      if (confirm('Apagar TODOS os dados e recomeçar do zero? Esta ação não tem volta.')) { S.resetAll(); go('dashboard'); render(); }
    },
    'restart-cycle': () => {
      if (confirm('Reiniciar o ciclo de 66 dias a partir de hoje?')) { S.restartCycle(); render(); }
    },
    'export-json': () => download(`projeto66-backup-${S.today()}.json`, S.exportJSON()),
    'export-pdf': exportPDF,
    'war-mode': () => War.open(),
    'exit-war': () => War.close(),
    'war-toggle': () => War.toggle(),
    'war-reset': () => War.reset(),
    'war-complete': el => War.complete(el.dataset.id),
    'close-celebrate': () => { $('#celebrate-overlay').hidden = true; },
    'close-modal': closeModal,
    'help': helpModal,
    'new-quote': showQuote,
    'toggle-sidebar': () => document.body.classList.toggle('sidebar-open'),
    'ob-start': () => {
      const v = $('#ob-name').value.trim();
      if (v) S.state.profile.name = v;
      S.state.settings.onboarded = true;
      S.state.profile.cycleStart = S.today();
      S.save(); closeModal(); render(); showQuote();
    },
    'ob-demo': () => {
      const v = $('#ob-name').value.trim();
      if (v) S.state.profile.name = v;
      S.state.settings.onboarded = true;
      S.save(); S.seedDemo(); closeModal(); render();
      toast('Explorando com dados de exemplo — zere tudo em Configurações quando quiser começar de verdade.', 'info', 6000);
    },
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    // inicializa o áudio no primeiro gesto
    if (S.state.settings.sound) P66.Sfx.init();
    const fn = actions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el); }
  });

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-action-change]');
    if (!el) return;
    if (el.dataset.actionChange === 'toggle-sound') {
      S.state.settings.sound = el.checked;
      P66.Sfx.enabled = el.checked;
      S.save();
    }
    if (el.dataset.actionChange === 'import-json') {
      const f = el.files[0];
      if (!f) return;
      f.text().then(txt => {
        try { S.importJSON(txt); toast('Backup importado com sucesso.', 'good'); render(); }
        catch (err) { toast('Falha ao importar: ' + esc(err.message), 'bad', 5000); }
      });
    }
  });

  // timeline: permitir Enter/Espaço nos cards com role=button
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-action]')) {
      e.preventDefault();
      e.target.click();
    }
  });

  /* ================= Atalhos globais ================= */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape') {
      if (!$('#war-overlay').hidden) { War.close(); return; }
      $('#celebrate-overlay').hidden = true;
      closeModal();
      return;
    }
    if (KEY_ROUTES[e.key]) { go(KEY_ROUTES[e.key]); return; }
    if (e.key === 'g' || e.key === 'G') { War.open(); return; }
    if (e.key === '?') helpModal();
  });

  /* ================= Boot ================= */
  S.init();
  P66.Sfx.enabled = S.state.settings.sound !== false;

  window.addEventListener('hashchange', render);
  document.addEventListener('p66:change', renderSidebarLevel);

  let resizeT;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(render, 200); });

  render();
  showQuote();
  tickClock();
  setInterval(tickClock, 30000);
  setTimeout(maybeShowWhy, 1200);

  if (!S.state.settings.onboarded) onboarding();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
