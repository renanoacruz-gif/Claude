/* =========================================================================
   FPS Analyzer — base de dados curada
   Revisão: 2026-08-28
   Notas 0-10 são avaliação editorial e comparável entre jogos da base.
   Números de população/patch vêm das fontes citadas em cada jogo (game.dados).
   ========================================================================= */

window.REVISAO = '28/08/2026';

window.CRITERIOS = [
  {k:'gameplay',    n:'Gameplay',    d:'Sensação de tiro, movimento, fluidez e coerência das mecânicas.'},
  {k:'mira',        n:'Mira',        d:'Quanto a pontaria pura decide, e quão limpo é o modelo de precisão.'},
  {k:'mapas',       n:'Mapas',       d:'Qualidade, variedade, balanceamento de lados e rejogabilidade.'},
  {k:'competitivo', n:'Competitivo', d:'Ranked, matchmaking, integridade, esports e profundidade.'},
  {k:'graficos',    n:'Gráficos',    d:'Qualidade visual E clareza — legibilidade do inimigo pesa mais que brilho.'},
  {k:'performance', n:'Performance', d:'FPS, otimização, netcode, tick rate e estabilidade.'},
  {k:'conteudo',    n:'Conteúdo',    d:'Volume, ritmo de atualização e valor do que se joga sem pagar.'},
  {k:'comunidade',  n:'Comunidade',  d:'Toxicidade, smurfs, cheaters e saúde da população.'},
  {k:'monetizacao', n:'Monetização', d:'Preço, agressividade, e ausência de vantagem paga.'}
];

window.GAMES = [];

/* ======================= COUNTER-STRIKE 2 ======================= */
GAMES.push({
id:'cs2', nome:'Counter-Strike 2', cor:'#f0a30a', tipo:'Tático', tags:['Tático','5v5','PC'],
pitch:'O padrão-ouro do tiro tático. Mecânica quase perfeita, tudo em volta dela cheio de arestas.',
notaGeral:8.4,
scores:{gameplay:9.0,mira:9.6,mapas:9.0,competitivo:8.7,graficos:7.8,performance:7.4,conteudo:6.0,comunidade:5.4,monetizacao:5.0},
visao:{
  completo:'Counter-Strike 2', dev:'Valve', publisher:'Valve', ano:'2023 (sucessor do CS:GO, 2012)',
  plataformas:'PC (Windows, Linux) — sem versão de console',
  engine:'Source 2',
  modelo:'Free-to-play, com receita concentrada em caixas e skins',
  modos:'Premier (ranqueado principal), Competitivo por mapa, Wingman 2v2, Deathmatch, Casual, Arms Race',
  perfil:'Tático, econômico, baseado em rounds. Sem habilidades, sem classes, sem regeneração de vida.',
  publico:'Jogador de PC com foco em pontaria e disciplina; base competitiva e de mercado de skins.',
  situacao:'Muito vivo em população. Ritmo de conteúdo baixo para o tamanho do jogo, e o anticheat segue sendo a crítica central.'
},
resumoNota:'8,4 porque o núcleo — economia, recuo determinístico, spray control, mapas — continua sendo o mais bem resolvido do gênero, e nenhum concorrente chegou perto. Perde pontos onde a Valve historicamente não entrega: anticheat, cadência de conteúdo e transparência do matchmaking.',
gameplay:{
  texto:'CS2 é lento por design e explosivo em janelas curtas. Uma partida Premier vive de economia (quando comprar, quando salvar), de utilitário (smoke, flash, molotov) e de trocas de tiro que terminam em frações de segundo. O <strong>TTK é dos mais baixos do gênero</strong>: um AK-47 mata com um tiro na cabeça a qualquer distância, sem armadura ou com ela. Isso torna o primeiro tiro quase sempre o tiro que decide.<br><br>O movimento é pesado e intencionalmente restritivo — o jogador precisa <strong>parar completamente</strong> para atirar com precisão (counter-strafe). Não há deslize, gancho, corrida em parede ou salto duplo. Essa restrição é o que gera o skill gap: o teto de habilidade não vem de acrobacia, vem de precisão de posicionamento, timing e controle de recuo.<br><br>O recuo é <strong>determinístico</strong>: o padrão de spray de cada arma é fixo e memorizável, com um componente aleatório pequeno. Quem treina, controla. As smokes volumétricas da Source 2 mudaram o jogo de verdade — elas são dinâmicas, abrem buraco quando você atira ou joga granada nelas, e criaram uma camada tática que o CS:GO não tinha.',
  notas:[['Velocidade das partidas',7.0],['Fluidez',8.5],['Tiro',9.8],['Recuo (qualidade do modelo)',9.5],['Movimento',7.0],['Precisão',9.6],['Peso da mira',9.8],['Peso da estratégia',9.0],['Peso do posicionamento',9.5]],
  ttk:'Muito baixo. Headshot de rifle mata instantaneamente; a maioria das trocas resolve em 1–3 tiros.',
  curva:'Íngreme e longa. Aprender a atirar leva semanas; aprender economia, utilitário e timings leva anos.',
  skillGap:'O maior do gênero em jogo puro de tiro. A diferença entre um jogador mediano e um de elite é brutal e visível em qualquer round.',
  dificuldade:'Alto. Sem mecânicas de perdão: sem regeneração, sem respawn, sem habilidade que salve um erro de posicionamento.'
},
armas:{
  texto:'O arsenal é pequeno para os padrões modernos (~35 armas) e é assim de propósito. Cada arma tem função econômica clara: a AK-47 e a M4 definem o round de compra completa, a AWP define o controle de ângulos longos, e as SMGs existem para o eco e o anti-eco (bônus de $600 por abate). Não há personalização mecânica: <strong>não existem attachments, loadouts ou perks</strong> — a skin é puramente cosmética e não altera um único valor.<br><br>O balanceamento é maduro, mas não é neutro. Há uma meta dominante estável: <strong>AK-47 / M4A4 / M4A1-S / AWP + Desert Eagle</strong> concentram a esmagadora maioria dos abates em nível alto. Categorias inteiras (metralhadoras pesadas, algumas shotguns, o SG 553 pós-nerf) são situacionais a ponto de quase nunca aparecerem em partida séria.',
  meta:'AK-47 (TR) e M4A4/M4A1-S (CT) como base; AWP como arma de definição de round; Desert Eagle no force-buy; MP9/MAC-10 no anti-eco. Meta estável há anos — mudanças vêm de ajustes de preço, não de armas novas.',
  dominante:true,
  dominanteTxt:'Sim, existe meta dominante — mas é uma dominância de design, não de desbalanceamento acidental. O jogo quer que a AK e a M4 sejam as armas de referência. O custo real é que boa parte do arsenal existe só no papel.',
  notas:[['Variedade',6.0],['Balanceamento',8.5],['Diferenciação entre armas',9.0],['Personalização',2.0],['Qualidade do recuo',9.5],['Distância efetiva bem definida',9.0],['Viabilidade das categorias',6.0]]
},
mapas:{
  texto:'O pool competitivo tem 7 mapas ativos, com rotação ocasional. É pouco em quantidade e muito em profundidade: cada mapa tem anos de teoria acumulada — linhas de smoke, timings de rotação, posições de default. O <strong>conhecimento de mapa vale tanto quanto a mira</strong>, e essa é uma das razões de o jogo ser tão hostil para o iniciante.<br><br>Verticalidade é baixa por escolha de design (quase todo combate acontece no mesmo plano, com poucas exceções). Os pontos de estrangulamento são o coração do jogo: mid de Dust2, banana de Inferno, connector de Mirage. Balanceamento entre lados varia por mapa e é acompanhado publicamente pelas estatísticas de campeonato.',
  destaques:[
    {nome:'Mirage',txt:'O mapa mais equilibrado e mais jogado do pool. Três rotas claras, mid decisivo, leitura simétrica. É o mapa que se recomenda para aprender o jogo.'},
    {nome:'Inferno',txt:'O mais dependente de utilitário do pool. Banana é provavelmente o choke point mais estudado do FPS competitivo. Historicamente pende para o lado CT.'},
    {nome:'Dust2',txt:'Icônico e o mais simples estruturalmente — o que o torna o mais puramente decidido por pontaria. Duelos de AWP em long/mid dominam.'},
    {nome:'Nuke',txt:'O único mapa com verticalidade real (dois andares + ramp). Fortemente favorável ao CT, o que o torna divisivo em veto de campeonato.'},
    {nome:'Ancient / Anubis / Train',txt:'Mapas mais recentes do pool. Train voltou remasterizado na Source 2 e reequilibrou o veto ao trazer um mapa de controle de espaço aberto.'}
  ],
  notas:[['Quantidade',6.0],['Qualidade',9.5],['Variedade',7.0],['Design',9.5],['Verticalidade',5.0],['Qualidade das rotas',9.0],['Balanceamento de lados',8.0],['Rejogabilidade',9.5],['Peso do conhecimento de mapa',9.8]]
},
competitivo:{
  classificacao:'Altamente competitivo',
  texto:'CS2 é referência de integridade de formato e problema crônico de integridade de partida. O <strong>Premier</strong> traz rating numérico visível (CS Rating), veto de mapa e é o modo que o jogo considera oficial. O sistema é bom em medir; é fraco em proteger.<br><br>O esporte é o mais consolidado do gênero: circuito com Majors patrocinados pela Valve, ligas de terceiros (ESL, BLAST), e um ecossistema de times com décadas de história. Nenhum outro FPS tem essa continuidade — um time de CS pode ser relevante por 10 anos.<br><br>O ponto fraco é o VAC. Mesmo com VAC Live, a percepção da comunidade competitiva é de que o matchmaking oficial em ratings altos convive com cheaters, e uma parte considerável do público sério migrou para plataformas de terceiros (FACEIT, ESEA) que rodam anticheat próprio em modo kernel. Isso é um sintoma raro: <strong>o jogo terceirizou a própria integridade competitiva</strong>.',
  notas:[['Ranking',8.5],['Matchmaking',6.5],['Sistema competitivo',8.5],['Esports',9.8],['Cenário profissional',9.8],['Skill gap',9.8],['Qualidade das ranqueadas',6.5],['Integridade competitiva',5.5],['Controle de smurfs',4.5],['Controle de cheaters',4.5],['Ambiente / toxicidade',5.0]],
  justificativa:'Altamente competitivo sem discussão: profundidade mecânica máxima, cenário profissional mais maduro do gênero e formato de round que recompensa disciplina coletiva. A ressalva é que a experiência competitiva de qualidade frequentemente exige sair do matchmaking oficial.'
},
experiencia:{
  iniciante:'Difícil. Não há tutorial que prepare de verdade, o TTK pune erro instantaneamente, e a economia é opaca nas primeiras dezenas de horas. Some-se a isso o ambiente de voz frequentemente hostil. É o FPS competitivo mais duro de começar em 2026.',
  intermediario:'Excelente. É onde a curva mais recompensa: aprender três smokes de um mapa muda seu resultado de forma mensurável. O progresso é visível e claramente atribuível ao treino, não ao jogo.',
  avancado:'Recompensa domínio técnico como nenhum outro. Controle de spray, movimento de counter-strafe, pré-mira, uso de utilitário e leitura econômica são camadas independentes que continuam rendendo depois de milhares de horas.',
  competitivo:'Profundidade de sobra. A ressalva é ambiental: para jogar sério, a rota prática é FACEIT/ESEA, não o Premier.'
},
tecnico:{
  texto:'A Source 2 melhorou iluminação, smokes e ferramentas, mas <strong>CS2 roda pior que o CS:GO em hardware modesto</strong> — isso é consenso da comunidade e a principal regressão técnica da transição. Em máquinas fortes o jogo entrega centenas de FPS; em PCs antigos que rodavam CS:GO a 300 FPS, a queda é perceptível.<br><br>O ponto mais debatido é o <strong>sub-tick</strong>: a Valve substituiu o tick rate fixo por um sistema que registra o instante exato do input entre ticks. Na teoria, resolve o problema clássico de perder um tiro por estar entre ticks. Na prática, a comunidade competitiva relatou desde o lançamento inconsistências de registro e de "peeker\'s advantage". A Valve ajustou o sistema várias vezes; a divergência entre a explicação técnica oficial e a percepção dos jogadores de alto nível nunca fechou completamente.',
  itens:[['FPS','Muito alto em hardware moderno; regressão em PCs antigos vs. CS:GO'],['Otimização','Mediana — o maior recuo da migração para Source 2'],['Input lag','Baixo em condições normais'],['Netcode','Sub-tick em vez de tick rate fixo — modelo tecnicamente ambicioso, contestado na prática'],['Tick rate','Não aplicável no modelo clássico: servidores oficiais usam sub-tick'],['Estabilidade','Boa; crashes não são um problema sistêmico'],['Escalabilidade','Boa, mas o piso de hardware subiu']],
  semDados:'Não há números públicos confiáveis e atuais da Valve sobre latência média de servidor por região ou taxa de detecção do VAC. Qualquer número específico nessas duas áreas deve ser tratado com desconfiança.',
  notas:[['FPS',8.5],['Otimização',6.5],['Input lag',8.5],['Netcode',6.5],['Estabilidade',8.0],['Escalabilidade gráfica',7.0]]
},
av:{
  texto:'CS2 não é um jogo bonito pelos padrões de 2026 — é um jogo <strong>legível</strong>, e isso importa mais. Modelos de personagem contrastam com os cenários, iluminação é mais realista que no CS:GO sem esconder o inimigo, e o design visual evita poluição. As smokes volumétricas são o destaque técnico: reagem a granadas e tiros, são iluminadas dinamicamente e viraram mecânica, não efeito.<br><br>O áudio é competitivamente decisivo. Passos, troca de arma, recarga e queda de granada têm assinaturas distintas, e a direcionalidade é precisa o suficiente para você chamar posição por som. Um jogador experiente joga metade do round pelo fone.',
  impacto:'Favorecem a competitividade. A clareza do inimigo é prioridade explícita de design: skins de arma são cosméticas e agressivas, mas skins de personagem são limitadas justamente para não comprometerem a leitura.',
  notas:[['Qualidade visual',7.5],['Animações',7.5],['Iluminação',8.5],['Texturas',7.5],['Design visual',8.5],['Clareza do inimigo',9.0],['Som dos disparos',9.0],['Passos (footsteps)',9.5],['Direcionalidade',9.5],['Mixagem',9.0]]
},
progressao:{
  texto:'Praticamente inexistente como sistema de recompensa. Não há árvore de desbloqueio, não há armas trancadas, não há perks. O que existe é <strong>economia de skins</strong>: caixas que exigem chave paga, drops semanais e um mercado de revenda real dentro do Steam.<br><br>Não há pay-to-win — nenhum item comprado afeta dano, recuo ou hitbox. Mas a monetização é problemática por outra razão: o modelo de caixa é <strong>abertura aleatória paga</strong>, com itens de valor extremo, e alimentou um ecossistema paralelo de sites de apostas de skins que atinge público adolescente. A Valve captura receita disso sem operar as apostas, e agiu contra elas apenas de forma pontual ao longo dos anos.<br><br>O Battle Pass ("Passe de Operação") não é permanente: operações aparecem esporadicamente, e a comunidade cobra publicamente a demora entre elas.',
  classe:'Aceitável',
  classeTxt:'Aceitável — e não mais que isso. Zero pay-to-win e o jogo inteiro é gratuito, o que é genuinamente generoso. Mas o motor de receita é caixa com chave paga, um mecanismo de recompensa aleatória com valor monetário real, ligado a um mercado de apostas paralelo que a Valve tolera há uma década.',
  p2w:'Nenhum. Skins não alteram nenhum valor de jogo.',
  notas:[['Progressão',3.0],['Battle Pass / Operações',4.0],['Skins (qualidade)',9.0],['Recompensas gratuitas',5.0],['Conteúdo sazonal',4.5],['Frequência de atualização',5.0],['Monetização (justiça)',5.0],['Ausência de pay-to-win',10.0]]
},
problemas:[
  {tipo:'fato',t:'Anticheat abaixo do padrão da categoria',p:'É verificável que o ecossistema competitivo sério do CS migrou para plataformas de terceiros com anticheat kernel (FACEIT, ESEA). Um jogo cujo público competitivo prefere um cliente externo ao matchmaking do próprio desenvolvedor tem um problema estrutural, não uma reclamação.'},
  {tipo:'fato',t:'Regressão de performance em hardware antigo',p:'CS2 exige mais que o CS:GO e derrubou performance em PCs que rodavam o antecessor com folga. Isso é mensurável e afeta um público historicamente grande no jogo.'},
  {tipo:'reclamacao',t:'Registro de tiro e sub-tick',p:'Reclamação recorrente e persistente de jogadores de alto nível sobre inconsistência de hitreg e peeker\'s advantage. A Valve fez ajustes sucessivos; a divergência entre a explicação técnica e a percepção dos jogadores não foi resolvida de forma consensual.'},
  {tipo:'reclamacao',t:'Ritmo de conteúdo lento',p:'Intervalos longos entre operações, mapas novos e mudanças de pool. Frequente na comunidade; é escolha de produto da Valve, não uma falha técnica.'},
  {tipo:'reclamacao',t:'Smurfs no Premier',p:'Conta gratuita torna smurf barato. Muito citado; a Valve não publica dados que permitam medir a extensão real.'},
  {tipo:'opiniao',t:'"O CS:GO era melhor"',p:'Posição comum entre veteranos, ancorada em performance e em preferências de sensação de tiro. É julgamento subjetivo — o CS2 objetivamente entregou smokes dinâmicas e ferramentas melhores.'}
],
fortes:[
  'Modelo de tiro e recuo mais bem resolvido do gênero — determinístico, treinável, justo.',
  'Economia por round: uma camada estratégica que quase nenhum concorrente tenta imitar bem.',
  'Mapas com uma década de refino e um dos maiores pesos de conhecimento tático do gênero.',
  'Cenário profissional mais maduro e contínuo de todos os FPS, com Majors e times de longevidade rara.',
  'Free-to-play sem qualquer vantagem paga: o jogo completo, competitivo, custa zero.'
],
fracos:[
  'VAC insuficiente — a integridade do matchmaking oficial é o maior buraco do produto.',
  'Ritmo de conteúdo lento para o tamanho e a receita do jogo.',
  'Performance pior que a do CS:GO em máquinas modestas.',
  'Onboarding hostil: quase nenhum suporte real ao iniciante em um jogo com curva altíssima.',
  'Modelo de receita baseado em caixa aleatória, com um mercado de apostas paralelo tolerado há anos.'
],
concorrentes:['valorant','r6','finals','bo7'],
vale:{
  veredito:'Sim',
  texto:'Se o que você quer é o teste mais puro de pontaria e disciplina tática que existe em 2026, é aqui. É gratuito, a população é enorme, e o teto de habilidade é praticamente ilimitado. O preço é engolir a curva de entrada e, se for jogar sério, provavelmente pagar por FACEIT.',
  perfis:[
    ['Casual','Com ressalvas. Existem modos leves (Deathmatch, Casual, Wingman), mas o jogo não foi desenhado para sessão relaxada. Um casual puro se diverte mais em The Finals ou Battlefield.'],
    ['Competitivo','Sim, primeira escolha. Nenhum outro FPS oferece esse teto mecânico e essa continuidade de cena.'],
    ['Solo','Sim, com ressalva. O Premier solo funciona, mas a experiência de comunicação em fila aberta é o ponto mais desgastante do jogo.'],
    ['Com amigos','Excelente. O formato 5v5 com economia compartilhada é feito para grupo fixo; é o melhor uso possível de um time de cinco.'],
    ['Foco em ranking','Sim. CS Rating é numérico, transparente e comparável — um dos melhores sistemas de rating visível do gênero.'],
    ['Foco em esports','Sim, incomparável. Majors, histórico e um circuito que dá sentido a acompanhar o jogo por anos.']
  ]
},
veredito:{
  melhor:'O modelo de tiro — recuo determinístico e precisão baseada em movimento.',
  problema:'Anticheat. O matchmaking oficial não protege a própria competição.',
  diferencial:'Economia por round + smokes volumétricas: profundidade tática sem habilidades.',
  risco:'A Valve continuar tratando conteúdo e integridade como prioridade secundária enquanto a receita de skins não cair.',
  perfil:'Quem quer melhorar em pontaria e tática por anos e aceita um jogo que não perdoa.',
  vale2026:'Sim',
  conclusao:'CS2 é o melhor FPS competitivo do mercado e, simultaneamente, o pior administrado entre os grandes. O núcleo é excelente e insubstituível; a camada de serviço — anticheat, conteúdo, comunicação — é indefensável para uma empresa desse porte. Você joga apesar da Valve, não por causa dela. E ainda assim vale.'
},
dados:[
  {l:'Média de jogadores simultâneos no Steam — agosto/2026',v:'~821.915 (queda de 2,7% vs. julho/2026)',f:'SteamDB / Steam Charts',u:'https://www.steamdb.com/en/tools/steam-charts/730-counter-strike-2'},
  {l:'Pico de 26/08/2026',v:'1.277.861 jogadores simultâneos',f:'SteamDB / Steam Charts',u:'https://www.steamdb.com/en/tools/steam-charts/730-counter-strike-2'},
  {l:'Maior pico dos últimos 12 meses',v:'1.722.141 (março/2026)',f:'SteamDB / Steam Charts',u:'https://www.steamdb.com/en/tools/steam-charts/730-counter-strike-2'},
  {l:'Divergência entre fontes',v:'Agregadores de terceiros publicam números "ao vivo" que não batem entre si; a série do SteamDB é a única diretamente derivada da API do Steam.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= VALORANT ======================= */
GAMES.push({
id:'valorant', nome:'Valorant', cor:'#ff4655', tipo:'Tático', tags:['Tático','Habilidades','5v5'],
pitch:'Tiro tático com habilidades. O competitivo mais bem administrado do gênero — e o mais vigiado.',
notaGeral:8.6,
scores:{gameplay:8.8,mira:9.2,mapas:8.3,competitivo:9.1,graficos:7.6,performance:9.3,conteudo:8.5,comunidade:5.8,monetizacao:5.5},
visao:{
  completo:'VALORANT', dev:'Riot Games', publisher:'Riot Games',
  ano:'2020 (PC); 2024 em PS5 e Xbox Series',
  plataformas:'PC (Windows), PlayStation 5, Xbox Series X|S',
  engine:'Unreal Engine 4 (com modificações pesadas da Riot para netcode e performance)',
  modelo:'Free-to-play; receita em skins de arma e passe de batalha',
  modos:'Competitivo (ranqueado), Desmatado, Premier (liga interna por times), Spike Rush, Swiftplay, Mata-mata, Escalada, Team Deathmatch',
  perfil:'Tático 5v5 por rounds, com economia e agentes com habilidades ativas e definitivas.',
  publico:'Jogador competitivo de PC, faixa mais jovem que a do CS, e a base feminina mais expressiva entre os FPS táticos.',
  situacao:'Estável e bem sustentado. Temporadas anuais divididas em 6 Atos, cadência regular de agentes, mapas e passes.'
},
resumoNota:'8,6 pela combinação rara de mecânica competitiva sólida, operação de serviço exemplar (patches previsíveis, anticheat que funciona, 128 tick em todos os servidores) e um esporte construído com método. Perde nas skins caríssimas e num ambiente de partida tão tóxico quanto o do CS.',
gameplay:{
  texto:'Valorant é CS com uma camada de utilitário controlada por personagem. A base é a mesma: rounds, economia, plant/defuse de spike, TTK baixíssimo, precisão penalizada por movimento. O que muda é que <strong>o utilitário deixou de ser um item comprável genérico e virou identidade de personagem</strong> — a smoke não é uma granada, é a Omen; o flash não é comprado, é o Skye.<br><br>Isso tem uma consequência de design importante: o round de Valorant é mais roteirizado que o de CS. A execução de um bombsite envolve uma sequência coordenada de habilidades com ordem e timing definidos. Ganha-se mais em coordenação e menos em improviso.<br><br>Movimento é ainda mais restrito que no CS — não há bunny hop relevante, não há counter-strafe com a mesma nuance, e o jogo penaliza agachar-atirando. O tiro é rigoroso: a primeira bala é precisa parado, e o spray tem padrão fixo com dispersão crescente. A mira continua decidindo a maioria dos duelos, mas com um piso: uma habilidade bem usada pode ganhar um duelo que a mira perderia.',
  notas:[['Velocidade das partidas',6.5],['Fluidez',8.5],['Tiro',9.0],['Recuo (qualidade do modelo)',8.5],['Movimento',6.5],['Precisão',9.2],['Peso da mira',9.0],['Peso da estratégia',9.5],['Peso do posicionamento',9.2]],
  ttk:'Muito baixo. Headshot de Vandal mata a qualquer distância; Phantom mata com headshot até ~15m e perde dano além disso. Essa diferença é a decisão de arma mais importante do jogo.',
  curva:'Íngreme e mais larga que a do CS: além de aprender a atirar e a economia, é preciso aprender 29 agentes — o que cada um faz contra você e a favor de você.',
  skillGap:'Alto, mas ligeiramente menor que o do CS em tiro puro, porque habilidades comprimem a diferença entre jogadores. Em compensação, o skill gap tático/coordenação é maior.',
  dificuldade:'Alto. Punitivo, mas com mais ferramentas de resgate do que o CS oferece.'
},
armas:{
  texto:'Arsenal enxuto (~18 armas) e muito bem diferenciado por função e faixa de preço. A decisão central é <strong>Vandal vs. Phantom</strong>: a Vandal mata com um tiro na cabeça a qualquer distância mas tem recuo mais bruto e cadência menor; a Phantom é mais controlável, silenciada e mais forte no spray, mas perde o one-tap na distância. É uma das escolhas de arma mais bem construídas de qualquer FPS — não existe resposta certa, existe estilo.<br><br>A Operator (AWP do Valorant) é cara e determinante, e a Riot já a ajustou várias vezes exatamente porque uma sniper de one-shot em um jogo com habilidades exige calibração constante.<br><br>Não há personalização mecânica: skins são exclusivamente cosméticas — mudam modelo, som, animação e efeito de abate, sem tocar em um único valor de dano ou recuo.',
  meta:'Vandal e Phantom dividem a esmagadora maioria dos rounds de compra completa; Operator define rounds de controle; Sheriff, Spectre e Judge dominam force-buys e eco. Ajustes vêm por patch a cada ~2 semanas.',
  dominante:true,
  dominanteTxt:'Sim, mas branda. Vandal/Phantom concentram o uso — só que a escolha entre elas é genuína e muda por mapa e por estilo. A meta real do Valorant não é de armas, é <strong>de composição de agentes</strong>: é ali que a variedade se estreita, com composições padrão por mapa se consolidando rápido depois de cada patch.',
  notas:[['Variedade',5.5],['Balanceamento',9.0],['Diferenciação entre armas',9.0],['Personalização',2.0],['Qualidade do recuo',8.5],['Distância efetiva bem definida',9.5],['Viabilidade das categorias',6.5]]
},
mapas:{
  texto:'Os mapas são construídos em torno do utilitário: corredores estreitos que só se atravessam com smoke, ângulos que só se limpam com flash, e mecânicas próprias por mapa (cordas, teleportes, portas). Isso os torna menos "puros" que os do CS e mais dependentes de composição.<br><br>O pool competitivo rotaciona — normalmente 7 mapas ativos com alguns fora de rotação. Verticalidade é moderada e mais presente que no CS. O balanceamento entre lados é acompanhado de perto pela Riot, que já reformou mapas inteiros (Bind, Haven, Split, Breeze, Icebox) quando as estatísticas de lado ficaram fora da faixa.<br><br>O peso do conhecimento de mapa é alto e tem uma camada a mais que no CS: não basta saber os ângulos, é preciso saber as <strong>linhas de habilidade</strong> — posições exatas de onde cada agente lança utilitário para cada ponto.',
  destaques:[
    {nome:'Ascent',txt:'O mapa mais equilibrado e mais estudado do pool. Mid aberto e decisivo, portas mecânicas que criam decisão tática real. É o "Mirage" do Valorant.'},
    {nome:'Haven',txt:'Três bombsites — único no gênero em nível competitivo. Força rotações e defesas espalhadas; premia coordenação sobre reflexo.'},
    {nome:'Lotus / Sunset / Abyss',txt:'Mapas mais recentes. Lotus também tem três sites e portas rotativas; Abyss dispensa paredes externas e mata por queda, o que muda completamente o duelo.'},
    {nome:'Icebox / Breeze',txt:'Os mais divisivos. Icebox é vertical e caótico; Breeze é aberto e favorável a sniper. Ambos já passaram por reformas por desequilíbrio de lados.'}
  ],
  notas:[['Quantidade',7.5],['Qualidade',8.5],['Variedade',8.5],['Design',8.5],['Verticalidade',7.0],['Qualidade das rotas',8.0],['Balanceamento de lados',8.5],['Rejogabilidade',8.5],['Peso do conhecimento de mapa',9.5]]
},
competitivo:{
  classificacao:'Altamente competitivo',
  texto:'É o competitivo mais bem operado do gênero, e não é perto. Ranqueado com faixas claras até Radiante, <strong>Premier</strong> como liga interna de times com divisões e playoffs (uma ponte real entre a ranqueada e o cenário amador), e um sistema de matchmaking que a Riot ajusta e comunica com regularidade.<br><br>O <strong>Vanguard</strong> é o diferencial mais importante do produto: anticheat em nível de kernel que roda desde o boot da máquina. É invasivo, e essa crítica é legítima — mas é também o motivo pelo qual Valorant tem, de longe, o menor problema de cheaters entre os FPS de grande porte. Em um gênero onde CS2 e Warzone convivem com cheating endêmico, isso é uma vantagem competitiva concreta.<br><br>Os esports (VCT) são construídos com times parceiros, ligas regionais e um calendário estável. Menos orgânico que o do CS — a Riot controla o circuito — mas mais previsível para times e jogadores.<br><br>Os problemas remanescentes: smurfing (conta grátis torna barato), e toxicidade em chat de voz, que a Riot combate com moderação de voz gravada e que segue sendo o ponto mais reclamado da experiência.',
  notas:[['Ranking',9.0],['Matchmaking',8.5],['Sistema competitivo',9.5],['Esports',9.0],['Cenário profissional',9.0],['Skill gap',9.0],['Qualidade das ranqueadas',8.0],['Integridade competitiva',9.5],['Controle de smurfs',5.5],['Controle de cheaters',9.5],['Ambiente / toxicidade',5.0]],
  justificativa:'Altamente competitivo. Profundidade tática comparável à do CS, com um sistema de suporte competitivo — ranked, Premier, anticheat, calendário de patches — objetivamente superior ao de qualquer concorrente.'
},
experiencia:{
  iniciante:'Mais acolhedor que o CS, mas ainda difícil. Modos rápidos (Swiftplay, Spike Rush) reduzem o atrito, o jogo explica o próprio sistema melhor, e agentes simples (Sova, Brimstone, Reyna) dão utilidade imediata. O obstáculo é decorar o que 29 agentes fazem.',
  intermediario:'Espaço enorme para evoluir, e mais claro do que no CS: dominar as linhas de utilitário de um agente em um mapa é um objetivo concreto, treinável e com retorno imediato no ranked.',
  avancado:'Recompensa domínio técnico, mas premia mais o domínio de sistema do que a mecânica pura. Um jogador de mira excepcional sem entendimento de composição bate num teto que o CS não impõe.',
  competitivo:'Profundidade de sobra, e a melhor infraestrutura para levar a sério: Premier dá caminho da ranqueada até o cenário amador sem precisar de plataforma de terceiros.'
},
tecnico:{
  texto:'Tecnicamente é o FPS competitivo mais bem executado do mercado. A Riot definiu desde o início metas explícitas: rodar em hardware fraco, servidores a <strong>128 tick</strong> para todos os jogadores (não só para pagantes ou torneios) e latência abaixo de 35 ms para a maioria da base, com investimento em infraestrutura de rede própria.<br><br>Isso significa que Valorant roda bem em máquinas que não rodam mais nada, tem hitreg consistente e raramente é acusado de netcode ruim — uma diferença marcante em relação a CS2, Apex e Battlefield 6. O custo é o Vanguard rodando em kernel permanentemente, com todos os riscos de privacidade e de conflito com outros softwares que isso implica.',
  itens:[['FPS','Altíssimo mesmo em hardware antigo — requisitos entre os mais baixos do gênero'],['Otimização','Excelente; é referência da categoria'],['Input lag','Baixo e consistente'],['Netcode','Consistente; poucas queixas estruturais de hitreg'],['Tick rate','128 tick em servidores oficiais, para todos os jogadores'],['Latência','Meta pública da Riot de <35 ms para a maioria da base, com infraestrutura própria'],['Estabilidade','Boa; problemas concentrados em conflitos do Vanguard com drivers e software de terceiros'],['Escalabilidade','Excelente — do notebook de escritório ao PC de topo']],
  semDados:'A Riot não publica taxa de detecção do Vanguard nem números atuais de banimento por região; comparações quantitativas com o VAC não têm base pública verificável.',
  notas:[['FPS',9.8],['Otimização',9.8],['Input lag',9.0],['Netcode',9.0],['Estabilidade',8.5],['Escalabilidade gráfica',9.8]]
},
av:{
  texto:'Estilo estilizado e semi-cartunesco, escolhido para performance e para clareza. Não impressiona tecnicamente e não tenta: texturas simples, iluminação modesta, poucos efeitos. Em compensação, <strong>o inimigo é sempre legível</strong> — silhuetas distintas, cores de contorno consistentes e cenários que nunca competem visualmente com um corpo em movimento.<br><br>O áudio é competitivamente central e bem mixado, com passos direcionais precisos e sons de habilidade distintos o suficiente para você identificar qual ultimate foi usada sem ver. O ponto de atrito é a poluição sonora em rounds com muito utilitário simultâneo.',
  impacto:'Favorecem a competitividade de forma deliberada. A Riot já recusou skins de personagem que reduzissem legibilidade — a estética foi subordinada à clareza, ao contrário do que ocorre em Warzone e Apex.',
  notas:[['Qualidade visual',6.5],['Animações',7.5],['Iluminação',6.5],['Texturas',6.0],['Design visual',8.5],['Clareza do inimigo',9.5],['Som dos disparos',8.5],['Passos (footsteps)',9.0],['Direcionalidade',9.0],['Mixagem',8.0]]
},
progressao:{
  texto:'Progressão de conta é cosmética: contratos de agente (que liberam agentes gratuitamente com tempo de jogo), passe de batalha por Ato e recompensas de nível. Nenhum item afeta jogabilidade.<br><br>O problema é o preço. Valorant tem, de forma consistente, <strong>as skins mais caras do gênero</strong>: coleções premium com faca custam o equivalente a vários jogos completos, e a Riot usa rotação de loja diária que limita o que você pode comprar em cada dia. Não há revenda e não há mercado — o que você compra fica com você e não vale nada fora do jogo.<br><br>A cadência de conteúdo é o oposto da do CS: cada Ato traz passe novo, e o ano traz agentes, mapas e modos com regularidade previsível.',
  classe:'Aceitável',
  classeTxt:'Aceitável. Zero pay-to-win, agentes obteníveis sem pagar, e conteúdo gratuito de verdade — mas o preço das skins é agressivo até para os padrões do mercado, e a rotação diária de loja é uma mecânica desenhada para pressão de escassez. É justo no que importa (equilíbrio) e caro no que não importa (aparência).',
  p2w:'Nenhum. Skins alteram só modelo, som e efeitos visuais.',
  notas:[['Progressão',6.5],['Battle Pass',8.0],['Skins (qualidade)',9.5],['Recompensas gratuitas',7.0],['Conteúdo sazonal',9.0],['Frequência de atualização',9.5],['Monetização (justiça)',5.5],['Ausência de pay-to-win',10.0]]
},
problemas:[
  {tipo:'fato',t:'Vanguard opera em nível de kernel',p:'Verificável e admitido pela Riot: o anticheat roda com privilégios de kernel desde o boot. É o que torna o jogo limpo, e é também um risco de superfície de ataque e um problema legítimo de privacidade. Fato com trade-off, não defeito puro.'},
  {tipo:'fato',t:'Custo das skins premium',p:'Preços de coleções e faca são públicos e estão entre os mais altos do mercado de FPS. Não é percepção — é tabela de preço.'},
  {tipo:'reclamacao',t:'Toxicidade em chat de voz',p:'Reclamação constante e antiga, com foco em ambiente hostil para jogadoras. A Riot implementou avaliação de voz gravada; a percepção da comunidade é de melhora parcial.'},
  {tipo:'reclamacao',t:'Smurfing na ranqueada',p:'Conta gratuita barateia smurf. Muito citado; sem dados públicos para dimensionar.'},
  {tipo:'reclamacao',t:'Composições engessadas por mapa',p:'A comunidade competitiva reclama que cada patch converge rápido para uma composição padrão por mapa, reduzindo variedade. Real, mas típico de qualquer jogo com meta madura.'},
  {tipo:'opiniao',t:'"Habilidades tiram o mérito da mira"',p:'Crítica comum de jogadores vindos do CS. É preferência de design: Valorant assume que utilitário deve ser pessoal e não comprável. Não há certo e errado aqui.'}
],
fortes:[
  'Integridade competitiva real: o Vanguard entrega o ambiente mais limpo entre os FPS de grande porte.',
  '128 tick para todo mundo, com foco declarado em latência baixa — netcode que não vira desculpa.',
  'Otimização excepcional: roda em hardware que nenhum concorrente moderno aceita.',
  'Premier: caminho estruturado da ranqueada até o competitivo amador, dentro do próprio jogo.',
  'Cadência de conteúdo previsível — agentes, mapas, modos e patches em calendário confiável.'
],
fracos:[
  'Skins entre as mais caras do mercado, com rotação de loja desenhada para pressão de compra.',
  'Anticheat em kernel é um custo real de privacidade e segurança que o jogador não pode recusar.',
  'Ambiente de partida tão hostil quanto o do CS, apesar de anos de investimento em moderação.',
  'Carga cognitiva alta para iniciantes: 29 agentes para aprender antes de jogar bem.',
  'Meta de composição converge rápido e engessa a variedade tática entre patches.'
],
concorrentes:['cs2','r6','ow','finals'],
vale:{
  veredito:'Sim',
  texto:'É a escolha mais segura do gênero tático em 2026: gratuito, roda em qualquer coisa, tem o competitivo mais bem administrado e o menor problema de cheaters. Se você quer tiro tático sem o atrito operacional do CS2, é aqui.',
  perfis:[
    ['Casual','Sim, com ressalvas. Swiftplay e Team Deathmatch dão sessões curtas, mas o jogo continua sendo tenso por natureza.'],
    ['Competitivo','Sim. Melhor infraestrutura competitiva do gênero — ranked, Premier e anticheat que funciona.'],
    ['Solo','Sim. O ranked solo é o mais bem sustentado do mercado; a ressalva é o chat de voz.'],
    ['Com amigos','Excelente, e é onde o jogo brilha mais: composição de cinco agentes coordenados é o auge do design.'],
    ['Foco em ranking','Sim. Sistema claro, com Premier como camada extra de progressão por time.'],
    ['Foco em esports','Sim. VCT tem calendário estável, produção forte e ligas regionais bem definidas.']
  ]
},
veredito:{
  melhor:'A operação: anticheat, servidores, patches e ranked funcionando como serviço sério.',
  problema:'Preço das skins e a exigência de um anticheat em kernel permanente.',
  diferencial:'Utilitário como identidade de personagem, sustentado por 128 tick e Vanguard.',
  risco:'Inchaço de agentes: cada novo agente aumenta a carga de aprendizado e a chance de meta engessada.',
  perfil:'Quem quer tiro tático de alto nível com infraestrutura confiável e sem conviver com cheaters.',
  vale2026:'Sim',
  conclusao:'Valorant fez o que a Valve não fez: tratou o competitivo como um produto que exige manutenção. Não tem o teto mecânico do CS2 nem a mesma pureza de duelo, mas entrega tudo o que está em volta com uma competência que o resto do gênero não alcança. Se o CS2 é o melhor jogo mal administrado, o Valorant é o jogo muito bom excepcionalmente bem administrado — e para a maioria das pessoas isso resulta numa experiência melhor.'
},
dados:[
  {l:'Temporada atual',v:'Temporada 2026, Ato 4 — iniciado em 24/06/2026. O jogo abandonou "Episódios": agora são temporadas anuais com 6 Atos.',f:'Dot Esports / Valocheck',u:'https://dotesports.com/valorant/news/all-valorant-season-start-and-end-dates'},
  {l:'Agentes disponíveis',v:'29 (o mais recente é Miks, Controlador, lançado no patch 12.05 em 17/03/2026)',f:'Turbosmurfs',u:'https://turbosmurfs.gg/article/valorant-agent-release-order-a-complete-timeline'},
  {l:'População',v:'Sem contador público oficial. O último marco divulgado pela Riot fala em mais de 35 milhões de jogadores por mês; a Tracker Network registrou 18,97 milhões de jogadores únicos rastreados em maio/2026.',f:'Riot / Tracker Network',u:'https://tracker.gg/valorant'},
  {l:'Divergência entre fontes',v:'Os dois números acima medem coisas diferentes (base declarada pela publisher vs. contas rastreadas por terceiro) e não devem ser comparados diretamente.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= RAINBOW SIX SIEGE X ======================= */
GAMES.push({
id:'r6', nome:'Rainbow Six Siege X', cor:'#5b8def', tipo:'Tático', tags:['Tático','Destruição','5v5'],
pitch:'Nenhum outro FPS transforma parede em decisão tática. Ainda insubstituível, e ainda mal cuidado.',
notaGeral:8.0,
scores:{gameplay:8.7,mira:8.2,mapas:8.6,competitivo:7.9,graficos:7.8,performance:8.0,conteudo:7.5,comunidade:4.8,monetizacao:6.0},
visao:{
  completo:'Tom Clancy\'s Rainbow Six Siege X', dev:'Ubisoft Montreal', publisher:'Ubisoft',
  ano:'2015 (Siege); relançado como Siege X em junho de 2025',
  plataformas:'PC, PlayStation 5, Xbox Series X|S (versões da geração anterior descontinuadas)',
  engine:'AnvilNext 2.0',
  modelo:'Free-to-play desde o Siege X, com camada gratuita limitada e edições pagas que liberam operadores',
  modos:'Ranqueado, Padrão, Dual Front (modo criado no Siege X), Treino, Eventos sazonais',
  perfil:'Tático 5v5 de ataque e defesa, com destruição de ambiente procedural e preparação de round.',
  publico:'Jogador tático que quer decisão espacial e leitura de som acima de reflexo puro.',
  situacao:'Ano 11 em curso. Relançamento como Siege X trouxe crescimento de base, seguido de um surto de cheating que prejudicou retenção.'
},
resumoNota:'8,0 porque a proposta central — destruição procedural aplicada a um jogo tático de rounds — continua sem concorrente após 11 anos, e o design de mapa é dos melhores do gênero. Perde no ambiente: cheating, toxicidade e um catálogo de operadores que virou barreira de entrada.',
gameplay:{
  texto:'Siege é o FPS mais lento e mais deliberado da lista. Cada round tem fase de preparação (drones do ataque, reforços da defesa), e a partida real acontece na negociação de espaço: <strong>paredes e pisos são destrutíveis de forma procedural</strong>, então cada round redesenha o mapa. Um buraco de 30 cm feito no lugar certo muda quem controla um cômodo.<br><br>O TTK é o mais baixo de todos os FPS relevantes — mais baixo que o do CS2. Muitas armas matam com um único tiro na cabeça e duas ou três no corpo. Combinado com a ausência de respawn no round, isso torna o jogo extremamente punitivo: um erro de posicionamento acaba a sua participação por dois minutos.<br><br>O recuo é mais vertical e mais aleatório que o do CS, e essa é a maior crítica mecânica ao jogo — o controle de spray é menos treinável e mais dependente de attachment. O movimento é lento, com inclinação lateral (lean) e mira apoiada em superfícies como camadas táticas próprias.',
  notas:[['Velocidade das partidas',5.5],['Fluidez',7.5],['Tiro',8.0],['Recuo (qualidade do modelo)',7.0],['Movimento',7.0],['Precisão',8.2],['Peso da mira',8.0],['Peso da estratégia',9.8],['Peso do posicionamento',9.8]],
  ttk:'O mais baixo do gênero. Headshot mata com praticamente qualquer arma; muitos duelos resolvem em uma bala.',
  curva:'A mais longa de todos os FPS táticos. Não é a mira: são ~80 operadores, dezenas de mapas com três andares cada, e centenas de posições de destruição que só se aprende jogando ou assistindo.',
  skillGap:'Enorme, e majoritariamente em conhecimento e não em mecânica. Um veterano ganha de um novato sem sequer atirar melhor.',
  dificuldade:'Muito alto. É provavelmente o FPS mais difícil de entrar da lista.'
},
armas:{
  texto:'O arsenal é grande e amarrado ao operador: <strong>você não escolhe a arma, você escolhe quem a carrega</strong>. Isso significa que o balanceamento de armas é, na prática, balanceamento de personagens — nerfar um rifle nerfa o operador inteiro.<br><br>Há personalização real: miras, canos, empunhaduras e supressores alteram recuo, dispersão e som de forma mensurável, e escolher o kit errado é um erro competitivo concreto. É a personalização mais significativa entre os FPS táticos da lista.<br><br>A meta é definida por operador, não por arma. Cada temporada de Ano gera uma lista de operadores obrigatórios em ranqueada alta, e a Ubisoft ajusta com nerfs frequentes.',
  meta:'Definida por operadores dominantes da temporada (padrão histórico: um punhado obrigatório no ataque e outro na defesa). Armas de destaque circulam junto com esses operadores.',
  dominante:true,
  dominanteTxt:'Sim, e é o problema estrutural mais antigo do jogo: com ~80 operadores, uma parcela grande é competitivamente inviável, e a meta de alto nível gira em torno de um subconjunto pequeno. Comprar operadores fora da meta é gastar por conteúdo que você não vai usar em ranqueada.',
  notas:[['Variedade',9.0],['Balanceamento',6.5],['Diferenciação entre armas',8.0],['Personalização',8.5],['Qualidade do recuo',7.0],['Distância efetiva bem definida',7.5],['Viabilidade das categorias',6.0]]
},
mapas:{
  texto:'Os mapas são o melhor trabalho de level design do gênero tático, e por uma razão específica: são <strong>projetados para serem destruídos</strong>. Cada um tem três ou mais andares, múltiplas entradas, hatches entre pisos e paredes que se classificam entre destrutíveis, reforçáveis e indestrutíveis. A verticalidade não é decorativa — atacar por cima é uma estratégia inteira.<br><br>O pool ranqueado é menor que o catálogo total, e a Ubisoft rework mapas antigos em vez de só adicionar novos, o que mantém a qualidade média alta. Balanceamento ataque/defesa é acompanhado por temporada e historicamente favorece a defesa em alguns mapas.<br><br>Rejogabilidade é altíssima justamente porque a destruição faz o mesmo mapa jogar diferente a cada round.',
  destaques:[
    {nome:'Bank',txt:'O mapa mais equilibrado e mais duradouro do jogo. Três andares plenamente utilizáveis, rotas verticais claras e sites que exigem abordagens distintas.'},
    {nome:'Clubhouse',txt:'Referência competitiva. Site do porão é uma das defesas mais bem construídas do gênero; exige destruição coordenada para ser tomado.'},
    {nome:'Consulate / Oregon',txt:'Reworks bem-sucedidos: mapas antigos reequilibrados sem perder identidade. Oregon é o melhor exemplo de jogo vertical entre andares.'},
    {nome:'Kafe Dostoyevsky',txt:'O mais difícil de atacar do pool competitivo. Ângulos longos e sites espalhados; premia disciplina de utilitário acima de tudo.'}
  ],
  notas:[['Quantidade',8.5],['Qualidade',9.0],['Variedade',8.5],['Design',9.5],['Verticalidade',9.8],['Qualidade das rotas',9.0],['Balanceamento de lados',7.5],['Rejogabilidade',9.5],['Peso do conhecimento de mapa',9.8]]
},
competitivo:{
  classificacao:'Altamente competitivo',
  texto:'Siege tem um dos formatos competitivos mais interessantes do gênero — banimento de operadores antes do round, fase de preparação, e um jogo que recompensa chamada de informação — e um dos ambientes mais problemáticos.<br><br>O ranqueado passou por várias revisões ao longo dos anos e hoje é razoável, mas convive com dois problemas graves. O primeiro é <strong>cheating</strong>: o Siege X trouxe camada gratuita, dobrou a aquisição de jogadores no comparativo ano a ano — e foi seguido de um surto de cheaters que prejudicou a retenção. O segundo é <strong>toxicidade</strong>, historicamente entre as piores do gênero, com fogo amigo em ranqueada como ferramenta de assédio (mitigado por sistema de reversão de dano, mas não eliminado).<br><br>O esporte é sólido e estável: Six Invitational como Major anual e ligas regionais consolidadas. Menor que CS e Valorant em audiência, mas com identidade própria e longevidade comprovada.',
  notas:[['Ranking',7.5],['Matchmaking',7.0],['Sistema competitivo',8.5],['Esports',8.0],['Cenário profissional',8.0],['Skill gap',9.5],['Qualidade das ranqueadas',6.5],['Integridade competitiva',5.5],['Controle de smurfs',5.0],['Controle de cheaters',5.0],['Ambiente / toxicidade',3.5]],
  justificativa:'Altamente competitivo pelo formato e pela profundidade — banimento de operadores, preparação de round e destruição criam uma camada estratégica que nenhum concorrente tem. A nota do bloco é puxada para baixo pelo ambiente, não pelo design.'
},
experiencia:{
  iniciante:'Muito difícil, e o pior onboarding da lista. Você morre sem entender de onde veio o tiro porque o tiro veio de uma parede que não existia dez segundos antes. Aprender exige investimento externo (vídeos, guias) que o jogo não fornece.',
  intermediario:'Espaço claríssimo. Cada mapa aprendido, cada posição de destruição memorizada, é ganho direto. Aqui o jogo é gratificante como poucos.',
  avancado:'Recompensa domínio técnico de forma incomum: o conhecimento vale mais que o reflexo, o que estende a vida competitiva do jogador muito além da idade típica de FPS.',
  competitivo:'Profundidade de sobra. O limitador é o ambiente e a estabilidade do balanceamento entre temporadas, não a falta de teto.'
},
tecnico:{
  texto:'Roda bem e escala bem — a AnvilNext entrega destruição procedural com custo de performance surpreendentemente baixo, e o Siege X modernizou iluminação e áudio sem elevar demais os requisitos. Estabilidade é boa.<br><br>O ponto historicamente fraco é o netcode em situações de destruição e peek: hitreg inconsistente e "morrer atrás da parede" são queixas antigas e recorrentes. O jogo usa servidores dedicados; a Ubisoft não publica tick rate de forma clara e comparável, e números citados por terceiros divergem.',
  itens:[['FPS','Bom em hardware médio; escala bem'],['Otimização','Boa — destruição procedural com custo controlado'],['Input lag','Aceitável'],['Netcode','Ponto fraco histórico: queixas recorrentes de hitreg e peeker\'s advantage'],['Tick rate','Sem dado oficial claro e atual da Ubisoft; valores citados por terceiros divergem'],['Estabilidade','Boa'],['Escalabilidade','Boa — de PCs medianos a consoles atuais']],
  semDados:'Não há publicação oficial atual e verificável de tick rate por região nem de métricas de detecção do anticheat. Evite números específicos nessas áreas.',
  notas:[['FPS',8.5],['Otimização',8.5],['Input lag',7.5],['Netcode',6.5],['Estabilidade',8.0],['Escalabilidade gráfica',8.5]]
},
av:{
  texto:'Visual realista e funcional, modernizado no Siege X com iluminação e materiais retrabalhados. Não compete com Battlefield 6 em espetáculo, mas serve à função: fumaça de destruição, poeira e detritos comunicam o que acabou de acontecer no ambiente.<br><br>A clareza do inimigo é o ponto mais frágil: uniformes escuros em interiores escuros, com destruição gerando ruído visual, tornam a leitura mais difícil que em CS2 ou Valorant. Skins de operador exageradas já foram criticadas por piorar isso.<br><br>O áudio, por outro lado, é o melhor da lista em importância mecânica: <strong>a propagação de som atravessa paredes e andares de forma modelada</strong>, e ouvir um reforço sendo colocado no andar de baixo é informação tática real. Ainda assim, a comunidade reclama de bugs de áudio direcional há anos.',
  impacto:'Neutros a levemente prejudiciais. A destruição é o que torna o jogo único e simultaneamente o que mais atrapalha a legibilidade visual — trade-off consciente, mas real.',
  notas:[['Qualidade visual',8.0],['Animações',8.0],['Iluminação',8.0],['Texturas',8.0],['Design visual',8.0],['Clareza do inimigo',6.5],['Som dos disparos',8.5],['Passos (footsteps)',9.0],['Direcionalidade',8.0],['Mixagem',7.5]]
},
progressao:{
  texto:'Progressão é de operadores: no modelo free-to-play do Siege X há um conjunto gratuito e o restante se libera com moeda do jogo (lento) ou compra (rápido). Como a meta competitiva depende de operadores específicos, isso cria uma zona cinzenta: <strong>não é pay-to-win, mas é pay-to-access</strong> — quem paga chega mais rápido às ferramentas competitivamente relevantes.<br><br>Há passe de batalha por temporada, skins, e um catálogo de cosméticos grande. Nenhum cosmético altera valores de jogo. As atualizações vêm em temporadas do Ano, com operador ou rework de mapa e ajustes de balanceamento.',
  classe:'Aceitável',
  classeTxt:'Aceitável, com uma ressalva importante: cosméticos são justos, mas o acesso a operadores é a moeda de pressão. Um jogador gratuito leva muito tempo até ter as opções de meta, e num jogo em que operador é sinônimo de função tática isso encosta na fronteira do pay-for-advantage sem cruzá-la.',
  p2w:'Não no sentido estrito — nenhum item pago tem estatística superior. Mas o desbloqueio acelerado de operadores dá acesso mais rápido às opções de meta.',
  notas:[['Progressão',7.0],['Battle Pass',7.5],['Skins (qualidade)',7.5],['Recompensas gratuitas',6.0],['Conteúdo sazonal',8.0],['Frequência de atualização',8.0],['Monetização (justiça)',6.0],['Ausência de pay-to-win',8.0]]
},
problemas:[
  {tipo:'fato',t:'Surto de cheating após a abertura gratuita',p:'O Siege X (junho/2025) trouxe camada de acesso gratuito e dobrou a aquisição de jogadores ano a ano; reportagens e dados de acompanhamento indicam que um surto de cheating no período seguinte prejudicou a retenção no fim de 2025. É o custo clássico de contas gratuitas sem anticheat forte.'},
  {tipo:'fato',t:'Inchaço de operadores',p:'Com ~80 operadores, a carga de aprendizado e o espaço de balanceamento tornaram-se objetivamente difíceis de administrar. Isso é reconhecido pela própria Ubisoft, que passou a fazer reworks em vez de só adicionar.'},
  {tipo:'reclamacao',t:'Toxicidade e fogo amigo',p:'Queixa antiga e persistente. A Ubisoft implementou reversão de dano de fogo amigo e sistemas de reputação; a percepção da comunidade é de melhora parcial.'},
  {tipo:'reclamacao',t:'Hitreg e netcode',p:'"Morri atrás da parede" é a reclamação mais duradoura do jogo. Real o suficiente para ser tratada como padrão, mas sem dados oficiais que a quantifiquem.'},
  {tipo:'reclamacao',t:'Balanceamento oscilante entre temporadas',p:'Nerfs e buffs grandes por temporada geram sensação de instabilidade de meta. Divide a comunidade: parte considera renovação saudável.'},
  {tipo:'opiniao',t:'"O Siege X descaracterizou o jogo"',p:'Parte da base veterana rejeita o rumo mais acessível e cosmeticamente chamativo. É preferência estética e cultural, não uma falha mensurável.'}
],
fortes:[
  'Destruição procedural como mecânica tática central — 11 anos depois, ainda sem concorrente real.',
  'Level design vertical e multiandar de qualidade rara, com reworks que mantêm o pool saudável.',
  'Propagação de som modelada através de paredes e andares: o áudio mais informativo da lista.',
  'Fase de preparação e banimento de operadores criam camada estratégica pré-round única.',
  'Skill gap baseado em conhecimento, não em reflexo — estende a vida competitiva do jogador.'
],
fracos:[
  'Cheating relevante, agravado pela abertura gratuita, sem anticheat à altura.',
  'Toxicidade entre as piores do gênero, incluindo assédio por fogo amigo.',
  '~80 operadores: barreira de entrada brutal e balanceamento praticamente impossível.',
  'Netcode e hitreg com queixas estruturais que atravessam anos sem solução definitiva.',
  'Clareza visual do inimigo prejudicada por interiores escuros e ruído de destruição.'
],
concorrentes:['cs2','valorant','tarkov','bo7'],
vale:{
  veredito:'Sim, com ressalvas',
  texto:'Vale por aquilo que só ele faz. Se a ideia de abrir um buraco no teto para atirar em quem está embaixo te interessa, não existe substituto. A ressalva é séria: prepare-se para uma curva de aprendizado longa e para um ambiente de partida ruim.',
  perfis:[
    ['Casual','Com ressalvas. A camada gratuita permite experimentar, mas o jogo pune o casual com força e a curva desanima.'],
    ['Competitivo','Sim. Profundidade tática de primeira linha; o problema é a integridade da partida, não o jogo.'],
    ['Solo','Com ressalvas. Siege depende de coordenação mais do que qualquer outro da lista; solo em fila aberta é a pior forma de jogá-lo.'],
    ['Com amigos','Excelente — é o melhor uso do jogo. Um time fixo de cinco transforma completamente a experiência.'],
    ['Foco em ranking','Sim, com ressalvas. O sistema funciona, mas cheaters e smurfs corroem a confiança no resultado.'],
    ['Foco em esports','Sim. Six Invitational é um dos melhores eventos do gênero e a cena regional é sólida.']
  ]
},
veredito:{
  melhor:'Destruição procedural aplicada a um jogo tático — proposta única e bem executada.',
  problema:'O ambiente: cheating pós-abertura gratuita somado à toxicidade histórica.',
  diferencial:'Cada round redesenha o mapa. Nenhum concorrente oferece isso.',
  risco:'O inchaço de operadores tornar o jogo impossível de balancear e de entrar.',
  perfil:'Jogador tático paciente, com grupo fixo, que valoriza conhecimento acima de reflexo.',
  vale2026:'Sim, com ressalvas',
  conclusao:'Siege é o FPS tático mais original já feito e continua sendo, uma década depois. O problema nunca foi o jogo — foi a manutenção: anticheat insuficiente, moderação fraca e um catálogo de operadores que cresceu além do que a Ubisoft consegue equilibrar. Se você tem um grupo de cinco e paciência, é uma das experiências mais recompensadoras do gênero. Se você quer entrar sozinho hoje, comece por outro jogo.'
},
dados:[
  {l:'Jogadores simultâneos no Steam — agosto/2026',v:'~59.832 em média (alta de 16,6% vs. julho/2026)',f:'activeplayer.io / Steam Charts',u:'https://activeplayer.io/tom-clancys-rainbow-six-siege/'},
  {l:'Pico de 2026',v:'139.019 em março/2026, impulsionado pelo Six Invitational e pela temporada do Ano 11',f:'Steam Charts',u:'https://steamplayercount.com/app/359550'},
  {l:'Base total',v:'A Ubisoft reportou mais de 10 milhões de jogadores únicos ativos em março/2026; estimativas de terceiros falam em ~30 milhões de ativos mensais em todas as plataformas.',f:'Ubisoft / agregadores',u:'https://www.quantumrun.com/consulting/tom-clancys-rainbow-six-siege/'},
  {l:'Divergência entre fontes',v:'Estimativas de simultâneos somando todas as plataformas variam entre ~108 mil e ~120 mil; são projeções de terceiros, não dados oficiais.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= BATTLEFIELD 6 ======================= */
GAMES.push({
id:'bf6', nome:'Battlefield 6', cor:'#7ec95a', tipo:'Militar', tags:['Larga escala','Destruição','Veículos'],
pitch:'O melhor tiro que a série já teve, entregue num pacote que perdeu 90% do público em dez meses.',
notaGeral:7.3,
scores:{gameplay:8.2,mira:7.8,mapas:6.4,competitivo:5.5,graficos:8.8,performance:7.4,conteudo:6.0,comunidade:6.0,monetizacao:6.5},
visao:{
  completo:'Battlefield 6', dev:'Battlefield Studios (DICE, Criterion, Motive, Ripple Effect)', publisher:'Electronic Arts',
  ano:'Outubro de 2025',
  plataformas:'PC, PlayStation 5, Xbox Series X|S',
  engine:'Frostbite',
  modelo:'Pago (compra do jogo), com temporadas e passe de batalha; modo battle royale gratuito à parte',
  modos:'Conquista, Breakthrough, Rush, Domínio, Esquadrão, modos de temporada e battle royale free-to-play',
  perfil:'Combate militar de larga escala com veículos, classes e destruição de ambiente.',
  publico:'Jogador que quer escala, caos coordenado e sandbox militar — não duelo 1v1.',
  situacao:'Preocupante. Lançamento recorde seguido de queda severa de população; temporadas atrasadas e recepção morna às correções.'
},
resumoNota:'7,3 porque o núcleo é genuinamente bom — o gunplay é o melhor da história da série, a destruição voltou a importar e a apresentação é de primeira linha. A nota não sobe porque o produto ao redor falhou: mapas criticados desde o lançamento, temporadas atrasadas, e uma sangria de jogadores que nenhuma atualização estancou.',
gameplay:{
  texto:'O gunplay de BF6 é a maior conquista técnica do jogo. O recuo é pesado, tátil e legível, as armas têm personalidade e o sistema de <strong>movimento com kinesthetic combat</strong> (deslizes, arrasto de corpo, mira apoiada) dá fluidez sem virar arena shooter. Comparado a Battlefield 2042, é outro jogo.<br><br>O TTK é curto para os padrões da série: trocas resolvem rápido, o que favorece quem vê primeiro e pune quem atravessa espaço aberto. Isso interage mal com um dos problemas centrais do jogo — mapas que a comunidade considera pequenos demais, funilando o combate para os mesmos pontos de estrangulamento repetidamente.<br><br>A destruição voltou a ser mecânica e não cenário: paredes caem, prédios desabam e a cobertura que você usou no início do round pode não existir no fim. É o que separa Battlefield de Call of Duty.',
  notas:[['Velocidade das partidas',7.5],['Fluidez',8.5],['Tiro',9.0],['Recuo (qualidade do modelo)',8.5],['Movimento',8.5],['Precisão',8.0],['Peso da mira',7.5],['Peso da estratégia',7.0],['Peso do posicionamento',8.0]],
  ttk:'Curto para a série — mais rápido que Battlefield 1 ou V. Favorece a primeira visualização e pune travessia exposta.',
  curva:'Suave. É fácil ser útil em dez minutos (dar munição, revivir, capturar bandeira) mesmo jogando mal.',
  skillGap:'Moderado. Existe teto real em pilotagem de veículo, mira e leitura de mapa, mas o formato de larga escala dilui a diferença individual.',
  dificuldade:'Médio-baixo para participar; médio-alto para carregar uma partida sozinho.'
},
armas:{
  texto:'Variedade grande, com classes (Assalto, Engenheiro, Suporte, Reconhecimento) reintroduzidas com armas e funções mais delimitadas do que em 2042. A personalização é profunda: ópticas, canos, coronhas, munições e acessórios alteram recuo, alcance e manuseio de forma sensível — o sistema de customização é um dos melhores da categoria militar.<br><br>O balanceamento foi um alvo declarado da Temporada 2, que priorizou revisões sistêmicas de armas, progressão, áudio e movimento em vez de conteúdo novo. A recepção foi dividida: parte da base reconheceu a melhora, parte considerou tarde demais.<br><br>Existe meta dominante, como em todo jogo com attachments: rifles de assalto versáteis e algumas SMGs concentram o uso em mapas fechados, e a viabilidade de armas de longo alcance depende muito de mapa.',
  meta:'Rifles de assalto de recuo controlável e SMGs de manuseio rápido dominam pela geometria fechada dos mapas; snipers e LMGs são fortemente dependentes de mapa.',
  dominante:true,
  dominanteTxt:'Sim. O tamanho dos mapas empurra a meta para armas de curta e média distância, o que reduz a variedade competitiva na prática — um efeito colateral direto do problema de level design, não do balanceamento de armas em si.',
  notas:[['Variedade',8.5],['Balanceamento',7.0],['Diferenciação entre armas',8.0],['Personalização',9.0],['Qualidade do recuo',8.5],['Distância efetiva bem definida',7.5],['Viabilidade das categorias',6.5]]
},
mapas:{
  texto:'É aqui que o jogo perde. A crítica mais consistente da comunidade desde o lançamento é que <strong>os mapas são pequenos demais para a proposta de Battlefield</strong>, com o combate sendo repetidamente funilado para os mesmos pontos de estrangulamento. Isso gera partidas que parecem Call of Duty com 64 jogadores: caóticas, mas sem a respiração e a manobra de flanco que definem a série.<br><br>A qualidade individual de arte e destruição é alta — os mapas são bonitos e desabam bem. O problema é estrutural: rotas insuficientes, pouca área de manobra para veículos e balanceamento entre lados questionado em modos como Breakthrough.<br><br>A Temporada 2 entregou menos mapas e armas do que originalmente planejado, e o retorno da guerra naval na Temporada 4 foi a tentativa de reabrir a escala do jogo.',
  destaques:[
    {nome:'O problema comum',txt:'Não há um punhado de mapas competitivamente canônicos como em CS2 ou Valorant — Battlefield não tem cena competitiva que os consagre. O que existe é uma reclamação transversal de escala e funil aplicada à maioria do pool de lançamento.'},
    {nome:'Mapas de escala maior',txt:'Os mapas mais abertos do pool são consistentemente os mais bem avaliados pela comunidade, o que reforça o diagnóstico: o jogo funciona melhor quando dá espaço.'},
    {nome:'Guerra naval (Temporada 4)',txt:'Adição estruturada para recuperar a escala perdida, com mapas construídos em torno de combate marítimo — a maior mudança de rumo do ciclo pós-lançamento.'}
  ],
  notas:[['Quantidade',6.5],['Qualidade',7.0],['Variedade',6.0],['Design',5.5],['Verticalidade',7.0],['Qualidade das rotas',5.5],['Balanceamento de lados',6.0],['Rejogabilidade',6.0],['Peso do conhecimento de mapa',6.5]]
},
competitivo:{
  classificacao:'Casual',
  texto:'Battlefield 6 não é um jogo competitivo e não tenta ser. Não há ranqueado estruturado com rating visível comparável ao de CS2 ou Valorant, não há circuito de esports relevante, e o formato de 64 jogadores com veículos torna o resultado individual difícil de isolar.<br><br>Isso não é um defeito — é o posicionamento. O problema é que a ausência de sistema competitivo remove um motor de retenção que jogos de serviço precisam. Sem ranking para perseguir e sem cena para acompanhar, a retenção depende inteiramente de conteúdo novo, e o conteúdo atrasou.<br><br>Integridade: cheating existe como em qualquer jogo de PC de grande porte, mas o impacto percebido é menor porque a morte individual pesa menos numa partida de 64 pessoas.',
  notas:[['Ranking',3.0],['Matchmaking',6.5],['Sistema competitivo',3.5],['Esports',2.5],['Cenário profissional',2.5],['Skill gap',6.5],['Qualidade das ranqueadas',5.0],['Integridade competitiva',6.5],['Controle de smurfs',7.0],['Controle de cheaters',6.0],['Ambiente / toxicidade',7.0]],
  justificativa:'Casual, por desenho. É um sandbox de larga escala e não um jogo de medição individual. Quem procura progressão competitiva mensurável não vai encontrar aqui.'
},
experiencia:{
  iniciante:'Muito acolhedor — o melhor da lista nesse quesito. Você contribui capturando pontos, dando munição e revivendo aliados mesmo com pontaria ruim. Nenhum outro FPS desta base deixa o iniciante ser útil tão rápido.',
  intermediario:'Espaço moderado. Você melhora em armas, movimento e pilotagem, mas o jogo não oferece uma métrica que torne essa evolução visível ou comparável.',
  avancado:'Recompensa parcialmente. Um jogador de elite domina uma partida, mas o formato de 64 jogadores dilui o impacto individual e não há teto mecânico comparável ao de um jogo tático.',
  competitivo:'Não. Falta ranqueado sério, falta cena, falta o formato. Quem quer competir de verdade não deveria escolher Battlefield 6.'
},
tecnico:{
  texto:'Visualmente é o mais impressionante da lista, e a Frostbite entrega destruição em larga escala com estabilidade razoável. Requisitos são altos, e o desempenho em PCs medianos exige concessões gráficas.<br><br>O problema técnico mais citado é <strong>netcode e hitreg</strong>: reclamações de que balas não registram e de inconsistência em trocas próximas persistiram, e a comunidade apontou que a Temporada 2 chegou sem resolvê-las. É um problema recorrente da série, não uma novidade deste título.',
  itens:[['FPS','Alto em hardware moderno; exigente em PCs medianos'],['Otimização','Razoável — melhorou desde o lançamento, mas continua pesado'],['Input lag','Aceitável'],['Netcode','Ponto crítico: queixas de hitreg persistiram através da Temporada 2'],['Tick rate','Sem valor oficial claro e atual publicado pela EA'],['Estabilidade','Boa em geral; problemas concentrados em janelas de lançamento de temporada'],['Escalabilidade','Boa em opções gráficas, mas o piso de hardware é o mais alto da lista']],
  semDados:'A EA não publica tick rate por região nem métricas de latência de servidor. Números específicos que circulam em fóruns não têm confirmação oficial.',
  notas:[['FPS',7.5],['Otimização',7.0],['Input lag',7.5],['Netcode',6.0],['Estabilidade',7.5],['Escalabilidade gráfica',8.0]]
},
av:{
  texto:'O melhor pacote audiovisual da base, com folga. Iluminação, texturas, animações de arma e o espetáculo da destruição colocam BF6 num patamar acima de qualquer concorrente aqui. O som é referência do gênero: disparos com peso real, eco por ambiente, e uma mixagem que comunica escala.<br><br>O custo é competitivo. Fumaça, poeira, explosões e detritos <strong>reduzem a clareza do inimigo</strong> — em um combate de 64 pessoas com destruição ativa, identificar um alvo é genuinamente mais difícil do que em qualquer jogo tático. Para a proposta de BF6, isso é aceitável; num jogo competitivo, seria inaceitável.',
  impacto:'Prejudicam a competitividade e favorecem a imersão. É uma troca deliberada e coerente com o que o jogo quer ser — mas explica por que Battlefield nunca virou esporte.',
  notas:[['Qualidade visual',9.5],['Animações',9.0],['Iluminação',9.0],['Texturas',9.0],['Design visual',8.5],['Clareza do inimigo',6.0],['Som dos disparos',9.8],['Passos (footsteps)',7.0],['Direcionalidade',8.0],['Mixagem',9.0]]
},
progressao:{
  texto:'Progressão tradicional de Battlefield: nível de arma libera attachments, nível de classe libera equipamento, e há passe de batalha por temporada com trilha gratuita e paga. A Temporada 2 mexeu na progressão como parte do pacote de correções sistêmicas.<br><br>Não há pay-to-win: attachments se ganham jogando, não comprando. A monetização é cosmética, e comparativamente contida para os padrões de 2026 — especialmente ao lado de Call of Duty.<br><br>O problema não é o preço, é o ritmo. A Temporada 1 foi estendida e a Temporada 2 adiada para 17/02/2026, com recompensas bônus para cobrir o vazio. A decisão gerou críticas amplas, e a temporada entregou menos mapas e armas do que o planejado.',
  classe:'Boa',
  classeTxt:'Boa. Jogo pago, sem vantagem comprável, passe com trilha gratuita real e loja cosmética contida. O pecado do modelo não é ganância — é entrega: o calendário de conteúdo falhou, e num jogo de serviço isso custa mais caro que uma loja cara.',
  p2w:'Nenhum. Attachments e equipamentos são desbloqueados por uso.',
  notas:[['Progressão',7.5],['Battle Pass',7.0],['Skins (qualidade)',7.0],['Recompensas gratuitas',7.0],['Conteúdo sazonal',5.5],['Frequência de atualização',5.0],['Monetização (justiça)',7.5],['Ausência de pay-to-win',9.5]]
},
problemas:[
  {tipo:'fato',t:'Queda severa de população',p:'Verificável: pico de 747.440 jogadores simultâneos no Steam na semana de lançamento (outubro/2025) contra média de ~43.800 em agosto/2026 — uma queda de aproximadamente 94% em relação ao pico. Nenhuma temporada reverteu a tendência.'},
  {tipo:'fato',t:'Temporada 2 adiada e reduzida',p:'A EA estendeu a Temporada 1 e adiou a Temporada 2 para 17/02/2026, e a temporada entregou menos mapas e armas do que o planejado originalmente. Ambos são fatos anunciados pela própria EA.'},
  {tipo:'reclamacao',t:'Mapas pequenos e funil de combate',p:'A crítica mais consistente da comunidade desde o lançamento: mapas pequenos demais que empurram as partidas para os mesmos pontos de estrangulamento. É reclamação recorrente e amplamente reportada, não uma métrica oficial.'},
  {tipo:'reclamacao',t:'Netcode e hitreg não resolvidos',p:'Queixa persistente de que a Temporada 2 chegou sem corrigir registro de tiro. Recorrente e amplamente relatada; a EA não publicou métricas que confirmem ou refutem.'},
  {tipo:'reclamacao',t:'Ceticismo com o roadmap',p:'A comunidade recebeu com desconfiança as promessas de correção da Temporada 2 e o cinemático vazado da mesma temporada. Sentimento documentado na cobertura de imprensa; não é uma falha do jogo em si.'},
  {tipo:'opiniao',t:'"Não parece um Battlefield"',p:'Julgamento comum entre veteranos, ligado à escala dos mapas e ao ritmo mais rápido. É comparação com uma memória da série, e varia conforme o título de referência de cada jogador.'}
],
fortes:[
  'O melhor gunplay da história da série — recuo, peso e manuseio de arma de primeira linha.',
  'Destruição de ambiente reintegrada como mecânica real, não como cenário.',
  'Pacote audiovisual superior a qualquer concorrente desta base, especialmente no som.',
  'Personalização de armas profunda e significativa, sem vantagem comprável.',
  'O FPS mais acolhedor da base: o iniciante contribui para o time sem precisar mirar bem.'
],
fracos:[
  'Perda de aproximadamente 94% do pico de jogadores em dez meses.',
  'Design de mapa é o ponto mais criticado: escala insuficiente e funis repetitivos.',
  'Calendário de temporadas falhou — atraso, extensão e entrega abaixo do prometido.',
  'Netcode e hitreg seguem sem solução convincente após ciclos de correção.',
  'Ausência total de camada competitiva: sem ranked sério, sem esports, sem retenção de longo prazo.'
],
concorrentes:['bo7','delta','arc','finals'],
vale:{
  veredito:'Sim, com ressalvas',
  texto:'Vale se você quer combate militar de larga escala e aceita pagar por um jogo cuja população encolheu drasticamente. O que está na caixa é bom: o tiro é excelente, a destruição funciona e a apresentação impressiona. O que não está na caixa é a certeza de que o suporte vai continuar no ritmo prometido.',
  perfis:[
    ['Casual','Sim. É o melhor da lista para sessão curta e sem compromisso — você se diverte mesmo jogando mal.'],
    ['Competitivo','Não. Falta ranqueado, falta cena, falta formato. Não é o jogo para isso.'],
    ['Solo','Com ressalvas. Funciona, mas o jogo é claramente construído para esquadrão coordenado.'],
    ['Com amigos','Excelente. Um esquadrão de quatro é a forma pretendida de jogar e a mais divertida da base.'],
    ['Foco em ranking','Não. Não há sistema de ranking significativo.'],
    ['Foco em esports','Não. Não existe cena competitiva relevante.']
  ]
},
veredito:{
  melhor:'O gunplay somado à destruição — o núcleo do jogo é genuinamente excelente.',
  problema:'Design de mapa. Mapas pequenos demais estrangulam a proposta de escala da série.',
  diferencial:'Larga escala com destruição real e som de guerra que nenhum concorrente alcança.',
  risco:'A população continuar caindo até o suporte ser reduzido — o risco clássico de jogo de serviço pago.',
  perfil:'Jogador casual ou de esquadrão que quer espetáculo militar e não competição medida.',
  vale2026:'Sim, com ressalvas',
  conclusao:'Battlefield 6 é um jogo bom preso dentro de um lançamento mal administrado. A DICE acertou exatamente onde 2042 errou — o tiro, a destruição, a sensação — e errou onde 2042 tinha acertado: escala de mapa. Somado a um calendário de temporadas que quebrou, o resultado é um jogo que perdeu quase toda a sua audiência antes de conseguir se corrigir. Compre pelo que ele é hoje, não pela promessa do que será.'
},
dados:[
  {l:'Pico de lançamento no Steam',v:'747.440 jogadores simultâneos (semana de lançamento, outubro/2025)',f:'SteamDB',u:'https://steamdb.info/app/2807960/charts/'},
  {l:'Média de simultâneos — agosto/2026',v:'~43.796 (alta de 7,4% vs. julho/2026) — cerca de 94% abaixo do pico de lançamento',f:'activeplayer.io / SteamDB',u:'https://activeplayer.io/battlefield-6/'},
  {l:'Temporada 2',v:'Adiada para 17/02/2026 após extensão da Temporada 1; focada em revisões de armas, progressão, áudio e movimento, com menos mapas e armas do que o planejado',f:'Notebookcheck / TechRadar',u:'https://www.notebookcheck.net/Battlefield-6-Season-2-promises-major-fixes-but-the-community-remains-skeptical.1224383.0.html'},
  {l:'Divergência entre fontes',v:'Estimativas de janeiro/2026 falavam em 70–80 mil simultâneos no Steam e 130–150 mil somando plataformas; séries posteriores mostram valores bem menores. Números "somando plataformas" são projeções de terceiros, não dados da EA.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= CALL OF DUTY: BLACK OPS 7 ======================= */
GAMES.push({
id:'bo7', nome:'Call of Duty: Black Ops 7', cor:'#e0a83c', tipo:'Arcade', tags:['Arcade','TTK curto','Warzone'],
pitch:'Multiplayer competente preso ao lançamento mais rejeitado da história da franquia.',
notaGeral:6.2,
scores:{gameplay:7.5,mira:7.8,mapas:5.5,competitivo:5.5,graficos:7.5,performance:6.5,conteudo:8.0,comunidade:4.2,monetizacao:3.8},
visao:{
  completo:'Call of Duty: Black Ops 7', dev:'Treyarch e Raven Software', publisher:'Activision (Microsoft)',
  ano:'14 de novembro de 2025',
  plataformas:'PC, PlayStation 5, Xbox Series X|S; disponível no Game Pass',
  engine:'IW Engine (variante Treyarch)',
  modelo:'Pago, com temporadas, passe de batalha e loja de cosméticos; Warzone segue free-to-play à parte',
  modos:'Multiplayer 6v6, Campanha cooperativa, Zumbis, Endgame, integração com Warzone',
  perfil:'Arcade rápido, TTK curto, movimento fluido e ciclos de partida de poucos minutos.',
  publico:'Base massiva e majoritariamente casual, com forte presença em console.',
  situacao:'Comercialmente forte, criticamente rejeitado. Jogo mais vendido de novembro/2025 e, simultaneamente, o pior avaliado por usuários na história da franquia.'
},
resumoNota:'6,2 porque o multiplayer 6v6 continua sendo o arcade shooter mais polido do mercado — movimento, resposta e feedback de tiro são excelentes. A nota desaba no resto: campanha rejeitada, uso de IA generativa em assets, exigência de conexão permanente, monetização agressiva e um dos piores ambientes de comunidade do gênero.',
gameplay:{
  texto:'O núcleo do multiplayer é bom e é a razão pela qual a franquia sobrevive a lançamentos ruins. O <strong>TTK é muito curto</strong> — trocas resolvem em frações de segundo — e o movimento é o mais fluido da base: deslize, mergulho, corrida tática e transições rápidas entre elas. É o FPS que responde mais imediatamente ao input.<br><br>O recuo é moderado e fortemente mitigável por attachments, o que desloca parte da habilidade de mira para a montagem correta da arma. A precisão é generosa em comparação com jogos táticos: você pode atirar em movimento com eficácia razoável, o que reduz o peso do posicionamento e aumenta o peso do reflexo.<br><br>A crítica mecânica mais duradoura da franquia continua sendo o <strong>SBMM</strong> (matchmaking por habilidade agressivo em partidas casuais), que muitos jogadores acusam de transformar toda partida pública num jogo de alta pressão.',
  notas:[['Velocidade das partidas',9.5],['Fluidez',9.0],['Tiro',8.0],['Recuo (qualidade do modelo)',6.5],['Movimento',9.0],['Precisão',7.0],['Peso da mira',7.5],['Peso da estratégia',4.5],['Peso do posicionamento',5.5]],
  ttk:'Muito curto — dos mais curtos da base, junto com Siege. Favorece reflexo e primeira visualização acima de tudo.',
  curva:'Suave. Um jogador novo consegue abates na primeira partida; a barreira de entrada é a mais baixa da lista.',
  skillGap:'Moderado. Existe teto real em movimento avançado e mira, mas o TTK curto, o auto-aim de console e os killstreaks comprimem a diferença entre jogadores.',
  dificuldade:'Baixo para jogar; médio para se destacar consistentemente.'
},
armas:{
  texto:'Arsenal enorme e o sistema de personalização mais profundo da base — <strong>Gunsmith</strong> permite montar a mesma arma de formas radicalmente diferentes, com dezenas de attachments alterando recuo, mobilidade, alcance e tempo de mira.<br><br>Essa profundidade é também o problema: com tantas variáveis, a comunidade encontra rapidamente uma montagem ótima por temporada, e a meta se estreita a poucas armas com poucos builds. Cada temporada nova reinicia esse ciclo, geralmente com a arma nova do passe entre as mais fortes — um padrão que a franquia repete há anos e que alimenta a acusação de vantagem via passe de batalha.<br><br>A diferenciação entre categorias é boa no papel, mas o TTK curto achata na prática: se tudo mata rápido, a escolha vira mobilidade e tempo de mira, não função tática.',
  meta:'Rotativa por temporada, tipicamente concentrada em poucos rifles de assalto e SMGs com builds ótimos difundidos. Armas de temporada frequentemente chegam fortes.',
  dominante:true,
  dominanteTxt:'Sim, e de forma cíclica. A cada temporada a comunidade converge para 2–4 armas com montagens específicas, e o restante do arsenal enorme vira irrelevante em partida séria. A variedade é aparente, não efetiva.',
  notas:[['Variedade',9.5],['Balanceamento',5.5],['Diferenciação entre armas',6.0],['Personalização',9.5],['Qualidade do recuo',6.5],['Distância efetiva bem definida',6.0],['Viabilidade das categorias',5.5]]
},
mapas:{
  texto:'Mapas de multiplayer são pequenos e desenhados para engajamento constante — o modelo de três faixas (three-lane) é a base histórica da franquia e funciona para ritmo. O problema é qualidade inconsistente: o design de mapa foi um dos motivos citados para a queda de retenção já no ciclo anterior (Black Ops 6), e a crítica se repetiu.<br><br>Verticalidade existe mas é rasa. Pontos de estrangulamento são muitos e curtos, o que gera combate constante e pouca leitura tática. Rejogabilidade é sustentada por volume — muitos mapas, rotação frequente — e não por profundidade individual: nenhum mapa de CoD sustenta anos de teoria como Mirage ou Bank.<br><br>O conhecimento de mapa importa (linhas de visão, pontos de spawn), mas muito menos que em qualquer jogo tático, e o sistema de respawn dinâmico torna o mapa menos previsível por natureza.',
  destaques:[
    {nome:'Modelo three-lane',txt:'A estrutura padrão de CoD: três rotas paralelas com conexões cruzadas. Garante ritmo e encontros constantes, ao custo de profundidade tática.'},
    {nome:'Mapas de Warzone',txt:'Escala completamente diferente e ciclo próprio. A ausência de um mapa principal novo no ciclo anterior foi uma queixa central da base de Warzone.'},
    {nome:'Sem canon competitivo',txt:'Diferente de CS2 ou Valorant, o pool competitivo da CDL é definido por regras de liga e rotaciona a cada ano com o jogo novo — não há mapa que acumule uma década de teoria.'}
  ],
  notas:[['Quantidade',8.5],['Qualidade',5.5],['Variedade',6.5],['Design',5.5],['Verticalidade',6.0],['Qualidade das rotas',6.0],['Balanceamento de lados',6.5],['Rejogabilidade',5.5],['Peso do conhecimento de mapa',5.0]]
},
competitivo:{
  classificacao:'Competitivo',
  texto:'Existe uma camada competitiva real — <strong>Ranked Play</strong> com regras da Call of Duty League (restrição de armas, modos e mapas) e um circuito profissional franqueado. O formato competitivo é bem definido e a CDL tem premiação alta.<br><br>Mas a integridade é o problema mais sério da lista, especialmente em Warzone: cheating em PC é endêmico e reconhecido publicamente pela Activision, que sucessivamente implementou e reforçou o RICOCHET. A percepção da comunidade é de que o problema nunca foi controlado. Some-se o <strong>SBMM em partidas casuais</strong>, que é a queixa mais universal da franquia: a base acusa o sistema de tornar toda partida uma partida ranqueada disfarçada.<br><br>O ciclo anual também limita a maturidade competitiva: cada ano reinicia meta, mapas e sistema, o que impede o acúmulo de teoria que sustenta o CS há uma década.',
  notas:[['Ranking',6.5],['Matchmaking',4.0],['Sistema competitivo',6.5],['Esports',7.0],['Cenário profissional',7.0],['Skill gap',6.0],['Qualidade das ranqueadas',5.5],['Integridade competitiva',3.5],['Controle de smurfs',4.0],['Controle de cheaters',3.5],['Ambiente / toxicidade',3.5]],
  justificativa:'Competitivo, não altamente competitivo. Tem liga profissional e ranqueado com regras sérias, mas o ciclo anual, o TTK curto, o SBMM e o problema de cheating impedem a profundidade e a estabilidade que definem a categoria mais alta.'
},
experiencia:{
  iniciante:'Muito fácil de começar — o mais fácil da base junto com Battlefield 6. Sessões curtas, gratificação imediata, e progressão que recompensa só por jogar. Está no Game Pass, o que reduz ainda mais o atrito.',
  intermediario:'Espaço moderado. Você melhora em movimento, montagem de armas e leitura de spawn, mas o SBMM ajusta a dificuldade para manter você perto de 50% de vitórias — o que muitos jogadores descrevem como progresso invisível.',
  avancado:'Recompensa parcialmente. Movimento avançado e domínio de Gunsmith fazem diferença real, mas o TTK curto e a assistência de mira em console limitam o quanto a habilidade individual consegue converter.',
  competitivo:'Existe profundidade suficiente para a CDL, mas com prazo de validade: o jogo do ano seguinte reinicia tudo. Quem quer construir domínio de longo prazo encontra teto artificial.'
},
tecnico:{
  texto:'Performance é adequada em hardware moderno, mas o jogo é notoriamente pesado em espaço de disco e em uso de memória, e a exigência de <strong>conexão permanente à internet, inclusive para a campanha</strong>, foi um dos motivos centrais da rejeição no lançamento.<br><br>Netcode é razoável para o formato arcade, mas a franquia carrega queixas históricas de desvantagem de quem hospeda o "peek" e de inconsistência de registro. A Activision não publica tick rate oficial atual de forma clara e comparável.',
  itens:[['FPS','Bom em hardware moderno; exigente em armazenamento e memória'],['Otimização','Mediana — o tamanho de instalação é uma reclamação constante da franquia'],['Input lag','Baixo — é um ponto forte do motor'],['Netcode','Razoável para arcade; queixas históricas de consistência'],['Tick rate','Sem valor oficial atual e claro publicado pela Activision'],['Estabilidade','Aceitável; picos de problema em lançamento de temporada'],['Escalabilidade','Boa em PC; console bem otimizado'],['Conexão','Exige conexão permanente, inclusive para conteúdo de campanha']],
  semDados:'Não há dados públicos verificáveis sobre taxa de detecção do RICOCHET nem sobre proporção de contas banidas por região.',
  notas:[['FPS',7.5],['Otimização',5.5],['Input lag',9.0],['Netcode',6.5],['Estabilidade',7.0],['Escalabilidade gráfica',7.5]]
},
av:{
  texto:'Produção alta e polimento de animação de arma que continua sendo referência — recarregar uma arma em CoD é um dos melhores momentos de animação em qualquer FPS. Iluminação e texturas são boas sem serem líderes de categoria.<br><br>A clareza do inimigo é o ponto fraco, e é autoinfligido: <strong>skins de operador exageradas</strong> (colaborações, personagens estilizados, cores fora de paleta) degradam a legibilidade em mapas realistas. É uma decisão comercial que a comunidade competitiva critica há anos.<br><br>O áudio é bom em impacto e fraco em informação: passos e direcionalidade são queixas recorrentes da franquia, com jogadores relatando dificuldade de localizar inimigos por som — um problema grave num jogo de TTK tão curto.',
  impacto:'Prejudicam a competitividade. A monetização de cosméticos entrou em conflito direto com a legibilidade do jogo, e a franquia optou consistentemente pelo cosmético.',
  notas:[['Qualidade visual',8.0],['Animações',9.5],['Iluminação',7.5],['Texturas',8.0],['Design visual',6.0],['Clareza do inimigo',5.0],['Som dos disparos',8.5],['Passos (footsteps)',5.5],['Direcionalidade',6.0],['Mixagem',7.0]]
},
progressao:{
  texto:'Progressão volumosa e bem calibrada para retenção: níveis de arma, camuflagens, desafios, prestígio e passe de batalha por temporada. É o sistema de recompensa mais denso da base — sempre há algo a desbloquear.<br><br>O problema é a monetização. A loja opera com pacotes de alto preço, colaborações constantes e bundles que frequentemente incluem vantagens de legibilidade (skins escuras, modelos difíceis de ler). Somado à percepção recorrente de que armas de passe chegam fortes, isso alimenta a acusação de <strong>vantagem indireta paga</strong> — que a Activision nega e que não é comprovável como pay-to-win estrito.<br><br>O uso de <strong>IA generativa em assets</strong> (incluindo cartões de visita) foi apontado por jogadores no lançamento e virou um dos pontos centrais da revolta — um jogo de preço cheio entregando arte gerada automaticamente.',
  classe:'Predatória',
  classeTxt:'Predatória. Preço cheio somado a loja agressiva, colaborações caras, e cosméticos que interferem na legibilidade competitiva. Não é pay-to-win no sentido estrito de estatísticas, mas é o modelo mais explorador da base — o jogador paga o jogo, paga o passe, e ainda enfrenta pressão de loja permanente.',
  p2w:'Não em estatísticas. Mas skins que degradam a legibilidade do inimigo e a percepção recorrente de armas de passe fortes criam vantagem indireta contestada.',
  notas:[['Progressão',8.5],['Battle Pass',6.5],['Skins (qualidade)',6.5],['Recompensas gratuitas',5.5],['Conteúdo sazonal',8.5],['Frequência de atualização',9.0],['Monetização (justiça)',3.0],['Ausência de pay-to-win',6.5]]
},
problemas:[
  {tipo:'fato',t:'Pior nota de usuário da história da franquia',p:'Verificável no Metacritic: nota de usuário na faixa de 1,7–1,9/10 em milhares de avaliações, abaixo de Modern Warfare 3 (2023), que tinha 2,3. Importante: parte disso é review bombing organizado, o que não invalida o sinal mas exige leitura cuidadosa.'},
  {tipo:'fato',t:'Divergência crítica x público',p:'O jogo tem Metascore de crítica de 83/100 (18 análises) contra ~1,9/10 de usuários. É uma das maiores divergências já registradas na franquia e deve ser apresentada como divergência, não resolvida a favor de um dos lados.'},
  {tipo:'fato',t:'Exigência de conexão permanente',p:'Confirmado: o jogo exige conexão constante à internet, inclusive para conteúdo de campanha. Foi um dos motivos explícitos da rejeição no lançamento.'},
  {tipo:'fato',t:'Uso de IA generativa em assets',p:'Jogadores identificaram e a cobertura reportou uso de IA generativa em elementos do jogo, incluindo cartões de visita. Ponto central da revolta em um produto de preço cheio.'},
  {tipo:'reclamacao',t:'SBMM em partidas casuais',p:'A queixa mais universal e antiga da franquia: matchmaking por habilidade agressivo em partidas públicas. A Activision já publicou material defendendo o sistema; a comunidade não aceitou. Reclamação recorrente com base em percepção, não em dados abertos.'},
  {tipo:'reclamacao',t:'Cheating em Warzone',p:'Queixa persistente e amplamente reportada em PC, apesar de sucessivas atualizações do RICOCHET. Sem dados públicos que permitam medir a extensão atual.'},
  {tipo:'opiniao',t:'"A campanha destruiu o legado de Black Ops"',p:'Julgamento subjetivo sobre tom, estrutura cooperativa e o desfecho. Amplamente compartilhado, mas é crítica de direção criativa e não uma falha mensurável.'}
],
fortes:[
  'Movimento e resposta de input: o arcade shooter mais fluido e imediato do mercado.',
  'Gunsmith — o sistema de personalização de armas mais profundo da base.',
  'Volume e ritmo de conteúdo: temporadas densas, modos variados, Zumbis e Warzone no mesmo pacote.',
  'Barreira de entrada mínima, reforçada pela presença no Game Pass.',
  'Liga profissional franqueada (CDL) com premiação alta e estrutura estável.'
],
fracos:[
  'Rejeição pública sem precedentes na franquia, com nota de usuário mais baixa da história.',
  'Monetização predatória sobre um jogo de preço cheio, com cosméticos que atrapalham a legibilidade.',
  'Cheating em Warzone nunca controlado, apesar de anos de RICOCHET.',
  'SBMM agressivo em partidas casuais — a queixa mais antiga e menos endereçada da série.',
  'Ciclo anual impede acúmulo de profundidade competitiva: cada ano reinicia meta, mapas e teoria.'
],
concorrentes:['bf6','delta','apex','cs2'],
vale:{
  veredito:'Sim, com ressalvas',
  texto:'Vale se o objetivo é multiplayer 6v6 rápido em sessões curtas, e principalmente se você já tem Game Pass — nesse caso o custo de experimentar é baixo. Não vale pelo preço cheio, não vale pela campanha, e não vale se você pretende jogar Warzone em PC levando a sério.',
  perfis:[
    ['Casual','Sim. É o melhor da base para 30 minutos de jogo depois do trabalho — gratificação imediata e progressão constante.'],
    ['Competitivo','Com ressalvas. Ranked Play funciona, mas integridade fraca e reinício anual limitam o valor do esforço.'],
    ['Solo','Sim. O formato de partidas curtas com preenchimento automático é o mais amigável ao jogador solo da base.'],
    ['Com amigos','Sim. Excelente para grupo casual — modos variados, sessões curtas, pouca exigência de coordenação.'],
    ['Foco em ranking','Com ressalvas. Existe ranked sério, mas o progresso zera todo ano e o ambiente é problemático.'],
    ['Foco em esports','Sim, com ressalvas. A CDL é bem estruturada, mas a audiência e a longevidade das narrativas ficam atrás de CS2 e Valorant.']
  ]
},
veredito:{
  melhor:'O multiplayer 6v6 — movimento, resposta e feedback de tiro seguem sendo os melhores do arcade.',
  problema:'A relação com o jogador: preço cheio, loja agressiva, IA generativa e conexão obrigatória.',
  diferencial:'Volume — multiplayer, Zumbis, campanha e Warzone num pacote que ninguém iguala em quantidade.',
  risco:'A erosão de confiança virar permanente: a franquia vende por inércia, e inércia acaba.',
  perfil:'Jogador casual de console ou assinante de Game Pass que quer partidas curtas e progressão constante.',
  vale2026:'Sim, com ressalvas',
  conclusao:'Black Ops 7 é o exemplo mais claro de que popularidade não é qualidade: foi o jogo mais vendido do mês de lançamento e o pior avaliado por usuários da história da série, ao mesmo tempo. O multiplayer não é o problema — ele é bom, e sempre foi. O problema é tudo o que a Activision empilhou em volta dele: preço cheio com loja permanente, IA generativa em assets, conexão obrigatória e um anticheat que nunca funcionou em Warzone. Jogue pelo Game Pass, ignore o resto, e não espere que o próximo ano corrija o que doze anos não corrigiram.'
},
dados:[
  {l:'Lançamento',v:'14 de novembro de 2025 — desenvolvido por Treyarch e Raven Software',f:'GameRant / Insider Gaming',u:'https://gamerant.com/call-of-duty-black-ops-7-reviews-user-scores-lowest-rated-cod/'},
  {l:'Nota de usuário no Metacritic',v:'~1,9/10 com mais de 1.440 avaliações (queda para 1,7 em alguns levantamentos) — a mais baixa da história da franquia, abaixo de Modern Warfare 3 (2,3)',f:'Metacritic via Insider Gaming / Notebookcheck',u:'https://insider-gaming.com/call-of-duty-black-ops-7-metacritic-user-rating/'},
  {l:'Nota da crítica',v:'Metascore 83/100 com 18 análises — divergência acentuada em relação ao público',f:'Metacritic via GameRant',u:'https://gamerant.com/call-of-duty-black-ops-7-reviews-user-scores-lowest-rated-cod/'},
  {l:'Vendas',v:'Jogo mais vendido de novembro/2025 — 18º ano consecutivo em que um Call of Duty lidera o mês de lançamento',f:'Cobertura de mercado',u:'https://www.thegamer.com/call-of-duty-black-ops-7-cod-bo7-worst-reviewed-entry-below-modern-warfare-3-metacritic/'},
  {l:'Ressalva metodológica',v:'Parte da nota de usuário é atribuída a review bombing organizado. O sinal de insatisfação é real e amplamente reportado, mas o número absoluto não deve ser lido como medida limpa de qualidade.',f:'Clawsome Gamer',u:'https://clawsomegamer.com/black-ops-7-now-worst-user-rated-call-of-duty-on-metacritic-amid-review-bombing/'},
  {l:'Sem dado confiável',v:'Não há números públicos atuais e verificáveis de população simultânea de Black Ops 7 por plataforma. Séries do Steam cobrem apenas parte da base (o jogo é majoritariamente jogado em console e no Game Pass).',f:'—',u:''}
],
atualizado:'2026-08-28'
});
