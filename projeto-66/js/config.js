/* =============================================================
   PROJETO 66 | Gestão à Vista — configuração central
   Namespace global: P66 (padrão do repositório: sem bundler)
   ============================================================= */
'use strict';

window.P66 = window.P66 || {};

/* ---------- Constantes do ciclo ---------- */
P66.CYCLE_DAYS = 66;

/* ---------- Ícones (SVG stroke, estilo tático/premium) ---------- */
P66.ICONS = (() => {
  const w = (paths, vb = '0 0 24 24') =>
    `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  return {
    target:  w('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'),
    clock:   w('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
    flag:    w('<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>'),
    radar:   w('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12l6-6"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    chart:   w('<path d="M4 20h16"/><path d="M7 20v-7"/><path d="M12 20V7"/><path d="M17 20v-11"/>'),
    compass: w('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
    spark:   w('<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>'),
    trophy:  w('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5H5a3 3 0 0 0 3 4"/><path d="M16 5h3a3 3 0 0 1-3 4"/><path d="M12 13v3"/><path d="M8 20h8M10 16h4v4"/>'),
    pen:     w('<path d="M14 5l5 5L8 21H3v-5z"/><path d="M12 7l5 5"/>'),
    shield:  w('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>'),
    anchor:  w('<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21"/><path d="M4 13a8 8 0 0 0 16 0"/><path d="M9 13H4M20 13h-5"/>'),
    gear:    w('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>'),
    sword:   w('<path d="M14.5 3.5L20 3l-.5 5.5L8 20l-4-4z"/><path d="M5 13l6 6"/><path d="M3 21l2-2"/>'),
    menu:    w('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    keyboard:w('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>'),
    alarm:   w('<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 2"/><path d="M5 4L3 6M19 4l2 2"/>'),
    bible:   w('<path d="M5 4a2 2 0 0 1 2-2h12v18H7a2 2 0 0 0-2 2z"/><path d="M12 6v6M9.5 8.5h5"/>'),
    dumbbell:w('<path d="M7 8v8M4 10v4M17 8v8M20 10v4M7 12h10"/>'),
    droplet: w('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
    book:    w('<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>'),
    brain:   w('<path d="M12 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0 3 3 0 0 0 2-5 3 3 0 0 0-2-5 3 3 0 0 0-3-3z"/><path d="M12 4v16"/>'),
    wind:    w('<path d="M4 9h9a2.5 2.5 0 1 0-2.5-2.5"/><path d="M4 14h13a2.5 2.5 0 1 1-2.5 2.5"/>'),
    heart:   w('<path d="M12 20s-7-4.5-9-9c-1.2-2.8.6-6 3.8-6 2 0 3.6 1.2 5.2 3.2C13.6 6.2 15.2 5 17.2 5c3.2 0 5 3.2 3.8 6-2 4.5-9 9-9 9z"/>'),
    clipboard:w('<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4a2 2 0 0 1 6 0"/><path d="M9 10h6M9 14h6M9 18h3"/>'),
    moon:    w('<path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/>'),
    flame:   w('<path d="M12 3s5 4.5 5 9.5a5 5 0 0 1-10 0C7 9 9 7 9.5 5c1 1 1.6 2 1.7 3.3C12.2 6.8 12 4.5 12 3z"/>'),
    check:   w('<path d="M4 12.5l5 5L20 6.5"/>'),
    plus:    w('<path d="M12 5v14M5 12h14"/>'),
    search:  w('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
    calendar:w('<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
    cross:   w('<path d="M12 3v18M6 9h12"/>'),
    users:   w('<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5a3.5 3.5 0 0 1 0 7M21 20c0-2.8-1.9-5.1-4.5-5.8"/>'),
    coins:   w('<circle cx="9" cy="9" r="6"/><path d="M14.5 5.5A6 6 0 1 1 8 15.4"/><path d="M9 6.5v5M7 9h4"/>'),
    briefcase:w('<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>'),
    smile:   w('<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01"/><path d="M8.5 14.5a5 5 0 0 0 7 0"/>'),
    x:       w('<path d="M6 6l12 12M18 6L6 18"/>'),
    pause:   w('<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>'),
    play:    w('<path d="M8 5l11 7-11 7z"/>'),
    reset:   w('<path d="M4 10a8 8 0 1 1 2 6"/><path d="M4 10V5m0 5h5"/>'),
    download:w('<path d="M12 4v11M7 11l5 5 5-5"/><path d="M5 20h14"/>'),
    upload:  w('<path d="M12 20V9M7 13l5-5 5 5"/><path d="M5 4h14"/>'),
    printer: w('<path d="M7 8V4h10v4"/><rect x="4" y="8" width="16" height="8" rx="1.5"/><path d="M7 13h10v7H7z"/>'),
    arrowUp: w('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    arrowDown:w('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    minus:   w('<path d="M5 12h14"/>'),
    warning: w('<path d="M12 4L2.5 20h19z"/><path d="M12 10v4M12 17.5h.01"/>'),
    star:    w('<path d="M12 3l2.5 5.7 6 .6-4.5 4.1 1.3 5.9L12 16.2 6.7 19.3 8 13.4 3.5 9.3l6-.6z"/>'),
    camera:  w('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7l1.5-3h3L15 7"/><circle cx="12" cy="13" r="3.5"/>'),
    trash:   w('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
    sun:     w('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>'),
  };
})();
P66.icon = (name) => P66.ICONS[name] || P66.ICONS.target;

/* ---------- Áreas do Homem Integral ---------- */
P66.AREAS = {
  espiritual:   { label: 'Espiritual',   icon: 'cross' },
  fisica:       { label: 'Física',       icon: 'dumbbell' },
  intelectual:  { label: 'Intelectual',  icon: 'brain' },
  financeira:   { label: 'Financeira',   icon: 'coins' },
  familia:      { label: 'Família',      icon: 'users' },
  casamento:    { label: 'Casamento',    icon: 'heart' },
  emocional:    { label: 'Emocional',    icon: 'smile' },
  profissional: { label: 'Profissional', icon: 'briefcase' },
  social:       { label: 'Social',       icon: 'users' },
};

/* ---------- Os 10 hábitos padrão ----------
   time  = horário planejado (timeline "Hoje")
   min   = tempo estimado em minutos
   xp    = pontos por conclusão
   prio  = alta | media | baixa
   areas = áreas do Homem Integral que o hábito alimenta            */
P66.DEFAULT_HABITS = [
  { id: 'h_acordar',   name: 'Acordar às 05:30',            goal: 'Ganhar a primeira batalha do dia',            icon: 'alarm',    time: '05:30', min: 0,  xp: 80,  prio: 'alta',  areas: ['emocional', 'profissional'] },
  { id: 'h_devocional',name: 'Devocional + Bíblia',         goal: 'Buscar a Deus antes de qualquer tela',        icon: 'bible',    time: '06:00', min: 20, xp: 120, prio: 'alta',  areas: ['espiritual'] },
  { id: 'h_treino',    name: 'Treino de 30 minutos',        goal: 'Corrida, musculação, flexão ou barra',        icon: 'dumbbell', time: '06:30', min: 30, xp: 100, prio: 'alta',  areas: ['fisica'] },
  { id: 'h_agua',      name: 'Água: 500ml ao acordar + 2L', goal: 'Hidratar o corpo desde a primeira hora',      icon: 'droplet',  time: '07:30', min: 5,  xp: 40,  prio: 'media', areas: ['fisica'] },
  { id: 'h_leitura',   name: 'Leitura de 10 páginas',       goal: 'Ficar mais inteligente e interessante',       icon: 'book',     time: '08:00', min: 25, xp: 70,  prio: 'alta',  areas: ['intelectual'] },
  { id: 'h_estudo',    name: 'Estudar habilidade (IA/Inglês)', goal: '30 minutos construindo o futuro',          icon: 'brain',    time: '12:30', min: 30, xp: 90,  prio: 'media', areas: ['intelectual', 'profissional'] },
  { id: 'h_pausa',     name: 'Pausa de 10 min em silêncio', goal: 'Esvaziar a cabeça, relaxar e alongar',        icon: 'wind',     time: '15:00', min: 10, xp: 50,  prio: 'baixa', areas: ['emocional'] },
  { id: 'h_esposa',    name: 'Investir na esposa',          goal: 'Atenção total, sem celular, todos os dias',   icon: 'heart',    time: '19:30', min: 20, xp: 90,  prio: 'alta',  areas: ['casamento', 'familia'] },
  { id: 'h_plano',     name: 'Planejar amanhã + organizar mesa', goal: 'Terminar o dia no comando do próximo',   icon: 'clipboard',time: '21:00', min: 10, xp: 40,  prio: 'media', areas: ['profissional', 'financeira'] },
  { id: 'h_sono',      name: 'Protocolo do sono',           goal: 'Sem telas 2h antes, quarto frio, celular fora', icon: 'moon',   time: '21:30', min: 30, xp: 80,  prio: 'alta',  areas: ['fisica', 'emocional'] },
];

/* ---------- Banco de missões (5 sorteadas por dia) ---------- */
P66.MISSIONS = [
  { id: 'm_pais',      name: 'Ligar para seus pais',                    xp: 60, icon: 'users',    areas: ['familia', 'social'] },
  { id: 'm_elogio',    name: 'Fazer um elogio sincero à sua esposa',    xp: 50, icon: 'heart',    areas: ['casamento'] },
  { id: 'm_paginas',   name: 'Ler 10 páginas extras',                   xp: 40, icon: 'book',     areas: ['intelectual'] },
  { id: 'm_agua',      name: 'Bater 2 litros de água antes das 18h',    xp: 30, icon: 'droplet',  areas: ['fisica'] },
  { id: 'm_mesa',      name: 'Organizar a mesa de trabalho',            xp: 30, icon: 'clipboard',areas: ['profissional'] },
  { id: 'm_evangelizar',name:'Evangelizar ou abençoar alguém hoje',     xp: 80, icon: 'cross',    areas: ['espiritual', 'social'] },
  { id: 'm_orcamento', name: 'Revisar o orçamento do mês',              xp: 60, icon: 'coins',    areas: ['financeira'] },
  { id: 'm_gratidao',  name: 'Anotar 3 motivos de gratidão',            xp: 40, icon: 'pen',      areas: ['emocional', 'espiritual'] },
  { id: 'm_caminhada', name: 'Caminhar 15 minutos ao ar livre',         xp: 40, icon: 'sun',      areas: ['fisica', 'emocional'] },
  { id: 'm_amigo',     name: 'Mandar mensagem para um amigo distante',  xp: 30, icon: 'users',    areas: ['social'] },
  { id: 'm_emails',    name: 'Zerar a caixa de entrada',                xp: 40, icon: 'briefcase',areas: ['profissional'] },
  { id: 'm_investir',  name: 'Guardar ou investir algum valor hoje',    xp: 70, icon: 'coins',    areas: ['financeira'] },
  { id: 'm_oracao',    name: 'Orar por alguém específico pelo nome',    xp: 50, icon: 'cross',    areas: ['espiritual'] },
  { id: 'm_familia',   name: 'Tempo de qualidade com a família',        xp: 60, icon: 'users',    areas: ['familia'] },
  { id: 'm_versiculo', name: 'Memorizar um versículo',                  xp: 60, icon: 'bible',    areas: ['espiritual', 'intelectual'] },
  { id: 'm_gentileza', name: 'Fazer algo gentil sem ser notado',        xp: 50, icon: 'smile',    areas: ['emocional', 'social'] },
  { id: 'm_dormir',    name: 'Deitar antes das 22h30',                  xp: 60, icon: 'moon',     areas: ['fisica'] },
  { id: 'm_semredes',  name: 'Sem redes sociais até as 18h',            xp: 80, icon: 'shield',   areas: ['emocional', 'profissional'] },
  { id: 'm_agradecer', name: 'Agradecer a alguém por escrito',          xp: 40, icon: 'pen',      areas: ['social', 'emocional'] },
  { id: 'm_alongar',   name: 'Alongamento de 10 minutos',               xp: 30, icon: 'wind',     areas: ['fisica'] },
  { id: 'm_semana',    name: 'Planejar a próxima semana',               xp: 60, icon: 'calendar', areas: ['profissional'] },
  { id: 'm_igreja',    name: 'Convidar alguém para a igreja',           xp: 70, icon: 'cross',    areas: ['espiritual', 'social'] },
  { id: 'm_metas',     name: 'Revisar as metas do ciclo',               xp: 50, icon: 'target',   areas: ['profissional', 'emocional'] },
  { id: 'm_servir',    name: 'Ato de serviço para a esposa',            xp: 60, icon: 'heart',    areas: ['casamento'] },
];
P66.MISSIONS_PER_DAY = 5;

/* ---------- Patentes (níveis de XP) ---------- */
P66.RANKS = [
  { level: 1,  name: 'Recruta',          xp: 0 },
  { level: 2,  name: 'Soldado',          xp: 400 },
  { level: 3,  name: 'Cabo',             xp: 1000 },
  { level: 4,  name: 'Sargento',         xp: 1800 },
  { level: 5,  name: 'Subtenente',       xp: 2800 },
  { level: 6,  name: 'Tenente',          xp: 4200 },
  { level: 7,  name: 'Capitão',          xp: 6000 },
  { level: 8,  name: 'Major',            xp: 8200 },
  { level: 9,  name: 'Tenente-Coronel',  xp: 11000 },
  { level: 10, name: 'Coronel',          xp: 14500 },
  { level: 11, name: 'General',          xp: 19000 },
  { level: 12, name: 'Marechal',         xp: 25000 },
];

/* ---------- Conquistas ----------
   check(S) recebe P66.Store e devolve true quando desbloqueada     */
P66.ACHIEVEMENTS = [
  { id: 'a_primeira',   name: 'Primeira Batalha',    desc: 'Conclua seu primeiro hábito',                 icon: 'check',   check: S => S.totalCompletions() >= 1 },
  { id: 'a_dia1',       name: 'Dia Perfeito',        desc: 'Complete 100% dos hábitos em um dia',         icon: 'star',    check: S => S.perfectDays() >= 1 },
  { id: 'a_streak7',    name: 'Semana de Ferro',     desc: '7 dias perfeitos consecutivos',               icon: 'flame',   check: S => S.bestStreak() >= 7 },
  { id: 'a_streak14',   name: 'Quinzena de Aço',     desc: '14 dias perfeitos consecutivos',              icon: 'flame',   check: S => S.bestStreak() >= 14 },
  { id: 'a_streak21',   name: 'Hábito Forjado',      desc: '21 dias perfeitos consecutivos',              icon: 'flame',   check: S => S.bestStreak() >= 21 },
  { id: 'a_streak33',   name: 'Meio Caminho',        desc: '33 dias perfeitos consecutivos',              icon: 'flame',   check: S => S.bestStreak() >= 33 },
  { id: 'a_streak66',   name: 'Projeto 66 Completo', desc: '66 dias perfeitos consecutivos',              icon: 'trophy',  check: S => S.bestStreak() >= 66 },
  { id: 'a_streak100',  name: 'Centurião',           desc: '100 dias perfeitos consecutivos',             icon: 'trophy',  check: S => S.bestStreak() >= 100 },
  { id: 'a_streak365',  name: 'Imparável',           desc: '365 dias perfeitos consecutivos',             icon: 'trophy',  check: S => S.bestStreak() >= 365 },
  { id: 'a_imaculado',  name: 'Imaculado',           desc: 'Feche um ciclo de 66 dias sem quebrar nenhum',icon: 'shield',  check: S => S.flawlessCycle() },
  { id: 'a_treino100',  name: 'Corpo de Elite',      desc: 'Treine 100 vezes',                            icon: 'dumbbell',check: S => S.habitCount('h_treino') >= 100 },
  { id: 'a_devo100',    name: 'Enraizado',           desc: '100 devocionais concluídos',                  icon: 'bible',   check: S => S.habitCount('h_devocional') >= 100 },
  { id: 'a_leitura100', name: 'Mente Afiada',        desc: '100 leituras concluídas',                     icon: 'book',    check: S => S.habitCount('h_leitura') >= 100 },
  { id: 'a_missao10',   name: 'Operador',            desc: 'Complete 10 missões',                         icon: 'flag',    check: S => S.missionsCount() >= 10 },
  { id: 'a_missao50',   name: 'Forças Especiais',    desc: 'Complete 50 missões',                         icon: 'flag',    check: S => S.missionsCount() >= 50 },
  { id: 'a_nivel5',     name: 'Subtenente',          desc: 'Alcance o nível 5',                           icon: 'arrowUp', check: S => S.levelInfo().level >= 5 },
  { id: 'a_nivel10',    name: 'Coronel',             desc: 'Alcance o nível 10',                          icon: 'arrowUp', check: S => S.levelInfo().level >= 10 },
  { id: 'a_reflexao1',  name: 'Autoexame',           desc: 'Registre sua primeira reflexão',              icon: 'pen',     check: S => S.journalCount() >= 1 },
  { id: 'a_reflexao7',  name: 'Vigilante',           desc: '7 reflexões registradas',                     icon: 'pen',     check: S => S.journalCount() >= 7 },
];

/* ---------- Paleta de dados (validada: dataviz six checks, modo escuro) ---------- */
P66.VIZ = {
  surface: '#14161a',
  series:  ['#c9821f', '#199e70', '#3987e5', '#e5484d'],  // categórica validada
  heat:    ['#6b4d1c', '#9c6f24', '#cd922f', '#f0b445'],  // rampa âmbar validada (ordinal)
  heatZero:'#1d2026',                                     // célula "sem execução" (track neutro)
  good:    '#199e70',
  bad:     '#e5484d',
  ink:     '#f2f3f5',
  ink2:    '#9ba1ab',
  ink3:    '#5f6670',
  grid:    'rgba(255,255,255,0.06)',
};
