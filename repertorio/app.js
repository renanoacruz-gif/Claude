/* 10 Minutos de Repertório — lógica da aplicação (vanilla JS, sem dependências) */

const DURATIONS = { STUDY: 600, PREP: 60, SPEAK: 120 };
const LS_KEYS = { SESSIONS: 'r10_sessions', STATS: 'r10_stats', AGG: 'r10_agg' };

const state = {
  mode: 'geral',
  topic: null,
  timer: null,
  rating: null,
  speakElapsed: 0,
};

/* ---------- persistência ---------- */
function loadJSON(key, fallback){
  try{ const v = JSON.parse(localStorage.getItem(key)); return v || fallback; }
  catch(e){ return fallback; }
}
function saveJSON(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }

function getSessions(){ return loadJSON(LS_KEYS.SESSIONS, []); }
function getStats(){ return loadJSON(LS_KEYS.STATS, {}); }
function getAgg(){ return loadJSON(LS_KEYS.AGG, { studyMinutes:0, speakMinutes:0, lastDate:null, streak:0 }); }

function todayISO(){ return new Date().toISOString().slice(0,10); }

function updateStreak(agg){
  const today = todayISO();
  if (agg.lastDate === today) return agg;
  if (!agg.lastDate){ agg.streak = 1; }
  else{
    const diffDays = Math.round((new Date(today) - new Date(agg.lastDate)) / 86400000);
    agg.streak = diffDays === 1 ? agg.streak + 1 : 1;
  }
  agg.lastDate = today;
  return agg;
}

function recordSession({ topic, nota, ideiaPrincipal, naoFicouClaro, isReview, studySeconds, speakSeconds }){
  const sessions = getSessions();
  sessions.push({
    date: new Date().toISOString(),
    id: topic.id, tema: topic.tema, categoria: topic.categoria,
    nota, ideiaPrincipal, naoFicouClaro: naoFicouClaro || '', isReview: !!isReview
  });
  saveJSON(LS_KEYS.SESSIONS, sessions);

  const stats = getStats();
  const s = stats[topic.id] || { timesShown:0, scores:[], lastReviewed:null };
  s.timesShown += 1;
  s.scores.push(nota);
  s.lastReviewed = new Date().toISOString();
  s.avgScore = s.scores.reduce((a,b)=>a+b,0) / s.scores.length;
  s.lastScore = nota;
  stats[topic.id] = s;
  saveJSON(LS_KEYS.STATS, stats);

  let agg = getAgg();
  agg = updateStreak(agg);
  agg.studyMinutes += Math.round((studySeconds||0)/60);
  agg.speakMinutes += Math.round((speakSeconds||0)/60);
  saveJSON(LS_KEYS.AGG, agg);
}

/* ---------- sorteio ---------- */
function pickTopic(mode){
  const stats = getStats();
  let pool;
  if (mode === 'intelectual' || mode === 'estoicismo' || mode === 'carater'){
    pool = TOPICS.filter(t => t.categoria === mode);
  } else if (mode === 'revisao'){
    pool = TOPICS.filter(t => stats[t.id]);
    if (!pool.length) return null;
    pool = pool.slice().sort((a,b)=>reviewPriority(b, stats) - reviewPriority(a, stats));
    pool = pool.slice(0, Math.max(5, Math.ceil(pool.length*0.3)));
  } else if (mode === 'surpreenda'){
    const unseen = TOPICS.filter(t => !stats[t.id]);
    pool = unseen.length ? unseen : TOPICS;
  } else {
    pool = TOPICS;
  }
  return pool[Math.floor(Math.random()*pool.length)];
}

function reviewPriority(topic, stats){
  const s = stats[topic.id];
  if (!s) return -1;
  let score = 0;
  score += (5 - (s.avgScore || 3)) * 10;
  const daysSince = s.lastReviewed ? (Date.now() - new Date(s.lastReviewed)) / 86400000 : 999;
  score += Math.min(daysSince, 60);
  if (s.timesShown === 1) score += 15;
  return score;
}

/* ---------- navegação de telas ---------- */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function categoryTag(cat){
  return `<span class="tag ${cat}">${CATEGORY_LABELS[cat]}</span>`;
}

/* ---------- HOME ---------- */
function initHome(){
  document.querySelectorAll('.mode-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      state.mode = btn.dataset.mode;
    });
  });
  document.getElementById('btn-sortear').addEventListener('click', onSortear);
  document.getElementById('link-repertorio').addEventListener('click', renderRepertorio);
}

function onSortear(){
  const topic = pickTopic(state.mode);
  if (!topic){
    alert('Você ainda não estudou nenhum tema. Escolha outro modo de sorteio.');
    return;
  }
  state.topic = topic;
  state.isReview = state.mode === 'revisao';
  if (state.isReview){ renderReviewRecall(topic); return; }
  renderDraw(topic);
}

/* ---------- DRAW (tema sorteado) ---------- */
function renderDraw(topic){
  const el = document.getElementById('screen-draw');
  el.innerHTML = `
    <div class="card">
      ${categoryTag(topic.categoria)}
      <h2>${topic.tema}</h2>
      <div class="label">Pergunta central</div>
      <p class="question">${topic.pergunta}</p>
      <div class="btn-row">
        <button class="btn-big" id="btn-iniciar">⏱ INICIAR 10 MINUTOS</button>
      </div>
      <div class="btn-row"><a class="btn btn-ghost" id="btn-cancelar">Voltar</a></div>
    </div>`;
  document.getElementById('btn-iniciar').addEventListener('click', ()=>startStudy(topic));
  document.getElementById('btn-cancelar').addEventListener('click', ()=>showScreen('screen-home'));
  showScreen('screen-draw');
}

/* ---------- ESTUDO (10 minutos) ---------- */
const GUIDE = [
  "O que é?", "De onde surgiu?", "Qual é a ideia central?", "Por que isso importa?",
  "Qual é um exemplo?", "Qual é uma crítica, limitação ou contraponto?", "Como isso pode ser aplicado à vida?"
];

function startStudy(topic){
  const el = document.getElementById('screen-study');
  el.innerHTML = `
    <div class="card">
      ${categoryTag(topic.categoria)}
      <h2>${topic.tema}</h2>
      <div class="timer" id="study-timer">10:00</div>
      <p class="subtle center">Durante os próximos 10 minutos, descubra:</p>
      <ol class="guide">${GUIDE.map((g,i)=>`<li data-n="${i+1}.">${g}</li>`).join('')}</ol>
      <div class="btn-row">
        <button class="btn" id="btn-material">Preciso de material para estudar</button>
      </div>
      <div class="material" id="material-box"></div>
    </div>`;
  document.getElementById('btn-material').addEventListener('click', ()=>{
    document.getElementById('material-box').classList.add('open');
    document.getElementById('material-box').innerHTML = renderMaterial(topic);
    document.getElementById('btn-material').style.display = 'none';
  });
  showScreen('screen-study');
  runCountdown('study-timer', DURATIONS.STUDY, ()=> goToPrep(topic, DURATIONS.STUDY));
}

function renderMaterial(topic){
  const m = topic.material;
  return `
    <h4>Definição</h4><p>${m.definicao}</p>
    <h4>Contexto</h4><p>${m.contexto}</p>
    <h4>Ideias principais</h4><ul>${m.ideias.map(i=>`<li>${i}</li>`).join('')}</ul>
    <h4>Exemplo</h4><p>${m.exemplo}</p>
    <h4>Contraponto</h4><p>${m.contraponto}</p>
    <h4>Aplicação</h4><p>${m.aplicacao}</p>
    <h4>Conceitos relacionados</h4><ul>${topic.relacionados.map(r=>`<li>${r}</li>`).join('')}</ul>`;
}

/* ---------- teste de recuperação: preparação de 60s ---------- */
function goToPrep(topic, studySeconds){
  state.studySeconds = studySeconds;
  const el = document.getElementById('screen-prep');
  el.innerHTML = `
    <div class="card center">
      ${categoryTag(topic.categoria)}
      <h2>Agora explique sem consultar.</h2>
      <p class="subtle">Organize mentalmente sua resposta antes de falar.</p>
      <div class="timer" id="prep-timer">01:00</div>
    </div>`;
  showScreen('screen-prep');
  runCountdown('prep-timer', DURATIONS.PREP, ()=> goToSpeak(topic));
}

/* ---------- falar por 2 minutos ---------- */
function goToSpeak(topic){
  const el = document.getElementById('screen-speak');
  el.innerHTML = `
    <div class="card center">
      ${categoryTag(topic.categoria)}
      <h2>🎙 FALAR POR 2 MINUTOS</h2>
      <div class="timer" id="speak-timer">00:00</div>
      <ul class="guide" style="text-align:left">
        <li data-n="•">O que é?</li>
        <li data-n="•">Por que importa?</li>
        <li data-n="•">Qual exemplo você daria?</li>
        <li data-n="•">Qual sua interpretação?</li>
        <li data-n="•">Qual crítica poderia ser feita?</li>
      </ul>
      <div class="btn-row">
        <button class="btn-big" id="btn-concluir-fala" disabled>Concluir</button>
      </div>
    </div>`;
  showScreen('screen-speak');
  runCountup('speak-timer', DURATIONS.SPEAK, ()=>{
    document.getElementById('btn-concluir-fala').disabled = false;
  });
  document.getElementById('btn-concluir-fala').addEventListener('click', ()=>{
    clearInterval(state.timer);
    state.speakSeconds = DURATIONS.SPEAK;
    goToAvaliacao(topic);
  });
}

/* ---------- avaliação ---------- */
function goToAvaliacao(topic){
  const el = document.getElementById('screen-avaliacao');
  el.innerHTML = `
    <div class="card">
      <h2>Quanto consegui explicar?</h2>
      <div class="rating" id="rating-row">
        ${[1,2,3,4,5].map(n=>`<button data-n="${n}">${n}</button>`).join('')}
      </div>
      <p class="subtle center">1 — Quase nada · 5 — Explico, relaciono e argumento</p>
      <div class="field">
        <label>Qual foi a principal ideia que você aprendeu?</label>
        <textarea id="ideia-principal" rows="2"></textarea>
      </div>
      <div class="field">
        <label>O que ainda não ficou claro? (opcional)</label>
        <textarea id="nao-claro" rows="2"></textarea>
      </div>
      <div class="btn-row">
        <button class="btn-big" id="btn-continuar-avaliacao">Continuar</button>
      </div>
    </div>`;
  showScreen('screen-avaliacao');
  document.getElementById('rating-row').addEventListener('click', e=>{
    if (e.target.tagName !== 'BUTTON') return;
    document.querySelectorAll('#rating-row button').forEach(b=>b.classList.remove('selected'));
    e.target.classList.add('selected');
    state.rating = Number(e.target.dataset.n);
  });
  document.getElementById('btn-continuar-avaliacao').addEventListener('click', ()=>{
    if (!state.rating){ alert('Selecione uma nota de 1 a 5.'); return; }
    state.ideiaPrincipal = document.getElementById('ideia-principal').value.trim();
    state.naoFicouClaro = document.getElementById('nao-claro').value.trim();
    goToDesafio(topic);
  });
}

/* ---------- desafio final ---------- */
function goToDesafio(topic){
  const template = CHALLENGE_TEMPLATES[Math.floor(Math.random()*CHALLENGE_TEMPLATES.length)];
  const pergunta = template.replace('{tema}', topic.tema);
  const el = document.getElementById('screen-desafio');
  el.innerHTML = `
    <div class="card">
      <div class="label">Desafio final</div>
      <p class="question">${pergunta}</p>
      <div class="field">
        <label>Sua resposta (opcional)</label>
        <textarea id="desafio-resposta" rows="3"></textarea>
      </div>
      <div class="btn-row">
        <button class="btn-big" id="btn-finalizar">Concluir sessão</button>
      </div>
    </div>`;
  showScreen('screen-desafio');
  document.getElementById('btn-finalizar').addEventListener('click', ()=>{
    recordSession({
      topic, nota: state.rating, ideiaPrincipal: state.ideiaPrincipal,
      naoFicouClaro: state.naoFicouClaro, isReview: state.isReview,
      studySeconds: state.studySeconds || 0, speakSeconds: state.speakSeconds || 0
    });
    goToConexoes(topic);
  });
}

/* ---------- conexões intelectuais ---------- */
function goToConexoes(topic){
  const el = document.getElementById('screen-conexoes');
  el.innerHTML = `
    <div class="card">
      <h2>Conecte os pontos</h2>
      <p class="subtle">Tema estudado: <strong>${topic.tema}</strong></p>
      <div class="connections">${topic.relacionados.map(r=>`<div class="item">${r}</div>`).join('')}</div>
      <div class="btn-row">
        <button class="btn-big" id="btn-fim-sessao">Voltar ao início</button>
      </div>
    </div>`;
  showScreen('screen-conexoes');
  document.getElementById('btn-fim-sessao').addEventListener('click', resetToHome);
}

/* ---------- modo revisão ---------- */
function renderReviewRecall(topic){
  const el = document.getElementById('screen-review-recall');
  el.innerHTML = `
    <div class="card">
      ${categoryTag(topic.categoria)}
      <h2>${topic.tema}</h2>
      <div class="label">Pergunta central</div>
      <p class="question">${topic.pergunta}</p>
      <div class="field">
        <label>O que você lembra sobre este assunto?</label>
        <textarea id="review-recall-text" rows="4"></textarea>
      </div>
      <div class="btn-row">
        <button class="btn-big" id="btn-comparar">Comparar com o conteúdo original</button>
      </div>
    </div>`;
  showScreen('screen-review-recall');
  document.getElementById('btn-comparar').addEventListener('click', ()=>{
    state.reviewRecallText = document.getElementById('review-recall-text').value.trim();
    renderReviewCompare(topic);
  });
}

function renderReviewCompare(topic){
  const el = document.getElementById('screen-review-compare');
  el.innerHTML = `
    <div class="card">
      <h2>Comparação</h2>
      <h4 class="label">O que você lembrou</h4>
      <p class="subtle">${state.reviewRecallText || '(nada anotado)'}</p>
      ${renderMaterial(topic)}
      <div class="btn-row">
        <button class="btn-big" id="btn-review-continuar">Continuar</button>
      </div>
    </div>`;
  showScreen('screen-review-compare');
  document.getElementById('btn-review-continuar').addEventListener('click', ()=>{
    state.studySeconds = 0; state.speakSeconds = 0;
    goToAvaliacao(topic);
  });
}

/* ---------- timers ---------- */
function runCountdown(elId, totalSeconds, onDone){
  clearInterval(state.timer);
  let remaining = totalSeconds;
  const elTimer = document.getElementById(elId);
  const render = ()=>{
    const m = String(Math.floor(remaining/60)).padStart(2,'0');
    const s = String(remaining%60).padStart(2,'0');
    elTimer.textContent = `${m}:${s}`;
    elTimer.classList.toggle('urgent', remaining <= 30);
  };
  render();
  state.timer = setInterval(()=>{
    remaining--;
    render();
    if (remaining <= 0){ clearInterval(state.timer); onDone(); }
  }, 1000);
}

function runCountup(elId, capSeconds, onCap){
  clearInterval(state.timer);
  let elapsed = 0;
  const elTimer = document.getElementById(elId);
  let capped = false;
  const render = ()=>{
    const m = String(Math.floor(elapsed/60)).padStart(2,'0');
    const s = String(elapsed%60).padStart(2,'0');
    elTimer.textContent = `${m}:${s}`;
  };
  render();
  state.timer = setInterval(()=>{
    elapsed++;
    render();
    if (elapsed >= capSeconds && !capped){ capped = true; onCap(); }
  }, 1000);
}

function resetToHome(){
  state.topic = null; state.rating = null; state.isReview = false;
  showScreen('screen-home');
}

/* ---------- MEU REPERTÓRIO ---------- */
function renderRepertorio(){
  const sessions = getSessions();
  const stats = getStats();
  const agg = getAgg();
  const temasEstudados = Object.keys(stats).length;
  const notas = sessions.map(s=>s.nota).filter(n=>typeof n === 'number');
  const media = notas.length ? (notas.reduce((a,b)=>a+b,0)/notas.length).toFixed(1) : '—';
  const dominados = Object.entries(stats).filter(([id,s])=> (s.avgScore||0) >= 4);
  const precisaRevisao = Object.entries(stats).filter(([id,s])=>{
    const daysSince = s.lastReviewed ? (Date.now() - new Date(s.lastReviewed))/86400000 : 999;
    return (s.avgScore||0) <= 2 || daysSince > 14 || s.timesShown === 1;
  });
  const findTema = id => (TOPICS.find(t=>t.id===id) || {}).tema || id;

  const el = document.getElementById('screen-repertorio');
  el.innerHTML = `
    <div class="brand"><h1>Meu Repertório</h1></div>
    <div class="stats-grid">
      <div class="stat"><div class="n">${temasEstudados}</div><div class="l">Temas estudados</div></div>
      <div class="stat"><div class="n">${agg.studyMinutes}</div><div class="l">Minutos estudados</div></div>
      <div class="stat"><div class="n">${agg.speakMinutes}</div><div class="l">Minutos de prática oral</div></div>
      <div class="stat"><div class="n">${media}</div><div class="l">Média das autoavaliações</div></div>
      <div class="stat"><div class="n">${agg.streak||0}</div><div class="l">Dias consecutivos</div></div>
      <div class="stat"><div class="n">${sessions.length}</div><div class="l">Sessões totais</div></div>
    </div>
    <div class="label">Temas dominados</div>
    <div class="topic-list">${dominados.length ? dominados.map(([id,s])=>`<div class="row"><span class="t">${findTema(id)}</span><span class="s">${s.avgScore.toFixed(1)}</span></div>`).join('') : '<div class="empty">Nenhum ainda — continue praticando.</div>'}</div>
    <div class="label">Temas que precisam de revisão</div>
    <div class="topic-list">${precisaRevisao.length ? precisaRevisao.map(([id,s])=>`<div class="row"><span class="t">${findTema(id)}</span><span class="s">${(s.avgScore||0).toFixed(1)}</span></div>`).join('') : '<div class="empty">Nada pendente no momento.</div>'}</div>
    <div class="nav-links"><a id="link-home-from-repertorio">← Voltar</a></div>`;
  document.getElementById('link-home-from-repertorio').addEventListener('click', ()=>showScreen('screen-home'));
  showScreen('screen-repertorio');
}

document.addEventListener('DOMContentLoaded', initHome);
