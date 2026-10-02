// node orcamentos/tests/calc.test.js
const assert = require('node:assert/strict');
const C = require('../js/calc.js');

assert.equal(C.parseMoney('1.234,56'), 123456);
assert.equal(C.parseMoney('1234.5'), 123450);
assert.equal(C.parseMoney('R$ 80'), 8000);
assert.equal(C.parseMoney(''), null);
assert.equal(C.parseMoney('abc'), null);
assert.equal(C.parseMoney('1,234'), null);

assert.equal(C.parseQty('2,5'), 2500);
assert.equal(C.parseQty('0.125'), 125);
assert.equal(C.parseQty('3'), 3000);
assert.equal(C.parseQty('-1'), null);

assert.equal(C.lineTotal({ qtyMilli: 2500, priceCents: 1999 }), 4998); // 49,975 → 49,98
assert.equal(C.lineTotal({ qtyMilli: 0, priceCents: 100 }), null);
assert.equal(C.lineTotal({ qtyMilli: 1000, priceCents: null }), null);

const items = [
  { id: 'a', category: 'labor', qtyMilli: 32500, priceCents: 1800 }, // 585,00
  { id: 'b', category: 'material', qtyMilli: 2000, priceCents: 28990 }, // 579,80
  { id: 'c', category: 'extra', qtyMilli: 1000, priceCents: 5000 }, // 50,00
  { id: 'd', category: 'labor', qtyMilli: 1000, priceCents: null },
];
const t = C.totals(items, { type: 'percent', bp: 500 });
assert.deepEqual(
  { labor: t.labor, material: t.material, extra: t.extra, subtotal: t.subtotal, discount: t.discount, total: t.total },
  { labor: 58500, material: 57980, extra: 5000, subtotal: 121480, discount: 6074, total: 115406 },
);
assert.deepEqual(t.incomplete, ['d']);
assert.equal(C.totals(items, { type: 'value', cents: 999999 }).total, 0);

assert.equal(C.formatBRL(123456), 'R$ 1.234,56');
assert.equal(C.formatBRL(5), 'R$ 0,05');
assert.equal(C.formatQty(2500), '2,5');
assert.equal(C.hash({ b: 1, a: [1, 2] }), C.hash({ a: [1, 2], b: 1 }));
assert.notEqual(C.hash({ a: 1 }), C.hash({ a: 2 }));

console.log('calc: ok');
