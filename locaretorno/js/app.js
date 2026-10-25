/* ============================================================
   LocaRetorno — app.js  (orquestração, telas e fluxo principal)
   BLOCO A: Busca → Vistoria (OK/Avaria + foto obrigatória) → Laudo → WhatsApp
   Regras: PIN 4 dígitos, offline-first, foto obrigatória p/ avaria.
   ============================================================ */
(function () {
  'use strict';

  const { el, money, fmtData, fmtDataCurta, toast, openModal, closeModal, iconePara } = UI;

  /* ================= Estado global ================= */
  const state = {
    locacaoAtual: null,          // LocacaoAtiva em vistoria
    vistoriaDraft: null,         // rascunho de VistoriaDevolucao (persistido por locacao)
    catalogoMap: {}              // id_item -> ItemCatalogo
  };

  const DRAFT_KEY = 'lr_draft_';       // rascunhos no localStorage (ultra-rápido, offline)
  const PIN_KEY = 'lr_pin';
  const FUNC_KEY = 'lr_funcionario';

  /* ================= PIN / autenticação leve ================= */
  function getPin() { return localStorage.getItem(PIN_KEY) || '1234'; }

  function unlock() {
    sessionStorage.setItem('lr_unlocked', '1');
    document.getElementById('pin-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    route('home');
  }

  function initPinScreen() {
    const dotsWrap = document.getElementById('pin-dots');
    const keypad = document.getElementById('pin-keypad');
    let entered = '';

    function renderDots(shakeIdx) {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        dotsWrap.appendChild(el('div', {
          class: 'pin-dot' + (i < entered.length ? ' filled' : '') + (shakeIdx === i ? ' shake' : '')
        }));
      }
    }

    function press(k) {
      if (k === 'del') { entered = entered.slice(0, -1); renderDots(-1); return; }
      if (entered.length >= 4) return;
      entered += k;
      renderDots(-1);
      if (navigator.vibrate) navigator.vibrate(8);
      if (entered.length === 4) {
        setTimeout(() => {
          if (entered === getPin()) unlock();
          else {
            renderDots(entered.length - 1);
            if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
            toast('PIN incorreto', true);
            setTimeout(() => { entered = ''; renderDots(-1); }, 350);
          }
        }, 160);
      }
    }

    ['1','2','3','4','5','6','7','8','9','','0','⌫'].forEach(k => {
      if (k === '') { keypad.appendChild(el('div')); return; }
      keypad.appendChild(el('button', {
        class: 'key-btn' + (k === '⌫' ? ' util' : ''), text: k, type: 'button',
        onclick: () => press(k === '⌫' ? 'del' : k)
      }));
    });

    // Teclado físico (desktop/testes)
    window.addEventListener('keydown', (e) => {
      const pinVisible = !document.getElementById('pin-screen').classList.contains('hidden');
      if (!pinVisible) return;
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('del');
    });

    renderDots(-1);

    // Biometria (WebAuthn simplificado — opcional, se o dispositivo suportar)
    const bioBtn = document.getElementById('pin-biometry');
    if (window.PublicKeyCredential) {
      bioBtn.classList.remove('hidden');
      bioBtn.onclick = async () => {
        try {
          await navigator.credentials.get({
            publicKey: { challenge: crypto.getRandomValues(new Uint8Array(16)), timeout: 30000, userVerification: 'required' }
          });
          unlock();
        } catch (e) {
          toast('Biometria indisponível — use o PIN.', true);
        }
      };
    }
  }

  /* ================= Conexão online/offline ================= */
  function updateConnBadge() {
    const badge = document.getElementById('conn-badge');
    const txt = document.getElementById('conn-text');
    const online = navigator.onLine;
    badge.classList.toggle('offline', !online);
    txt.textContent = online ? 'Online' : 'Offline';
    if (online) flushSyncQueue();
  }

  /** Sincronização básica: ao voltar online, processa a fila local (simula upload das fotos/laudos). */
  async function flushSyncQueue() {
    try {
      const pending = await Store.pendingSync();
      if (!pending.length) return;
      for (const p of pending) await Store.clearSync(p.id);
      toast('✔ ' + pending.length + ' laudo(s) sincronizado(s)');
    } catch (e) { console.warn(e); }
  }

  /* ================= Roteador simples ================= */
  function route(name, param) {
    const root = document.getElementById('view-root');
    const bar = document.getElementById('bottom-bar');
    bar.classList.add('hidden');
    bar.innerHTML = '';
    root.innerHTML = '';
    window.scrollTo(0, 0);
    if (name === 'home') renderHome(root, bar);
    else if (name === 'vistoria') renderVistoria(root, bar, param);
    else if (name === 'laudo') renderLaudo(root, bar, param);
  }

  function formatTel(w) {
    const d = String(w).replace(/\D/g, '');
    if (d.length >= 12) return '+' + d.slice(0, 2) + ' (' + d.slice(2, 4) + ') ' + d.slice(4, 9) + '-' + d.slice(9);
    if (d.length >= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
    return w;
  }

  /* ================= TELA 1 — Inicial / Busca rápida ================= */
  async function renderHome(root, bar) {
    const search = el('input', {
      class: 'search-input', type: 'search', placeholder: 'Nome do cliente ou telefone…',
      autocomplete: 'off', enterkeyhint: 'search'
    });
    const listWrap = el('div');

    root.appendChild(el('h2', { text: 'Registrar Devolução', style: 'margin:4px 4px 12px;font-size:1.35rem;' }));
    root.appendChild(el('div', { class: 'search-wrap' }, [
      el('span', { class: 'search-icon', text: '🔎' }), search
    ]));
    root.appendChild(el('div', { class: 'section-title', text: 'Locações ativas' }));
    root.appendChild(listWrap);

    // Botão fixo inferior (sticky bottom)
    bar.classList.remove('hidden');
    bar.appendChild(el('button', {
      class: 'btn btn-primary', type: 'button',
      onclick: () => { search.focus(); toast('Digite o nome ou telefone do cliente'); }
    }, '➕ Registrar Devolução'));

    const todas = (await Store.listLocacoes()).filter(l => !l.devolvida);

    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

    function draw() {
      const q = norm(search.value.trim());
      const digits = search.value.replace(/\D/g, '');
      const filtered = !q ? todas : todas.filter(l =>
        norm(l.cliente_nome).includes(q) ||
        (digits.length >= 3 && l.cliente_whatsapp.includes(digits))
      );
      listWrap.innerHTML = '';
      if (!filtered.length) {
        listWrap.appendChild(el('div', { class: 'empty-state',
          text: q ? 'Nenhuma locação encontrada para esta busca.' : 'Nenhuma locação ativa cadastrada.' }));
        return;
      }
      filtered.forEach(l => {
        listWrap.appendChild(el('button', { class: 'card loc-card', type: 'button', onclick: () => goVistoria(l.id) }, [
          el('div', { class: 'row1' }, [
            el('span', { class: 'client', text: l.cliente_nome }),
            el('span', { class: 'date', text: 'saída ' + fmtDataCurta(l.data_saida) })
          ]),
          el('div', { class: 'meta' }, [
            el('span', { class: 'chip', text: '📦 ' + l.itens.length + (l.itens.length > 1 ? ' itens' : ' item') }),
            el('span', { text: '📱 ' + formatTel(l.cliente_whatsapp) })
          ])
        ]));
      });
    }

    search.addEventListener('input', draw);
    draw();
    setTimeout(() => search.focus(), 80);
  }

  /* ================= TELA 2 — Vistoria (CORE) ================= */
  async function goVistoria(locacaoId) {
    const loc = await Store.getLocacao(locacaoId);
    if (!loc) return toast('Locação não encontrada', true);

    const existente = await Store.findVistoriaByLocacao(locacaoId);
    if (existente) { state.locacaoAtual = loc; return route('laudo', existente); }

    state.locacaoAtual = loc;

    // Recupera rascunho salvo (sobrevive a fechar o app no meio da vistoria)
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY + locacaoId) || 'null'); } catch (e) {}
    if (!draft || draft.locacao_id !== locacaoId) {
      draft = {
        id: LR.uid('vis'),
        locacao_id: locacaoId,
        data_hora: new Date().toISOString(),
        funcionario_resp: localStorage.getItem(FUNC_KEY) || 'Balcão 1',
        status: 'em_andamento',
        itens_vistoriados: loc.itens.map(it => ({
          item_id: it.id_item, nome: it.nome, estado_saida: it.estado_saida,
          estado_chegada: null,        // OK | AVARIA | PERDA
          fotos: [], observacao: '', valor_cobranca: 0
        }))
      };
    }
    state.vistoriaDraft = draft;

    const cat = await Store.listCatalogo();
    state.catalogoMap = Object.fromEntries(cat.map(c => [c.id, c]));

    route('vistoria', loc);
  }

  function saveDraft() {
    if (!state.vistoriaDraft) return;
    try { localStorage.setItem(DRAFT_KEY + state.vistoriaDraft.locacao_id, JSON.stringify(state.vistoriaDraft)); }
    catch (e) { console.warn('rascunho não salvo', e); }
  }

  function renderVistoria(root, bar, loc) {
    const draft = state.vistoriaDraft;

    root.appendChild(el('button', { class: 'back-link', type: 'button', text: '← Voltar', onclick: () => route('home') }));
    root.appendChild(el('h2', { text: loc.cliente_nome, style: 'margin:0 0 2px;font-size:1.3rem;' }));
    root.appendChild(el('div', { class: 'item-sub', style: 'margin-bottom:8px',
      text: 'Saída: ' + fmtData(loc.data_saida) + ' · ' + formatTel(loc.cliente_whatsapp) }));

    // Barra de progresso superior ("X de Y itens vistoriados")
    const fill = el('div', { class: 'progress-fill', style: 'width:0%' });
    const labelCount = el('span', { text: '' });
    const totalValue = el('span', { text: '' });
    root.appendChild(el('div', { class: 'progress-wrap' }, [
      el('div', { class: 'progress-label' }, [labelCount, totalValue]),
      el('div', { class: 'progress-track' }, fill)
    ]));

    const listWrap = el('div');
    root.appendChild(listWrap);

    function doneItems() { return draft.itens_vistoriados.filter(i => i.estado_chegada).length; }
    function somaAvarias() {
      return draft.itens_vistoriados.reduce((s, i) =>
        s + ((i.estado_chegada === 'AVARIA' || i.estado_chegada === 'PERDA') ? Number(i.valor_cobranca) || 0 : 0), 0);
    }

    /* ---------- Rodapé sticky ---------- */
    const sumLabel = el('div', { class: 'item-sub hidden',
      style: 'position:absolute;top:-18px;left:16px;background:var(--color-bg-card);padding:0 6px;border-radius:6px;border:1px solid var(--color-border)' });
    const finishBtn = el('button', { class: 'btn btn-success', type: 'button', text: 'Finalizar Devolução' });
    bar.classList.remove('hidden');
    bar.appendChild(el('div', { style: 'position:relative;width:100%' }, [sumLabel, finishBtn]));
    finishBtn.onclick = finalize;

    function refreshProgress() {
      const n = doneItems(), t = draft.itens_vistoriados.length;
      fill.style.width = Math.round((n / t) * 100) + '%';
      fill.classList.toggle('complete', n === t);
      labelCount.textContent = n + ' de ' + t + ' itens vistoriados';
      totalValue.textContent = n === t ? '✔ Completo' : '';
      finishBtn.disabled = n < t;
      finishBtn.textContent = n === t ? '✅ Finalizar Devolução' : 'Faltam ' + (t - n) + ' item(ns)';
      sumLabel.textContent = somaAvarias() > 0 ? 'Cobrança atual: ' + money(somaAvarias()) : '';
      sumLabel.classList.toggle('hidden', somaAvarias() <= 0);
    }

    function statusPill(iv) {
      if (iv.estado_chegada === 'OK')     return el('span', { class: 'status-pill status-ok', text: '✓ OK' });
      if (iv.estado_chegada === 'AVARIA') return el('span', { class: 'status-pill status-avaria', text: '✖ AVARIA' + (iv.valor_cobranca ? ' · ' + money(iv.valor_cobranca) : '') });
      if (iv.estado_chegada === 'PERDA')  return el('span', { class: 'status-pill status-perda', text: '⚠ PERDA' + (iv.valor_cobranca ? ' · ' + money(iv.valor_cobranca) : '') });
      return el('span', { class: 'status-pill status-pending', text: '… pendente' });
    }

    function drawItems() {
      listWrap.innerHTML = '';
      draft.itens_vistoriados.forEach((iv, idx) => {
        const thumb = el('div', { class: 'item-thumb' },
          iv.fotos.length ? el('img', { src: iv.fotos[0], alt: 'prova' }) : iconePara(iv.nome));
        const actions = el('div', { class: 'item-actions' });

        if (iv.estado_chegada) {
          actions.appendChild(statusPill(iv));
          actions.appendChild(el('button', {
            class: 'big-btn big-avaria', style: 'min-width:52px;background:#fff;color:var(--color-brand);border-color:var(--color-border)',
            title: 'Editar', text: '✏️', type: 'button', onclick: () => editItem(idx)
          }));
        } else {
          actions.appendChild(el('button', {
            class: 'big-btn big-ok', text: 'OK ✓', type: 'button',
            onclick: () => { iv.estado_chegada = 'OK'; saveDraft(); drawItems(); refreshProgress(); autoAdvance(idx); }
          }));
          actions.appendChild(el('button', {
            class: 'big-btn big-avaria', text: 'Avaria ✖', type: 'button',
            onclick: () => openAvariaModal(idx)
          }));
        }

        listWrap.appendChild(el('div', { class: 'card item-card', dataset: { idx: String(idx) } }, [
          thumb,
          el('div', { class: 'item-info' }, [
            el('div', { class: 'item-name', text: iv.nome }),
            el('div', { class: 'item-sub', text: 'Saída: ' + (iv.estado_saida || '—') })
          ]),
          actions
        ]));
      });
    }

    // Velocidade > perfeição: rola até o próximo item pendente
    function autoAdvance(fromIdx) {
      let nextPending = -1;
      for (let i = fromIdx + 1; i < draft.itens_vistoriados.length; i++) {
        if (!draft.itens_vistoriados[i].estado_chegada) { nextPending = i; break; }
      }
      if (nextPending < 0) nextPending = draft.itens_vistoriados.findIndex(x => !x.estado_chegada);
      if (nextPending >= 0) {
        const node = listWrap.querySelector('[data-idx="' + nextPending + '"]');
        if (node && typeof node.scrollIntoView === 'function') {
          try { node.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
        }
      }
    }

    function editItem(idx) {
      const iv = draft.itens_vistoriados[idx];
      if (iv.estado_chegada === 'OK') {
        openModal((m) => {
          m.appendChild(el('h3', { class: 'modal-title', text: iv.nome }));
          m.appendChild(el('p', { class: 'modal-sub', text: 'Item marcado como OK. O que deseja fazer?' }));
          m.appendChild(el('button', { class: 'btn btn-danger', style: 'margin-bottom:10px',
            text: '✖ Na verdade tem avaria/problema', onclick: () => { closeModal(); openAvariaModal(idx); } }));
          m.appendChild(el('button', { class: 'btn btn-ghost', text: 'Manter OK', onclick: closeModal }));
        });
      } else {
        openAvariaModal(idx);
      }
    }

    /* ---------- Modal OBRIGATÓRIO de avaria (foto exigida) ---------- */
    function openAvariaModal(idx) {
      const iv = draft.itens_vistoriados[idx];
      const catItem = state.catalogoMap[iv.item_id];
      const suggested = Number(iv.valor_cobranca) || (catItem ? Number(catItem.valor_reparo_estimado) : 0);
      const fotos = [...(iv.fotos || [])];
      let tipo = iv.estado_chegada === 'PERDA' ? 'PERDA' : 'AVARIA';

      openModal((m) => {
        m.appendChild(el('h3', { class: 'modal-title', text: (tipo === 'PERDA' ? '⚠ ' : '✖ ') + iv.nome }));
        m.appendChild(el('p', { class: 'modal-sub', text: 'Anexe a prova fotográfica. Sem foto o item NÃO pode ser marcado com problema.' }));

        // Tipo de problema: seletor rápido (sem digitação)
        const segOk = el('button', { class: 'suggest-chip', type: 'button', text: '✖ Avaria' });
        const segPerda = el('button', { class: 'suggest-chip', type: 'button', text: '⚠ Perda' });
        function paintSeg() {
          segOk.classList.toggle('active', tipo === 'AVARIA');
          segPerda.classList.toggle('active', tipo === 'PERDA');
        }
        segOk.onclick = () => { tipo = 'AVARIA'; paintSeg(); };
        segPerda.onclick = () => { tipo = 'PERDA'; paintSeg(); };
        paintSeg();
        m.appendChild(el('div', { class: 'suggest-row', style: 'margin:0 0 6px' }, [segOk, segPerda]));

        // ---- Fotos ----
        m.appendChild(el('label', { class: 'field-label', html: 'Prova fotográfica <span class="req-tag">(obrigatória)</span>' }));
        const zone = el('div', { class: 'photo-zone' });
        const fileCam = el('input', { type: 'file', accept: 'image/*', capture: 'environment', multiple: '' });
        const fileLib = el('input', { type: 'file', accept: 'image/*', multiple: '' });

        const confirmBtn = el('button', { class: 'btn btn-danger', type: 'button', text: '✔ Confirmar avaria' });

        function drawZone() {
          zone.innerHTML = '';
          zone.classList.toggle('missing', fotos.length === 0);
          if (!fotos.length) {
            zone.appendChild(el('div', { style: 'text-align:center;color:var(--color-text-muted);padding:16px' }, [
              el('div', { style: 'font-size:2rem', text: '📷' }),
              el('div', { style: 'font-weight:800;margin-top:4px', text: 'Sem foto — avaria bloqueada' })
            ]));
          } else {
            const grid = el('div', { class: 'photo-preview-grid' });
            fotos.forEach((src, i) => {
              grid.appendChild(el('div', { class: 'photo-preview' }, [
                el('img', { src, alt: 'prova ' + (i + 1) }),
                el('button', { class: 'photo-remove', type: 'button', text: '×',
                  onclick: () => { fotos.splice(i, 1); drawZone(); } })
              ]));
            });
            zone.appendChild(grid);
          }
          confirmBtn.disabled = fotos.length === 0;
        }

        async function handleFiles(files) {
          let added = 0;
          for (const f of Array.from(files).slice(0, 4)) {
            try { fotos.push(await LR.compressImage(f)); added++; } catch (e) { toast('Falha ao processar imagem', true); }
          }
          if (!added && fotos.length === 0 && files.length) {
            // Fallback (testes/dispositivos sem decodificação): usa dataURL direto do arquivo.
            for (const f of Array.from(files).slice(0, 4)) {
              try {
                const dataUrl = await new Promise((res, rej) => {
                  const r = new FileReader();
                  r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f);
                });
                fotos.push(dataUrl);
              } catch (e) { /* ignora */ }
            }
          }
          drawZone();
        }
        fileCam.onchange = () => handleFiles(fileCam.files);
        fileLib.onchange = () => handleFiles(fileLib.files);

        m.appendChild(zone);
        m.appendChild(el('div', { class: 'photo-buttons' }, [
          el('button', { class: 'btn btn-primary', type: 'button', text: '📷 Tirar foto', onclick: () => fileCam.click() }),
          el('button', { class: 'btn btn-ghost', type: 'button', text: '🖼 Galeria', onclick: () => fileLib.click() })
        ]));
        m.appendChild(fileCam); m.appendChild(fileLib);

        // ---- Observação ----
        m.appendChild(el('label', { class: 'field-label', text: 'Descrição do problema' }));
        const obs = el('textarea', { class: 'textarea-input', maxlength: '180',
          placeholder: 'Ex.: risco profundo no cabo, motor não liga…' });
        obs.value = iv.observacao || '';
        m.appendChild(obs);

        // ---- Valor sugerido ----
        m.appendChild(el('label', { class: 'field-label', text: 'Valor de cobrança (R$)' }));
        const wrap = el('div', { class: 'money-wrap' });
        const val = el('input', { class: 'text-input money-input', type: 'number', inputmode: 'decimal', min: '0', step: '0.5' });
        val.value = suggested ? String(suggested) : '';
        wrap.appendChild(val);
        m.appendChild(wrap);
        if (catItem && catItem.valor_reparo_estimado) {
          const sug = Number(catItem.valor_reparo_estimado);
          const chips = el('div', { class: 'suggest-row' });
          [[sug, 'Sugerido'], [Math.round(sug * 0.5), '50%'], [sug * 2, 'Integral']].forEach((pair, i) => {
            const c = el('button', { class: 'suggest-chip' + (i === 0 ? ' active' : ''), type: 'button',
              text: money(pair[0]) + ' · ' + pair[1], onclick: () => {
                val.value = String(pair[0]);
                chips.querySelectorAll('.suggest-chip').forEach(x => x.classList.remove('active'));
                c.classList.add('active');
              } });
            chips.appendChild(c);
          });
          m.appendChild(chips);
          m.appendChild(el('div', { class: 'item-sub', style: 'margin-top:6px',
            text: 'Reparo estimado do catálogo: ' + money(sug) }));
        }

        const err = el('div', { class: 'error-text hidden', text: '⚠ Foto obrigatória para registrar avaria.' });
        m.appendChild(err);

        const cancelBtn = el('button', { class: 'btn btn-ghost', type: 'button', text: 'Cancelar' });
        drawZone();

        cancelBtn.onclick = closeModal;
        confirmBtn.onclick = () => {
          if (!fotos.length) { err.classList.remove('hidden'); zone.classList.add('missing'); return; }
          iv.estado_chegada = tipo;
          iv.fotos = fotos;
          iv.observacao = obs.value.trim();
          iv.valor_cobranca = Math.max(0, Number(val.value) || 0);
          saveDraft();
          closeModal();
          drawItems(); refreshProgress();
          autoAdvance(idx);
          toast(iv.nome + ': ' + (tipo === 'PERDA' ? 'perda' : 'avaria') + ' registrada');
        };

        m.appendChild(el('div', { style: 'display:flex;gap:10px;margin-top:20px' }, [cancelBtn, confirmBtn]));
      }, { dismissible: false });
    }

    /* ---------- Finalizar ---------- */
    async function finalize() {
      const v = state.vistoriaDraft;
      v.status = 'finalizada';
      v.data_hora = new Date().toISOString();
      v.total_cobranca = somaAvarias();
      v.avarias = v.itens_vistoriados.filter(i => i.estado_chegada === 'AVARIA').length;
      v.perdas = v.itens_vistoriados.filter(i => i.estado_chegada === 'PERDA').length;
      await Store.saveVistoria(v);
      // fila de sincronização (upload das fotos quando online)
      await Store.enqueueSync({ id: v.id, tipo: 'laudo', vistoria_id: v.id, criado_em: new Date().toISOString() });
      localStorage.removeItem(DRAFT_KEY + v.locacao_id);
      const loc = state.locacaoAtual;
      loc.devolvida = true;
      await Store.saveLocacao(loc);
      updateConnBadge();
      route('laudo', v);
    }

    drawItems();
    refreshProgress();
  }

  /* ================= TELA 3 — Laudo / Resumo + WhatsApp ================= */
  function renderLaudo(root, bar, vistoria) {
    const loc = state.locacaoAtual;
    const problems = vistoria.itens_vistoriados.filter(i => i.estado_chegada && i.estado_chegada !== 'OK');
    const oks = vistoria.itens_vistoriados.filter(i => i.estado_chegada === 'OK');
    const total = vistoria.total_cobranca != null ? vistoria.total_cobranca
      : vistoria.itens_vistoriados.reduce((s, i) => s + (i.estado_chegada !== 'OK' ? Number(i.valor_cobranca) || 0 : 0), 0);

    root.appendChild(el('button', { class: 'back-link', type: 'button', text: '← Voltar às devoluções', onclick: () => route('home') }));

    root.appendChild(el('div', { class: 'card summary-hero ' + (problems.length ? 'bad' : 'ok') }, [
      el('div', { style: 'font-size:2.4rem', text: problems.length ? '📋' : '✅' }),
      el('div', { class: 'big-num', text: problems.length ? money(total) : 'Sem avarias' }),
      el('div', { style: 'color:var(--color-text-muted);font-weight:700;margin-top:6px',
        text: problems.length ? 'Total de reparos a cobrar' : 'Devolução 100% aprovada' })
    ]));

    root.appendChild(el('div', { class: 'kpi-row' }, [
      el('div', { class: 'kpi' }, [el('div', { class: 'v', text: String(oks.length) }), el('div', { class: 'l', text: 'OK' })]),
      el('div', { class: 'kpi' }, [el('div', { class: 'v', style: 'color:var(--color-danger)',
        text: String(vistoria.avarias != null ? vistoria.avarias : problems.filter(p => p.estado_chegada === 'AVARIA').length) }),
        el('div', { class: 'l', text: 'Avarias' })]),
      el('div', { class: 'kpi' }, [el('div', { class: 'v', style: 'color:var(--color-warning)',
        text: String(vistoria.perdas != null ? vistoria.perdas : problems.filter(p => p.estado_chegada === 'PERDA').length) }),
        el('div', { class: 'l', text: 'Perdas' })])
    ]));

    root.appendChild(el('div', { class: 'section-title', text: 'Itens vistoriados · ' + fmtData(vistoria.data_hora) }));

    vistoria.itens_vistoriados.forEach(iv => {
      let pill;
      if (iv.estado_chegada === 'OK')          pill = el('span', { class: 'status-pill status-ok', text: '✓ OK' });
      else if (iv.estado_chegada === 'PERDA')  pill = el('span', { class: 'status-pill status-perda', text: '⚠ PERDA · ' + money(iv.valor_cobranca) });
      else                                     pill = el('span', { class: 'status-pill status-avaria', text: '✖ AVARIA · ' + money(iv.valor_cobranca) });
      root.appendChild(el('div', { class: 'card laudo-item' }, [
        (iv.fotos && iv.fotos.length) ? el('img', { class: 'prova', src: iv.fotos[0], alt: 'prova fotográfica' })
          : el('div', { class: 'item-thumb' }, iconePara(iv.nome)),
        el('div', { class: 'item-info' }, [
          el('div', { style: 'display:flex;justify-content:space-between;gap:8px;align-items:center' }, [
            el('div', { class: 'item-name', text: iv.nome }), pill
          ]),
          iv.observacao ? el('div', { class: 'item-sub', text: '“' + iv.observacao + '”' }) : null
        ])
      ]));
    });

    if (total > 0) root.appendChild(el('div', { class: 'laudo-total', text: 'Total a cobrar: ' + money(total) }));

    bar.classList.remove('hidden');
    bar.appendChild(el('button', {
      class: 'btn btn-whatsapp', type: 'button', text: '📲 Enviar Laudo no WhatsApp',
      onclick: () => sendWhatsApp(vistoria, total)
    }));
  }

  function buildMensagem(vistoria, total) {
    const loc = state.locacaoAtual;
    const nome = loc ? loc.cliente_nome : 'cliente';
    const problemas = vistoria.itens_vistoriados.filter(i => i.estado_chegada && i.estado_chegada !== 'OK');
    const n = problemas.length;

    let msg = 'Olá ' + nome + ', sua devolução foi registrada.';
    if (n) {
      msg += ' Identificamos ' + n + ' ' + (n > 1 ? 'avarias/problemas' : 'avaria') + '. Veja o laudo: [Link].' + '\n\n';
      problemas.forEach(p => {
        msg += '• ' + p.nome + ' (' + p.estado_chegada + '): ' + (p.observacao || 'sem descrição') + ' — ' + money(p.valor_cobranca) + '\n';
      });
      msg += '\nValor total de reparos: ' + money(total) + '.';
    } else {
      msg += ' Nenhum problema identificado. Tudo certo! ✅';
    }
    msg += '\n\nResponsável: ' + vistoria.funcionario_resp + '\nLocaRetorno — proteção patrimonial';
    return msg;
  }

  function sendWhatsApp(vistoria, total) {
    const loc = state.locacaoAtual;
    const tel = loc ? loc.cliente_whatsapp : '';
    const msg = encodeURIComponent(buildMensagem(vistoria, total));
    const url = tel ? 'https://wa.me/' + LR.normalizarTel(tel) + '?text=' + msg : 'https://wa.me/?text=' + msg;
    window.open(url, '_blank');
    if (!navigator.onLine) toast('Sem conexão — mensagem preparada, envie ao reconectar.', true);
  }

  /* ================= Bootstrap ================= */
  async function boot() {
    // Reset por segurança: o HTML começa com #app visível e telas ocultas;
    // o estado real só é decidido após init + checagem de sessão.
    document.getElementById('app').classList.add('hidden');
    document.getElementById('pin-screen').classList.remove('hidden');

    initPinScreen();
    window.addEventListener('online', updateConnBadge);
    window.addEventListener('offline', updateConnBadge);
    try {
      await Store.init();
    } catch (e) {
      console.error(e);
      document.body.innerHTML = '<p style="padding:24px;font-family:sans-serif">Erro ao iniciar banco local. Tente outro navegador.</p>';
      return;
    }
    updateConnBadge();
    if (sessionStorage.getItem('lr_unlocked') === '1') unlock();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
