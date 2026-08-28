/* Gera as versões de arquivo único a partir de index.html + css/ + js/.
   Uso: node build.js
   Saídas:
     fps-analyzer.html          documento completo, abre offline (exceto fontes)
     dist/artifact.html         só o conteúdo do <body>, para publicar como Artifact */
const fs = require('fs'), path = require('path');
const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');

const html = read('index.html');
const css  = read('css/style.css');
const js   = ['js/data.js','js/data2.js','js/charts.js','js/app.js'].map(read).join('\n\n');

const corpo = html
  .replace(/<link rel="stylesheet" href="css\/style\.css">\s*/, '')
  .replace(/<script src="js\/[a-z0-9]+\.js"><\/script>\s*/g, '')
  .match(/<body>([\s\S]*?)<\/body>/)[1]
  .trim();

const fontes = html.match(/<link rel="preconnect"[\s\S]*?display=swap">/)[0];
const titulo = html.match(/<title>([\s\S]*?)<\/title>/)[1];

const bloco = `${fontes}\n<style>\n${css}\n</style>\n\n${corpo}\n\n<script>\n${js}\n</script>`;

fs.writeFileSync(path.join(__dirname, 'fps-analyzer.html'),
`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0b0f14">
<title>${titulo}</title>
</head>
<body>
${bloco}
</body>
</html>
`);

fs.mkdirSync(path.join(__dirname,'dist'), {recursive:true});
fs.writeFileSync(path.join(__dirname,'dist/artifact.html'), `<title>${titulo}</title>\n${bloco}\n`);

const kb = f => (fs.statSync(path.join(__dirname,f)).size/1024).toFixed(0);
console.log(`fps-analyzer.html  ${kb('fps-analyzer.html')} KB`);
console.log(`dist/artifact.html ${kb('dist/artifact.html')} KB`);
