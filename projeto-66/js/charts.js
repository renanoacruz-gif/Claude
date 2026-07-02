/* =============================================================
   PROJETO 66 — Gráficos SVG (sem bibliotecas)
   Marcas finas, extremidades arredondadas ancoradas na base,
   grid recessivo, tooltip em hover. Paleta validada em P66.VIZ.
   ============================================================= */
'use strict';

P66.Charts = (() => {
  const V = P66.VIZ;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- tooltip singleton ---------- */
  const tip = () => document.getElementById('chart-tip');
  function showTip(evt, html) {
    const t = tip();
    if (!t) return;
    t.innerHTML = html;
    t.hidden = false;
    const pad = 14;
    let x = evt.clientX + pad, y = evt.clientY + pad;
    const r = t.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 8) x = evt.clientX - r.width - pad;
    if (y + r.height > window.innerHeight - 8) y = evt.clientY - r.height - pad;
    t.style.left = x + 'px';
    t.style.top = y + 'px';
  }
  function hideTip() { const t = tip(); if (t) t.hidden = true; }

  function svgEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  /* barra com topo arredondado ancorada na base */
  function barPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    if (h <= 0) return '';
    return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`;
  }

  /* ---------- barras verticais (% por dia) ---------- */
  function bars(el, data, opts = {}) {
    el.innerHTML = '';
    const W = el.clientWidth || 320, H = opts.height || 180;
    const padL = 30, padB = 22, padT = 10, padR = 6;
    const iw = W - padL - padR, ih = H - padT - padB;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: H, role: 'img' });
    const max = opts.max || 100;

    [0, 50, 100].forEach(v => {
      const y = padT + ih - (v / max) * ih;
      svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: W - padR, y2: y, stroke: v === 0 ? 'rgba(255,255,255,0.14)' : V.grid, 'stroke-width': 1 }));
      const lab = svgEl('text', { x: padL - 7, y: y + 3.5, 'text-anchor': 'end', fill: V.ink3, 'font-size': 10 });
      lab.textContent = v;
      svg.appendChild(lab);
    });

    const n = data.length;
    const slot = iw / n;
    const bw = Math.min(26, Math.max(6, slot - 4));
    data.forEach((d, i) => {
      const val = Math.max(0, Math.min(max, d.pct ?? d.value ?? 0));
      const h = (val / max) * ih;
      const x = padL + i * slot + (slot - bw) / 2;
      const y = padT + ih - h;
      const isToday = d.key === P66.Store.today();
      const p = svgEl('path', {
        d: barPath(x, y, bw, h, 4),
        fill: isToday ? V.heat[3] : V.series[0],
        opacity: d.future ? 0.25 : 1,
      });
      // alvo de hover maior que a marca
      const hit = svgEl('rect', { x: padL + i * slot, y: padT, width: slot, height: ih, fill: 'transparent' });
      hit.addEventListener('mousemove', e => showTip(e, `<strong>${d.label}</strong><br>${d.done !== undefined ? `${d.done}/${d.total} hábitos · ` : ''}${val}%`));
      hit.addEventListener('mouseleave', hideTip);
      svg.appendChild(p);
      if (h > 0 || true) svg.appendChild(hit);
      if (n <= 12 || i % Math.ceil(n / 10) === 0) {
        const lab = svgEl('text', { x: padL + i * slot + slot / 2, y: H - 6, 'text-anchor': 'middle', fill: isToday ? V.ink2 : V.ink3, 'font-size': 10 });
        lab.textContent = d.label;
        svg.appendChild(lab);
      }
    });
    el.appendChild(svg);
  }

  /* ---------- linha com área (evolução) ---------- */
  function line(el, data, opts = {}) {
    el.innerHTML = '';
    const W = el.clientWidth || 320, H = opts.height || 200;
    const padL = 30, padB = 22, padT = 10, padR = 10;
    const iw = W - padL - padR, ih = H - padT - padB;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: H, role: 'img' });
    const max = opts.max || 100;
    const n = data.length;
    const X = i => padL + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
    const Y = v => padT + ih - (Math.max(0, Math.min(max, v)) / max) * ih;

    [0, 50, 100].forEach(v => {
      const y = Y(v);
      svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: W - padR, y2: y, stroke: v === 0 ? 'rgba(255,255,255,0.14)' : V.grid, 'stroke-width': 1 }));
      const lab = svgEl('text', { x: padL - 7, y: y + 3.5, 'text-anchor': 'end', fill: V.ink3, 'font-size': 10 });
      lab.textContent = v;
      svg.appendChild(lab);
    });

    const pts = data.map((d, i) => [X(i), Y(d.pct ?? d.value ?? 0)]);
    const lineD = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const areaD = lineD + ` L${pts[pts.length - 1][0]},${padT + ih} L${pts[0][0]},${padT + ih} Z`;

    const gid = 'g' + Math.random().toString(36).slice(2, 8);
    const defs = svgEl('defs', {});
    defs.innerHTML = `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${V.series[0]}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${V.series[0]}" stop-opacity="0"/></linearGradient>`;
    svg.appendChild(defs);
    svg.appendChild(svgEl('path', { d: areaD, fill: `url(#${gid})` }));
    svg.appendChild(svgEl('path', { d: lineD, fill: 'none', stroke: V.series[0], 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));

    // rótulos esparsos no eixo X (sem colidir com o último)
    const step = Math.max(1, Math.ceil(n / 6));
    data.forEach((d, i) => {
      if (i % step !== 0 && i !== n - 1) return;
      if (i !== n - 1 && n - 1 - i < step * 0.6) return;
      const lab = svgEl('text', { x: X(i), y: H - 6, 'text-anchor': 'middle', fill: V.ink3, 'font-size': 10 });
      lab.textContent = d.label;
      svg.appendChild(lab);
    });

    // crosshair + tooltip
    const cursor = svgEl('line', { x1: 0, y1: padT, x2: 0, y2: padT + ih, stroke: 'rgba(255,255,255,0.25)', 'stroke-width': 1, visibility: 'hidden' });
    const dot = svgEl('circle', { r: 4, fill: V.heat[3], stroke: V.surface, 'stroke-width': 2, visibility: 'hidden' });
    svg.appendChild(cursor); svg.appendChild(dot);
    const hit = svgEl('rect', { x: padL, y: padT, width: iw, height: ih, fill: 'transparent' });
    hit.addEventListener('mousemove', e => {
      const box = svg.getBoundingClientRect();
      const mx = (e.clientX - box.left) * (W / box.width);
      let i = Math.round(((mx - padL) / iw) * (n - 1));
      i = Math.max(0, Math.min(n - 1, i));
      cursor.setAttribute('x1', X(i)); cursor.setAttribute('x2', X(i));
      cursor.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', X(i)); dot.setAttribute('cy', Y(data[i].pct ?? data[i].value ?? 0));
      dot.setAttribute('visibility', 'visible');
      const d = data[i];
      showTip(e, `<strong>${d.label}</strong><br>${d.done !== undefined ? `${d.done}/${d.total} hábitos · ` : ''}${d.pct ?? d.value ?? 0}%`);
    });
    hit.addEventListener('mouseleave', () => { cursor.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); hideTip(); });
    svg.appendChild(hit);
    el.appendChild(svg);
  }

  /* ---------- heatmap dos 66 dias ---------- */
  function heatColor(pct) {
    if (pct <= 0) return V.heatZero;
    if (pct < 34) return V.heat[0];
    if (pct < 67) return V.heat[1];
    if (pct < 100) return V.heat[2];
    return V.heat[3];
  }
  function heatmap(el, cells, opts = {}) {
    el.innerHTML = '';
    const cols = opts.cols || 11; // 11 x 6 = 66
    const size = 15, gap = 3;
    const rows = Math.ceil(cells.length / cols);
    const W = cols * (size + gap) - gap, H = rows * (size + gap) - gap;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', style: 'max-width:' + (W * 1.6) + 'px', role: 'img' });
    cells.forEach((c, i) => {
      const x = (i % cols) * (size + gap), y = Math.floor(i / cols) * (size + gap);
      const attrs = { x, y, width: size, height: size, rx: 3.5 };
      if (c.state === 'future') {
        Object.assign(attrs, { fill: 'transparent', stroke: 'rgba(255,255,255,0.07)', 'stroke-width': 1 });
      } else {
        Object.assign(attrs, { fill: heatColor(c.pct) });
        if (c.state === 'today') Object.assign(attrs, { stroke: V.ink, 'stroke-width': 1.4 });
      }
      const r = svgEl('rect', attrs);
      r.addEventListener('mousemove', e => showTip(e,
        `<strong>Dia ${c.dayNum}</strong> · ${P66.Store.fmtDate(c.key)}<br>` +
        (c.state === 'future' ? 'Ainda por vir' : `${c.pct}% executado`)));
      r.addEventListener('mouseleave', hideTip);
      svg.appendChild(r);
    });
    el.appendChild(svg);
  }

  /* ---------- calendário mensal de execução ---------- */
  function calendar(el, year, month) {
    el.innerHTML = '';
    const S = P66.Store;
    const first = new Date(year, month, 1);
    const daysIn = new Date(year, month + 1, 0).getDate();
    const startWd = first.getDay();
    const head = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const wrap = document.createElement('div');
    wrap.className = 'cal-grid';
    head.forEach(h => {
      const c = document.createElement('div');
      c.className = 'cal-head'; c.textContent = h;
      wrap.appendChild(c);
    });
    for (let i = 0; i < startWd; i++) wrap.appendChild(document.createElement('div'));
    for (let d = 1; d <= daysIn; d++) {
      const k = S.dkey(new Date(year, month, d));
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      const c = S.completionForDay(k);
      const isFuture = k > S.today();
      const inLog = !!S.day(k);
      if (!isFuture && inLog) {
        cell.style.background = heatColor(c.pct);
        if (c.pct >= 67) cell.classList.add('cal-dark-ink');
      } else if (!isFuture) {
        cell.style.background = V.heatZero;
      }
      if (k === S.today()) cell.classList.add('cal-today');
      if (isFuture) cell.classList.add('cal-future');
      cell.textContent = d;
      cell.addEventListener('mousemove', e => showTip(e,
        `<strong>${S.fmtDate(k)}</strong><br>` + (isFuture ? 'Ainda por vir' : (inLog ? `${c.done}/${c.total} hábitos · ${c.pct}%` : 'Sem registro'))));
      cell.addEventListener('mouseleave', hideTip);
      wrap.appendChild(cell);
    }
    el.appendChild(wrap);
  }

  /* ---------- medidor circular ---------- */
  function ringSVG(pct, opts = {}) {
    const size = opts.size || 92, sw = opts.stroke || 8;
    const r = (size - sw) / 2, c = 2 * Math.PI * r;
    const val = Math.max(0, Math.min(100, pct));
    const color = opts.color || (val >= 70 ? V.good : val >= 40 ? V.series[0] : V.bad);
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="ring" role="img" aria-label="${val}%">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="${sw}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}"
        stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - val / 100)}"
        transform="rotate(-90 ${size / 2} ${size / 2})" class="ring-value"/>
      <text x="50%" y="50%" dy="0.36em" text-anchor="middle" fill="${V.ink}" font-size="${size * 0.24}" font-weight="700">${Math.round(val)}</text>
    </svg>`;
  }

  /* ---------- barras horizontais (força dos hábitos) ---------- */
  function hbars(el, data, opts = {}) {
    el.innerHTML = '';
    const rows = data.map(d => {
      const val = Math.max(0, Math.min(100, d.rate ?? d.value ?? 0));
      const color = opts.color || V.series[0];
      return `<div class="hbar-row" data-tip="${(d.tip || '').replace(/"/g, '&quot;')}">
        <span class="hbar-label">${d.label}</span>
        <span class="hbar-track"><span class="hbar-fill" style="width:${val}%;background:${color}"></span></span>
        <span class="hbar-val">${val}%</span>
      </div>`;
    }).join('');
    el.innerHTML = rows;
    el.querySelectorAll('.hbar-row[data-tip]').forEach(r => {
      const t = r.getAttribute('data-tip');
      if (!t) return;
      r.addEventListener('mousemove', e => showTip(e, t));
      r.addEventListener('mouseleave', hideTip);
    });
  }

  return { bars, line, heatmap, calendar, ringSVG, hbars, heatColor, showTip, hideTip };
})();
