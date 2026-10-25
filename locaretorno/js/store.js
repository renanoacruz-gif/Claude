/* ============================================================
   LocaRetorno — store.js
   Camada de dados offline-first: IndexedDB com fallback LocalStorage.
   Entidades do MVP: LocacaoAtiva, ItemCatalogo, VistoriaDevolucao.
   Fotos são comprimidas em base64 (dataURL) e guardadas localmente;
   fila de sincronização simula upload quando a conexão volta.
   ============================================================ */
(function () {
  'use strict';

  const DB_NAME = 'locaretorno';
  const DB_VERSION = 1;
  const STORES = ['locacoes', 'catalogo', 'vistorias', 'sync'];
  const LS_PREFIX = 'lr_';

  /* ---------- Backend IndexedDB ---------- */
  function idbOpen() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('sem indexedDB'));
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        STORES.forEach(s => {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('bloqueado'));
    });
  }

  function idbTx(db, store, mode, fn) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const os = tx.objectStore(store);
      let out;
      try { out = fn(os); } catch (e) { return reject(e); }
      tx.oncomplete = () => resolve(out && out.result !== undefined ? out.result : undefined);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  /* ---------- Fallback LocalStorage ---------- */
  const LS = {
    all(store) {
      try { return JSON.parse(localStorage.getItem(LS_PREFIX + store) || '[]'); }
      catch (e) { return []; }
    },
    saveAll(store, arr) { localStorage.setItem(LS_PREFIX + store, JSON.stringify(arr)); },
    put(store, obj) {
      const arr = LS.all(store);
      const i = arr.findIndex(x => x.id === obj.id);
      if (i >= 0) arr[i] = obj; else arr.push(obj);
      LS.saveAll(store, arr);
    },
    get(store, id) { return LS.all(store).find(x => x.id === id) || null; },
    del(store, id) { LS.saveAll(store, LS.all(store).filter(x => x.id !== id)); }
  };

  /* ---------- API pública ---------- */
  class Store {
    constructor() { this.db = null; this.useLS = false; }

    async init() {
      try {
        this.db = await idbOpen();
        this.useLS = false;
      } catch (e) {
        console.warn('[LocaRetorno] IndexedDB indisponível — usando LocalStorage.', e);
        this.useLS = true;
      }
      await this._seed();
    }

    /* --- genéricos --- */
    async _all(store) {
      if (this.useLS) return LS.all(store);
      return idbTx(this.db, store, 'readonly', os => os.getAll());
    }
    async _get(store, id) {
      if (this.useLS) return LS.get(store, id);
      return idbTx(this.db, store, 'readonly', os => os.get(id));
    }
    async _put(store, obj) {
      if (this.useLS) return LS.put(store, obj);
      return idbTx(this.db, store, 'readwrite', os => os.put(obj));
    }
    async _del(store, id) {
      if (this.useLS) return LS.del(store, id);
      return idbTx(this.db, store, 'readwrite', os => os.delete(id));
    }

    /* --- Locações ativas --- */
    async listLocacoes() {
      const arr = await this._all('locacoes');
      return arr.sort((a, b) => new Date(b.data_saida) - new Date(a.data_saida));
    }
    async getLocacao(id) { return this._get('locacoes', id); }
    async saveLocacao(l) { return this._put('locacoes', l); }

    /* --- Catálogo --- */
    async listCatalogo() { return this._all('catalogo'); }
    async getCatalogoItem(id) { return this._get('catalogo', id); }
    async saveCatalogoItem(i) { return this._put('catalogo', i); }

    /* --- Vistorias --- */
    async listVistorias() {
      const arr = await this._all('vistorias');
      return arr.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
    }
    async getVistoria(id) { return this._get('vistorias', id); }
    async saveVistoria(v) { return this._put('vistorias', v); }
    async findVistoriaByLocacao(locacaoId) {
      const arr = await this._all('vistorias');
      return arr.find(v => v.locacao_id === locacaoId && v.status === 'finalizada') || null;
    }

    /* --- Fila de sincronização (modo offline básico) --- */
    async enqueueSync(payload) { return this._put('sync', payload); }
    async pendingSync() { return this._all('sync'); }
    async clearSync(id) { return this._del('sync', id); }

    /* ---------- Seed de demonstração ---------- */
    async _seed() {
      const existing = await this._all('locacoes');
      if (existing.length) return;

      const catalogo = [
        { id: 'cat-betoneira',  nome: 'Betoneira 390L',            categoria: 'Construção', valor_reparo_estimado: 250 },
        { id: 'cat-martelete',  nome: 'Martelete Rotativo 800W',   categoria: 'Construção', valor_reparo_estimado: 180 },
        { id: 'cat-extensao',   nome: 'Extensão Elétrica 10m',     categoria: 'Elétricos',  valor_reparo_estimado: 30 },
        { id: 'cat-serra',      nome: 'Serra Circular 1400W',      categoria: 'Construção', valor_reparo_estimado: 160 },
        { id: 'cat-escada',     nome: 'Escada Alumínio 7 Degraus', categoria: 'Acesso',     valor_reparo_estimado: 120 },
        { id: 'cat-tenda',      nome: 'Tenda Branca 3x3m',         categoria: 'Festas',     valor_reparo_estimado: 200 },
        { id: 'cat-cadeirinha', nome: 'Cadeirão Infantil (cx 10)', categoria: 'Festas',     valor_reparo_estimado: 40 },
        { id: 'caixa-som',      nome: 'Caixa de Som 500W',         categoria: 'Festas',     valor_reparo_estimado: 300 },
        { id: 'cat-luminaria',  nome: 'Luminária LED de Mesa',     categoria: 'Festas',     valor_reparo_estimado: 60 }
      ];
      for (const i of catalogo) await this._put('catalogo', i);

      const now = Date.now();
      const D = 86400000;
      const locacoes = [
        {
          id: 'loc-001', cliente_nome: 'João Silva', cliente_whatsapp: '5511987654321',
          data_saida: new Date(now - 2 * D).toISOString(),
          itens: [
            { id_item: 'cat-betoneira', nome: 'Betoneira 390L',           estado_saida: 'Funcional, tanque limpo' },
            { id_item: 'cat-martelete', nome: 'Martelete Rotativo 800W',  estado_saida: 'Funcional, ponteira nova' },
            { id_item: 'cat-extensao',  nome: 'Extensão Elétrica 10m',    estado_saida: 'Funcional, cabo sem riscos' }
          ]
        },
        {
          id: 'loc-002', cliente_nome: 'Maria Oliveira Festas', cliente_whatsapp: '5521991234567',
          data_saida: new Date(now - 1 * D).toISOString(),
          itens: [
            { id_item: 'cat-tenda',      nome: 'Tenda Branca 3x3m',         estado_saida: 'Lona íntegra' },
            { id_item: 'cat-cadeirinha', nome: 'Cadeirão Infantil (cx 10)', estado_saida: '10 unidades completas' },
            { id_item: 'caixa-som',      nome: 'Caixa de Som 500W',         estado_saida: 'Funcional, sem amassados' },
            { id_item: 'cat-luminaria',  nome: 'Luminária LED de Mesa',     estado_saida: 'Funcional' }
          ]
        },
        {
          id: 'loc-003', cliente_nome: 'Carlos Construtora ABC', cliente_whatsapp: '5531988887777',
          data_saida: new Date(now - 5 * D).toISOString(),
          itens: [
            { id_item: 'cat-serra',  nome: 'Serra Circular 1400W',      estado_saida: 'Funcional, disco novo' },
            { id_item: 'cat-escada', nome: 'Escada Alumínio 7 Degraus', estado_saida: 'Sem deformações' },
            { id_item: 'cat-betoneira', nome: 'Betoneira 390L',         estado_saida: 'Funcional' },
            { id_item: 'cat-extensao',  nome: 'Extensão Elétrica 10m',  estado_saida: 'Funcional' },
            { id_item: 'cat-martelete', nome: 'Martelete Rotativo 800W', estado_saida: 'Funcional' }
          ]
        }
      ];
      for (const l of locacoes) await this._put('locacoes', l);
    }
  }

  /* ---------- Utilidades globais ---------- */
  function uid(prefix) {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /** Comprime/redimensiona imagem para dataURL JPEG (~640px) — mantém o app leve offline. */
  function compressImage(fileOrBlob, maxDim) {
    maxDim = maxDim || 640;
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(fileOrBlob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width: w, height: h } = img;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        w = Math.round(w * scale); h = Math.round(h * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  }

  function normalizarTel(s) { return String(s || '').replace(/\D/g, ''); }

  window.Store = new Store();
  window.LR = { uid, compressImage, normalizarTel };
})();
