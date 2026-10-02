// Assistente de triagem. Usa a API do Claude quando há chave configurada;
// senão, um extrator local por regras. Em ambos os casos o resultado é apenas
// sugestão: nada entra no pedido sem confirmação do prestador.
(function (root) {
  const C = root.Catalog;
  const SPEC_IDS = C.SPECIALTIES.map((s) => s.id);

  const COMMON_FIELDS = {
    client_name: 'Nome do cliente',
    phone: 'Telefone',
    email: 'E-mail',
    address: 'Endereço de execução',
    deadline: 'Prazo desejado',
    access: 'Condições de acesso',
    materials_by: 'Quem fornece materiais',
    measures: 'Quantidades ou medidas',
  };

  const QUESTIONS = {
    address: 'Qual o endereço completo onde o serviço será feito?',
    deadline: 'Para quando você precisa do serviço?',
    access: 'Há alguma restrição de acesso ao local (horário, portaria, escada, elevador)?',
    materials_by: 'Os materiais serão fornecidos por você ou devo incluí-los no orçamento?',
    'ac.equipmentType': 'Qual o tipo do aparelho (split, janela, cassete…)?',
    'ac.equipmentQty': 'Quantos aparelhos são?',
    'ac.btu': 'Sabe a potência do aparelho em BTU? (consta na etiqueta)',
    'ac.infra': 'O local já tem infraestrutura pronta (tubulação, dreno e ponto elétrico)?',
    'ac.pipeLength': 'Qual a distância aproximada entre a unidade interna e a externa?',
    'ac.installSite': 'Em que andar fica e onde a condensadora ficará (sacada, fachada, laje)?',
    'paint.area': 'Qual a área aproximada a pintar, em m²? Se preferir, envie as medidas das paredes.',
    'paint.rooms': 'Quais ambientes serão pintados?',
    'paint.surfaceState': 'Como está a superfície hoje? Pode enviar fotos?',
    'paint.paintBy': 'A tinta será fornecida por você ou devo incluir no orçamento?',
    'paint.prep': 'Deseja preparação da superfície (lixamento, massa corrida, selador)?',
    'plumb.requestType': 'É instalação, vazamento, troca, desentupimento ou outro?',
    'plumb.points': 'Quais pontos ou peças estão envolvidos?',
    'plumb.location': 'Em qual cômodo está o problema?',
    'plumb.pipeAccess': 'A tubulação é embutida na parede/piso ou aparente?',
    'handy.taskList': 'Pode listar cada tarefa com a quantidade de itens?',
    'handy.availableMaterials': 'Você já tem as peças e acessórios (buchas, parafusos, suportes)?',
  };

  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

  // Garante que só fica o que tem evidência literal na mensagem.
  function grounded(message, evidence) {
    const e = norm(evidence);
    return e.length >= 2 && norm(message).includes(e);
  }

  function extraFieldLabel(spec, key) {
    const f = (C.EXTRA_FIELDS[spec] || []).find((x) => x.key === key);
    return f ? f.label : key;
  }

  function sanitize(message, raw, catalog) {
    const out = { specialties: [], tasks: [], fields: [], missing: [], questions: [], suggestions: [] };
    for (const s of raw.specialties || []) {
      if (SPEC_IDS.includes(s.id) && !out.specialties.some((x) => x.id === s.id)) {
        out.specialties.push({ id: s.id, evidence: s.evidence || '' });
      }
    }
    for (const t of raw.tasks || []) {
      if (!t.description || !grounded(message, t.evidence)) continue;
      // Quantidade só se os dígitos aparecem na evidência.
      const num = t.quantity && (String(t.quantity).match(/\d+(?:[.,]\d+)?/) || [])[0];
      const q = num && norm(t.evidence).includes(num) ? t.quantity : null;
      out.tasks.push({ description: t.description, quantity: q, specialty: SPEC_IDS.includes(t.specialty) ? t.specialty : null, evidence: t.evidence });
    }
    for (const [k, v] of Object.entries(raw.fields || {})) {
      if (COMMON_FIELDS[k] && v && v.value && grounded(message, v.evidence || v.value)) {
        out.fields.push({ scope: 'common', key: k, label: COMMON_FIELDS[k], value: v.value, evidence: v.evidence || v.value });
      }
    }
    for (const f of raw.extra_fields || []) {
      const def = (C.EXTRA_FIELDS[f.specialty] || []).find((x) => x.key === f.key);
      if (!def || !f.value || !grounded(message, f.evidence || f.value)) continue;
      if (def.type === 'select' && !def.options.includes(f.value)) continue;
      out.fields.push({ scope: f.specialty, key: f.key, label: `${C.specialty(f.specialty).short} · ${def.label}`, value: f.value, evidence: f.evidence || f.value });
    }
    out.missing = (raw.missing || []).filter((m) => m && m.item).slice(0, 15);
    out.questions = (raw.questions || []).filter(Boolean).slice(0, 10);
    const ids = new Set(catalog.map((c) => c.id));
    for (const s of raw.catalog_suggestions || []) {
      if (ids.has(s.catalog_id) && out.tasks[s.task_index]) out.suggestions.push({ taskIndex: s.task_index, catalogId: s.catalog_id });
    }
    return out;
  }

  // ---------- Extrator local (sem IA) ----------
  function localAnalyze(message, catalog, enabledSpecs) {
    const text = norm(message);
    const raw = { specialties: [], tasks: [], fields: {}, extra_fields: [], missing: [], questions: [], catalog_suggestions: [] };

    const hits = {};
    for (const s of C.SPECIALTIES) {
      const kw = s.keywords.filter((k) => text.includes(norm(k)));
      if (kw.length) { hits[s.id] = kw.length; raw.specialties.push({ id: s.id, evidence: kw.slice(0, 3).join(', ') }); }
    }
    raw.specialties.sort((a, b) => hits[b.id] - hits[a.id]);

    const sentences = String(message).split(/\n+|(?<=[.!?;])\s+/).map((s) => s.trim().replace(/^[-•*\d.)\s]+(?=\D)/, '').trim()).filter((s) => s.length > 3);
    for (const sent of sentences) {
      const ns = norm(sent);
      const spec = C.SPECIALTIES.find((s) => s.keywords.some((k) => ns.includes(norm(k))));
      if (!spec) continue;
      const qm = sent.match(/\b(\d+(?:[.,]\d+)?)\s*(x|un\b|unidades?|pe[çc]as?|aparelhos?|splits?|m²|m2|metros?|pontos?|portas?|quadros?|prateleiras?|cortinas?|torneiras?|tomadas?)/i)
        || sent.match(/^(\d+)\s+\S/);
      raw.tasks.push({ description: sent.replace(/[.;]$/, ''), quantity: qm ? qm[0].trim() : null, specialty: spec.id, evidence: sent });
    }

    const phone = message.match(/(\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/);
    if (phone) raw.fields.phone = { value: phone[0].trim(), evidence: phone[0].trim() };
    const email = message.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    if (email) raw.fields.email = { value: email[0], evidence: email[0] };
    const addr = message.match(/\b(rua|r\.|av\.?|avenida|travessa|alameda|estrada|rodovia)\s[^\n,.;]+(,\s*\d+[^\n.;]*)?/i);
    if (addr) raw.fields.address = { value: addr[0].trim(), evidence: addr[0].trim() };
    const dl = message.match(/\b(hoje|amanh[ãa]|urgente|essa semana|esta semana|semana que vem|pr[óo]xima semana|fim de semana|s[áa]bado|domingo|segunda|ter[çc]a|quarta|quinta|sexta|\d{1,2}\/\d{1,2}(\/\d{2,4})?)\b[^\n.;?!]*/i);
    if (dl) raw.fields.deadline = { value: dl[0].trim(), evidence: dl[0].trim() };
    const acc = message.match(/[^\n.;?!,]*\b(portaria|elevador|escada|andar|condom[íi]nio|hor[áa]rio)\b[^\n.;?!,]*/i);
    if (acc) raw.fields.access = { value: acc[0].trim(), evidence: acc[0].trim() };
    const mat = message.match(/[^\n.;?!,]*\b(j[áa] tenho|j[áa] comprei|eu compro|voc[êe] traz|fornec\w*)\b[^\n.;?!,]*/i);
    if (mat) raw.fields.materials_by = { value: mat[0].trim(), evidence: mat[0].trim() };

    const area = message.match(/(\d+(?:[.,]\d+)?)\s*(m²|m2|metros quadrados)/i);
    if (area) raw.extra_fields.push({ specialty: 'paint', key: 'area', value: area[1], evidence: area[0] });
    const btu = message.match(/(\d{1,2}[.\s]?\d{3})\s*btus?/i);
    if (btu) raw.extra_fields.push({ specialty: 'ac', key: 'btu', value: btu[1], evidence: btu[0] });
    const acq = message.match(/(\d+)\s*(aparelhos?|splits?|ar(es)?[- ]condicionados?)/i);
    if (acq) raw.extra_fields.push({ specialty: 'ac', key: 'equipmentQty', value: acq[1], evidence: acq[0] });
    if (/\bjanela\b/i.test(message) && hits.ac) raw.extra_fields.push({ specialty: 'ac', key: 'equipmentType', value: 'Janela', evidence: 'janela' });
    const pt = [['vazamento', 'Vazamento'], ['vazando', 'Vazamento'], ['entupid', 'Desentupimento'], ['desentup', 'Desentupimento'], ['trocar', 'Troca'], ['troca', 'Troca'], ['instalar', 'Instalação']]
      .find(([k]) => text.includes(k));
    if (pt && hits.plumb) raw.extra_fields.push({ specialty: 'plumb', key: 'requestType', value: pt[1], evidence: pt[0] });
    const coats = message.match(/(\d)\s*dem[ãa]os?/i);
    if (coats) raw.extra_fields.push({ specialty: 'paint', key: 'coats', value: coats[1], evidence: coats[0] });

    const detected = raw.specialties.map((s) => s.id);
    const have = new Set([...Object.keys(raw.fields), ...raw.extra_fields.map((f) => `${f.specialty}.${f.key}`)]);
    for (const k of ['address', 'deadline', 'access', 'materials_by']) {
      if (!have.has(k)) raw.missing.push({ item: COMMON_FIELDS[k], reason: k === 'materials_by' ? 'Define se materiais entram no orçamento.' : 'Necessário para planejar a execução.' });
      if (!have.has(k) && QUESTIONS[k]) raw.questions.push(QUESTIONS[k]);
    }
    for (const sp of detected) {
      for (const key of C.PRICE_CRITICAL[sp] || []) {
        const id = `${sp}.${key}`;
        if (have.has(id)) continue;
        raw.missing.push({ item: `${C.specialty(sp).short}: ${extraFieldLabel(sp, key)}`, reason: 'Afeta o preço.' });
        if (QUESTIONS[id]) raw.questions.push(QUESTIONS[id]);
      }
    }
    if (!detected.length) raw.missing.push({ item: 'Especialidade', reason: 'Não foi possível identificar o tipo de serviço.' });

    raw.tasks.forEach((t, i) => {
      const best = bestCatalogMatch(t.description, catalog.filter((c) => c.specialty === t.specialty && (!enabledSpecs.length || enabledSpecs.includes(c.specialty))));
      if (best) raw.catalog_suggestions.push({ task_index: i, catalog_id: best.id });
    });
    return raw;
  }

  const STOP = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'ou', 'a', 'o', 'para', 'com', 'em', 'um', 'uma', 'no', 'na']);
  const tokens = (s) => norm(s).replace(/[^a-z0-9 ]/g, ' ').split(' ').filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.slice(0, 4));

  function bestCatalogMatch(desc, list) {
    const td = new Set(tokens(desc));
    let best = null; let score = 0;
    for (const c of list) {
      const s = tokens(c.name).filter((w) => td.has(w)).length;
      if (s > score) { score = s; best = c; }
    }
    return score > 0 ? best : null;
  }

  // ---------- Claude ----------
  const SYSTEM = `Você é um assistente de triagem de pedidos para prestadores de serviços residenciais e comerciais no Brasil (pequenos reparos, ar-condicionado, pintura, hidráulica).

Sua tarefa: organizar a mensagem do cliente para o prestador revisar.

Regras obrigatórias:
- Extraia SOMENTE informações explicitamente escritas na mensagem. Para cada valor, informe em "evidence" o trecho literal copiado da mensagem.
- Não diagnostique problemas técnicos, não dimensione equipamentos ou materiais, não estime medidas, preços, horas de trabalho ou quantidades.
- Se uma quantidade não foi escrita pelo cliente, use null.
- Não prometa que o serviço pode ser feito sem avaliação.
- Não acrescente serviços ou materiais que o cliente não pediu. Sugestões de catálogo apenas apontam itens já existentes que correspondem a tarefas pedidas.
- Em "missing", liste dados ausentes que afetam preço ou execução, explicando por quê.
- Em "questions", escreva perguntas curtas e cordiais, em português, para o prestador enviar ao cliente.
- Para campos do tipo lista de opções, use exatamente uma das opções fornecidas ou omita.`;

  function schema() {
    const nul = { type: ['string', 'null'] };
    const fieldObj = { anyOf: [{ type: 'object', properties: { value: { type: 'string' }, evidence: { type: 'string' } }, required: ['value', 'evidence'], additionalProperties: false }, { type: 'null' }] };
    const fields = {};
    Object.keys(COMMON_FIELDS).forEach((k) => { fields[k] = fieldObj; });
    return {
      type: 'object',
      additionalProperties: false,
      required: ['specialties', 'tasks', 'fields', 'extra_fields', 'missing', 'questions', 'catalog_suggestions'],
      properties: {
        specialties: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'evidence'], properties: { id: { type: 'string', enum: SPEC_IDS }, evidence: { type: 'string' } } } },
        tasks: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['description', 'quantity', 'specialty', 'evidence'], properties: { description: { type: 'string' }, quantity: nul, specialty: { type: 'string', enum: SPEC_IDS }, evidence: { type: 'string' } } } },
        fields: { type: 'object', additionalProperties: false, required: Object.keys(COMMON_FIELDS), properties: fields },
        extra_fields: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['specialty', 'key', 'value', 'evidence'], properties: { specialty: { type: 'string', enum: SPEC_IDS }, key: { type: 'string' }, value: { type: 'string' }, evidence: { type: 'string' } } } },
        missing: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['item', 'reason'], properties: { item: { type: 'string' }, reason: { type: 'string' } } } },
        questions: { type: 'array', items: { type: 'string' } },
        catalog_suggestions: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['task_index', 'catalog_id'], properties: { task_index: { type: 'integer' }, catalog_id: { type: 'string' } } } },
      },
    };
  }

  let sdkPromise = null;
  async function client(settings) {
    if (!sdkPromise) sdkPromise = import('https://esm.sh/@anthropic-ai/sdk');
    const { default: Anthropic } = await sdkPromise;
    return new Anthropic({ apiKey: settings.ai.apiKey, dangerouslyAllowBrowser: true });
  }

  async function callClaude(settings, { system, user, format, maxTokens }) {
    const anthropic = await client(settings);
    const resp = await anthropic.beta.messages.create({
      model: settings.ai.model || 'claude-opus-5-5',
      max_tokens: maxTokens,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: format ? { effort: 'low', format } : { effort: 'low' },
      system,
      messages: [{ role: 'user', content: user }],
    });
    if (resp.stop_reason === 'refusal') throw new Error('A IA recusou a solicitação. Use o modo local ou preencha manualmente.');
    if (resp.stop_reason === 'max_tokens') throw new Error('Resposta da IA incompleta. Tente uma mensagem menor.');
    const text = resp.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    if (!text) throw new Error('Resposta vazia da IA.');
    return text;
  }

  function catalogForPrompt(catalog) {
    return catalog.map((c) => `- id=${c.id} | ${C.specialty(c.specialty).short} | ${c.name} | unidade: ${c.unit}`).join('\n') || '(catálogo vazio)';
  }

  function extraFieldsForPrompt(specs) {
    return specs.map((sp) => `${sp}:\n` + C.EXTRA_FIELDS[sp].map((f) => `  - key=${f.key} (${f.label})${f.type === 'select' ? ' opções: ' + f.options.filter(Boolean).join(' | ') : ''}`).join('\n')).join('\n');
  }

  async function analyze(message, ctx) {
    const { settings, catalog } = ctx;
    if (!settings.ai.apiKey) return { mode: 'local', ...sanitize(message, localAnalyze(message, catalog, settings.specialties), catalog) };
    const user = `Especialidades atendidas pelo prestador: ${settings.specialties.join(', ') || 'todas'}.

Campos adicionais disponíveis por especialidade:
${extraFieldsForPrompt(SPEC_IDS)}

Catálogo de serviços do prestador:
${catalogForPrompt(catalog)}

Mensagem do cliente:
"""
${message}
"""`;
    const text = await callClaude(settings, { system: SYSTEM, user, maxTokens: 16000, format: { type: 'json_schema', schema: schema() } });
    let raw;
    try { raw = JSON.parse(text); } catch { throw new Error('Não foi possível interpretar a resposta da IA.'); }
    return { mode: 'claude', ...sanitize(message, raw, catalog) };
  }

  // ---------- Escopo ----------
  const itemLine = (it) => (Number.isInteger(it.qtyMilli) ? `${it.description} (${root.Calc.formatQty(it.qtyMilli)} ${it.unit})` : it.description);

  function localScope(job, settings) {
    const lines = [];
    const specs = job.specialties.map((s) => C.specialty(s).short).join(', ');
    lines.push(`Proposta para serviços de ${specs || 'manutenção'}${job.request.address ? ` no endereço ${job.request.address}` : ''}.`);
    if (job.estimateType !== 'firm') {
      lines.push(job.estimateType === 'awaiting_visit'
        ? 'Os valores serão confirmados após visita técnica ao local.'
        : 'Esta é uma estimativa preliminar, baseada nas informações recebidas, sujeita a confirmação no local.');
    }
    job.tasks.forEach((t, i) => {
      lines.push('');
      lines.push(`${i + 1}. ${t.title}`);
      const its = job.items.filter((it) => it.taskId === t.id);
      its.forEach((it) => lines.push(`   - ${itemLine(it)}`));
    });
    const loose = job.items.filter((it) => !it.taskId || !job.tasks.some((t) => t.id === it.taskId));
    if (loose.length) {
      lines.push('');
      lines.push('Itens gerais:');
      loose.forEach((it) => lines.push(`   - ${itemLine(it)}`));
    }
    return lines.join('\n');
  }

  async function draftScope(job, ctx) {
    const { settings } = ctx;
    if (!settings.ai.apiKey) return { mode: 'local', text: localScope(job, settings) };
    const data = {
      especialidades: job.specialties.map((s) => C.specialty(s).label),
      tipo: C.labelOf(C.ESTIMATE_TYPES, job.estimateType),
      endereco: job.request.address,
      tarefas: job.tasks.map((t) => ({
        titulo: t.title,
        inclusoes: t.inclusions, exclusoes: t.exclusions,
        itens: job.items.filter((it) => it.taskId === t.id).map(itemLine),
      })),
      itens_gerais: job.items.filter((it) => !job.tasks.some((t) => t.id === it.taskId)).map(itemLine),
    };
    const system = `Você redige o texto de escopo de propostas comerciais de prestadores de serviço, em português do Brasil, tom profissional e claro.
Regras: use apenas as tarefas e itens fornecidos (já confirmados pelo prestador); não acrescente serviços, materiais, medidas, prazos, garantias ou preços; não diagnostique; não afirme que o serviço dispensa avaliação. Se o tipo for "Estimativa preliminar" ou "Aguardando visita técnica", deixe claro que os valores dependem de confirmação no local. Não repita a lista de inclusões/exclusões (ela aparece em outra seção). Responda só com o texto do escopo, sem títulos em markdown.`;
    const text = await callClaude(settings, { system, user: JSON.stringify(data, null, 2), maxTokens: 4000 });
    return { mode: 'claude', text: text.trim() };
  }

  root.AI = { analyze, draftScope, COMMON_FIELDS, _localAnalyze: localAnalyze, _sanitize: sanitize };
})(window);
