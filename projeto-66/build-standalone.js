#!/usr/bin/env node
/* Gera projeto-66/standalone.html — o app inteiro em um único arquivo.
   Uso: node build-standalone.js [saida.html] [--bare]
   --bare: sem <!DOCTYPE>/<html>/<head>/<body> (para hosts que embrulham o conteúdo). */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const css = read('css/style.css');
const html = read('index.html');

// miolo do <body> antes dos <script src>
const body = html.match(/<body>([\s\S]*?)<script /)[1];

const order = ['config', 'quotes', 'audio', 'store', 'charts', 'claudi', 'views', 'app'];
const js = order.map(n => {
  let code = read(`js/${n}.js`);
  if (n === 'app') {
    // sem service worker na versão de arquivo único (não há sw.js ao lado)
    code = code.replace(/if \('serviceWorker' in navigator[\s\S]*?\.catch\(\(\) => \{\}\);\n  \}/, '/* service worker: apenas na versão multi-arquivo */');
  }
  return `<script>\n${code}\n</script>`;
}).join('\n');

const inner = `<title>Projeto 66 | Gestão à Vista</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<style>
${css}
</style>
${body}
${js}`;

const fullDoc = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0b0c0f">
<title>Projeto 66 | Gestão à Vista</title>
<style>
${css}
</style>
</head>
<body>
${body}
${js}
</body>
</html>`;

const out = process.argv[2] || path.join(ROOT, 'standalone.html');
const bare = process.argv.includes('--bare');
fs.writeFileSync(out, bare ? inner : fullDoc);
console.log(`gerado: ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB, ${bare ? 'bare' : 'documento completo'})`);
