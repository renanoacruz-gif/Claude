/* ============================================================
   LocaRetorno — ui.js  (helpers de DOM, modal, toast)
   ============================================================ */
(function () {
  'use strict';

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else node.setAttribute(k, v === true ? '' : String(v));
      }
    }
    (Array.isArray(children) ? children : children != null ? [children] : [])
      .filter(c => c !== null && c !== undefined && c !== false)
      .forEach(c => node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c));
    return node;
  }

  const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function money(v) { return fmtBRL.format(Number(v) || 0); }

  function fmtData(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
      ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  function fmtDataCurta(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg, isError) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.toggle('err', !!isError);
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
  }

  /* ---------- Modal ---------- */
  function openModal(builderFn, opts) {
    opts = opts || {};
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    content.innerHTML = '';
    builderFn(content);
    overlay.classList.remove('hidden');
    overlay.dataset.dismissible = opts.dismissible === false ? '0' : '1';
    overlay.onclick = (e) => {
      if (e.target === overlay && overlay.dataset.dismissible === '1') closeModal();
    };
  }
  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
    overlay.onclick = null;
    document.getElementById('modal-content').innerHTML = '';
  }

  /* ---------- Ícones por categoria (thumbnail do card) ---------- */
  const ICONES = {
    'Betoneira': '🏗️', 'Martelete': '🔨', 'Extensão': '🔌', 'Serra': '🪚',
    'Escada': '🪜', 'Tenda': '⛺', 'Cadeirão': '🪑', 'Caixa de Som': '🔊', 'Luminária': '💡'
  };
  function iconePara(nome) {
    for (const k of Object.keys(ICONES)) if (nome.toLowerCase().includes(k.toLowerCase())) return ICONES[k];
    return '📦';
  }

  window.UI = { el, money, fmtData, fmtDataCurta, toast, openModal, closeModal, iconePara };
})();
