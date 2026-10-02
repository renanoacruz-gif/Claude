// UI: roteamento por hash, renderização por template e delegação de eventos.
(function () {
  const C = window.Catalog;
  const K = window.Calc;
  const S = window.Store;
  const app = document.getElementById('app');

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDT = (iso) => (iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '');
  const fmtD = (iso) => (iso ? new Date(iso + (iso.length === 10 ? 'T12:00' : '')).toLocaleDateString('pt-BR') : '');
  const lines = (txt) => String(txt || '').split('\n').map((x) => x.trim()).filter(Boolean);
  const db = () => S.db;

  let saveTimer = null;
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(S.save, 300); }

  // ---------- Componentes ----------
  function field(label, id, bind, value, opt = {}) {
    const attrs = `id="${id}" data-bind="${esc(bind)}"${opt.placeholder ? ` placeholder="${esc(opt.placeholder)}"` : ''}${opt.required ? ' required' : ''}`;
    let input;
    if (opt.type === 'textarea') input = `<textarea ${attrs} rows="${opt.rows || 3}">${esc(value)}</textarea>`;
    else if (opt.type === 'select') input = `<select ${attrs}>${opt.options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o || '—']; return `<option value="${esc(v)}"${String(v) === String(value ?? '') ? ' selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`;
    else input = `<input ${attrs} type="${opt.type || 'text'}" value="${esc(value)}"${opt.inputmode ? ` inputmode="${opt.inputmode}"` : ''}${opt.list ? ` list="${opt.list}"` : ''}>`;
    return `<label class="field${opt.wide ? ' wide' : ''}"><span>${esc(label)}${opt.required ? ' *' : ''}</span>${input}${opt.hint ? `<small>${esc(opt.hint)}</small>` : ''}</label>`;
  }

  const badge = (list, id, cls) => `<span class="badge ${cls}-${id}">${esc(C.labelOf(list, id))}</span>`;
  const unitOptions = (preferred) => [...new Set([...(preferred || []), ...C.UNITS])];

  // ---------- Regras de revisão ----------
  function reviewPayload(job) {
    const c = S.client(job.clientId) || {};
    return {
      client: { name: c.name, phone: c.phone, email: c.email, address: c.address },
      specialties: job.specialties, request: job.request, estimateType: job.estimateType, evaluation: job.evaluation,
      tasks: job.tasks, items: job.items, discount: job.discount, scope: job.scope,
      paymentTerms: job.paymentTerms, validityDays: job.validityDays,
    };
  }
  const reviewValid = (job) => !!job.review && job.review.hash === K.hash(reviewPayload(job));

  function checks(job) {
    const c = S.client(job.clientId);
    const blocking = [];
    const warnings = [];
    if (!c || !c.name.trim()) blocking.push('Informe o nome do cliente.');
    if (!job.specialties.length) blocking.push('Selecione ao menos uma especialidade no pedido.');
    if (!job.items.length) blocking.push('Adicione ao menos um item ao orçamento.');
    job.items.forEach((it, i) => {
      const n = `Item ${i + 1}${it.description ? ` (“${it.description}”)` : ''}`;
      if (!it.description.trim()) blocking.push(`${n}: descrição vazia.`);
      if (!Number.isInteger(it.qtyMilli) || it.qtyMilli <= 0) blocking.push(`${n}: quantidade não informada.`);
      if (!Number.isInteger(it.priceCents)) blocking.push(`${n}: preço não informado.`);
      if (!it.unit) blocking.push(`${n}: unidade não informada.`);
      if (!it.taskId) warnings.push(`${n} não está vinculado a nenhuma tarefa.`);
    });
    if (job.evaluation !== 'ready' && job.estimateType === 'firm') {
      blocking.push(`Avaliação em “${C.labelOf(C.EVALUATION, job.evaluation)}”: salve como “Estimativa preliminar” ou “Aguardando visita técnica”, ou marque a avaliação como pronta.`);
    }
    if (!String(job.paymentTerms || '').trim()) blocking.push('Informe as condições de pagamento.');
    if (!(Number(job.validityDays) > 0)) blocking.push('Informe a validade do orçamento em dias.');
    job.tasks.forEach((t) => {
      if (!job.items.some((it) => it.taskId === t.id)) warnings.push(`Tarefa “${t.title}” sem itens de preço.`);
      if (!(t.inclusions || []).length) warnings.push(`Tarefa “${t.title}” sem inclusões descritas.`);
    });
    if (!job.scope.trim()) warnings.push('Escopo em branco.');
    if (!job.request.address && !(c && c.address)) warnings.push('Endereço de execução não informado.');
    return { blocking, warnings };
  }

  // ---------- Layout ----------
  function shell(content, active) {
    const nav = [['#/', 'Acompanhamento', 'home'], ['#/novo', '+ Novo pedido', 'new'], ['#/clientes', 'Clientes', 'clients'], ['#/catalogo', 'Serviços', 'catalog'], ['#/config', 'Configurações', 'settings']];
    return `<header class="top"><a class="brand" href="#/">OrçaPro</a><nav>${nav.map(([h, l, k]) => `<a href="${h}" class="${k === active ? 'on' : ''}">${l}</a>`).join('')}</nav></header><main>${content}</main>`;
  }

  // ---------- Onboarding ----------
  let wiz = null;
  function initWiz() {
    const s = db().settings;
    wiz = {
      step: 1,
      provider: { ...s.provider },
      specialties: [...s.specialties],
      services: {}, // spec -> [{name, unit, priceText, on}]
      billingModes: [...s.billingModes],
      paymentTerms: s.paymentTerms || '',
      validityDays: s.validityDays || 15,
    };
  }
  function ensureWizServices() {
    for (const sp of wiz.specialties) {
      if (!wiz.services[sp]) wiz.services[sp] = C.specialty(sp).services.map((x) => ({ name: x.name, unit: x.unit, priceText: '', on: true }));
    }
  }

  function viewSetup() {
    if (!wiz) initWiz();
    const steps = ['Seus dados', 'Especialidades', 'Serviços', 'Cobrança', 'Condições'];
    let body = '';
    if (wiz.step === 1) {
      const p = wiz.provider;
      body = `<h2>Nome e dados do prestador ou empresa</h2><div class="grid">
        ${field('Nome / empresa', 'w-name', 'wiz:provider.name', p.name, { required: true })}
        ${field('CPF / CNPJ', 'w-doc', 'wiz:provider.doc', p.doc)}
        ${field('Telefone / WhatsApp', 'w-phone', 'wiz:provider.phone', p.phone)}
        ${field('E-mail', 'w-email', 'wiz:provider.email', p.email, { type: 'email' })}
        ${field('Endereço', 'w-addr', 'wiz:provider.address', p.address)}
        ${field('Cidade / UF', 'w-city', 'wiz:provider.city', p.city)}</div>`;
    } else if (wiz.step === 2) {
      body = `<h2>Quais especialidades você atende?</h2><p class="muted">Selecione uma ou várias. Os campos do pedido e os modelos de proposta se adaptam a elas.</p>
        <div class="cards">${C.SPECIALTIES.map((s) => `<label class="card check"><input type="checkbox" data-action="wiz-spec" value="${s.id}"${wiz.specialties.includes(s.id) ? ' checked' : ''}><strong>${esc(s.label)}</strong></label>`).join('')}</div>`;
    } else if (wiz.step === 3) {
      ensureWizServices();
      body = `<h2>Serviços oferecidos</h2><p class="muted">Sugestões editáveis, <strong>sem preços</strong>. Desmarque o que não faz, ajuste nomes e unidades e informe seus valores (pode deixar para depois).</p>
        ${wiz.specialties.map((sp) => `<section class="panel"><h3>${esc(C.specialty(sp).label)}</h3>
          <table class="tbl"><thead><tr><th></th><th>Serviço</th><th>Unidade</th><th>Seu preço (R$)</th></tr></thead><tbody>
          ${wiz.services[sp].map((x, i) => `<tr><td><input type="checkbox" data-action="wiz-svc-on" data-sp="${sp}" data-i="${i}"${x.on ? ' checked' : ''}></td>
            <td><input id="ws-${sp}-${i}-n" data-bind="wizsvc:${sp}:${i}:name" value="${esc(x.name)}"></td>
            <td><select id="ws-${sp}-${i}-u" data-bind="wizsvc:${sp}:${i}:unit">${unitOptions(C.specialty(sp).units).map((u) => `<option${u === x.unit ? ' selected' : ''}>${esc(u)}</option>`).join('')}</select></td>
            <td><input id="ws-${sp}-${i}-p" data-bind="wizsvc:${sp}:${i}:priceText" value="${esc(x.priceText)}" inputmode="decimal" placeholder="a definir"></td></tr>`).join('')}
          </tbody></table><button class="btn ghost" data-action="wiz-svc-add" data-sp="${sp}">+ Serviço personalizado</button></section>`).join('')}`;
    } else if (wiz.step === 4) {
      body = `<h2>Como você costuma cobrar?</h2><p class="muted">Essas unidades aparecem primeiro ao montar orçamentos.</p>
        <div class="cards">${C.BILLING_MODES.map((m) => `<label class="card check"><input type="checkbox" data-action="wiz-bill" value="${esc(m.id)}"${wiz.billingModes.includes(m.id) ? ' checked' : ''}><strong>${esc(m.label)}</strong></label>`).join('')}</div>`;
    } else {
      body = `<h2>Condições de pagamento e validade</h2><div class="grid">
        ${field('Condições de pagamento', 'w-pay', 'wiz:paymentTerms', wiz.paymentTerms, { type: 'textarea', wide: true, placeholder: 'Ex.: 50% na aprovação e 50% na conclusão. PIX ou cartão.', required: true })}
        ${field('Validade do orçamento (dias)', 'w-val', 'wiz:validityDays', wiz.validityDays, { type: 'number', required: true })}</div>`;
    }
    const err = wizError();
    return `<div class="setup"><h1>Configuração inicial</h1>
      <ol class="steps">${steps.map((s, i) => `<li class="${i + 1 === wiz.step ? 'on' : i + 1 < wiz.step ? 'done' : ''}">${s}</li>`).join('')}</ol>
      <div class="panel">${body}</div>
      ${err ? `<p class="error">${esc(err)}</p>` : ''}
      <div class="actions">${wiz.step > 1 ? '<button class="btn ghost" data-action="wiz-back">Voltar</button>' : '<span></span>'}
      <button class="btn" data-action="wiz-next"${err ? ' disabled' : ''}>${wiz.step === 5 ? 'Concluir' : 'Continuar'}</button></div></div>`;
  }

  function wizError() {
    if (wiz.step === 1 && !wiz.provider.name.trim()) return 'Informe o nome do prestador ou empresa.';
    if (wiz.step === 2 && !wiz.specialties.length) return 'Selecione ao menos uma especialidade.';
    if (wiz.step === 3) {
      for (const sp of wiz.specialties) for (const x of wiz.services[sp] || []) {
        if (x.on && x.priceText && K.parseMoney(x.priceText) === null) return `Preço inválido em “${x.name}”. Use o formato 150,00.`;
      }
    }
    if (wiz.step === 4 && !wiz.billingModes.length) return 'Selecione ao menos uma forma de cobrança.';
    if (wiz.step === 5 && (!wiz.paymentTerms.trim() || !(Number(wiz.validityDays) > 0))) return 'Informe condições de pagamento e validade.';
    return '';
  }

  function finishWiz() {
    const s = db().settings;
    s.provider = wiz.provider;
    s.specialties = wiz.specialties;
    s.billingModes = wiz.billingModes;
    s.paymentTerms = wiz.paymentTerms;
    s.validityDays = Number(wiz.validityDays);
    for (const sp of wiz.specialties) {
      for (const x of wiz.services[sp] || []) {
        if (!x.on || !x.name.trim()) continue;
        const exists = db().catalog.find((c) => c.specialty === sp && c.name.toLowerCase() === x.name.trim().toLowerCase());
        if (exists) { exists.unit = x.unit; if (x.priceText) exists.priceCents = K.parseMoney(x.priceText); continue; }
        const custom = !C.specialty(sp).services.some((d) => d.name === x.name);
        db().catalog.push({ id: S.uid(), specialty: sp, name: x.name.trim(), unit: x.unit, priceCents: x.priceText ? K.parseMoney(x.priceText) : null, custom });
      }
    }
    s.onboarded = true;
    S.save();
    wiz = null;
    location.hash = '#/';
  }

  // ---------- Acompanhamento ----------
  const filters = { commercial: '', evaluation: '', q: '' };
  function viewHome() {
    const jobs = db().jobs.filter((j) => {
      const c = S.client(j.clientId);
      if (filters.commercial && j.commercial !== filters.commercial) return false;
      if (filters.evaluation && j.evaluation !== filters.evaluation) return false;
      if (filters.q && !`${j.number} ${c?.name || ''} ${j.request.description}`.toLowerCase().includes(filters.q.toLowerCase())) return false;
      return true;
    });
    const count = (k, v) => db().jobs.filter((j) => j[k] === v).length;
    const sum = (v) => db().jobs.filter((j) => j.commercial === v).reduce((a, j) => a + K.totals(j.items, j.discount).total, 0);
    const today = new Date().toISOString().slice(0, 10);
    const due = db().jobs.filter((j) => j.followUp && j.followUp <= today && ['draft', 'sent'].includes(j.commercial));
    return shell(`<div class="kpis">
        <div class="kpi"><span>Rascunhos</span><strong>${count('commercial', 'draft')}</strong></div>
        <div class="kpi"><span>Enviados</span><strong>${count('commercial', 'sent')}</strong><small>${K.formatBRL(sum('sent'))}</small></div>
        <div class="kpi"><span>Aprovados</span><strong>${count('commercial', 'approved')}</strong><small>${K.formatBRL(sum('approved'))}</small></div>
        <div class="kpi"><span>Aguardando visita</span><strong>${count('evaluation', 'awaiting_visit')}</strong></div></div>
      ${due.length ? `<div class="panel warn"><strong>Retornos para hoje ou atrasados:</strong> ${due.map((j) => `<a href="#/pedido/${j.id}/acompanhamento">${esc(j.number)} – ${esc(S.client(j.clientId)?.name || '')}</a>`).join(', ')}</div>` : ''}
      <div class="toolbar">
        <input id="f-q" data-bind="filter:q" placeholder="Buscar nº, cliente ou descrição" value="${esc(filters.q)}">
        <select id="f-c" data-bind="filter:commercial"><option value="">Status comercial: todos</option>${C.COMMERCIAL.map((s) => `<option value="${s.id}"${filters.commercial === s.id ? ' selected' : ''}>${s.label}</option>`).join('')}</select>
        <select id="f-e" data-bind="filter:evaluation"><option value="">Avaliação: todas</option>${C.EVALUATION.map((s) => `<option value="${s.id}"${filters.evaluation === s.id ? ' selected' : ''}>${s.label}</option>`).join('')}</select>
        <a class="btn" href="#/novo">+ Novo pedido</a></div>
      ${jobs.length ? `<table class="tbl list"><thead><tr><th>Nº</th><th>Cliente</th><th>Especialidades</th><th>Avaliação</th><th>Tipo</th><th>Comercial</th><th class="r">Total</th><th>Retorno</th><th>Atualizado</th></tr></thead><tbody>
        ${jobs.map((j) => `<tr data-href="#/pedido/${j.id}/pedido"><td>${esc(j.number)}</td><td>${esc(S.client(j.clientId)?.name || '—')}</td>
          <td>${j.specialties.map((s) => esc(C.specialty(s).short)).join(', ') || '—'}</td>
          <td>${badge(C.EVALUATION, j.evaluation, 'ev')}</td><td>${esc(C.labelOf(C.ESTIMATE_TYPES, j.estimateType))}</td>
          <td>${badge(C.COMMERCIAL, j.commercial, 'cm')}${j.review && !reviewValid(j) ? ' <span class="badge stale">alterado</span>' : ''}</td>
          <td class="r">${K.formatBRL(K.totals(j.items, j.discount).total)}</td><td>${fmtD(j.followUp)}</td><td>${fmtDT(j.updatedAt)}</td></tr>`).join('')}
        </tbody></table>` : '<p class="empty">Nenhum pedido encontrado.</p>'}`, 'home');
  }

  // ---------- Novo pedido ----------
  function viewNew() {
    const clients = db().clients;
    return shell(`<h1>Novo pedido</h1><div class="panel"><h2>1. Cliente</h2>
      ${clients.length ? `<div class="row"><select id="n-client"><option value="">Selecione um cliente existente…</option>${clients.map((c) => `<option value="${c.id}">${esc(c.name)}${c.phone ? ' · ' + esc(c.phone) : ''}</option>`).join('')}</select>
      <button class="btn" data-action="new-existing">Usar cliente</button></div><p class="muted">ou cadastre um novo:</p>` : ''}
      <div class="grid">${field('Nome', 'n-name', 'tmp:name', '', { required: true })}${field('Telefone / WhatsApp', 'n-phone', 'tmp:phone', '')}
      ${field('E-mail', 'n-email', 'tmp:email', '')}${field('Endereço', 'n-addr', 'tmp:address', '')}</div>
      <button class="btn" data-action="new-client">Criar cliente e pedido</button>
      <p class="muted">Dica: se só tem a mensagem do cliente, crie o pedido com o nome e use o assistente para organizar o restante.</p></div>`, 'new');
  }

  // ---------- Pedido ----------
  const TABS = [['pedido', '1. Pedido'], ['itens', '2. Serviços e materiais'], ['orcamento', '3. Orçamento'], ['revisao', '4. Revisão e PDF'], ['acompanhamento', '5. Acompanhamento']];
  const aiState = {}; // jobId -> {loading, error, result}

  function viewJob(id, tab) {
    const job = S.job(id);
    if (!job) return shell('<p class="empty">Pedido não encontrado.</p>', '');
    const c = S.client(job.clientId) || {};
    const t = K.totals(job.items, job.discount);
    const valid = reviewValid(job);
    const head = `<div class="jobhead"><div><h1>${esc(job.number)} · ${esc(c.name || 'Sem cliente')}</h1>
      <div class="badges">${badge(C.EVALUATION, job.evaluation, 'ev')} ${badge(C.COMMERCIAL, job.commercial, 'cm')} <span class="badge">${esc(C.labelOf(C.ESTIMATE_TYPES, job.estimateType))}</span>
      ${job.review ? (valid ? `<span class="badge ok">Revisado v${job.review.version}</span>` : '<span class="badge stale">Alterado após revisão</span>') : '<span class="badge">Não revisado</span>'}</div></div>
      <div class="total">${K.formatBRL(t.total)}</div></div>
      <nav class="tabs">${TABS.map(([k, l]) => `<a href="#/pedido/${id}/${k}" class="${k === tab ? 'on' : ''}">${l}</a>`).join('')}</nav>`;
    const views = { pedido: tabRequest, itens: tabItems, orcamento: tabQuote, revisao: tabReview, acompanhamento: tabTrack };
    return shell(head + (views[tab] || tabRequest)(job, c), '');
  }

  function tabRequest(job, c) {
    const r = job.request;
    const mySpecs = db().settings.specialties;
    const specList = [...new Set([...mySpecs, ...job.specialties])];
    const extra = job.specialties.map((sp) => `<section class="panel spec"><h3>${esc(C.specialty(sp).label)}</h3><div class="grid">
      ${C.EXTRA_FIELDS[sp].map((f) => {
        const v = (r.extra[sp] || {})[f.key] ?? '';
        const id = `x-${sp}-${f.key}`;
        const bind = `extra:${sp}:${f.key}`;
        if (f.type === 'yesno') return field(f.label, id, bind, v, { type: 'select', options: [['', '—'], ['Sim', 'Sim'], ['Não', 'Não']] });
        return field(f.label, id, bind, v, { type: f.type === 'number' ? 'text' : f.type, options: f.options, placeholder: f.placeholder, inputmode: f.type === 'number' ? 'numeric' : '', wide: f.type === 'textarea' });
      }).join('')}</div></section>`).join('');

    return `<div class="cols2"><div>
      <section class="panel"><h2>Cliente e contato</h2><div class="grid">
        ${field('Nome', 'c-name', `client:${c.id}:name`, c.name, { required: true })}
        ${field('Telefone / WhatsApp', 'c-phone', `client:${c.id}:phone`, c.phone)}
        ${field('E-mail', 'c-email', `client:${c.id}:email`, c.email)}
        ${field('Endereço do cliente', 'c-addr', `client:${c.id}:address`, c.address)}</div></section>
      <section class="panel"><h2>Especialidades deste pedido</h2>
        <div class="chips">${specList.map((sp) => `<label class="chip"><input type="checkbox" data-action="job-spec" value="${sp}"${job.specialties.includes(sp) ? ' checked' : ''}> ${esc(C.specialty(sp).short)}</label>`).join('')}
        ${C.SPECIALTIES.filter((s) => !specList.includes(s.id)).map((s) => `<label class="chip off"><input type="checkbox" data-action="job-spec" value="${s.id}"> ${esc(s.short)} <small>(não cadastrada)</small></label>`).join('')}</div>
        <p class="muted">Só os campos das especialidades marcadas aparecem abaixo. Nenhum é obrigatório.</p></section>
      <section class="panel"><h2>Pedido</h2><div class="grid">
        ${field('Endereço de execução', 'r-addr', 'req:address', r.address, { wide: true, placeholder: c.address || '' })}
        ${field('Descrição do pedido', 'r-desc', 'req:description', r.description, { type: 'textarea', wide: true })}
        ${field('Serviço solicitado', 'r-svc', 'req:requestedService', r.requestedService)}
        ${field('Quantidades ou medidas (se conhecidas)', 'r-meas', 'req:measures', r.measures)}
        ${field('Materiais fornecidos por', 'r-mat', 'req:materialsBy', r.materialsBy, { list: 'dl-mat' })}
        ${field('Condições de acesso ao local', 'r-acc', 'req:access', r.access)}
        ${field('Prazo desejado', 'r-dl', 'req:deadline', r.deadline)}
        ${field('Necessita visita técnica?', 'r-visit', 'req:needsVisit', r.needsVisit, { type: 'select', options: [['', '—'], ['Sim', 'Sim'], ['Não', 'Não'], ['A definir', 'A definir']] })}
        ${field('Observações', 'r-notes', 'req:notes', r.notes, { type: 'textarea', wide: true })}</div>
        <datalist id="dl-mat"><option>Cliente</option><option>Prestador</option><option>Parte cliente, parte prestador</option><option>A definir</option></datalist></section>
      ${extra}
      <section class="panel"><h2>Etapa de avaliação</h2><div class="grid">
        ${field('Avaliação', 'j-eval', 'job:evaluation', job.evaluation, { type: 'select', options: C.EVALUATION.map((e) => [e.id, e.label]) })}
        ${field('Tipo de documento', 'j-type', 'job:estimateType', job.estimateType, { type: 'select', options: C.ESTIMATE_TYPES.map((e) => [e.id, e.label]) })}</div>
        <div class="row"><button class="btn ghost" data-action="mark-prelim">Salvar como Estimativa preliminar</button>
        <button class="btn ghost" data-action="mark-visit">Salvar como Aguardando visita técnica</button>
        <button class="btn ghost" data-action="mark-ready">Pronto para orçamento</button></div>
        <p class="muted">A etapa de avaliação é independente do status comercial (rascunho, enviado, aprovado, perdido).</p></section>
      <div class="actions"><span></span><a class="btn" href="#/pedido/${job.id}/itens">Próximo: serviços e materiais →</a></div>
    </div><aside>${aiPanel(job)}</aside></div>`;
  }

  // ---------- Assistente ----------
  function aiPanel(job) {
    const st = aiState[job.id] || {};
    const hasKey = !!db().settings.ai.apiKey;
    let res = '';
    if (st.result) {
      const r = st.result;
      const catOpts = (spec) => db().catalog.filter((c) => !spec || c.specialty === spec);
      res = `<div class="ai-result"><p class="muted">Modo: ${r.mode === 'claude' ? 'IA (Claude)' : 'local, por regras'} · revise e confirme o que deve entrar no pedido.</p>
        <h4>Especialidade provável</h4>${r.specialties.length ? r.specialties.map((s) => `<label class="line"><input type="checkbox" data-ai="spec" value="${s.id}"${job.specialties.includes(s.id) ? ' checked disabled' : ''}> ${esc(C.specialty(s.id).label)} <small>“${esc(s.evidence)}”</small></label>`).join('') : '<p class="muted">Não identificada.</p>'}
        <h4>Informações encontradas na mensagem</h4>${r.fields.length ? r.fields.map((f, i) => `<label class="line"><input type="checkbox" data-ai="field" value="${i}"> <strong>${esc(f.label)}:</strong> ${esc(f.value)}</label>`).join('') : '<p class="muted">Nenhuma.</p>'}
        <h4>Tarefas solicitadas</h4>${r.tasks.length ? r.tasks.map((t, i) => {
          const sug = r.suggestions.find((s) => s.taskIndex === i);
          return `<div class="line task-sug"><label><input type="checkbox" data-ai="task" value="${i}"> ${esc(t.description)}${t.quantity ? ` <small>qtd. informada: ${esc(t.quantity)}</small>` : ''}</label>
            <select data-ai-cat="${i}"><option value="">Sem item do catálogo</option>${catOpts(t.specialty).map((c) => `<option value="${c.id}"${sug && sug.catalogId === c.id ? ' selected' : ''}>${esc(c.name)} (${esc(c.unit)})${sug && sug.catalogId === c.id ? ' — sugerido' : ''}</option>`).join('')}</select></div>`;
        }).join('') : '<p class="muted">Nenhuma tarefa identificada.</p>'}
        <button class="btn" data-action="ai-apply">Aplicar itens selecionados</button>
        <h4>Dados faltantes</h4>${r.missing.length ? `<ul>${r.missing.map((m) => `<li><strong>${esc(m.item)}</strong>${m.reason ? ` — ${esc(m.reason)}` : ''}</li>`).join('')}</ul>
          <div class="row"><button class="btn ghost sm" data-action="mark-prelim">Estimativa preliminar</button><button class="btn ghost sm" data-action="mark-visit">Aguardando visita</button></div>` : '<p class="muted">Nenhum apontado.</p>'}
        <h4>Perguntas sugeridas ao cliente</h4>${r.questions.length ? `<ol>${r.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ol><button class="btn ghost sm" data-action="ai-copy-q">Copiar perguntas</button>` : '<p class="muted">Nenhuma.</p>'}</div>`;
    }
    return `<section class="panel ai"><h2>Assistente de triagem</h2>
      <p class="muted">Cole a mensagem do cliente. O assistente só organiza o que foi escrito — não diagnostica, não estima medidas, preços ou quantidades e nada é adicionado sem sua confirmação.${hasKey ? '' : ' <em>Sem chave de API: usando extrator local.</em>'}</p>
      <textarea id="ai-msg" data-bind="job:rawMessage" rows="7" placeholder="Ex.: Oi! Preciso instalar 2 splits de 12000 BTU no apto, 5º andar, e trocar a torneira da cozinha que está vazando…">${esc(job.rawMessage)}</textarea>
      <button class="btn" data-action="ai-run"${st.loading ? ' disabled' : ''}>${st.loading ? 'Analisando…' : 'Analisar mensagem'}</button>
      ${st.error ? `<p class="error">${esc(st.error)}</p>` : ''}${res}</section>`;
  }

  async function runAI(job) {
    if (!job.rawMessage.trim()) return;
    aiState[job.id] = { loading: true };
    render();
    try {
      const result = await window.AI.analyze(job.rawMessage, { settings: db().settings, catalog: db().catalog });
      aiState[job.id] = { result };
      S.log(job, `Mensagem do cliente analisada (${result.mode === 'claude' ? 'IA' : 'modo local'})`);
      S.save();
    } catch (e) {
      aiState[job.id] = { error: e.message || String(e) };
    }
    render();
  }

  function addTask(job, specialty, title) {
    const tpl = C.specialty(specialty)?.template || { inclusions: [], exclusions: [] };
    const task = { id: S.uid(), specialty, title, inclusions: [...tpl.inclusions], exclusions: [...tpl.exclusions] };
    job.tasks.push(task);
    if (!job.specialties.includes(specialty)) job.specialties.push(specialty);
    return task;
  }

  function itemFromCatalog(cat, taskId, qtyMilli) {
    return { id: S.uid(), category: 'labor', taskId, description: cat.name, qtyMilli: qtyMilli ?? null, unit: cat.unit, priceCents: cat.priceCents ?? null, catalogId: cat.id };
  }

  function applyAI(job) {
    const r = (aiState[job.id] || {}).result;
    if (!r) return;
    const checked = (kind) => [...app.querySelectorAll(`[data-ai="${kind}"]:checked:not(:disabled)`)].map((el) => el.value);
    const c = S.client(job.clientId);
    let n = 0;
    for (const sp of checked('spec')) if (!job.specialties.includes(sp)) { job.specialties.push(sp); n++; }
    for (const i of checked('field')) {
      const f = r.fields[i];
      if (f.scope === 'common') {
        const map = { client_name: () => { if (c) c.name = f.value; }, phone: () => { if (c) c.phone = f.value; }, email: () => { if (c) c.email = f.value; },
          address: () => { job.request.address = f.value; }, deadline: () => { job.request.deadline = f.value; }, access: () => { job.request.access = f.value; },
          materials_by: () => { job.request.materialsBy = f.value; }, measures: () => { job.request.measures = f.value; } };
        (map[f.key] || (() => {}))();
      } else {
        job.request.extra[f.scope] = job.request.extra[f.scope] || {};
        job.request.extra[f.scope][f.key] = f.value;
        if (!job.specialties.includes(f.scope)) job.specialties.push(f.scope);
      }
      n++;
    }
    for (const i of checked('task')) {
      const t = r.tasks[i];
      const spec = t.specialty || job.specialties[0] || db().settings.specialties[0];
      const task = addTask(job, spec, t.description);
      const catId = app.querySelector(`[data-ai-cat="${i}"]`)?.value;
      const cat = catId && S.catalogItem(catId);
      if (cat) {
        // Só usa a quantidade se ela veio escrita pelo cliente (número explícito).
        const m = t.quantity && t.quantity.match(/\d+(?:[.,]\d+)?/);
        job.items.push(itemFromCatalog(cat, task.id, m ? K.parseQty(m[0]) : null));
      }
      n++;
    }
    if (!n) { alert('Selecione ao menos um item para aplicar.'); return; }
    S.log(job, `Sugestões do assistente confirmadas (${n} item(ns))`);
    S.save();
    render();
  }

  // ---------- Serviços e materiais ----------
  function tabItems(job) {
    const specUnits = (taskId) => {
      const t = job.tasks.find((x) => x.id === taskId);
      return unitOptions([...db().settings.billingModes, ...(t ? C.specialty(t.specialty).units : [])]);
    };
    const taskOpts = (sel) => `<option value="">— geral —</option>${job.tasks.map((t) => `<option value="${t.id}"${t.id === sel ? ' selected' : ''}>${esc(t.title)}</option>`).join('')}`;
    const t = K.totals(job.items, job.discount);
    const specs = job.specialties.length ? job.specialties : db().settings.specialties;

    const tasks = job.tasks.map((task) => `<div class="task-card"><div class="row">
        <select id="t-${task.id}-s" data-bind="task:${task.id}:specialty">${C.SPECIALTIES.map((s) => `<option value="${s.id}"${s.id === task.specialty ? ' selected' : ''}>${esc(s.short)}</option>`).join('')}</select>
        <input id="t-${task.id}-t" class="grow" data-bind="task:${task.id}:title" value="${esc(task.title)}" placeholder="Título da tarefa">
        <button class="btn ghost sm danger" data-action="task-del" data-id="${task.id}">Remover</button></div>
      <div class="grid">${field('Incluso no valor (uma por linha)', `t-${task.id}-i`, `task:${task.id}:inclusions`, (task.inclusions || []).join('\n'), { type: 'textarea' })}
      ${field('Não incluso (uma por linha)', `t-${task.id}-e`, `task:${task.id}:exclusions`, (task.exclusions || []).join('\n'), { type: 'textarea' })}</div></div>`).join('');

    const itemRows = (cat) => job.items.filter((it) => it.category === cat).map((it) => `<tr>
      <td><input id="i-${it.id}-d" data-bind="item:${it.id}:description" value="${esc(it.description)}" placeholder="Descrição"></td>
      <td><select id="i-${it.id}-t" data-bind="item:${it.id}:taskId">${taskOpts(it.taskId)}</select></td>
      <td><input id="i-${it.id}-q" class="num" data-bind="item:${it.id}:qty" value="${esc(K.formatQty(it.qtyMilli))}" inputmode="decimal" placeholder="qtd."></td>
      <td><select id="i-${it.id}-u" data-bind="item:${it.id}:unit">${specUnits(it.taskId).map((u) => `<option${u === it.unit ? ' selected' : ''}>${esc(u)}</option>`).join('')}</select></td>
      <td><input id="i-${it.id}-p" class="num" data-bind="item:${it.id}:price" value="${esc(K.formatMoneyInput(it.priceCents))}" inputmode="decimal" placeholder="preço"></td>
      <td class="r" data-total-for="${it.id}">${K.formatBRL(K.lineTotal(it))}</td>
      <td><select id="i-${it.id}-c" data-bind="item:${it.id}:category" title="Categoria">${C.CATEGORIES.map((c) => `<option value="${c.id}"${c.id === it.category ? ' selected' : ''}>${esc(c.label.split(' ')[0])}</option>`).join('')}</select></td>
      <td><button class="btn ghost sm danger" data-action="item-del" data-id="${it.id}" title="Remover">×</button></td></tr>`).join('');

    const catalog = db().catalog.filter((c) => specs.includes(c.specialty));
    return `<section class="panel"><h2>Tarefas</h2><p class="muted">Uma proposta pode reunir várias tarefas e especialidades. Para cada tarefa, deixe claro o que está e o que não está incluso.</p>
      ${tasks || '<p class="empty">Nenhuma tarefa ainda.</p>'}
      <div class="row"><select id="nt-spec">${specs.map((s) => `<option value="${s}">${esc(C.specialty(s).short)}</option>`).join('')}</select>
      <input id="nt-title" class="grow" placeholder="Nova tarefa (ex.: Instalação de split na sala)"><button class="btn" data-action="task-add">+ Tarefa</button></div></section>
      <section class="panel"><h2>Itens</h2>
      <div class="row"><select id="add-cat" class="grow"><option value="">Adicionar serviço do catálogo…</option>${specs.map((sp) => `<optgroup label="${esc(C.specialty(sp).short)}">${catalog.filter((c) => c.specialty === sp).map((c) => `<option value="${c.id}">${esc(c.name)} · ${esc(c.unit)} · ${c.priceCents === null ? 'sem preço' : K.formatBRL(c.priceCents)}</option>`).join('')}</optgroup>`).join('')}</select>
      <select id="add-task">${taskOpts(job.tasks.length === 1 ? job.tasks[0].id : '')}</select><button class="btn" data-action="item-add-cat">Adicionar</button></div>
      ${C.CATEGORIES.map((cat) => `<h3>${esc(cat.label)}</h3><div class="scroll"><table class="tbl items"><thead><tr><th>Descrição</th><th>Tarefa</th><th>Qtd.</th><th>Unidade</th><th>Preço un. (R$)</th><th class="r">Total</th><th>Categoria</th><th></th></tr></thead>
        <tbody>${itemRows(cat.id) || '<tr><td colspan="8" class="muted">Nenhum item.</td></tr>'}</tbody></table></div>
        <button class="btn ghost sm" data-action="item-add" data-cat="${cat.id}">+ ${cat.id === 'labor' ? 'Mão de obra avulsa' : cat.id === 'material' ? 'Material' : 'Deslocamento / acréscimo'}</button>`).join('')}
      </section><div id="totals-box">${totalsBox(t)}</div>
      <div class="actions"><a class="btn ghost" href="#/pedido/${job.id}/pedido">← Pedido</a><a class="btn" href="#/pedido/${job.id}/orcamento">Próximo: orçamento →</a></div>`;
  }

  function totalsBox(t) {
    return `<div class="panel totals"><table>${C.CATEGORIES.map((c) => `<tr><td>${esc(c.label)}</td><td class="r">${K.formatBRL(t[c.id])}</td></tr>`).join('')}
      <tr><td>Subtotal</td><td class="r">${K.formatBRL(t.subtotal)}</td></tr>${t.discount ? `<tr><td>Desconto</td><td class="r">-${K.formatBRL(t.discount)}</td></tr>` : ''}
      <tr class="grand"><td>Total</td><td class="r">${K.formatBRL(t.total)}</td></tr></table>
      ${t.incomplete.length ? `<p class="error">${t.incomplete.length} item(ns) sem quantidade ou preço não entram no total.</p>` : ''}</div>`;
  }

  // ---------- Orçamento ----------
  function tabQuote(job) {
    const d = job.discount;
    const t = K.totals(job.items, job.discount);
    const st = aiState[job.id + ':scope'] || {};
    return `<div class="cols2"><div>
      <section class="panel"><h2>Escopo</h2><p class="muted">O assistente redige com base apenas nas tarefas e itens já confirmados. Revise o texto.</p>
        <textarea id="q-scope" data-bind="job:scope" rows="10">${esc(job.scope)}</textarea>
        <button class="btn ghost" data-action="scope-draft"${st.loading ? ' disabled' : ''}>${st.loading ? 'Redigindo…' : 'Redigir escopo a partir dos itens'}</button>
        ${st.error ? `<p class="error">${esc(st.error)}</p>` : ''}</section>
      <section class="panel"><h2>Condições</h2><div class="grid">
        ${field('Tipo de documento', 'q-type', 'job:estimateType', job.estimateType, { type: 'select', options: C.ESTIMATE_TYPES.map((e) => [e.id, e.label]) })}
        ${field('Validade (dias)', 'q-val', 'job:validityDays', job.validityDays, { inputmode: 'numeric' })}
        ${field('Condições de pagamento', 'q-pay', 'job:paymentTerms', job.paymentTerms, { type: 'textarea', wide: true })}
        ${field('Desconto', 'q-dt', 'disc:type', d.type, { type: 'select', options: [['value', 'Valor (R$)'], ['percent', 'Percentual (%)']] })}
        ${field(d.type === 'percent' ? 'Desconto (%)' : 'Desconto (R$)', 'q-dv', 'disc:value', d.type === 'percent' ? (Number.isInteger(d.bp) ? String(d.bp / 100).replace('.', ',') : '') : K.formatMoneyInput(d.cents), { inputmode: 'decimal' })}</div></section>
      <div class="actions"><a class="btn ghost" href="#/pedido/${job.id}/itens">← Itens</a><a class="btn" href="#/pedido/${job.id}/revisao">Próximo: revisão →</a></div>
      </div><aside><div id="totals-box">${totalsBox(t)}</div></aside></div>`;
  }

  async function draftScope(job) {
    const key = job.id + ':scope';
    if (job.scope.trim() && !confirm('Substituir o escopo atual pelo rascunho?')) return;
    aiState[key] = { loading: true };
    render();
    try {
      const r = await window.AI.draftScope(job, { settings: db().settings });
      job.scope = r.text;
      S.log(job, `Escopo redigido (${r.mode === 'claude' ? 'IA' : 'modelo local'})`);
      S.save();
      aiState[key] = {};
    } catch (e) { aiState[key] = { error: e.message || String(e) }; }
    render();
  }

  // ---------- Revisão ----------
  const reviewChecks = {}; // jobId -> Set
  const MANUAL = ['Conferi quantidades e medidas de cada item', 'Conferi os preços unitários e o total', 'Conferi inclusões e exclusões de cada tarefa', 'Conferi dados do cliente, condições e validade'];

  function tabReview(job, c) {
    const { blocking, warnings } = checks(job);
    const valid = reviewValid(job);
    const set = reviewChecks[job.id] || new Set();
    const canConfirm = !blocking.length && set.size === MANUAL.length;
    const t = K.totals(job.items, job.discount);
    return `<div class="cols2"><div>
      <section class="panel"><h2>Revisão obrigatória</h2>
        ${valid ? `<p class="ok">Revisado em ${fmtDT(job.review.at)} (versão ${job.review.version}). Qualquer alteração exigirá nova revisão.</p>` : job.review ? '<p class="error">O orçamento foi alterado depois da última revisão. Revise novamente para gerar o PDF.</p>' : ''}
        <h3>Pendências que impedem a emissão</h3>${blocking.length ? `<ul class="bad">${blocking.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '<p class="ok">Nenhuma.</p>'}
        <h3>Avisos</h3>${warnings.length ? `<ul class="warnlist">${warnings.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '<p class="muted">Nenhum.</p>'}
        ${valid ? '' : `<h3>Confirmações</h3>${MANUAL.map((m, i) => `<label class="line"><input type="checkbox" data-action="rv-check" value="${i}"${set.has(String(i)) ? ' checked' : ''}> ${esc(m)}</label>`).join('')}
        <button class="btn" data-action="rv-confirm"${canConfirm ? '' : ' disabled'}>Confirmar revisão</button>`}</section>
      <section class="panel"><h2>PDF</h2><p class="muted">Gera a proposta para impressão; escolha “Salvar como PDF” no diálogo do navegador.</p>
        <button class="btn" data-action="pdf"${valid ? '' : ' disabled'}>Gerar PDF</button>
        <button class="btn ghost" data-action="pdf-preview">Pré-visualizar (rascunho)</button>
        ${valid && job.commercial === 'draft' ? '<button class="btn ghost" data-action="mark-sent">Marcar como enviado</button>' : ''}</section>
      </div><aside><section class="panel"><h2>Resumo</h2>
        <p><strong>${esc(C.labelOf(C.ESTIMATE_TYPES, job.estimateType))}</strong> para ${esc(c.name || '—')}</p>
        <p>${job.tasks.length} tarefa(s) · ${job.items.length} item(ns)</p>${totalsBox(t)}</section></aside></div>`;
  }

  function confirmReview(job) {
    const { blocking } = checks(job);
    if (blocking.length || (reviewChecks[job.id] || new Set()).size !== MANUAL.length) return;
    const version = (job.versions[0]?.version || 0) + 1;
    const payload = reviewPayload(job);
    const at = S.now();
    job.review = { at, hash: K.hash(payload), version };
    job.versions.unshift({ version, at, snapshot: JSON.parse(JSON.stringify(payload)), total: K.totals(job.items, job.discount).total });
    delete reviewChecks[job.id];
    S.log(job, `Revisão confirmada — versão ${version} (${K.formatBRL(K.totals(job.items, job.discount).total)})`);
    S.save();
    render();
  }

  // ---------- Acompanhamento ----------
  function tabTrack(job) {
    const valid = reviewValid(job);
    const next = { draft: valid ? ['sent'] : [], sent: ['approved', 'lost', 'draft'], approved: ['draft'], lost: ['draft'] }[job.commercial];
    return `<div class="cols2"><div>
      <section class="panel"><h2>Status comercial</h2><p>Atual: ${badge(C.COMMERCIAL, job.commercial, 'cm')}</p>
        <div class="row">${next.map((s) => `<button class="btn${s === 'lost' ? ' danger' : s === 'draft' ? ' ghost' : ''}" data-action="set-commercial" data-v="${s}">${s === 'draft' ? 'Voltar para rascunho' : 'Marcar como ' + esc(C.labelOf(C.COMMERCIAL, s).toLowerCase())}</button>`).join('')}</div>
        ${job.commercial === 'draft' && !valid ? '<p class="muted">Para marcar como enviado, conclua a revisão.</p>' : ''}
        <div class="grid">${field('Próximo contato / retorno', 'tr-fu', 'job:followUp', job.followUp, { type: 'date' })}</div>
        <div class="row"><input id="tr-note" class="grow" placeholder="Registrar anotação (ex.: cliente pediu prazo até sexta)"><button class="btn ghost" data-action="note-add">Registrar</button></div></section>
      <section class="panel"><h2>Histórico</h2><ul class="history">${job.history.map((h) => `<li><time>${fmtDT(h.at)}</time> ${esc(h.text)}</li>`).join('')}</ul></section>
      </div><aside><section class="panel"><h2>Versões revisadas</h2>${job.versions.length ? `<ul class="history">${job.versions.map((v) => `<li><strong>v${v.version}</strong> · ${fmtDT(v.at)} · ${K.formatBRL(v.total)}${job.review && job.review.version === v.version && valid ? ' <span class="badge ok">atual</span>' : ''}</li>`).join('')}</ul>` : '<p class="muted">Nenhuma versão revisada ainda.</p>'}
      <button class="btn ghost danger" data-action="job-del">Excluir pedido</button></section></aside></div>`;
  }

  function setCommercial(job, v) {
    if (v === 'sent' && !reviewValid(job)) { alert('Conclua a revisão antes de marcar como enviado.'); return; }
    const from = job.commercial;
    job.commercial = v;
    S.log(job, `Status comercial: ${C.labelOf(C.COMMERCIAL, from)} → ${C.labelOf(C.COMMERCIAL, v)}`);
    S.save();
    render();
  }

  // ---------- Clientes ----------
  function viewClients() {
    const cl = db().clients;
    return shell(`<h1>Clientes</h1>${cl.length ? `<table class="tbl list"><thead><tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th>Endereço</th><th>Pedidos</th><th></th></tr></thead><tbody>
      ${cl.map((c) => `<tr><td><input id="cl-${c.id}-n" data-bind="client:${c.id}:name" value="${esc(c.name)}"></td><td><input id="cl-${c.id}-p" data-bind="client:${c.id}:phone" value="${esc(c.phone)}"></td>
        <td><input id="cl-${c.id}-e" data-bind="client:${c.id}:email" value="${esc(c.email)}"></td><td><input id="cl-${c.id}-a" data-bind="client:${c.id}:address" value="${esc(c.address)}"></td>
        <td>${db().jobs.filter((j) => j.clientId === c.id).map((j) => `<a href="#/pedido/${j.id}/pedido">${esc(j.number)}</a>`).join(', ') || '—'}</td>
        <td><button class="btn ghost sm" data-action="client-job" data-id="${c.id}">+ Pedido</button></td></tr>`).join('')}</tbody></table>` : '<p class="empty">Nenhum cliente. Crie um em “Novo pedido”.</p>'}`, 'clients');
  }

  // ---------- Catálogo ----------
  function viewCatalog() {
    const specs = db().settings.specialties;
    return shell(`<h1>Serviços e preços</h1><p class="muted">Preços são seus. Itens sem preço podem ser usados, mas o valor precisa ser informado no orçamento.</p>
      ${specs.map((sp) => `<section class="panel"><h2>${esc(C.specialty(sp).label)}</h2><table class="tbl"><thead><tr><th>Serviço</th><th>Unidade</th><th>Preço (R$)</th><th></th></tr></thead><tbody>
        ${db().catalog.filter((c) => c.specialty === sp).map((c) => `<tr><td><input id="ct-${c.id}-n" data-bind="cat:${c.id}:name" value="${esc(c.name)}">${c.custom ? ' <span class="badge">personalizado</span>' : ''}</td>
          <td><select id="ct-${c.id}-u" data-bind="cat:${c.id}:unit">${unitOptions(C.specialty(sp).units).map((u) => `<option${u === c.unit ? ' selected' : ''}>${esc(u)}</option>`).join('')}</select></td>
          <td><input id="ct-${c.id}-p" class="num" data-bind="cat:${c.id}:price" value="${esc(K.formatMoneyInput(c.priceCents))}" inputmode="decimal" placeholder="a definir"></td>
          <td><button class="btn ghost sm danger" data-action="cat-del" data-id="${c.id}">×</button></td></tr>`).join('')}</tbody></table>
        <button class="btn ghost sm" data-action="cat-add" data-sp="${sp}">+ Serviço personalizado</button></section>`).join('')}
      <p class="muted">Para atender outras especialidades, ajuste em Configurações.</p>`, 'catalog');
  }

  // ---------- Configurações ----------
  function viewSettings() {
    const s = db().settings;
    const p = s.provider;
    return shell(`<h1>Configurações</h1>
      <section class="panel"><h2>Prestador</h2><div class="grid">
        ${field('Nome / empresa', 's-n', 'set:provider.name', p.name)}${field('CPF / CNPJ', 's-d', 'set:provider.doc', p.doc)}
        ${field('Telefone', 's-p', 'set:provider.phone', p.phone)}${field('E-mail', 's-e', 'set:provider.email', p.email)}
        ${field('Endereço', 's-a', 'set:provider.address', p.address)}${field('Cidade / UF', 's-c', 'set:provider.city', p.city)}</div></section>
      <section class="panel"><h2>Especialidades e cobrança</h2>
        <div class="chips">${C.SPECIALTIES.map((sp) => `<label class="chip"><input type="checkbox" data-action="set-spec" value="${sp.id}"${s.specialties.includes(sp.id) ? ' checked' : ''}> ${esc(sp.short)}</label>`).join('')}</div>
        <div class="chips">${C.BILLING_MODES.map((m) => `<label class="chip"><input type="checkbox" data-action="set-bill" value="${esc(m.id)}"${s.billingModes.includes(m.id) ? ' checked' : ''}> ${esc(m.label)}</label>`).join('')}</div></section>
      <section class="panel"><h2>Padrões da proposta</h2><div class="grid">
        ${field('Condições de pagamento', 's-pay', 'set:paymentTerms', s.paymentTerms, { type: 'textarea', wide: true })}
        ${field('Validade (dias)', 's-val', 'set:validityDays', s.validityDays, { inputmode: 'numeric' })}</div></section>
      <section class="panel"><h2>Assistente de IA</h2><p class="muted">Opcional. Sem chave, o assistente usa um extrator local por regras. A chave fica salva apenas neste navegador e as mensagens são enviadas diretamente à API da Anthropic.</p>
        <div class="grid">${field('Chave da API Anthropic', 's-key', 'set:ai.apiKey', s.ai.apiKey, { type: 'password', placeholder: 'sk-ant-…' })}
        ${field('Modelo', 's-model', 'set:ai.model', s.ai.model, { type: 'select', options: [['claude-opus-5-5', 'Claude Opus 5.5'], ['claude-sonnet-5-5', 'Claude Sonnet 5.5'], ['claude-haiku-4-5', 'Claude Haiku 4.5']] })}</div></section>
      <section class="panel"><h2>Dados</h2><div class="row">
        <button class="btn ghost" data-action="export">Exportar backup (JSON)</button>
        <label class="btn ghost">Importar backup<input type="file" id="imp" accept="application/json" hidden></label>
        <button class="btn ghost" data-action="rerun-setup">Refazer configuração inicial</button>
        <button class="btn ghost danger" data-action="reset">Apagar todos os dados</button></div></section>`, 'settings');
  }

  // ---------- Roteamento ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    if (!db().settings.onboarded && parts[0] !== 'setup') { location.hash = '#/setup'; return null; }
    switch (parts[0]) {
      case 'setup': return viewSetup();
      case 'novo': return viewNew();
      case 'clientes': return viewClients();
      case 'catalogo': return viewCatalog();
      case 'config': return viewSettings();
      case 'pedido': return viewJob(parts[1], parts[2] || 'pedido');
      default: return viewHome();
    }
  }

  function render() {
    const ae = document.activeElement;
    const focusId = ae && ae.id;
    let sel = null;
    try { if (ae && typeof ae.selectionStart === 'number') sel = [ae.selectionStart, ae.selectionEnd]; } catch { /* tipo sem seleção */ }
    const html = route();
    if (html === null) return;
    const scroll = window.scrollY;
    app.innerHTML = html;
    window.scrollTo(0, scroll);
    if (focusId) {
      const el = document.getElementById(focusId);
      if (el) { el.focus(); if (sel && el.setSelectionRange) try { el.setSelectionRange(...sel); } catch { /* tipo sem seleção */ } }
    }
  }
  const renderSoon = () => setTimeout(render, 0);

  function currentJob() {
    const m = location.hash.match(/^#\/pedido\/([^/]+)/);
    return m ? S.job(m[1]) : null;
  }

  function refreshTotals(job) {
    const box = document.getElementById('totals-box');
    if (box) box.innerHTML = totalsBox(K.totals(job.items, job.discount));
  }

  // ---------- Binding de campos ----------
  function setPath(obj, path, value) {
    const ks = path.split('.');
    let o = obj;
    while (ks.length > 1) o = o[ks.shift()];
    o[ks[0]] = value;
  }

  // Retorna true se a mudança exige re-render.
  function applyBind(el) {
    const [kind, ...rest] = el.dataset.bind.split(':');
    const v = el.value;
    const job = currentJob();
    switch (kind) {
      case 'wiz': setPath(wiz, rest[0], v); return 'soft';
      case 'wizsvc': { const [sp, i, k] = rest; wiz.services[sp][i][k] = v; return 'soft'; }
      case 'filter': filters[rest[0]] = v; return true;
      case 'tmp': return false;
      case 'set': setPath(db().settings, rest[0], rest[0] === 'validityDays' ? Number(v) || '' : v); break;
      case 'client': { const c = S.client(rest[0]); if (c) c[rest[1]] = v; if (job) job.updatedAt = S.now(); break; }
      case 'cat': {
        const c = S.catalogItem(rest[0]);
        if (!c) return false;
        if (rest[1] === 'price') { const p = K.parseMoney(v); el.classList.toggle('invalid', !!v && p === null); c.priceCents = v ? p : null; } else c[rest[1]] = v;
        break;
      }
      case 'job': {
        if (rest[0] === 'validityDays') job.validityDays = Number(v) || '';
        else job[rest[0]] = v;
        if (rest[0] === 'evaluation' || rest[0] === 'estimateType') { S.log(job, `${rest[0] === 'evaluation' ? 'Avaliação' : 'Tipo de documento'}: ${C.labelOf(rest[0] === 'evaluation' ? C.EVALUATION : C.ESTIMATE_TYPES, v)}`); S.save(); return true; }
        if (rest[0] === 'followUp') { S.log(job, v ? `Retorno agendado para ${fmtD(v)}` : 'Retorno removido'); S.save(); return true; }
        job.updatedAt = S.now();
        break;
      }
      case 'req': job.request[rest[0]] = v; job.updatedAt = S.now(); break;
      case 'extra': { const [sp, k] = rest; job.request.extra[sp] = job.request.extra[sp] || {}; job.request.extra[sp][k] = v; job.updatedAt = S.now(); break; }
      case 'task': {
        const t = job.tasks.find((x) => x.id === rest[0]);
        if (!t) return false;
        if (rest[1] === 'inclusions' || rest[1] === 'exclusions') t[rest[1]] = lines(v);
        else t[rest[1]] = v;
        if (rest[1] === 'specialty' && !job.specialties.includes(v)) job.specialties.push(v);
        job.updatedAt = S.now();
        if (rest[1] === 'specialty') { saveSoon(); return true; }
        break;
      }
      case 'item': {
        const it = job.items.find((x) => x.id === rest[0]);
        if (!it) return false;
        const k = rest[1];
        if (k === 'qty') { const q = K.parseQty(v); el.classList.toggle('invalid', !!v && q === null); it.qtyMilli = q; }
        else if (k === 'price') { const p = K.parseMoney(v); el.classList.toggle('invalid', !!v && p === null); it.priceCents = p; }
        else it[k] = v;
        const cell = app.querySelector(`[data-total-for="${it.id}"]`);
        if (cell) cell.textContent = K.formatBRL(K.lineTotal(it));
        refreshTotals(job);
        job.updatedAt = S.now();
        if (k === 'category' || k === 'taskId') { saveSoon(); return true; }
        break;
      }
      case 'disc': {
        if (rest[0] === 'type') { job.discount = v === 'percent' ? { type: 'percent', bp: 0 } : { type: 'value', cents: 0 }; saveSoon(); return true; }
        if (job.discount.type === 'percent') {
          const q = K.parseQty(v); // até 3 casas; converte para pontos-base (2 casas de %)
          const bp = q === null ? null : Math.round(q / 10);
          el.classList.toggle('invalid', !!v && (bp === null || bp > 10000));
          job.discount.bp = bp === null ? 0 : Math.min(bp, 10000);
        } else {
          const p = K.parseMoney(v);
          el.classList.toggle('invalid', !!v && p === null);
          job.discount.cents = p || 0;
        }
        refreshTotals(job);
        break;
      }
      default: return false;
    }
    saveSoon();
    return false;
  }

  app.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.dataset || !el.dataset.bind || el.tagName === 'SELECT') return;
    const r = applyBind(el);
    if (r === true) renderSoon();
    if (r === 'soft') {
      const btn = app.querySelector('[data-action="wiz-next"]');
      if (btn) btn.disabled = !!wizError();
    }
  });

  app.addEventListener('change', (e) => {
    const el = e.target;
    if (el.id === 'imp') return importFile(el);
    if (el.dataset && el.dataset.bind) {
      const r = el.tagName === 'SELECT' ? applyBind(el) : false;
      // Texto não re-renderiza no change: o blur antecede o clique e trocaria o botão sob o cursor.
      if (r === true || r === 'soft' || el.type === 'date') renderSoon();
      return;
    }
    const a = el.dataset && el.dataset.action;
    if (!a) return;
    const job = currentJob();
    const toggle = (arr, v) => (el.checked ? (arr.includes(v) ? arr : [...arr, v]) : arr.filter((x) => x !== v));
    if (a === 'wiz-spec') wiz.specialties = toggle(wiz.specialties, el.value);
    else if (a === 'wiz-bill') wiz.billingModes = toggle(wiz.billingModes, el.value);
    else if (a === 'wiz-svc-on') wiz.services[el.dataset.sp][el.dataset.i].on = el.checked;
    else if (a === 'job-spec') {
      job.specialties = toggle(job.specialties, el.value);
      S.log(job, `Especialidade ${el.checked ? 'adicionada' : 'removida'}: ${C.specialty(el.value).short}`);
      S.save();
    } else if (a === 'set-spec') {
      db().settings.specialties = toggle(db().settings.specialties, el.value);
      if (el.checked && !db().catalog.some((c) => c.specialty === el.value)) {
        C.specialty(el.value).services.forEach((x) => db().catalog.push({ id: S.uid(), specialty: el.value, name: x.name, unit: x.unit, priceCents: null, custom: false }));
      }
      S.save();
    } else if (a === 'set-bill') { db().settings.billingModes = toggle(db().settings.billingModes, el.value); S.save(); }
    else if (a === 'rv-check') {
      const set = reviewChecks[job.id] || (reviewChecks[job.id] = new Set());
      if (el.checked) set.add(el.value); else set.delete(el.value);
    }
    renderSoon();
  });

  app.addEventListener('click', (e) => {
    const row = e.target.closest('tr[data-href]');
    if (row && !e.target.closest('a,button,input,select')) { location.hash = row.dataset.href; return; }
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.tagName === 'INPUT') return;
    const a = btn.dataset.action;
    const job = currentJob();
    const val = (id) => (document.getElementById(id) || {}).value || '';

    const actions = {
      'wiz-next': () => { if (wizError()) return; if (wiz.step === 5) finishWiz(); else { wiz.step++; render(); } },
      'wiz-back': () => { wiz.step--; render(); },
      'wiz-svc-add': () => { const sp = btn.dataset.sp; wiz.services[sp].push({ name: '', unit: C.specialty(sp).units[0], priceText: '', on: true }); render(); },
      'new-existing': () => { const id = val('n-client'); if (!id) return alert('Selecione um cliente.'); const j = S.newJob(id); S.save(); location.hash = `#/pedido/${j.id}/pedido`; },
      'new-client': () => {
        const name = val('n-name').trim();
        if (!name) return alert('Informe o nome do cliente.');
        const c = { id: S.uid(), name, phone: val('n-phone'), email: val('n-email'), address: val('n-addr'), notes: '', createdAt: S.now() };
        db().clients.unshift(c);
        const j = S.newJob(c.id);
        j.request.address = c.address;
        S.save();
        location.hash = `#/pedido/${j.id}/pedido`;
      },
      'client-job': () => { const j = S.newJob(btn.dataset.id); S.save(); location.hash = `#/pedido/${j.id}/pedido`; },
      'mark-prelim': () => { job.estimateType = 'preliminary'; if (job.evaluation === 'ready') job.evaluation = 'pending_info'; S.log(job, 'Salvo como Estimativa preliminar'); S.save(); render(); },
      'mark-visit': () => { job.estimateType = 'awaiting_visit'; job.evaluation = 'awaiting_visit'; job.request.needsVisit = 'Sim'; S.log(job, 'Salvo como Aguardando visita técnica'); S.save(); render(); },
      'mark-ready': () => { job.evaluation = 'ready'; S.log(job, 'Avaliação: Pronto para orçamento'); S.save(); render(); },
      'ai-run': () => runAI(job),
      'ai-apply': () => applyAI(job),
      'ai-copy-q': () => {
        const q = aiState[job.id].result.questions.map((x, i) => `${i + 1}. ${x}`).join('\n');
        navigator.clipboard?.writeText(q).then(() => alert('Perguntas copiadas.'), () => prompt('Copie as perguntas:', q));
      },
      'task-add': () => {
        const title = val('nt-title').trim();
        if (!title) return alert('Informe o título da tarefa.');
        addTask(job, val('nt-spec'), title);
        S.log(job, `Tarefa adicionada: ${title}`);
        S.save(); render();
      },
      'task-del': () => {
        const t = job.tasks.find((x) => x.id === btn.dataset.id);
        if (!confirm(`Remover a tarefa “${t.title}”? Os itens vinculados ficam como gerais.`)) return;
        job.tasks = job.tasks.filter((x) => x !== t);
        job.items.forEach((it) => { if (it.taskId === t.id) it.taskId = ''; });
        S.log(job, `Tarefa removida: ${t.title}`);
        S.save(); render();
      },
      'item-add-cat': () => {
        const cat = S.catalogItem(val('add-cat'));
        if (!cat) return alert('Selecione um serviço do catálogo.');
        job.items.push(itemFromCatalog(cat, val('add-task'), null));
        S.save(); render();
      },
      'item-add': () => {
        const cat = btn.dataset.cat;
        const unit = cat === 'extra' ? 'verba' : cat === 'material' ? 'unidade' : (db().settings.billingModes[0] || 'serviço');
        job.items.push({ id: S.uid(), category: cat, taskId: job.tasks.length === 1 ? job.tasks[0].id : '', description: cat === 'extra' ? 'Deslocamento' : '', qtyMilli: null, unit, priceCents: null, catalogId: null });
        S.save(); render();
      },
      'item-del': () => { job.items = job.items.filter((x) => x.id !== btn.dataset.id); S.save(); render(); },
      'scope-draft': () => draftScope(job),
      'rv-confirm': () => confirmReview(job),
      pdf: () => {
        if (!reviewValid(job)) return alert('Conclua a revisão antes de gerar o PDF.');
        window.PDF.open(job, S.client(job.clientId), db().settings);
        S.log(job, `PDF gerado (versão ${job.review.version})`);
        S.save();
      },
      'pdf-preview': () => {
        const draft = { ...job, review: null };
        const html = window.PDF.build(draft, S.client(job.clientId), db().settings)
          .replace('<body>', '<body><div style="background:#fee2e2;border:2px solid #b91c1c;padding:8px;margin-bottom:8px;font-weight:700">PRÉ-VISUALIZAÇÃO — NÃO REVISADO, NÃO ENVIAR</div>')
          .replace(/<script>[\s\S]*?<\/script>/, '');
        const w = window.open('', '_blank');
        if (!w) return alert('Permita pop-ups para pré-visualizar.');
        w.document.write(html); w.document.close();
      },
      'mark-sent': () => setCommercial(job, 'sent'),
      'set-commercial': () => setCommercial(job, btn.dataset.v),
      'note-add': () => { const t = val('tr-note').trim(); if (!t) return; S.log(job, `Anotação: ${t}`); S.save(); render(); },
      'job-del': () => {
        if (!confirm(`Excluir o pedido ${job.number}? Esta ação não pode ser desfeita.`)) return;
        db().jobs = db().jobs.filter((x) => x !== job); S.save(); location.hash = '#/';
      },
      'cat-add': () => { const sp = btn.dataset.sp; db().catalog.push({ id: S.uid(), specialty: sp, name: 'Novo serviço', unit: C.specialty(sp).units[0], priceCents: null, custom: true }); S.save(); render(); },
      'cat-del': () => { if (confirm('Remover este serviço do catálogo? Orçamentos existentes não são alterados.')) { db().catalog = db().catalog.filter((c) => c.id !== btn.dataset.id); S.save(); render(); } },
      export: () => {
        const blob = new Blob([S.exportJSON()], { type: 'application/json' });
        const a2 = document.createElement('a');
        a2.href = URL.createObjectURL(blob); a2.download = `orcapro-backup-${new Date().toISOString().slice(0, 10)}.json`; a2.click();
        setTimeout(() => URL.revokeObjectURL(a2.href), 1000);
      },
      'rerun-setup': () => { initWiz(); location.hash = '#/setup'; },
      reset: () => { if (confirm('Apagar todos os dados deste navegador?') && confirm('Tem certeza? Faça um backup antes.')) { S.reset(); wiz = null; location.hash = '#/setup'; render(); } },
    };
    if (actions[a]) { e.preventDefault(); actions[a](); }
  });

  function importFile(input) {
    const f = input.files[0];
    if (!f) return;
    f.text().then((txt) => {
      try { S.importJSON(txt); alert('Backup importado.'); location.hash = '#/'; render(); } catch (err) { alert('Falha ao importar: ' + err.message); }
    });
  }

  window.addEventListener('hashchange', render);
  render();
})();
