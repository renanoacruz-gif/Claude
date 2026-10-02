// Persistência local (localStorage). Um único documento JSON versionado.
(function (root) {
  const KEY = 'orcapro:v1';

  const empty = () => ({
    version: 1,
    settings: {
      onboarded: false,
      provider: { name: '', doc: '', phone: '', email: '', address: '', city: '' },
      specialties: [],
      billingModes: [],
      paymentTerms: '',
      validityDays: 15,
      ai: { apiKey: '', model: 'claude-opus-5-5' },
    },
    catalog: [], // {id, specialty, name, unit, priceCents|null, custom}
    clients: [], // {id, name, phone, email, address, notes, createdAt}
    jobs: [],
    seq: 0,
  });

  let db = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(empty(), JSON.parse(raw));
    } catch (e) { console.warn('Falha ao ler dados locais', e); }
    return empty();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {
      alert('Não foi possível salvar os dados neste navegador: ' + e.message);
    }
  }

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const now = () => new Date().toISOString();

  function newJob(clientId) {
    db.seq += 1;
    const year = new Date().getFullYear();
    const job = {
      id: uid(),
      number: `${year}-${String(db.seq).padStart(4, '0')}`,
      clientId,
      createdAt: now(),
      updatedAt: now(),
      specialties: [],
      request: {
        address: '', description: '', requestedService: '', measures: '',
        materialsBy: '', access: '', deadline: '', needsVisit: '', notes: '', extra: {},
      },
      rawMessage: '',
      evaluation: 'pending_info',
      estimateType: 'firm',
      commercial: 'draft',
      tasks: [], // {id, specialty, title, inclusions, exclusions}
      items: [], // {id, category, taskId, description, qtyMilli, unit, priceCents, catalogId}
      discount: { type: 'value', cents: 0 },
      scope: '',
      paymentTerms: db.settings.paymentTerms,
      validityDays: db.settings.validityDays,
      followUp: '',
      review: null, // {at, hash, version}
      versions: [], // {version, at, snapshot, totals}
      history: [],
    };
    log(job, 'Pedido criado');
    db.jobs.unshift(job);
    return job;
  }

  function log(job, text) {
    job.history.unshift({ at: now(), text });
    job.updatedAt = now();
  }

  function exportJSON() { return JSON.stringify(db, null, 2); }

  function importJSON(text) {
    const data = JSON.parse(text);
    if (!data || data.version !== 1 || !Array.isArray(data.jobs)) throw new Error('Arquivo inválido');
    db = Object.assign(empty(), data);
    save();
  }

  function reset() { db = empty(); save(); }

  root.Store = {
    get db() { return db; },
    save, uid, now, newJob, log, exportJSON, importJSON, reset,
    client: (id) => db.clients.find((c) => c.id === id),
    job: (id) => db.jobs.find((j) => j.id === id),
    catalogItem: (id) => db.catalog.find((c) => c.id === id),
  };
})(window);
