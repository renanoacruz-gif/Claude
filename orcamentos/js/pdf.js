// Gera a proposta em HTML imprimível; o navegador salva como PDF ("Salvar como PDF").
(function (root) {
  const C = root.Catalog;
  const K = root.Calc;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nl2br = (s) => esc(s).replace(/\n/g, '<br>');
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '');

  function build(job, client, settings) {
    const p = settings.provider;
    const t = K.totals(job.items, job.discount);
    const title = C.labelOf(C.ESTIMATE_TYPES, job.estimateType);
    const issued = job.review ? job.review.at : new Date().toISOString();
    const validUntil = new Date(new Date(issued).getTime() + (Number(job.validityDays) || 0) * 86400000);

    const rows = (cat) => job.items.filter((it) => it.category === cat.id).map((it) => {
      const task = job.tasks.find((x) => x.id === it.taskId);
      return `<tr><td>${esc(it.description)}${task ? `<div class="muted">${esc(task.title)}</div>` : ''}</td>
        <td class="r">${esc(K.formatQty(it.qtyMilli))}</td><td>${esc(it.unit)}</td>
        <td class="r">${K.formatBRL(it.priceCents)}</td><td class="r">${K.formatBRL(K.lineTotal(it))}</td></tr>`;
    }).join('');

    const sections = C.CATEGORIES.map((cat) => {
      const r = rows(cat);
      return r ? `<h3>${esc(cat.label)}</h3><table><thead><tr><th>Descrição</th><th class="r">Qtd.</th><th>Un.</th><th class="r">Preço un.</th><th class="r">Total</th></tr></thead>
        <tbody>${r}</tbody><tfoot><tr><td colspan="4" class="r">Subtotal ${esc(cat.label.toLowerCase())}</td><td class="r">${K.formatBRL(t[cat.id])}</td></tr></tfoot></table>` : '';
    }).join('');

    const tasks = job.tasks.map((task) => `<div class="task"><strong>${esc(task.title)}</strong>
      <span class="muted"> · ${esc(C.specialty(task.specialty)?.short || '')}</span>
      <div class="cols"><div><em>Incluso no valor</em><ul>${(task.inclusions || []).map((x) => `<li>${esc(x)}</li>`).join('') || '<li>—</li>'}</ul></div>
      <div><em>Não incluso</em><ul>${(task.exclusions || []).map((x) => `<li>${esc(x)}</li>`).join('') || '<li>—</li>'}</ul></div></div></div>`).join('');

    const notes = [...new Set(job.specialties.map((s) => C.specialty(s)?.template.notes).filter(Boolean))];

    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(title)} ${esc(job.number)}</title>
<style>
  @page { size: A4; margin: 16mm; }
  body { font: 12px/1.45 -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #111; margin: 0; }
  header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
  h1 { font-size: 20px; margin: 0; } h2 { font-size: 14px; margin: 16px 0 6px; } h3 { font-size: 13px; margin: 14px 0 4px; }
  .muted { color: #555; font-size: 11px; } .r { text-align: right; }
  table { width: 100%; border-collapse: collapse; } th, td { border-bottom: 1px solid #ddd; padding: 4px 6px; vertical-align: top; }
  th { background: #f2f2f2; text-align: left; } tfoot td { font-weight: 600; border-bottom: none; }
  .banner { border: 2px solid #b45309; background: #fff7ed; padding: 8px; margin: 10px 0; font-weight: 600; }
  .totals { margin-left: auto; width: 280px; margin-top: 12px; } .totals td { border: none; } .grand td { font-size: 15px; font-weight: 700; border-top: 2px solid #111; }
  .task { border: 1px solid #ddd; padding: 6px 8px; margin: 6px 0; break-inside: avoid; } .cols { display: flex; gap: 16px; } .cols > div { flex: 1; } ul { margin: 2px 0; padding-left: 18px; }
  .sign { margin-top: 40px; display: flex; gap: 40px; } .sign div { flex: 1; border-top: 1px solid #111; text-align: center; padding-top: 4px; }
</style></head><body>
<header><div><h1>${esc(p.name || 'Prestador')}</h1><div class="muted">${[p.doc, p.phone, p.email].filter(Boolean).map(esc).join(' · ')}</div>
<div class="muted">${esc([p.address, p.city].filter(Boolean).join(' – '))}</div></div>
<div class="r"><strong>${esc(title)}</strong><br>Nº ${esc(job.number)}<br>Emissão: ${fmtDate(issued)}<br>Válido até: ${validUntil.toLocaleDateString('pt-BR')}${job.review ? `<br><span class="muted">Versão ${job.review.version}</span>` : ''}</div></header>
${job.estimateType === 'preliminary' ? '<div class="banner">ESTIMATIVA PRELIMINAR — valores baseados nas informações recebidas, sujeitos a confirmação no local.</div>' : ''}
${job.estimateType === 'awaiting_visit' ? '<div class="banner">AGUARDANDO VISITA TÉCNICA — valores de referência; o orçamento definitivo será emitido após a avaliação presencial.</div>' : ''}
<h2>Cliente</h2><div>${esc(client?.name || '')}${client?.phone ? ' · ' + esc(client.phone) : ''}${client?.email ? ' · ' + esc(client.email) : ''}</div>
<div class="muted">Local de execução: ${esc(job.request.address || client?.address || '—')}</div>
${job.scope ? `<h2>Escopo</h2><div>${nl2br(job.scope)}</div>` : ''}
${tasks ? `<h2>Tarefas — o que está contemplado</h2>${tasks}` : ''}
<h2>Itens</h2>${sections || '<p>—</p>'}
<table class="totals"><tr><td>Subtotal</td><td class="r">${K.formatBRL(t.subtotal)}</td></tr>
${t.discount ? `<tr><td>Desconto</td><td class="r">-${K.formatBRL(t.discount)}</td></tr>` : ''}
<tr class="grand"><td>Total</td><td class="r">${K.formatBRL(t.total)}</td></tr></table>
<h2>Condições</h2><div><strong>Pagamento:</strong> ${nl2br(job.paymentTerms || '—')}</div>
<div><strong>Validade:</strong> ${esc(job.validityDays)} dias</div>
${job.request.deadline ? `<div><strong>Prazo desejado pelo cliente:</strong> ${esc(job.request.deadline)}</div>` : ''}
${notes.length ? `<h2>Observações</h2><ul>${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
<div class="sign"><div>${esc(p.name || 'Prestador')}</div><div>De acordo: ${esc(client?.name || 'Cliente')}</div></div>
<script>window.onload = () => setTimeout(() => window.print(), 300);<\/script>
</body></html>`;
  }

  function open(job, client, settings) {
    const w = window.open('', '_blank');
    if (!w) { alert('Permita pop-ups para gerar o PDF.'); return; }
    w.document.open();
    w.document.write(build(job, client, settings));
    w.document.close();
  }

  root.PDF = { build, open };
})(window);
