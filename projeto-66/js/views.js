/* =============================================================
   PROJETO 66 — Views: renderização de todas as telas.
   Cada view expõe render() -> HTML e mount(root) para gráficos
   e comportamentos pós-render. Eventos usam data-action
   (delegação central em app.js).
   ============================================================= */
'use strict';

P66.Views = (() => {
  const S = () => P66.Store;
  const C = () => P66.Charts;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const ic = n => `<span class="i">${P66.icon(n)}</span>`;

  /* ---------- helpers ---------- */
  function habitStreak(id) {
    let n = 0, k = S().today();
    if (S().isDone(id, k)) n = 1;
    k = S().addDays(k, -1);
    while (S().day(k) && S().isDone(id, k)) { n++; k = S().addDays(k, -1); }
    return n;
  }

  function habitStatus(h) {
    const iso = S().doneAt(h.id);
    if (iso) {
      const d = new Date(iso);
      return { key: 'done', label: `Concluído às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` };
    }
    const now = new Date();
    const [hh, mm] = h.time.split(':').map(Number);
    if (hh * 60 + mm < now.getHours() * 60 + now.getMinutes()) return { key: 'late', label: 'Atrasado' };
    return { key: 'pending', label: `Às ${h.time}` };
  }

  function tile(label, value, sub, tone) {
    return `<div class="tile ${tone ? 'tile-' + tone : ''}">
      <span class="tile-label">${label}</span>
      <span class="tile-value">${value}</span>
      ${sub ? `<span class="tile-sub">${sub}</span>` : ''}
    </div>`;
  }

  function sectionHead(title, sub) {
    return `<div class="section-head"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;
  }

  function heatLegend() {
    const V = P66.VIZ;
    return `<div class="heat-legend"><span>Menos</span>
      ${[V.heatZero, ...V.heat].map(c => `<i style="background:${c}"></i>`).join('')}
      <span>Mais</span></div>`;
  }

  const PRIO = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

  function habitCard(h) {
    const st = habitStatus(h);
    const streak = habitStreak(h.id);
    return `<article class="habit-card ${st.key}" data-habit="${h.id}">
      <div class="habit-top">
        <span class="habit-icon">${P66.icon(h.icon)}</span>
        <span class="prio prio-${h.prio}">${PRIO[h.prio]}</span>
      </div>
      <h3 class="habit-name">${esc(h.name)}</h3>
      <p class="habit-goal">${esc(h.goal)}</p>
      <div class="habit-meta">
        <span title="Horário planejado">${ic('clock')}${h.time}</span>
        ${h.min ? `<span title="Tempo estimado">${h.min} min</span>` : ''}
        <span title="XP por conclusão">+${h.xp} XP</span>
      </div>
      <div class="habit-foot">
        <span class="habit-streak" title="Sequência de dias">${ic('flame')}${streak}</span>
        <span class="habit-status st-${st.key}">${st.label}</span>
        ${st.key === 'done'
          ? `<button class="btn btn-ghost btn-sm" data-action="undo-habit" data-id="${h.id}">Desfazer</button>`
          : `<button class="btn btn-primary btn-sm" data-action="complete-habit" data-id="${h.id}">Concluir</button>`}
      </div>
    </article>`;
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */
  const dashboard = {
    render() {
      const st = S();
      const c = st.completionForDay(st.today());
      const remaining = c.total - c.done;
      const lvl = st.levelInfo();
      const h = new Date().getHours();
      const saud = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
      return `
      <section class="hero">
        <p class="hero-kicker">Ciclo ${st.cycleNumber()} · ${st.fmtDateLong(st.today())}</p>
        <h1>${saud}, ${esc(st.state.profile.name)}.</h1>
        <p class="hero-line">Hoje é o <strong>Dia ${st.dayNumber()} de ${P66.CYCLE_DAYS}</strong>.</p>
        <p class="hero-line">${c.done > 0
          ? `Você já venceu <strong>${c.done} ${c.done === 1 ? 'batalha' : 'batalhas'}</strong> hoje. ${remaining > 0 ? `${remaining === 1 ? 'Falta' : 'Faltam'} <strong>${remaining}</strong>.` : ''}`
          : `<strong>${c.total} batalhas</strong> esperam por você hoje.`}</p>
      </section>

      <section class="mission-bar-wrap ${c.pct === 100 ? 'complete' : ''}">
        <div class="mission-bar-head">
          <span class="mission-bar-title">MISSÃO DO DIA</span>
          <span class="mission-bar-pct">${c.pct}%</span>
        </div>
        <div class="mission-bar"><div class="mission-bar-fill" style="width:${c.pct}%"></div></div>
        <p class="mission-bar-note">${P66.Claudi.headline()}</p>
      </section>

      <section class="quick-tiles">
        ${tile('Sequência atual', `${st.currentStreak()} <small>dias</small>`, `Recorde: ${st.bestStreak()}`)}
        ${tile('Patente', `Nv ${lvl.level}`, lvl.name)}
        ${tile('XP total', lvl.xp.toLocaleString('pt-BR'), lvl.next ? `${lvl.next.xp - lvl.xp} até ${lvl.next.name}` : 'Patente máxima')}
        ${tile('Dias restantes', st.daysLeft(), 'no ciclo de 66')}
      </section>

      ${sectionHead('Painel dos 10 hábitos', 'Cada cartão é uma batalha. Vença todas e o dia é seu.')}
      <section class="habit-grid">
        ${st.habits().map(habitCard).join('')}
      </section>`;
    },
    mount() {},
  };

  /* =========================================================
     HOJE — timeline
     ========================================================= */
  const hoje = {
    render() {
      const st = S();
      const habits = [...st.habits()].sort((a, b) => a.time.localeCompare(b.time));
      const next = st.nextHabit();
      const c = st.completionForDay(st.today());
      return `
      ${sectionHead('Hoje', `${st.fmtDateLong(st.today())} · ${c.done}/${c.total} concluídos`)}
      <section class="timeline">
        ${habits.map(h => {
          const stt = habitStatus(h);
          const isNext = next && next.id === h.id && stt.key !== 'done';
          return `<div class="tl-item ${stt.key} ${isNext ? 'next' : ''}">
            <span class="tl-time">${h.time}</span>
            <span class="tl-node"></span>
            <div class="tl-card" ${stt.key !== 'done' ? `data-action="complete-habit" data-id="${h.id}" role="button" tabindex="0"` : ''}>
              <span class="tl-icon">${P66.icon(h.icon)}</span>
              <div class="tl-body">
                <span class="tl-name">${esc(h.name)}</span>
                <span class="tl-meta">${h.min ? h.min + ' min · ' : ''}+${h.xp} XP${isNext ? ' · <strong>PRÓXIMO</strong>' : ''}</span>
              </div>
              <span class="tl-status st-${stt.key}">${stt.key === 'done' ? ic('check') : stt.key === 'late' ? ic('warning') : ''}${stt.label}</span>
            </div>
          </div>`;
        }).join('')}
      </section>`;
    },
    mount() {},
  };

  /* =========================================================
     MISSÕES
     ========================================================= */
  const missoes = {
    render() {
      const st = S();
      const list = st.missionsForDay();
      const done = list.filter(m => st.missionDone(m.id)).length;
      const xpToday = list.filter(m => st.missionDone(m.id)).reduce((s, m) => s + m.xp, 0);
      return `
      ${sectionHead('Missões do dia', 'Além dos hábitos: pequenas vitórias que constroem o homem integral. Renovadas diariamente.')}
      <section class="quick-tiles">
        ${tile('Cumpridas hoje', `${done}/${list.length}`)}
        ${tile('XP em missões hoje', `+${xpToday}`)}
        ${tile('Missões no total', st.missionsCount())}
      </section>
      <section class="mission-list">
        ${list.map(m => {
          const isDone = st.missionDone(m.id);
          return `<div class="mission-item ${isDone ? 'done' : ''}">
            <span class="mission-icon">${P66.icon(m.icon)}</span>
            <div class="mission-body">
              <span class="mission-name">${esc(m.name)}</span>
              <span class="mission-meta">+${m.xp} XP${m.areas.length ? ' · ' + m.areas.map(a => P66.AREAS[a].label).join(', ') : ''}</span>
            </div>
            ${isDone
              ? `<button class="btn btn-ghost btn-sm" data-action="undo-mission" data-id="${m.id}">Desfazer</button>`
              : `<button class="btn btn-primary btn-sm" data-action="complete-mission" data-id="${m.id}">Cumprir</button>`}
          </div>`;
        }).join('')}
      </section>
      <section class="card form-inline">
        <input type="text" id="new-mission-name" placeholder="Missão personalizada para hoje..." maxlength="80">
        <button class="btn btn-secondary" data-action="add-mission">${ic('plus')}Adicionar</button>
      </section>`;
    },
    mount() {},
  };

  /* =========================================================
     SALA DE GUERRA — gestão à vista
     ========================================================= */
  const guerra = {
    render() {
      const st = S();
      const lvl = st.levelInfo();
      const late = st.lateHabitsToday();
      return `
      ${sectionHead('Sala de Guerra', 'Gestão à vista: o estado real da operação, sem filtro.')}
      <section class="kpi-grid">
        ${tile('Dias restantes', st.daysLeft(), `Dia ${st.dayNumber()} de 66`)}
        ${tile('Hábitos concluídos', st.totalCompletions(), 'desde o início')}
        ${tile('Atrasados hoje', late.length, late.length ? 'recupere agora' : 'tudo em dia', late.length ? 'bad' : 'good')}
        ${tile('Maior sequência', `${st.bestStreak()} <small>dias</small>`)}
        ${tile('Sequência atual', `${st.currentStreak()} <small>dias</small>`)}
        ${tile('Dias perfeitos', st.perfectDays(), '', 'good')}
        ${tile('Dias quebrados', st.brokenDays(), 'neste ciclo', st.brokenDays() ? 'bad' : 'good')}
        ${tile('Execução geral', st.overallRate() + '%', 'do ciclo')}
        ${tile('Pontuação total', lvl.xp.toLocaleString('pt-BR'), `XP · Nível ${lvl.level} · ${lvl.name}`)}
      </section>

      <div class="grid-2">
        <section class="card">
          <h3 class="card-title">Evolução semanal</h3>
          <div id="ch-week" class="chart"></div>
        </section>
        <section class="card">
          <h3 class="card-title">Evolução mensal</h3>
          <div id="ch-month" class="chart"></div>
        </section>
      </div>

      <div class="grid-2">
        <section class="card">
          <h3 class="card-title">Mapa de calor — ciclo de 66 dias</h3>
          <div id="ch-heat" class="chart chart-heat"></div>
          ${heatLegend()}
        </section>
        <section class="card">
          <h3 class="card-title">Calendário de execução — ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
          <div id="ch-cal" class="chart"></div>
        </section>
      </div>`;
    },
    mount(root) {
      C().bars(root.querySelector('#ch-week'), S().weeklySeries());
      C().line(root.querySelector('#ch-month'), S().monthlySeries(30));
      C().heatmap(root.querySelector('#ch-heat'), S().heatmapCycle());
      const now = new Date();
      C().calendar(root.querySelector('#ch-cal'), now.getFullYear(), now.getMonth());
    },
  };

  /* =========================================================
     EVOLUÇÃO
     ========================================================= */
  const evolucao = {
    render() {
      const st = S();
      const minutes = st.minutesInvested();
      const hours = Math.floor(minutes / 60);
      const strength = st.habitStrength();
      const strong = strength[0], weakArr = strength.filter(x => x.opp >= 2), weak = weakArr[weakArr.length - 1];
      return `
      ${sectionHead('Evolução', 'Constância, horários e pontos fortes — os dados não mentem.')}
      <section class="quick-tiles">
        ${tile('Tempo investido', `${hours}h ${minutes % 60}min`, 'em hábitos concluídos')}
        ${tile('Hábito mais forte', strong ? `${strong.rate}%` : '—', strong ? esc(strong.habit.name) : '')}
        ${tile('Hábito mais fraco', weak ? `${weak.rate}%` : '—', weak ? esc(weak.habit.name) : '', weak && weak.rate < 60 ? 'bad' : '')}
        ${tile('Execução geral', st.overallRate() + '%', 'do ciclo')}
      </section>

      <section class="card">
        <h3 class="card-title">Constância — últimos 30 dias</h3>
        <div id="ev-month" class="chart"></div>
      </section>

      <div class="grid-2">
        <section class="card">
          <h3 class="card-title">Horários de execução</h3>
          <p class="card-sub">Em que hora do dia você vence as batalhas</p>
          <div id="ev-hours" class="chart"></div>
        </section>
        <section class="card">
          <h3 class="card-title">Dias da semana</h3>
          <p class="card-sub">Taxa média de execução por dia</p>
          <div id="ev-week" class="chart"></div>
        </section>
      </div>

      <section class="card">
        <h3 class="card-title">Força de cada hábito</h3>
        <p class="card-sub">Taxa de execução no ciclo atual · passe o mouse para detalhes</p>
        <div id="ev-strength"></div>
      </section>`;
    },
    mount(root) {
      const st = S();
      C().line(root.querySelector('#ev-month'), st.monthlySeries(30));
      const hist = st.hourHistogram();
      const maxH = Math.max(1, ...hist);
      C().bars(root.querySelector('#ev-hours'),
        hist.map((v, i) => ({ label: String(i).padStart(2, '0'), value: Math.round((v / maxH) * 100), raw: v }))
          .map(d => ({ ...d, pct: d.value, done: undefined })), { height: 160 });
      C().bars(root.querySelector('#ev-week'), st.weekdayRates().map(d => ({ label: d.label, pct: d.pct })), { height: 160 });
      C().hbars(root.querySelector('#ev-strength'), st.habitStrength().map(x => ({
        label: esc(x.habit.name), rate: x.rate,
        tip: `<strong>${esc(x.habit.name)}</strong><br>${x.done}/${x.opp} dias executado` + (x.avgDelay > 15 ? `<br>Atraso médio: ${x.avgDelay} min` : ''),
      })));
    },
  };

  /* =========================================================
     HOMEM INTEGRAL
     ========================================================= */
  const integral = {
    render() {
      const scores = S().areaScores();
      const weakest = [...scores].sort((a, b) => a.score - b.score)[0];
      return `
      ${sectionHead('Homem Integral', 'Nove áreas, uma vida. Nota 0–100 com base na execução dos últimos 14 dias.')}
      <section class="area-grid">
        ${scores.map(a => `
          <div class="area-card">
            <div class="area-ring">${C().ringSVG(a.score, { size: 96 })}</div>
            <span class="area-name">${ic(a.icon)}${a.label}</span>
          </div>`).join('')}
      </section>
      ${weakest ? `<section class="card callout">
        ${ic('target')}
        <div><strong>Frente prioritária: ${weakest.label} (${weakest.score}).</strong>
        Hábitos e missões dessa área merecem prioridade esta semana. Homem integral não deixa flanco aberto.</div>
      </section>` : ''}`;
    },
    mount() {},
  };

  /* =========================================================
     CLAUDI
     ========================================================= */
  const claudi = {
    render() {
      const items = P66.Claudi.briefing();
      return `
      <section class="claudi-head">
        <div class="claudi-avatar">${P66.icon('spark')}</div>
        <div>
          <h2>Claudi</h2>
          <p>${P66.Claudi.greeting()} Analisei sua execução — este é o relatório de hoje.</p>
        </div>
      </section>
      <section class="claudi-list">
        ${items.map(i => `
          <div class="claudi-item tone-${i.tone}">
            <span class="claudi-item-icon">${P66.icon(i.icon)}</span>
            <div>
              <strong>${i.title}</strong>
              <p>${i.text}</p>
            </div>
          </div>`).join('')}
      </section>
      <p class="claudi-foot">Análise 100% local, recalculada a cada abertura. Quanto mais dias registrados, mais afiado o relatório.</p>`;
    },
    mount() {},
  };

  /* =========================================================
     CONQUISTAS
     ========================================================= */
  const conquistas = {
    render() {
      const st = S();
      const unlocked = st.state.achievements;
      const n = Object.keys(unlocked).length;
      return `
      ${sectionHead('Conquistas', `${n} de ${P66.ACHIEVEMENTS.length} desbloqueadas. Medalhas não se compram — se conquistam.`)}
      <section class="badge-grid">
        ${P66.ACHIEVEMENTS.map(a => {
          const got = unlocked[a.id];
          return `<div class="badge ${got ? 'got' : 'locked'}">
            <span class="badge-icon">${P66.icon(a.icon)}</span>
            <strong>${a.name}</strong>
            <p>${a.desc}</p>
            <span class="badge-date">${got ? 'Conquistada em ' + st.fmtDate(got) : 'Bloqueada'}</span>
          </div>`;
        }).join('')}
      </section>`;
    },
    mount() {},
  };

  /* =========================================================
     REFLEXÃO — diário pesquisável
     ========================================================= */
  const QUESTIONS = [
    { id: 'bem', q: 'O que fiz bem hoje?' },
    { id: 'falha', q: 'Onde falhei?' },
    { id: 'melhorar', q: 'Como posso melhorar amanhã?' },
    { id: 'vitoria', q: 'Qual foi minha maior vitória?' },
    { id: 'deus', q: 'O que Deus me ensinou hoje?' },
  ];

  const reflexao = {
    render() {
      const st = S();
      const today = st.state.journal[st.today()] || {};
      const entries = st.searchJournal('');
      return `
      ${sectionHead('Reflexão do dia', 'Cinco perguntas, todas as noites. O homem que se examina não se perde.')}
      <section class="card">
        ${QUESTIONS.map(x => `
          <label class="field">
            <span>${x.q}</span>
            <textarea id="jr-${x.id}" rows="2" placeholder="...">${esc(today[x.id] || '')}</textarea>
          </label>`).join('')}
        <button class="btn btn-primary" data-action="save-journal">${ic('check')}Salvar reflexão</button>
        ${today.ts ? `<span class="saved-hint">Salva ${new Date(today.ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
      </section>

      ${sectionHead('Diário', `${entries.length} ${entries.length === 1 ? 'registro' : 'registros'} · busca inteligente`)}
      <section class="card form-inline">
        ${ic('search')}
        <input type="search" id="journal-search" placeholder="Buscar no diário... (ex.: treino, paciência, esposa)">
      </section>
      <section id="journal-list" class="journal-list">${reflexao.renderList(entries)}</section>`;
    },
    renderList(entries) {
      if (!entries.length) return '<p class="empty">Nenhum registro encontrado.</p>';
      return entries.map(e => `
        <article class="journal-entry">
          <header>${S().fmtDateLong(e.key)}</header>
          ${QUESTIONS.filter(x => e[x.id]).map(x => `<p><strong>${x.q}</strong> ${esc(e[x.id])}</p>`).join('') || '<p class="empty">—</p>'}
        </article>`).join('');
    },
    mount(root) {
      const input = root.querySelector('#journal-search');
      if (input) input.addEventListener('input', () => {
        root.querySelector('#journal-list').innerHTML = reflexao.renderList(S().searchJournal(input.value));
      });
    },
  };

  /* =========================================================
     RESPONSABILIDADE — prestação de contas
     ========================================================= */
  const responsabilidade = {
    render() {
      const st = S();
      const fail = st.lastFailure();
      return `
      ${sectionHead('Responsabilidade', 'Prestação de contas sem narrativa: números, causa e plano de correção.')}
      <section class="quick-tiles">
        ${tile('Dias consecutivos', `${st.currentStreak()} <small>dias</small>`, 'perfeitos em sequência')}
        ${tile('Dias quebrados', st.brokenDays(), 'neste ciclo', st.brokenDays() ? 'bad' : 'good')}
        ${tile('Execução geral', st.overallRate() + '%', 'do ciclo', st.overallRate() >= 80 ? 'good' : st.overallRate() >= 50 ? '' : 'bad')}
        ${tile('Última falha', fail ? st.fmtDate(fail.key) : '—', fail ? `${fail.missed.length} hábito(s) perdido(s)` : 'nenhuma registrada', fail ? 'bad' : 'good')}
      </section>

      ${fail ? `
      <section class="card">
        <h3 class="card-title">Análise da última falha — ${st.fmtDateLong(fail.key)}</h3>
        <p class="card-sub">Hábitos perdidos: ${fail.missed.map(esc).join(', ') || '—'}</p>
        <label class="field"><span>Motivo da falha</span>
          <textarea id="fail-motivo" rows="2" placeholder="O que realmente aconteceu? Sem desculpas, com fatos.">${esc(fail.note?.motivo || '')}</textarea>
        </label>
        <label class="field"><span>Plano de correção</span>
          <textarea id="fail-plano" rows="2" placeholder="O que muda para não repetir?">${esc(fail.note?.plano || '')}</textarea>
        </label>
        <button class="btn btn-primary" data-action="save-failure" data-key="${fail.key}">${ic('shield')}Registrar prestação de contas</button>
      </section>` : `
      <section class="card callout">${ic('shield')}<div><strong>Nenhuma falha registrada no ciclo.</strong> Continue assim — e quando falhar, volte aqui e preste contas. É isso que separa homens de meninos.</div></section>`}`;
    },
    mount() {},
  };

  /* =========================================================
     POR QUE CONTINUO?
     ========================================================= */
  const WHY_TYPES = {
    proposito: 'Propósito', objetivo: 'Objetivo', sonho: 'Sonho',
    promessa: 'Promessa', versiculo: 'Versículo', familia: 'Família',
  };
  const porque = {
    render() {
      const whys = S().state.whys;
      return `
      ${sectionHead('Por que continuo?', 'Quando a vontade faltar, esta tela lembra você do que está em jogo.')}
      <section class="card">
        <div class="form-grid">
          <select id="why-type">${Object.entries(WHY_TYPES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
          <input type="text" id="why-text" placeholder="Ex.: Ver meus filhos servindo a Deus. / Aposentar meus pais." maxlength="160">
          <label class="btn btn-ghost btn-file" title="Anexar foto">
            ${ic('camera')}<input type="file" id="why-photo" accept="image/*" hidden>
          </label>
          <button class="btn btn-primary" data-action="add-why">${ic('plus')}Adicionar</button>
        </div>
        <span id="why-photo-hint" class="saved-hint"></span>
      </section>
      <section class="why-grid">
        ${whys.length ? whys.map(w => `
          <article class="why-card">
            ${w.img ? `<img src="${w.img}" alt="">` : ''}
            <span class="why-type">${WHY_TYPES[w.type] || w.type}</span>
            <p>${esc(w.text)}</p>
            <button class="icon-btn why-del" data-action="remove-why" data-id="${w.id}" title="Remover">${P66.icon('trash')}</button>
          </article>`).join('')
        : '<p class="empty">Cadastre propósitos, sonhos, promessas e versículos. Eles aparecem automaticamente quando a execução cair — para lembrar você do porquê.</p>'}
      </section>`;
    },
    mount(root) {
      const photo = root.querySelector('#why-photo');
      if (photo) photo.addEventListener('change', () => {
        const hint = root.querySelector('#why-photo-hint');
        hint.textContent = photo.files[0] ? `Foto anexada: ${photo.files[0].name}` : '';
      });
    },
  };

  /* =========================================================
     CONFIGURAÇÕES
     ========================================================= */
  const config = {
    render() {
      const st = S();
      return `
      ${sectionHead('Configurações', 'Ajustes do sistema, backup e dados.')}
      <section class="card">
        <h3 class="card-title">Perfil</h3>
        <div class="form-grid">
          <input type="text" id="cfg-name" value="${esc(st.state.profile.name)}" maxlength="30" placeholder="Seu nome">
          <button class="btn btn-secondary" data-action="save-name">Salvar</button>
        </div>
        <label class="switch-row">
          <input type="checkbox" id="cfg-sound" ${st.state.settings.sound ? 'checked' : ''} data-action-change="toggle-sound">
          <span>Sons de vitória</span>
        </label>
      </section>

      <section class="card">
        <h3 class="card-title">Ciclo</h3>
        <p class="card-sub">Ciclo ${st.cycleNumber()} · Dia ${st.dayNumber()} de 66 · iniciado em ${st.fmtDate(st.currentCycleStartKey())}</p>
        <button class="btn btn-ghost" data-action="restart-cycle">${ic('reset')}Reiniciar ciclo a partir de hoje</button>
      </section>

      <section class="card">
        <h3 class="card-title">Backup & exportação</h3>
        <p class="card-sub">Seus dados vivem neste dispositivo (modo offline). Exporte regularmente.</p>
        <div class="btn-row">
          <button class="btn btn-secondary" data-action="export-json">${ic('download')}Exportar backup (JSON)</button>
          <label class="btn btn-secondary btn-file">${ic('upload')}Importar backup<input type="file" id="cfg-import" accept="application/json" hidden data-action-change="import-json"></label>
          <button class="btn btn-secondary" data-action="export-pdf">${ic('printer')}Relatório em PDF</button>
        </div>
      </section>

      <section class="card">
        <h3 class="card-title">Demonstração & dados</h3>
        <div class="btn-row">
          <button class="btn btn-ghost" data-action="seed-demo">${ic('spark')}Carregar 16 dias de demonstração</button>
          <button class="btn btn-danger" data-action="reset-all">${ic('trash')}Zerar tudo</button>
        </div>
      </section>

      <section class="card">
        <h3 class="card-title">Aplicativo</h3>
        <p class="card-sub">PWA instalável: no navegador, use "Instalar aplicativo" / "Adicionar à tela inicial" para ter o Projeto 66 como app — funciona offline. Atalhos de teclado: pressione <kbd>?</kbd>.</p>
      </section>`;
    },
    mount() {},
  };

  return { dashboard, hoje, missoes, guerra, evolucao, integral, claudi, conquistas, reflexao, responsabilidade, porque, config };
})();
