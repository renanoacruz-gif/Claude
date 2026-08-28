/* FPS Analyzer — lógica da aplicação */
(function(){
'use strict';

const $  = (s,r)=> (r||document).querySelector(s);
const $$ = (s,r)=> Array.from((r||document).querySelectorAll(s));
const byId = id => GAMES.find(g=>g.id===id);
const esc = s => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- utilidades de nota ---------- */
function scoreColor(v){
  if(v>=8.5) return '#3fcf6b';
  if(v>=7)   return '#9ccf3f';
  if(v>=5.5) return '#f2c14b';
  if(v>=4)   return '#f2874b';
  return '#ef4d4d';
}
const fmt = v => v.toFixed(1).replace('.',',');

function bars(list){
  return '<div class="bars">' + list.map(([lbl,v])=>`
    <div class="brow">
      <span class="lbl">${esc(lbl)}</span>
      <span class="bar"><i style="width:${v*10}%;background:${scoreColor(v)}"></i></span>
      <span class="v" style="color:${scoreColor(v)}">${fmt(v)}</span>
    </div>`).join('') + '</div>';
}

function miniBars(g){
  const keys=['gameplay','competitivo','performance','monetizacao'];
  return '<div class="minibars">' + keys.map(k=>{
    const c = CRITERIOS.find(x=>x.k===k), v = g.scores[k];
    return `<div class="mb"><span>${c.n}</span>
      <span class="bar"><i style="width:${v*10}%;background:${scoreColor(v)}"></i></span>
      <span class="val">${fmt(v)}</span></div>`;
  }).join('') + '</div>';
}

/* ================= NAVEGAÇÃO ================= */
function show(view){
  $$('.view').forEach(v=>v.classList.remove('active'));
  $('#view-'+view).classList.add('active');
  $$('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  window.scrollTo({top:0,behavior:'instant'});
}
$$('.nav-btn').forEach(b=> b.addEventListener('click', ()=>{
  const v=b.dataset.view; show(v);
  if(v==='compare') renderCompare();
  if(v==='ranking') renderRanking();
  if(v==='about')   renderAbout();
}));

/* ================= BIBLIOTECA ================= */
const state = { q:'', tipos:new Set(), sort:'nota' };

const TIPOS = [...new Set(GAMES.map(g=>g.tipo))];
$('#filters').innerHTML = TIPOS.map(t=>`<button class="chip" data-t="${esc(t)}">${esc(t)}</button>`).join('');
$$('#filters .chip').forEach(c=> c.addEventListener('click', ()=>{
  const t=c.dataset.t;
  state.tipos.has(t) ? state.tipos.delete(t) : state.tipos.add(t);
  c.classList.toggle('on'); renderLibrary();
}));
$('#search').addEventListener('input', e=>{ state.q = e.target.value.trim().toLowerCase(); renderLibrary(); });
$('#sort').addEventListener('change', e=>{ state.sort = e.target.value; renderLibrary(); });

/* aliases para busca — "cs2", "r6", "cod", "bf6"… */
const ALIAS = {
  cs2:['cs','csgo','cs go','counter strike','counter-strike','cs2'],
  valorant:['valo','val','valorant','riot'],
  r6:['r6','siege','rainbow','rainbow six','siege x'],
  bf6:['bf','bf6','battlefield','battlefield 6'],
  bo7:['cod','call of duty','black ops','bo7','warzone','blackops'],
  apex:['apex','apex legends','respawn'],
  ow:['ow','ow2','overwatch','overwatch 2','blizzard'],
  finals:['the finals','finals','embark'],
  tarkov:['tarkov','eft','escape from tarkov'],
  delta:['delta','delta force','df'],
  arc:['arc','arc raiders','raiders']
};

function matches(g){
  if(state.tipos.size && !state.tipos.has(g.tipo)) return false;
  if(!state.q) return true;
  const hay = [g.nome, g.visao.completo, g.tipo, g.visao.dev, ...(ALIAS[g.id]||[])].join(' ').toLowerCase();
  return hay.includes(state.q);
}

function renderLibrary(){
  let list = GAMES.filter(matches);
  const s = state.sort;
  list.sort((a,b)=>{
    if(s==='nome') return a.nome.localeCompare(b.nome);
    if(s==='ano')  return String(b.visao.ano).localeCompare(String(a.visao.ano));
    if(s==='nota') return b.notaGeral - a.notaGeral;
    return b.scores[s] - a.scores[s];
  });

  $('#grid').innerHTML = list.map(g=>`
    <article class="card" data-id="${g.id}" style="--cardc:${g.cor}">
      <div class="card-top">
        <div>
          <h3>${esc(g.nome)}</h3>
          <div class="sub">${esc(g.visao.dev)} · ${esc(String(g.visao.ano).split(';')[0])}</div>
        </div>
        <div class="score-badge" style="color:${scoreColor(g.notaGeral)}">${fmt(g.notaGeral)}<small>NOTA</small></div>
      </div>
      <div class="tags">
        <span class="tag cls">${esc(g.competitivo.classificacao)}</span>
        ${g.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}
      </div>
      <p class="pitch">${esc(g.pitch)}</p>
      ${miniBars(g)}
    </article>`).join('');

  $$('#grid .card').forEach(c=> c.addEventListener('click', ()=> openGame(c.dataset.id)));
  $('#lib-count').textContent = `${list.length} de ${GAMES.length} jogos${state.q?` para "${state.q}"`:''}`;
  $('#not-found').classList.toggle('hidden', list.length>0 || !state.q);
  if(list.length===0 && state.q) $('#prompt-out').classList.add('hidden');
}

/* gerador de prompt para jogos fora da base */
$('#gen-prompt').addEventListener('click', ()=>{
  const nome = $('#search').value.trim() || '[NOME DO JOGO]';
  const out = $('#prompt-out');
  out.textContent = buildPrompt(nome);
  out.classList.remove('hidden');
  navigator.clipboard && navigator.clipboard.writeText(out.textContent)
    .then(()=>{ $('#gen-prompt').textContent='Prompt copiado ✓'; setTimeout(()=>$('#gen-prompt').textContent='Gerar prompt de análise',2200); })
    .catch(()=>{});
});

function buildPrompt(nome){
return `Atue como especialista em jogos FPS (gameplay competitivo, mecânicas, armas, mapas,
matchmaking, progressão, comunidade, desempenho técnico e cenário competitivo).

Analise o jogo: ${nome}

Pesquise informações ATUAIS na internet antes de responder. Priorize: atualizações,
temporada vigente, balanceamento, meta, população, problemas técnicos, cheaters,
cenário competitivo e monetização. Não invente estatísticas — quando não houver dado
confiável, diga isso explicitamente. Quando houver divergência entre fontes, apresente
a divergência. Diferencie fato de reclamação recorrente e de opinião subjetiva.
Se existir mais de um jogo com nome semelhante, peça esclarecimento antes de analisar.

Estrutura obrigatória da resposta:

1.  VISÃO GERAL — nome completo, desenvolvedora, publicadora, ano, plataformas, motor
    gráfico, modelo de negócio, modos principais, perfil, público-alvo, situação atual.
    Dê nota 0-10 e explique a nota.
2.  GAMEPLAY — velocidade, fluidez, tiro, recoil, movimento, TTK, precisão, importância
    da mira/estratégia/posicionamento, curva de aprendizado, skill gap, dificuldade.
    Notas 0-10 nos principais elementos.
3.  ARMAS — variedade, balanceamento, diferenciação, meta atual, personalização, recoil,
    distância efetiva, viabilidade das categorias. Existe meta dominante que reduz a
    variedade competitiva?
4.  MAPAS — quantidade, qualidade, variedade, design, verticalidade, rotas, chokepoints,
    balanceamento entre lados, rejogabilidade, peso do conhecimento de mapa. Destaque
    individualmente os mapas competitivos relevantes.
5.  COMPETITIVO — ranking, matchmaking, sistema competitivo, esports, cenário
    profissional, skill gap, qualidade das ranqueadas, integridade, smurfs, cheaters,
    toxicidade, qualidade da comunidade competitiva. Classifique explicitamente:
    Casual / Competitivo / Altamente competitivo — e justifique.
6.  EXPERIÊNCIA POR NÍVEL — iniciante, intermediário, avançado, competitivo.
7.  DESEMPENHO TÉCNICO — FPS, otimização, input lag, netcode, tick rate, latência,
    estabilidade, crashes, problemas conhecidos, escalabilidade gráfica.
8.  GRÁFICOS E ÁUDIO — qualidade visual, animações, iluminação, texturas, design visual,
    clareza dos inimigos, som dos disparos, footsteps, direcionalidade, mixagem.
    Os gráficos favorecem ou prejudicam a competitividade?
9.  PROGRESSÃO E CONTEÚDO — progressão, battle pass, skins, desbloqueios, recompensas,
    conteúdo sazonal, atualizações, monetização, pay-to-win. Classifique a monetização:
    Excelente / Boa / Aceitável / Predatória — e justifique.
10. COMUNIDADE E PROBLEMAS — principais problemas atuais, separando problema comprovado
    de reclamação recorrente e de opinião subjetiva.
11. PONTOS FORTES — os 5 principais, priorizando o que diferencia dos concorrentes.
12. PONTOS FRACOS — os 5 principais. Seja crítico; popularidade não é qualidade.
13. COMPARAÇÃO COM CONCORRENTES — escolha até 5 concorrentes diretos e compare em tabela:
    Gameplay, Mira, Mapas, Competitivo, Gráficos, Performance, Conteúdo, Comunidade,
    Monetização e Nota geral (todos 0-10).
14. PARA QUEM VALE A PENA — Sim / Sim, com ressalvas / Não. Avalie separadamente:
    casual, competitivo, solo, com amigos, foco em ranking, foco em esports.
15. VEREDITO FINAL — Nota geral, melhor característica, maior problema, maior diferencial,
    maior risco, perfil ideal de jogador, "vale jogar em 2026?" e uma conclusão curta,
    direta e crítica.`;
}

/* ================= PÁGINA DE ANÁLISE ================= */
function sec(n, titulo, html){
  return `<section class="sec"><h3><span class="n">${n}</span>${titulo}</h3>${html}</section>`;
}

function tabelaConcorrentes(g){
  const rivais = (g.concorrentes||[]).map(byId).filter(Boolean);
  const todos = [g, ...rivais];
  const linhas = CRITERIOS.map(c=>{
    const vals = todos.map(x=>x.scores[c.k]);
    const max = Math.max(...vals);
    return `<tr><th>${c.n}</th>${todos.map((x,i)=>
      `<td class="${vals[i]===max?'best':''}" style="color:${scoreColor(vals[i])}">${fmt(vals[i])}</td>`).join('')}</tr>`;
  }).join('');
  const nGeral = todos.map(x=>x.notaGeral), maxG = Math.max(...nGeral);
  return `<div class="table-scroll"><table class="cmp">
    <thead><tr><th style="text-align:left">Critério</th>${todos.map(x=>`<th style="color:${x.cor}">${esc(x.nome)}</th>`).join('')}</tr></thead>
    <tbody>${linhas}
    <tr class="total"><th>Nota geral</th>${todos.map((x,i)=>
      `<td class="${nGeral[i]===maxG?'best':''}" style="color:${scoreColor(x.notaGeral)}">${fmt(x.notaGeral)}</td>`).join('')}</tr>
    </tbody></table></div>`;
}

function openGame(id){
  const g = byId(id); if(!g) return;
  const v = g.visao;

  const html = `
  <button class="back">← Voltar para a biblioteca</button>

  <div class="hero">
    <div style="flex:1 1 380px">
      <h2 style="color:${g.cor}">${esc(g.nome)}</h2>
      <p class="full">${esc(v.completo)}</p>
      <div class="tags">
        <span class="tag cls">${esc(g.competitivo.classificacao)}</span>
        <span class="tag">${esc(g.tipo)}</span>
        <span class="tag">Monetização: ${esc(g.progressao.classe)}</span>
        <span class="tag">Vale em 2026: ${esc(g.veredito.vale2026)}</span>
      </div>
    </div>
    <div class="bigscore"><b style="color:${scoreColor(g.notaGeral)}">${fmt(g.notaGeral)}</b><span>NOTA GERAL</span></div>
  </div>

  ${sec('01','Visão geral', `
    <dl class="specs">
      ${[['Desenvolvedora',v.dev],['Publicadora',v.publisher],['Lançamento',v.ano],['Plataformas',v.plataformas],
         ['Motor gráfico',v.engine],['Modelo de negócio',v.modelo],['Modos principais',v.modos],
         ['Perfil',v.perfil],['Público-alvo',v.publico],['Situação atual',v.situacao]]
        .map(([k,val])=>`<div class="spec"><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}
    </dl>
    <div class="callout"><strong>Por que ${fmt(g.notaGeral)}:</strong> ${g.resumoNota}</div>
    ${bars(CRITERIOS.map(c=>[c.n, g.scores[c.k]]))}
  `)}

  ${sec('02','Gameplay', `
    <p>${g.gameplay.texto}</p>
    ${bars(g.gameplay.notas)}
    <dl class="specs">
      ${[['TTK',g.gameplay.ttk],['Curva de aprendizado',g.gameplay.curva],['Skill gap',g.gameplay.skillGap],['Nível de dificuldade',g.gameplay.dificuldade]]
        .map(([k,val])=>`<div class="spec"><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}
    </dl>
  `)}

  ${sec('03','Armas', `
    <p>${g.armas.texto}</p>
    <div class="callout ${g.armas.dominante?'warn':'ok'}">
      <strong>Meta dominante?</strong> ${g.armas.dominanteTxt}
      <br><br><strong>Meta atual:</strong> ${esc(g.armas.meta)}
    </div>
    ${bars(g.armas.notas)}
  `)}

  ${sec('04','Mapas', `
    <p>${g.mapas.texto}</p>
    <h4 style="font-size:14px;margin:18px 0 10px">Destaques</h4>
    <ul class="clean">${g.mapas.destaques.map(d=>`<li><strong>${esc(d.nome)}</strong> — ${esc(d.txt)}</li>`).join('')}</ul>
    ${bars(g.mapas.notas)}
  `)}

  ${sec('05','Competitivo', `
    <span class="pill ${g.competitivo.classificacao==='Casual'?'casual':(g.competitivo.classificacao==='Competitivo'?'comp':'alt')}">${esc(g.competitivo.classificacao)}</span>
    <p>${g.competitivo.texto}</p>
    <div class="callout"><strong>Justificativa da classificação:</strong> ${esc(g.competitivo.justificativa)}</div>
    ${bars(g.competitivo.notas)}
  `)}

  ${sec('06','Experiência por nível de jogador', `
    <div class="exp">
      ${[['Iniciante',g.experiencia.iniciante],['Intermediário',g.experiencia.intermediario],
         ['Avançado',g.experiencia.avancado],['Competitivo',g.experiencia.competitivo]]
        .map(([k,val])=>`<div class="lv"><h4>${k}</h4><p>${esc(val)}</p></div>`).join('')}
    </div>
  `)}

  ${sec('07','Desempenho técnico', `
    <p>${g.tecnico.texto}</p>
    <dl class="specs">${g.tecnico.itens.map(([k,val])=>`<div class="spec"><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
    <div class="callout warn"><strong>Sem dado confiável:</strong> ${esc(g.tecnico.semDados)}</div>
    ${bars(g.tecnico.notas)}
  `)}

  ${sec('08','Gráficos e áudio', `
    <p>${g.av.texto}</p>
    <div class="callout"><strong>Impacto na competitividade:</strong> ${esc(g.av.impacto)}</div>
    ${bars(g.av.notas)}
  `)}

  ${sec('09','Progressão e conteúdo', `
    <p>${g.progressao.texto}</p>
    <div class="callout ${g.progressao.classe==='Predatória'?'warn':(g.progressao.classe==='Excelente'||g.progressao.classe==='Boa'?'ok':'')}">
      <strong>Monetização: ${esc(g.progressao.classe)}</strong> — ${esc(g.progressao.classeTxt)}
      <br><br><strong>Pay-to-win:</strong> ${esc(g.progressao.p2w)}
    </div>
    ${bars(g.progressao.notas)}
  `)}

  ${sec('10','Comunidade e problemas', `
    <p class="muted">Cada item está classificado como <strong>fato</strong> (verificável),
       <strong>reclamação recorrente</strong> (percepção ampla da comunidade, sem dado que a feche)
       ou <strong>opinião</strong> (julgamento subjetivo).</p>
    ${g.problemas.map(p=>`
      <div class="prob">
        <span class="kind ${p.tipo==='fato'?'fato':(p.tipo==='reclamacao'?'recl':'opin')}">${p.tipo==='fato'?'Fato':(p.tipo==='reclamacao'?'Reclamação':'Opinião')}</span>
        <b>${esc(p.t)}</b><p>${esc(p.p)}</p>
      </div>`).join('')}
  `)}

  ${sec('11 / 12','Pontos fortes e fracos', `
    <div class="cols2">
      <div class="box pos"><h4>▲ 5 pontos fortes</h4>
        <ul class="clean">${g.fortes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="box neg"><h4>▼ 5 pontos fracos</h4>
        <ul class="clean">${g.fracos.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
    </div>
  `)}

  ${sec('13','Comparação com concorrentes', `
    <p class="muted">Concorrentes diretos escolhidos por posicionamento e público, não por popularidade.
       Verde = melhor nota da linha.</p>
    ${tabelaConcorrentes(g)}
    <p style="margin-top:12px"><button class="btn" id="to-compare">Abrir no comparador completo →</button></p>
  `)}

  ${sec('14','Para quem vale a pena', `
    <span class="pill ${g.vale.veredito==='Não'?'casual':(g.vale.veredito==='Sim'?'alt':'comp')}">${esc(g.vale.veredito)}</span>
    <p>${esc(g.vale.texto)}</p>
    <dl class="specs">${g.vale.perfis.map(([k,val])=>`<div class="spec"><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
  `)}

  ${sec('15','Veredito final', `
    <div class="verdict">
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <b style="font-family:var(--mono);font-size:38px;color:${scoreColor(g.notaGeral)}">${fmt(g.notaGeral)}</b>
        <span style="font-size:12px;letter-spacing:1.4px;color:var(--muted);font-weight:700">NOTA GERAL / 10</span>
      </div>
      <dl class="vgrid">
        ${[['Melhor característica',g.veredito.melhor],['Maior problema',g.veredito.problema],
           ['Maior diferencial',g.veredito.diferencial],['Maior risco',g.veredito.risco],
           ['Perfil ideal',g.veredito.perfil],['Vale jogar em 2026?',g.veredito.vale2026]]
          .map(([k,val])=>`<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}
      </dl>
      <p style="margin:0">${esc(g.veredito.conclusao)}</p>
    </div>
  `)}

  ${sec('—','Dados concretos e fontes', `
    <div class="sources">
      ${g.dados.map(d=>`<div><strong style="color:var(--txt2)">${esc(d.l)}:</strong> ${esc(d.v)}
        ${d.u?` — <a href="${esc(d.u)}" target="_blank" rel="noopener">${esc(d.f)}</a>`:(d.f&&d.f!=='—'?` — ${esc(d.f)}`:'')}</div>`).join('')}
      <div style="margin-top:8px">Dados revisados em ${esc(g.atualizado.split('-').reverse().join('/'))}.
        Números de população mudam continuamente — confira a fonte antes de citar.</div>
    </div>
  `)}
  `;

  $('#game-content').innerHTML = html;
  show('game');
  $('#game-content .back').addEventListener('click', ()=>{ show('library'); });
  const tc = $('#to-compare');
  if(tc) tc.addEventListener('click', ()=>{
    cmpSel = new Set([g.id, ...(g.concorrentes||[]).slice(0,2)]);
    show('compare'); renderCompare();
  });
}

/* ================= COMPARADOR ================= */
let cmpSel = new Set(['cs2','valorant','r6']);

function renderCompare(){
  $('#cmp-picker').innerHTML = GAMES.map(g=>
    `<button class="pick ${cmpSel.has(g.id)?'on':''}" data-id="${g.id}" style="--pc:${g.cor}">${esc(g.nome)}</button>`).join('');
  $$('#cmp-picker .pick').forEach(b=> b.addEventListener('click', ()=>{
    const id=b.dataset.id;
    if(cmpSel.has(id)) cmpSel.delete(id);
    else { if(cmpSel.size>=5){ b.animate([{opacity:.3},{opacity:1}],200); return; } cmpSel.add(id); }
    renderCompare();
  }));

  const sel = GAMES.filter(g=>cmpSel.has(g.id));
  const ok = sel.length>=2;
  $('#cmp-empty').classList.toggle('hidden', ok);
  $('#cmp-result').classList.toggle('hidden', !ok);
  if(!ok) return;

  Radar.draw($('#radar'), sel, CRITERIOS);
  $('#radar-legend').innerHTML = sel.map(g=>
    `<div><i style="background:${g.cor}"></i><span>${esc(g.nome)} <strong style="font-family:var(--mono);color:${scoreColor(g.notaGeral)}">${fmt(g.notaGeral)}</strong></span></div>`).join('');

  const linhas = CRITERIOS.map(c=>{
    const vals = sel.map(x=>x.scores[c.k]); const max=Math.max(...vals);
    return `<tr><th title="${esc(c.d)}">${c.n}</th>${sel.map((x,i)=>
      `<td class="${vals[i]===max?'best':''}" style="color:${scoreColor(vals[i])}">${fmt(vals[i])}</td>`).join('')}</tr>`;
  }).join('');
  const ng = sel.map(x=>x.notaGeral), maxG=Math.max(...ng);
  $('#cmp-table').innerHTML = `
    <thead><tr><th style="text-align:left">Critério</th>${sel.map(x=>`<th style="color:${x.cor}">${esc(x.nome)}</th>`).join('')}</tr></thead>
    <tbody>${linhas}
      <tr class="total"><th>Nota geral</th>${sel.map((x,i)=>
        `<td class="${ng[i]===maxG?'best':''}" style="color:${scoreColor(x.notaGeral)}">${fmt(x.notaGeral)}</td>`).join('')}</tr>
    </tbody>`;

  /* quem vence cada critério */
  const vitorias = {};
  sel.forEach(g=>vitorias[g.id]=[]);
  CRITERIOS.forEach(c=>{
    const max = Math.max(...sel.map(x=>x.scores[c.k]));
    sel.filter(x=>x.scores[c.k]===max).forEach(x=>vitorias[x.id].push(c.n));
  });

  $('#cmp-verdict').innerHTML = sel.map(g=>`
    <div class="vcard" style="border-left:3px solid ${g.cor}">
      <div class="win">Vence em ${vitorias[g.id].length} de ${CRITERIOS.length} critérios</div>
      <h4 style="color:${g.cor}">${esc(g.nome)}</h4>
      <p style="font-size:13px;color:var(--txt2);margin:6px 0 0">${esc(g.veredito.diferencial)}</p>
      ${vitorias[g.id].length ? `<ul>${vitorias[g.id].map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`
        : `<p style="font-size:13px;color:var(--muted);margin-top:8px">Não lidera nenhum critério nesta comparação.</p>`}
    </div>`).join('');
}

/* ================= RANKING ================= */
const PERFIS = [
  {n:'Melhor para competitivo sério', k:g=> (g.scores.competitivo*2 + g.scores.mira + g.scores.mapas)/4,
   d:'Peso duplo em competitivo, somado a mira e mapas. Mede onde o esforço de treino se converte em resultado medido.'},
  {n:'Melhor para começar hoje', k:g=> {
      const facil = {cs2:3,valorant:6,r6:2,bf6:9.5,bo7:9.5,apex:4,ow:9,finals:8.5,tarkov:1,delta:8.5,arc:7.5}[g.id]||5;
      return (facil*2 + g.scores.comunidade + g.scores.monetizacao)/4;
   }, d:'Facilidade de entrada (peso duplo), qualidade da comunidade e custo de acesso.'},
  {n:'Melhor custo-benefício', k:g=> (g.scores.monetizacao*2 + g.scores.conteudo + g.notaGeral)/4,
   d:'Monetização com peso duplo, mais volume de conteúdo e qualidade geral.'},
  {n:'Melhor para PC fraco', k:g=> (g.scores.performance*2 + g.scores.monetizacao)/3,
   d:'Performance e escalabilidade com peso duplo, mais custo de entrada.'},
  {n:'Melhor teto de habilidade', k:g=> (g.gameplay.notas.find(x=>/mira/i.test(x[0]))?.[1] || g.scores.mira)*0.4 + g.scores.gameplay*0.6,
   d:'Peso da mira somado à qualidade do sistema de gameplay — onde a habilidade individual mais rende.'}
];

function renderRanking(){
  let html = '<div style="margin:22px 0">';

  CRITERIOS.forEach(c=>{
    const list = [...GAMES].sort((a,b)=>b.scores[c.k]-a.scores[c.k]).slice(0,5);
    html += `<div class="rank-cat">
      <h3>${c.n}</h3><p class="why">${esc(c.d)}</p>
      <div class="rank-list">${list.map((g,i)=>`
        <div class="rank-row ${i===0?'first':''}" data-id="${g.id}">
          <span class="pos">${i+1}º</span>
          <span class="nm">${esc(g.nome)}</span>
          <span class="bar"><i style="width:${g.scores[c.k]*10}%;background:${g.cor}"></i></span>
          <span class="sc" style="color:${scoreColor(g.scores[c.k])}">${fmt(g.scores[c.k])}</span>
        </div>`).join('')}</div></div>`;
  });

  html += '<h2 class="view-title" style="margin-top:34px">Melhor FPS — por perfil de jogador</h2>';
  html += '<p class="muted" style="margin-bottom:18px">Índices compostos a partir das mesmas notas. A fórmula de cada perfil está declarada — nada é escolha arbitrária.</p>';

  PERFIS.forEach(p=>{
    const list = [...GAMES].map(g=>({g, v:p.k(g)})).sort((a,b)=>b.v-a.v).slice(0,5);
    html += `<div class="rank-cat">
      <h3>${esc(p.n)}</h3><p class="why">${esc(p.d)}</p>
      <div class="rank-list">${list.map((x,i)=>`
        <div class="rank-row ${i===0?'first':''}" data-id="${x.g.id}">
          <span class="pos">${i+1}º</span>
          <span class="nm">${esc(x.g.nome)}</span>
          <span class="bar"><i style="width:${x.v*10}%;background:${x.g.cor}"></i></span>
          <span class="sc" style="color:${scoreColor(x.v)}">${fmt(x.v)}</span>
        </div>`).join('')}</div></div>`;
  });

  html += '</div>';
  $('#rank-content').innerHTML = html;
  $$('#rank-content .rank-row').forEach(r=> r.addEventListener('click', ()=> openGame(r.dataset.id)));
}

/* ================= METODOLOGIA ================= */
function renderAbout(){
  $('#about-content').innerHTML = `
  <h2 class="view-title">Metodologia e limites desta base</h2>
  <p class="muted">Última revisão: ${REVISAO}. ${GAMES.length} jogos analisados.</p>

  ${sec('01','Como as notas funcionam', `
    <p>Todas as notas são <strong>avaliação editorial</strong> numa escala 0-10 calibrada para ser
       comparável <em>entre os jogos desta base</em>. Elas não são médias de reviews, nem agregam
       notas de terceiros, nem representam consenso da comunidade.</p>
    <p>A nota geral <strong>não é a média dos nove critérios</strong>. Um jogo pode ter notas médias
       e nota geral alta se o que ele faz bem é insubstituível — e o contrário também vale.
       Cada análise explica a nota no bloco "Por que X".</p>
    <p class="muted" style="margin-top:16px">Os nove critérios do comparativo, com o que cada um mede:</p>
    <dl class="specs">${CRITERIOS.map(c=>`<div class="spec"><dt>${c.n}</dt><dd>${esc(c.d)}</dd></div>`).join('')}</dl>
  `)}

  ${sec('02','Fato, reclamação e opinião', `
    <p>Na seção de problemas de cada jogo, todo item é rotulado:</p>
    <ul class="clean">
      <li><strong>Fato</strong> — verificável em fonte primária ou em dado público (número de jogadores,
          anúncio oficial, decisão documentada da desenvolvedora).</li>
      <li><strong>Reclamação recorrente</strong> — percepção ampla e persistente da comunidade que não
          pode ser fechada com dado público. Continua sendo informação relevante, mas não é prova.</li>
      <li><strong>Opinião</strong> — julgamento subjetivo, incluindo os meus. Sinalizado como tal.</li>
    </ul>
    <div class="callout warn">Onde não há dado confiável, cada análise diz isso explicitamente em vez
      de estimar. Tick rate, taxa de detecção de anticheat e latência por região são as áreas onde
      quase nenhuma desenvolvedora publica número verificável — desconfie de qualquer fonte que apresente
      esses valores com precisão.</div>
  `)}

  ${sec('03','Divergência entre fontes', `
    <p>Números de população vêm de agregadores com metodologias diferentes e frequentemente discordam.
       Quando isso acontece, a divergência está registrada na análise em vez de ser resolvida a favor
       de um dos lados.</p>
    <p>Dois casos claros nesta base: <strong>ARC Raiders</strong>, com fontes reportando desde ~31 mil
       até ~100 mil simultâneos no mesmo período; e <strong>Overwatch</strong>, cujas estimativas de
       ativos mensais variam de 6 a 19 milhões conforme o agregador.</p>
    <p>Também vale distinguir métricas que parecem comparáveis e não são: "usuários registrados
       acumulados" é marketing, "ativos mensais" é estimativa, e "simultâneos no Steam" é a única
       série derivada diretamente de uma API pública — e cobre só uma plataforma.</p>
  `)}

  ${sec('04','Limites conhecidos', `
    <ul class="clean">
      <li>A base é curada manualmente e cobre 11 títulos. Para jogos fora dela, a biblioteca gera
          um prompt de análise completo para você usar num assistente com acesso à web.</li>
      <li>Números de população envelhecem rápido. Cada análise traz a data de revisão e o link da fonte.</li>
      <li><strong>ARC Raiders</strong> é jogado em terceira pessoa. Está incluído por ser concorrente
          direto de mercado dos shooters de extração, e isso está sinalizado na análise dele.</li>
      <li>Jogos com público majoritariamente de console (Call of Duty) têm dados de população piores,
          porque as séries públicas cobrem principalmente o Steam.</li>
      <li>As notas refletem o <strong>estado atual</strong> de cada jogo, não a versão de lançamento.</li>
    </ul>
  `)}`;
}

/* ================= INÍCIO ================= */
$('#rev-date').textContent = REVISAO;
renderLibrary();

})();
