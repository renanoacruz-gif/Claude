// Cálculos determinísticos em centavos inteiros. Nada aqui usa IA.
(function (root) {
  // "1.234,56" | "1234,56" | "1234.56" | "1234" → centavos (int) ou null
  function parseMoney(input) {
    if (input === null || input === undefined) return null;
    let s = String(input).trim().replace(/[R$\s]/g, '');
    if (!s) return null;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
    const [int, dec = ''] = s.split('.');
    return parseInt(int, 10) * 100 + parseInt((dec + '00').slice(0, 2), 10);
  }

  // Quantidade com até 3 casas → milésimos (int) ou null
  function parseQty(input) {
    if (input === null || input === undefined) return null;
    let s = String(input).trim();
    if (!s) return null;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    if (!/^\d+(\.\d{1,3})?$/.test(s)) return null;
    const [int, dec = ''] = s.split('.');
    return parseInt(int, 10) * 1000 + parseInt((dec + '000').slice(0, 3), 10);
  }

  // Arredondamento half-up para inteiros não negativos
  const divRound = (num, den) => Math.floor((num * 2 + den) / (den * 2));

  // qtyMilli * priceCents / 1000 → centavos
  function lineTotal(item) {
    if (!Number.isInteger(item.qtyMilli) || !Number.isInteger(item.priceCents)) return null;
    if (item.qtyMilli <= 0 || item.priceCents < 0) return null;
    return divRound(item.qtyMilli * item.priceCents, 1000);
  }

  function totals(items, discount) {
    const sums = { labor: 0, material: 0, extra: 0 };
    const incomplete = [];
    for (const it of items || []) {
      const t = lineTotal(it);
      if (t === null) { incomplete.push(it.id); continue; }
      sums[it.category] = (sums[it.category] || 0) + t;
    }
    const subtotal = sums.labor + sums.material + sums.extra;
    let disc = 0;
    if (discount && discount.type === 'percent' && Number.isInteger(discount.bp)) {
      disc = divRound(subtotal * Math.min(Math.max(discount.bp, 0), 10000), 10000);
    } else if (discount && discount.type === 'value' && Number.isInteger(discount.cents)) {
      disc = Math.min(Math.max(discount.cents, 0), subtotal);
    }
    return { ...sums, subtotal, discount: disc, total: subtotal - disc, incomplete };
  }

  function formatBRL(cents) {
    if (!Number.isInteger(cents)) return '—';
    const neg = cents < 0;
    const abs = Math.abs(cents);
    const int = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (neg ? '-' : '') + 'R$ ' + int + ',' + String(abs % 100).padStart(2, '0');
  }

  function formatQty(milli) {
    if (!Number.isInteger(milli)) return '';
    const int = Math.floor(milli / 1000);
    const dec = String(milli % 1000).padStart(3, '0').replace(/0+$/, '');
    return dec ? `${int},${dec}` : String(int);
  }

  function formatMoneyInput(cents) {
    return Number.isInteger(cents) ? formatBRL(cents).replace('R$ ', '') : '';
  }

  // Serialização estável para detectar alterações após a revisão.
  function stable(v) {
    if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    if (v && typeof v === 'object') {
      return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
    }
    return JSON.stringify(v === undefined ? null : v);
  }

  function hash(v) {
    const s = stable(v);
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(16);
  }

  root.Calc = { parseMoney, parseQty, lineTotal, totals, formatBRL, formatQty, formatMoneyInput, stable, hash };
  if (typeof module !== 'undefined') module.exports = root.Calc;
})(typeof window !== 'undefined' ? window : globalThis);
