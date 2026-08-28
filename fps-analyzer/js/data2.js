/* FPS Analyzer — base de dados (parte 2) */

/* ======================= APEX LEGENDS ======================= */
GAMES.push({
id:'apex', nome:'Apex Legends', cor:'#d13639', tipo:'Battle Royale', tags:['Battle Royale','Movimento','Squad'],
pitch:'O melhor movimento e o melhor tiro já feitos num battle royale. Uma década de decisões comerciais ruins em cima disso.',
notaGeral:7.2,
scores:{gameplay:8.8,mira:8.6,mapas:7.5,competitivo:6.5,graficos:7.5,performance:6.6,conteudo:6.5,comunidade:5.5,monetizacao:4.5},
visao:{
  completo:'Apex Legends', dev:'Respawn Entertainment', publisher:'Electronic Arts', ano:'2019',
  plataformas:'PC, PlayStation, Xbox, Nintendo Switch',
  engine:'Source (fortemente modificada)',
  modelo:'Free-to-play; receita em passes de batalha, eventos e cosméticos',
  modos:'Battle Royale em trios e duplas, Mixtape (modos rápidos), Ranqueado, modos sazonais rotativos',
  perfil:'Battle royale de esquadrão com lendas de habilidades, movimento avançado e TTK médio.',
  publico:'Jogador que quer mecânica de alto teto dentro do formato battle royale.',
  situacao:'Estabilizado depois de uma queda severa. A Respawn voltou a entregar balanceamento frequente, modos e atualizações de mapa, e a curva parou de cair.'
},
resumoNota:'7,2 porque o núcleo mecânico — movimento, gunplay, design de habilidades, ping system — é o melhor do formato e influenciou o gênero inteiro. A nota é puxada para baixo por anos de monetização agressiva, servidores de tick baixo e um problema de cheating que nunca foi resolvido.',
gameplay:{
  texto:'Apex tem o gunplay mais satisfatório do battle royale e um dos melhores de qualquer FPS: recuo com padrão aprendível, feedback de acerto claro e armas com identidade forte. O <strong>movimento</strong> é o diferencial real — deslize em declive, tirolesa, escalada, e técnicas avançadas que a comunidade descobriu e a Respawn escolheu manter. O teto de mobilidade é altíssimo e visível.<br><br>O <strong>TTK é médio-alto</strong> por design: escudos com níveis significam que uma troca dura vários segundos, o que dá tempo de reagir, recuar e ser resgatado pelo esquadrão. Isso é o oposto de CS2 — aqui a habilidade não é matar primeiro, é vencer uma sequência longa de decisões sob pressão.<br><br>O sistema de ping foi inventado aqui e virou padrão da indústria: comunicação tática precisa sem microfone.',
  notas:[['Velocidade das partidas',6.5],['Fluidez',9.8],['Tiro',9.2],['Recuo (qualidade do modelo)',8.8],['Movimento',9.8],['Precisão',8.5],['Peso da mira',8.5],['Peso da estratégia',7.5],['Peso do posicionamento',8.5]],
  ttk:'Médio-alto. Escudos escalonados fazem trocas durarem segundos, favorecendo reposicionamento e trabalho de equipe sobre o primeiro tiro.',
  curva:'Íngreme no movimento, moderada no tiro. Ser competente leva horas; dominar o movimento leva centenas.',
  skillGap:'Muito alto — provavelmente o maior fora dos jogos táticos. Um jogador de elite é praticamente inalcançável em duelo de movimento.',
  dificuldade:'Alto. O formato battle royale ainda adiciona pressão de tempo e RNG de loot.'
},
armas:{
  texto:'Arsenal bem diferenciado com sistema de raridade de attachments encontrados no chão. Cada arma tem tipo de munição, hop-up e curva de dano própria, e a Respawn rotaciona armas para o "Care Package" (versão superior, quantidade limitada) para mexer na meta sem nerfar permanentemente.<br><br>A personalização é por loot, não por loadout: você monta a arma com o que achar. Isso adiciona RNG real ao poder de fogo — a mesma arma com mira 3x e carregador roxo é outra arma.<br><br>Existe meta dominante clara por temporada, e ela muda com frequência porque a Respawn balanceia agressivamente. É um dos jogos com meta mais móvel da base.',
  meta:'Rotativa por temporada, guiada por ajustes de dano/recuo e pela rotação do Care Package. R-301, Flatline, Wingman e as SMGs de munição leve circulam historicamente no topo.',
  dominante:true,
  dominanteTxt:'Sim, mas saudável: existe uma meta dominante em cada temporada e ela realmente muda entre temporadas. Isso é diferente de CS2 (meta congelada há anos) e de CoD (meta que reinicia junto com o jogo).',
  notas:[['Variedade',8.5],['Balanceamento',7.5],['Diferenciação entre armas',9.0],['Personalização',7.0],['Qualidade do recuo',8.8],['Distância efetiva bem definida',8.5],['Viabilidade das categorias',7.5]]
},
mapas:{
  texto:'Mapas grandes com rotação entre eles por temporada. O design privilegia <strong>rotas de movimento</strong> — tirolesas, balões, jump pads, declives — e essa é a assinatura do jogo: o mapa é lido como uma rede de possibilidades de deslocamento, não só como cobertura.<br><br>Verticalidade é alta e significativa; controle de terreno alto é uma vantagem tática concreta. Os pontos de estrangulamento são criados dinamicamente pelo anel, o que muda a leitura a cada partida.<br><br>A Respawn atualiza mapas em vez de apenas trocá-los, reformando setores inteiros entre temporadas — o que mantém a rejogabilidade alta. O peso do conhecimento de mapa é grande no competitivo (rotações de anel são pré-planejadas por times profissionais) e moderado no casual.',
  destaques:[
    {nome:'World\'s Edge',txt:'O mapa mais equilibrado do rodízio competitivo: terreno variado, rotas verticais claras e zonas de alto valor bem distribuídas.'},
    {nome:'Storm Point',txt:'O maior do pool, com foco em deslocamento longo e eventos de PvE. Divide opiniões pela distância entre zonas de combate.'},
    {nome:'Olympus',txt:'O mais aberto e o mais favorável a lendas de mobilidade. Rotação rápida e combates de longa distância.'},
    {nome:'Kings Canyon',txt:'O mapa original, o menor e o mais agressivo. Reformado várias vezes; é onde o combate acontece mais cedo.'}
  ],
  notas:[['Quantidade',7.0],['Qualidade',8.0],['Variedade',7.5],['Design',8.0],['Verticalidade',9.0],['Qualidade das rotas',9.0],['Balanceamento de lados',7.0],['Rejogabilidade',7.5],['Peso do conhecimento de mapa',7.5]]
},
competitivo:{
  classificacao:'Competitivo',
  texto:'Existe ranqueado com sistema de pontos que combina colocação e abates, e a Respawn já reformou esse sistema várias vezes — sinal de que nunca encontrou um equilíbrio consensual entre premiar sobrevivência e premiar agressividade.<br><br>O cenário profissional (ALGS) é sólido e tem produção de qualidade, mas sofre do problema estrutural de todo battle royale competitivo: <strong>20 times num mapa não produzem uma narrativa tão clara quanto 2 times num mapa</strong>. É emocionante e difícil de acompanhar ao mesmo tempo.<br><br>Os problemas de integridade são reais: cheating em PC é frequente em ranqueadas altas, e a ALGS já teve incidentes de invasão em partida ao vivo. O anticheat não está no nível do Vanguard.',
  notas:[['Ranking',6.5],['Matchmaking',6.5],['Sistema competitivo',7.0],['Esports',7.5],['Cenário profissional',7.5],['Skill gap',9.5],['Qualidade das ranqueadas',6.0],['Integridade competitiva',5.0],['Controle de smurfs',5.0],['Controle de cheaters',4.5],['Ambiente / toxicidade',6.0]],
  justificativa:'Competitivo. Skill gap altíssimo e cena profissional estruturada, mas o formato battle royale limita a repetibilidade competitiva e a integridade do ranked é fraca.'
},
experiencia:{
  iniciante:'Difícil. A curva de movimento é íngreme, o formato battle royale pune erro com uma espera longa, e você enfrenta jogadores com milhares de horas de deslize. O ping system e o preenchimento automático ajudam, mas não compensam.',
  intermediario:'Excelente. É o jogo com a evolução mais visível da base: cada técnica de movimento aprendida muda o que você consegue fazer numa luta. O progresso é palpável.',
  avancado:'Recompensa domínio técnico como poucos. Movimento avançado, controle de recuo e leitura de rotação de anel são camadas independentes que continuam rendendo indefinidamente.',
  competitivo:'Profundidade de sobra em mecânica. O limitador é o sistema ao redor — ranked instável e anticheat insuficiente.'
},
tecnico:{
  texto:'O ponto mais criticado de Apex há anos é o <strong>tick rate de servidor</strong>: a Respawn opera servidores de tick baixo (historicamente 20 Hz), o que a comunidade competitiva cobra desde 2019 num jogo com movimento tão rápido. É provavelmente a maior contradição técnica do gênero: o FPS com o movimento mais veloz roda no servidor mais lento entre os grandes.<br><br>Performance em PC é boa (motor Source modificado escala bem), mas o jogo tem histórico de problemas de estabilidade em eventos e de audio bugs. A EA implantou anticheat de nível kernel em 2024 após incidentes públicos.',
  itens:[['FPS','Bom — escala bem em hardware modesto'],['Otimização','Boa no cliente'],['Input lag','Aceitável'],['Netcode','Ponto fraco histórico: tick de servidor baixo é a crítica competitiva central'],['Tick rate','Historicamente 20 Hz nos servidores — a Respawn nunca elevou para o padrão de 60/128 Hz dos concorrentes táticos'],['Estabilidade','Mediana; picos de problema em eventos e lançamentos de temporada'],['Escalabilidade','Boa']],
  semDados:'A EA não publica métricas atuais de detecção de cheating nem confirmação oficial pública do tick rate atual por região.',
  notas:[['FPS',8.0],['Otimização',8.0],['Input lag',7.5],['Netcode',5.0],['Estabilidade',6.5],['Escalabilidade gráfica',8.0]]
},
av:{
  texto:'Direção de arte colorida e legível, com silhuetas de lenda distintas — você identifica quem é o inimigo pela forma, o que é bom design competitivo. A qualidade técnica é modesta para 2026 (o motor é antigo), mas a consistência visual compensa.<br><br>O áudio é o maior problema técnico do jogo, e não é opinião: <strong>bugs de áudio</strong> — passos que não tocam, inimigos inaudíveis dentro de prédios — são a queixa mais antiga e persistente da comunidade, atravessando temporadas e correções sucessivas. Num jogo de esquadrão em espaços fechados, isso é grave.',
  impacto:'Visualmente favorecem a competitividade (silhuetas legíveis, cores distintas). O áudio a prejudica de forma concreta e reconhecida.',
  notas:[['Qualidade visual',7.5],['Animações',8.5],['Iluminação',7.0],['Texturas',7.0],['Design visual',8.5],['Clareza do inimigo',8.0],['Som dos disparos',8.5],['Passos (footsteps)',4.5],['Direcionalidade',5.5],['Mixagem',6.0]]
},
progressao:{
  texto:'Passe de batalha por temporada, eventos com cosméticos de tempo limitado e uma loja de heirlooms (cosméticos raros de altíssimo valor). Não há pay-to-win — nada comprado altera dano, recuo ou mobilidade.<br><br>O problema é histórico e documentado: em meados de 2024 a Respawn passou a cobrar <strong>dois passes de batalha por temporada</strong>, decisão que gerou reação intensa e cuja janela coincide com quedas mais acentuadas de população e de receita. A EA orientou expectativa de queda de aproximadamente 40% nas net bookings de Apex no ano fiscal de 2025.<br><br>Desde então a Respawn corrigiu o rumo em conteúdo — balanceamento mais frequente, modos Wild Card, atualizações de mapa — e a curva estabilizou.',
  classe:'Predatória',
  classeTxt:'Predatória, com atenuantes recentes. Eventos com cosméticos de preço muito alto, heirlooms atrás de sistema de sorte, e a decisão dos dois passes por temporada em 2024 marcam um histórico de monetização agressiva sobre uma base fiel. Zero pay-to-win é o que impede a classificação de ser pior.',
  p2w:'Nenhum. Todos os itens pagos são cosméticos.',
  notas:[['Progressão',6.5],['Battle Pass',5.0],['Skins (qualidade)',8.0],['Recompensas gratuitas',5.5],['Conteúdo sazonal',7.5],['Frequência de atualização',7.5],['Monetização (justiça)',4.0],['Ausência de pay-to-win',10.0]]
},
problemas:[
  {tipo:'fato',t:'Queda severa de população em 2024',p:'Verificável: os simultâneos no Steam caíram de 470.696 em fevereiro/2024 para 140.830 em dezembro/2024 — cerca de 70% de perda. A janela coincide com a introdução dos dois passes de batalha por temporada.'},
  {tipo:'fato',t:'Queda de receita reconhecida pela publisher',p:'A EA orientou expectativa de queda de aproximadamente 40% nas net bookings de Apex no ano fiscal de 2025. É orientação oficial da publisher, não estimativa de terceiros.'},
  {tipo:'fato',t:'Tick rate de servidor baixo',p:'Historicamente 20 Hz, muito abaixo dos 128 Hz do Valorant, num jogo cujo diferencial é velocidade de movimento. Cobrado pela comunidade competitiva desde o lançamento.'},
  {tipo:'reclamacao',t:'Bugs de áudio',p:'A reclamação mais persistente da comunidade: passos ausentes ou inconsistentes. Atravessa temporadas e correções; a Respawn reconhece e corrige parcialmente a cada ciclo.'},
  {tipo:'reclamacao',t:'Cheating em ranqueadas altas',p:'Amplamente relatado em PC, com incidentes públicos inclusive em partidas da ALGS. A EA respondeu com anticheat de kernel; a percepção de melhora é parcial.'},
  {tipo:'opiniao',t:'"O jogo ficou lento demais / rápido demais"',p:'Debate permanente sobre TTK e valores de escudo. Cada ajuste divide a base; é preferência de ritmo, não um erro objetivo.'}
],
fortes:[
  'O melhor sistema de movimento de qualquer FPS — teto de habilidade praticamente ilimitado.',
  'Gunplay excepcional para o formato, com armas de identidade forte e recuo aprendível.',
  'O sistema de ping, inventado aqui e depois copiado por todo o gênero.',
  'Design de lendas com habilidades que criam papéis reais sem transformar o jogo em hero shooter.',
  'Meta que realmente muda entre temporadas, com balanceamento agressivo e frequente.'
],
fracos:[
  'Tick rate de servidor baixo — contradição direta com a velocidade do jogo.',
  'Bugs de áudio crônicos que afetam informação tática essencial.',
  'Histórico de monetização agressiva, com os dois passes por temporada como ponto de ruptura.',
  'Cheating relevante em PC, com anticheat que chegou tarde.',
  'Barreira de entrada alta demais para novatos em 2026: a base restante é composta de veteranos.'
],
concorrentes:['bo7','finals','arc','ow'],
vale:{
  veredito:'Sim, com ressalvas',
  texto:'Vale se você quer o mais alto teto mecânico dentro de um battle royale e não se importa de entrar num jogo com sete anos de veteranos. É gratuito, então o custo de testar é zero. A ressalva é dupla: a curva de entrada em 2026 é brutal e o histórico comercial da EA com o jogo é ruim.',
  perfis:[
    ['Casual','Com ressalvas. O modo Mixtape dá partidas rápidas sem o peso do battle royale, mas o jogo principal pune casual com força.'],
    ['Competitivo','Sim, com ressalvas. Skill gap enorme; o problema é a integridade do ranked e o tick rate.'],
    ['Solo','Com ressalvas. Preenchimento automático funciona graças ao ping system, mas trio de estranhos é a pior forma de jogar.'],
    ['Com amigos','Excelente. Trio fixo é a forma pretendida e transforma completamente a experiência.'],
    ['Foco em ranking','Com ressalvas. O sistema já foi reformado várias vezes e a comunidade nunca ficou satisfeita.'],
    ['Foco em esports','Sim. A ALGS tem produção forte, mas o formato de battle royale é intrinsecamente mais difícil de acompanhar.']
  ]
},
veredito:{
  melhor:'O movimento. Nenhum FPS chegou perto do que a Respawn construiu aqui.',
  problema:'Tick rate de 20 Hz num jogo cuja identidade é velocidade.',
  diferencial:'Movimento avançado somado a habilidades de lenda e ao sistema de ping.',
  risco:'A EA priorizar extração de receita de uma base fiel e encolhida em vez de crescimento.',
  perfil:'Jogador mecânico que quer teto alto e joga com um trio fixo.',
  vale2026:'Sim, com ressalvas',
  conclusao:'Apex continua sendo o battle royale mais bem desenhado que existe e um dos FPS com maior teto mecânico de qualquer gênero. O que aconteceu com ele é um caso de estudo em como monetização agressiva corrói um produto excelente: a Respawn construiu algo raro e a EA passou anos cobrando caro demais por isso. O jogo se estabilizou e voltou a receber atenção — mas a base que perdeu não volta.'
},
dados:[
  {l:'Média de simultâneos no Steam',v:'~123.370 nos últimos 30 dias (queda de 2,7% vs. período anterior)',f:'activeplayer.io',u:'https://activeplayer.io/apex-legends/'},
  {l:'Queda de 2024',v:'De 470.696 simultâneos no Steam (fevereiro/2024) para 140.830 (dezembro/2024) — cerca de 70% de perda',f:'Steam Charts / agregadores',u:'https://pley.gg/apex-legends/apex-legends-player-count/'},
  {l:'Base total',v:'Estimativas de terceiros apontam 20 a 22 milhões de jogadores ativos mensais em todas as plataformas no início de 2026',f:'SQ Magazine / Quantumrun',u:'https://sqmagazine.co.uk/apex-legends-statistics/'},
  {l:'Receita',v:'A EA orientou queda de aproximadamente 40% nas net bookings de Apex no ano fiscal de 2025',f:'Orientação da EA',u:'https://www.quantumrun.com/consulting/apex-legends/'},
  {l:'Divergência entre fontes',v:'Números de "ativos mensais" são estimativas de agregadores; a EA não publica MAU de Apex de forma isolada e auditável.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= OVERWATCH ======================= */
GAMES.push({
id:'ow', nome:'Overwatch', cor:'#f99e1a', tipo:'Hero Shooter', tags:['Hero shooter','5v5','Objetivo'],
pitch:'O hero shooter que definiu o subgênero, relançado em 2026 tentando apagar a memória do "2".',
notaGeral:7.6,
scores:{gameplay:8.5,mira:7.8,mapas:7.5,competitivo:6.8,graficos:8.5,performance:8.6,conteudo:8.2,comunidade:4.8,monetizacao:6.0},
visao:{
  completo:'Overwatch (rebatizado a partir de Overwatch 2 na atualização "Reign of Talon", fevereiro de 2026)',
  dev:'Blizzard Entertainment', publisher:'Blizzard Entertainment (Microsoft)',
  ano:'2016 (Overwatch); 2022 (Overwatch 2); rebranding em 2026',
  plataformas:'PC, PlayStation, Xbox, Nintendo Switch',
  engine:'Motor proprietário da Blizzard',
  modelo:'Free-to-play, com passe de batalha e loja de cosméticos',
  modos:'Rápida, Competitiva, Arcade, Rivalidade Estádio, modos sazonais',
  perfil:'Hero shooter 5v5 baseado em objetivo, com heróis de papéis fixos (dano, tanque, suporte).',
  publico:'Público amplo, mais casual que o dos FPS táticos, com forte apelo estético e narrativo.',
  situacao:'Em reposicionamento. A Blizzard removeu o "2" do nome, prometeu 10 heróis novos no ano e entregou 5 de uma vez — uma aposta de volume para recuperar relevância.'
},
resumoNota:'7,6 porque continua sendo o hero shooter mais bem produzido e mais legível do mercado, com performance excelente e um dos melhores designs de personagem de qualquer jogo. Perde no competitivo instável, na comunidade hostil e num histórico de promessas não cumpridas que o rebranding tenta enterrar.',
gameplay:{
  texto:'Overwatch não é um jogo de mira — é um jogo de <strong>composição, contra-escolha e uso de ultimate</strong>. O tiro existe e importa (Cassidy, Widowmaker e Ashe são heróis de pontaria pura), mas boa parte do elenco resolve duelos com habilidade, mobilidade ou cura, não com precisão.<br><br>O formato 5v5 (um tanque em vez de dois) acelerou o jogo e reduziu o "escudo empurrando escudo" que travava o Overwatch 1, mas concentrou uma pressão enorme sobre o tanque solo — o papel mais criticado do jogo desde 2022. O TTK varia radicalmente por herói: alguns matam em fração de segundo, outros exigem sequências longas.<br><br>A atualização Reign of Talon reposicionou o jogo com cinco heróis de uma vez e um compromisso de dez no ano — uma escala de conteúdo que o jogo nunca teve, e que traz risco óbvio de balanceamento.',
  notas:[['Velocidade das partidas',8.0],['Fluidez',9.0],['Tiro',7.5],['Recuo (qualidade do modelo)',6.5],['Movimento',8.5],['Precisão',7.5],['Peso da mira',7.0],['Peso da estratégia',9.0],['Peso do posicionamento',9.0]],
  ttk:'Muito variável por herói. Não existe um TTK do jogo — existe o TTK de cada confronto, o que é a característica definidora do subgênero.',
  curva:'Fácil de começar, difícil de dominar. O obstáculo não é mecânico, é conhecer o elenco inteiro e entender contra-escolhas.',
  skillGap:'Alto em heróis de mira, moderado no resto. O skill gap real está em decisão: quando usar ultimate, quando trocar de herói, quando agrupar.',
  dificuldade:'Médio. Acessível para entrar, exigente para subir de faixa.'
},
armas:{
  texto:'Não há armas separadas dos heróis — <strong>o herói é a arma</strong>. Isso torna a diferenciação a mais alta possível: nenhum personagem atira como outro, e cada um tem recuo, alcance efetivo e cadência próprios, sem personalização nenhuma.<br><br>Não há attachments, loadouts ou modificações. Isso elimina completamente a possibilidade de vantagem por progressão e mantém todos os jogadores no mesmo patamar de ferramentas.<br><br>O custo é que "balanceamento de armas" e "balanceamento de personagens" são a mesma coisa, e com um elenco que cresceu para dezenas de heróis — mais dez apenas em 2026 — o espaço de balanceamento ficou muito difícil de administrar.',
  meta:'Definida por composição, não por arma. Cada patch gera um conjunto de heróis obrigatórios por faixa de elo, e a Blizzard ajusta com frequência.',
  dominante:true,
  dominanteTxt:'Sim, e é o problema estrutural do subgênero: a meta de heróis se estreita rapidamente após cada patch, e em elos altos jogar fora dela é uma desvantagem concreta. Com a adição de 10 heróis em um ano, o risco de meta instável é o maior da história do jogo.',
  notas:[['Variedade',9.5],['Balanceamento',6.5],['Diferenciação entre armas',9.8],['Personalização',1.0],['Qualidade do recuo',6.5],['Distância efetiva bem definida',8.5],['Viabilidade das categorias',6.5]]
},
mapas:{
  texto:'Mapas construídos em torno de tipos de objetivo (escolta, controle, empurrão, disputa). São compactos, bem sinalizados e muito legíveis — a Blizzard é excelente em comunicar visualmente para onde ir e onde está o perigo.<br><br>Verticalidade é alta e essencial: heróis de mobilidade usam telhados e plataformas como camada tática própria. Pontos de estrangulamento são o coração do design — e também a crítica mais antiga, já que alguns mapas criam funis onde o time defensor tem vantagem estrutural muito grande.<br><br>Balanceamento entre lados é acompanhado por modo: mapas de escolta historicamente favorecem um dos lados no primeiro ponto, e a Blizzard reformou mapas por essa razão.',
  destaques:[
    {nome:'King\'s Row',txt:'O mapa mais icônico e um dos mais equilibrados. Combina disputa inicial com escolta e tem verticalidade bem distribuída.'},
    {nome:'Lijiang Tower',txt:'Mapa de controle em três arenas distintas — o formato mais limpo competitivamente, sem vantagem de lado.'},
    {nome:'Mapas de Empurrão',txt:'Formato mais recente, simétrico por natureza, criado justamente para resolver o problema de balanceamento entre atacante e defensor.'},
    {nome:'Hanamura / Anubis (Assalto)',txt:'O modo de dois pontos foi removido da rotação competitiva justamente por desequilíbrio estrutural entre lados — um reconhecimento explícito do problema.'}
  ],
  notas:[['Quantidade',8.0],['Qualidade',8.0],['Variedade',8.5],['Design',8.0],['Verticalidade',8.5],['Qualidade das rotas',7.5],['Balanceamento de lados',7.0],['Rejogabilidade',7.5],['Peso do conhecimento de mapa',7.0]]
},
competitivo:{
  classificacao:'Competitivo',
  texto:'Existe ranqueado com divisões e um histórico competitivo real, mas o sistema é o mais instável da base: a Blizzard já reformulou o competitivo várias vezes, mudou como o rating é exibido, e a comunidade nunca considerou o resultado transparente.<br><br>O maior problema estrutural é o <strong>papel de tanque solo no 5v5</strong>: um jogador ruim ou mal-encaixado nessa posição decide a partida sozinho, o que gera frustração e toxicidade concentrada. Some-se as filas por função com tempos de espera desiguais.<br><br>Os esports passaram por uma transformação difícil: a Overwatch League franqueada foi encerrada e substituída por um circuito operado de forma diferente, com escala menor. O cenário existe, mas perdeu o status que teve em 2018-2019.<br><br>Cheating é um problema menor que em CS2 ou Warzone; toxicidade e comportamento em fila são o ponto crítico da comunidade.',
  notas:[['Ranking',6.5],['Matchmaking',6.5],['Sistema competitivo',6.5],['Esports',6.0],['Cenário profissional',6.0],['Skill gap',7.5],['Qualidade das ranqueadas',6.0],['Integridade competitiva',7.5],['Controle de smurfs',5.5],['Controle de cheaters',7.5],['Ambiente / toxicidade',3.5]],
  justificativa:'Competitivo. Tem ranqueado sério e história de esports, mas a instabilidade do sistema, o encolhimento da cena profissional e a dependência de composição limitam a profundidade competitiva mensurável.'
},
experiencia:{
  iniciante:'Fácil e agradável. Heróis simples (Soldier: 76, Reinhardt, Mercy) dão contribuição imediata, os objetivos são claros e o jogo não exige pontaria excepcional para ser útil. É o hero shooter mais acessível.',
  intermediario:'Espaço claro: aprender um segundo e terceiro herói, entender contra-escolhas e aprender a coordenar ultimates são objetivos concretos com retorno visível.',
  avancado:'Recompensa domínio, mas de forma limitada em elos altos, onde o resultado depende fortemente do encaixe da composição e do desempenho do tanque solo. O impacto individual é menor que em CS2 ou Apex.',
  competitivo:'Existe profundidade suficiente, mas a instabilidade do sistema competitivo e do cenário profissional torna difícil levar o jogo a sério a longo prazo.'
},
tecnico:{
  texto:'Tecnicamente muito sólido. O motor da Blizzard entrega estilo visual rico com desempenho alto mesmo em hardware modesto — está entre os melhores da base em otimização, atrás apenas de Valorant.<br><br>Netcode é bom para o formato, com hitreg consistente e favor do atirador bem calibrado. Estabilidade é boa. Historicamente o jogo teve problemas em janelas de lançamento de temporada, mas não como padrão.',
  itens:[['FPS','Alto em quase qualquer hardware moderno'],['Otimização','Excelente — entre as melhores da base'],['Input lag','Baixo'],['Netcode','Bom; hitreg consistente e sem queixas estruturais graves'],['Tick rate','Sem publicação oficial atual e clara da Blizzard'],['Estabilidade','Boa'],['Escalabilidade','Excelente — do notebook ao PC de topo, além de consoles']],
  semDados:'A Blizzard não publica tick rate atual nem métricas de latência por região.',
  notas:[['FPS',9.0],['Otimização',9.0],['Input lag',8.5],['Netcode',8.5],['Estabilidade',8.5],['Escalabilidade gráfica',9.0]]
},
av:{
  texto:'A melhor direção de arte da base. Estilo estilizado, colorido, com silhuetas de herói absolutamente distintas — você identifica quem está na sua frente pela forma, à distância, no meio do caos. Isso é design competitivo de altíssimo nível disfarçado de estética casual.<br><br>O áudio é igualmente exemplar em função: cada ultimate tem uma frase falada distinta e audível para inimigos e aliados, cada herói tem um som de passo próprio, e a mixagem prioriza informação sobre espetáculo. É o melhor uso de áudio como sistema de comunicação de qualquer FPS da lista.<br><br>O ponto de atrito é a poluição em lutas de time com muitos efeitos simultâneos.',
  impacto:'Favorecem fortemente a competitividade. Overwatch prova que estilo colorido e legibilidade não são opostos — o oposto do que Call of Duty faz com suas skins.',
  notas:[['Qualidade visual',8.5],['Animações',9.0],['Iluminação',8.0],['Texturas',8.0],['Design visual',9.5],['Clareza do inimigo',9.0],['Som dos disparos',8.0],['Passos (footsteps)',8.5],['Direcionalidade',8.5],['Mixagem',9.0]]
},
progressao:{
  texto:'Passe de batalha por temporada com trilha gratuita e paga, loja rotativa de skins e desafios semanais. Heróis novos ficaram atrás do passe por um período no início do Overwatch 2 — decisão amplamente criticada — e a Blizzard recuou, liberando heróis para todos.<br><br>Não há pay-to-win. A crítica principal não é de preço isolado, é de <strong>contexto</strong>: o Overwatch 2 foi vendido como sequência com modo PvE, o PvE foi cancelado, e o jogo se tornou free-to-play com loja. A comunidade nunca perdoou essa sequência de eventos, e o rebranding de 2026 é a tentativa de virar a página.',
  classe:'Aceitável',
  classeTxt:'Aceitável. Free-to-play com heróis liberados, passe com trilha gratuita real e zero vantagem paga. O que impede uma classificação melhor é o histórico: um PvE cancelado que justificava a existência do "2", e skins de preço alto num jogo cuja proposta original era conteúdo cosmético via caixas gratuitas.',
  p2w:'Nenhum. Todos os heróis são gratuitos e nenhum item pago afeta jogabilidade.',
  notas:[['Progressão',7.0],['Battle Pass',7.5],['Skins (qualidade)',9.0],['Recompensas gratuitas',6.5],['Conteúdo sazonal',8.5],['Frequência de atualização',8.5],['Monetização (justiça)',6.0],['Ausência de pay-to-win',10.0]]
},
problemas:[
  {tipo:'fato',t:'Cancelamento do modo PvE',p:'A Blizzard cancelou o modo história cooperativo que era a principal justificativa declarada para a existência de Overwatch 2. É fato admitido publicamente e a origem da maior parte da desconfiança da base.'},
  {tipo:'fato',t:'Reestruturação do cenário profissional',p:'A Overwatch League franqueada foi encerrada e substituída por um circuito de escala menor. Fato verificável; representa uma redução real do patamar competitivo que o jogo teve em 2018-2019.'},
  {tipo:'fato',t:'Volatilidade de população em 2026',p:'Levantamentos de agregadores apontam agosto/2026 estimado em 6,0 a 9,0 milhões de jogadores, uma queda de 32,4% em relação a julho/2026, depois de um pico de 18,97 milhões em dezembro/2025. São estimativas de terceiros, não dados da Blizzard.'},
  {tipo:'reclamacao',t:'O tanque solo no formato 5v5',p:'Queixa constante desde 2022: um único tanque carrega pressão desproporcional e define partidas sozinho. A Blizzard fez ajustes sucessivos; a insatisfação persiste.'},
  {tipo:'reclamacao',t:'Toxicidade e comportamento em fila',p:'Reclamação recorrente e antiga, agravada pela dependência de composição — a culpa é sempre atribuível a alguém. Sistemas de reporte existem; a percepção de melhora é limitada.'},
  {tipo:'opiniao',t:'"O rebranding é só marketing"',p:'Leitura comum de que remover o "2" não resolve nada. É interpretação — a atualização entregou cinco heróis de uma vez e um compromisso de dez no ano, o que é conteúdo real independente do nome.'}
],
fortes:[
  'Design de personagem e direção de arte de primeira linha: legibilidade excepcional dentro de um estilo colorido.',
  'Áudio como sistema de informação — frases de ultimate e passos distintos por herói.',
  'Otimização excelente, entre as melhores da base, com boa escalabilidade.',
  'Todos os heróis gratuitos e zero vantagem comprável.',
  'Ritmo de conteúdo elevado em 2026: cinco heróis de uma vez e compromisso de dez no ano.'
],
fracos:[
  'Sistema competitivo instável, reformado várias vezes sem consenso da comunidade.',
  'Tanque solo no 5v5 concentra pressão e frustração — problema não resolvido desde 2022.',
  'Cenário profissional encolhido após o fim da Overwatch League franqueada.',
  'Comunidade entre as mais tóxicas da base, agravada pela dependência de composição.',
  'Adicionar dez heróis em um ano é um risco enorme de meta instável e balanceamento perdido.'
],
concorrentes:['valorant','apex','finals','r6'],
vale:{
  veredito:'Sim',
  texto:'Vale. É gratuito, roda em qualquer coisa, tem a melhor produção artística do gênero e está no melhor ritmo de conteúdo de sua história. Se você quer um FPS de time onde pontaria não é o único caminho para contribuir, é a melhor porta de entrada que existe.',
  perfis:[
    ['Casual','Sim, é onde o jogo mais brilha. Partidas rápidas, heróis fáceis e progressão amigável.'],
    ['Competitivo','Com ressalvas. Existe ranqueado sério, mas o sistema é instável e o impacto individual é limitado.'],
    ['Solo','Com ressalvas. Funciona, mas depender de estranhos para composição é a maior fonte de frustração do jogo.'],
    ['Com amigos','Excelente. Um grupo coordenado de cinco com composição planejada é a melhor experiência disponível.'],
    ['Foco em ranking','Com ressalvas. O sistema muda com frequência demais para dar sensação de progresso estável.'],
    ['Foco em esports','Com ressalvas. A cena existe, mas está muito abaixo do que já foi e do que CS2 e Valorant oferecem hoje.']
  ]
},
veredito:{
  melhor:'Design de heróis e legibilidade — arte a serviço da clareza competitiva.',
  problema:'O tanque solo no 5v5 e um sistema competitivo que nunca se estabilizou.',
  diferencial:'Personagens com identidade mecânica e sonora que nenhum concorrente iguala.',
  risco:'Dez heróis novos em um ano quebrarem o balanceamento de forma irreversível.',
  perfil:'Jogador de time que quer contribuir por função e não apenas por pontaria.',
  vale2026:'Sim',
  conclusao:'Overwatch continua sendo o melhor hero shooter já feito, e o rebranding de 2026 é uma admissão honesta de que o "2" foi um erro de posicionamento — cobrou uma sequência e entregou uma atualização com loja. O jogo em si nunca foi o problema: arte, som e design de personagem seguem imbatíveis. O que falta é estabilidade — no competitivo, no cenário e agora no balanceamento, com dez heróis chegando num único ano. É excelente para jogar e difícil de levar a sério por muito tempo.'
},
dados:[
  {l:'Rebranding',v:'Atualização "Reign of Talon" (fevereiro/2026): o jogo voltou a se chamar Overwatch, com posicionamento de "forever game", cinco heróis lançados de uma vez e compromisso de dez heróis no ano',f:'Cobertura especializada',u:'https://rolldeepcrew.com/is-overwatch-still-popular-in-2026-the-complete-player-count-and-community-analysis/'},
  {l:'Ativos mensais',v:'Entre 13,1 e 18,97 milhões de maio/2025 a junho/2026, com pico em dezembro/2025 (18,97 milhões)',f:'activeplayer.io',u:'https://activeplayer.io/overwatch-2/'},
  {l:'Agosto/2026',v:'Estimativa de 6,0 a 9,0 milhões de jogadores — queda de 32,4% em relação a julho/2026',f:'activeplayer.io',u:'https://activeplayer.io/overwatch-2/'},
  {l:'Divergência entre fontes',v:'A Blizzard não publica MAU oficial. Todos os números acima são estimativas de agregadores, com metodologias diferentes e variação alta entre eles — trate como ordem de grandeza, não como medida.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= THE FINALS ======================= */
GAMES.push({
id:'finals', nome:'The Finals', cor:'#d31f3c', tipo:'Arena', tags:['Destruição total','Objetivo','3v3v3'],
pitch:'A destruição mais avançada de qualquer FPS, num jogo que quase ninguém está jogando.',
notaGeral:8.0,
scores:{gameplay:9.0,mira:8.2,mapas:8.5,competitivo:6.0,graficos:8.8,performance:7.5,conteudo:7.5,comunidade:7.5,monetizacao:8.0},
visao:{
  completo:'THE FINALS', dev:'Embark Studios', publisher:'Nexon', ano:'Dezembro de 2023',
  plataformas:'PC, PlayStation 5, Xbox Series X|S',
  engine:'Unreal Engine 5, com sistema proprietário de destruição',
  modelo:'Free-to-play, com passe de batalha e cosméticos',
  modos:'Torneio (ranqueado), Quick Cash, Power Shift, World Tour, modos de temporada',
  perfil:'Arena por equipes em formato de game show, com destruição total do cenário e classes por porte físico.',
  publico:'Jogador que quer criatividade mecânica e caos controlado, com viés de PC.',
  situacao:'Saudável em qualidade e frágil em escala. A Temporada 11 ("Galaxy Masters") levou o jogo ao maior pico de jogadores em dez meses.'
},
resumoNota:'8,0 pela ambição técnica genuinamente inédita — destruição total, servidores que processam o colapso de prédios inteiros — e por uma monetização honesta num mercado que perdeu o hábito. A nota é limitada pela população pequena, que compromete matchmaking e viabilidade competitiva.',
gameplay:{
  texto:'The Finals é o FPS mais criativo em atividade. O jogo é 3v3v3 (ou 5v5 em alguns modos) em torno de caixas-forte e depósito de dinheiro, e <strong>o mapa inteiro é destrutível</strong> — não paredes selecionadas como no Battlefield, o prédio inteiro. Você pode explodir o piso sob o time inimigo e derrubá-los com o objetivo três andares abaixo.<br><br>As classes são por porte: Leve (rápido, frágil, com gancho e invisibilidade), Médio (equilibrado, com cura e torre) e Pesado (lento, resistente, com escudo e explosivos). Cada uma joga de forma radicalmente diferente, e as ferramentas são de manipulação de ambiente — espuma que constrói cobertura, cordas, plataformas, cargas de demolição.<br><br>O TTK é médio, com foco em pressão sustentada e reanimação. A física é o núcleo: dinheiro cai, objetos voam, e uma decisão física bem tomada vale mais que um duelo ganho.',
  notas:[['Velocidade das partidas',8.5],['Fluidez',9.0],['Tiro',8.5],['Recuo (qualidade do modelo)',8.0],['Movimento',9.0],['Precisão',8.0],['Peso da mira',7.5],['Peso da estratégia',8.5],['Peso do posicionamento',9.0]],
  ttk:'Médio. Trocas duram o suficiente para reagir, recuar e ser resgatado — mas a queda de um prédio mata instantaneamente.',
  curva:'Média. Fácil de entender, difícil de pensar em três dimensões destrutíveis. O salto de habilidade está em usar o ambiente, não em mirar.',
  skillGap:'Alto e incomum: a diferença entre jogadores está mais em criatividade tática e uso de física do que em pontaria.',
  dificuldade:'Médio. Acolhedor para entrar, com teto alto e pouco convencional.'
},
armas:{
  texto:'Arsenal médio, distribuído por classe — cada porte tem seu conjunto próprio, e trocar de arma implica trocar de estilo. A diferenciação é boa e as armas têm identidade clara, embora o recuo seja menos técnico que o de CS2 ou Apex.<br><br>A personalização é mínima em termos mecânicos: você escolhe arma, dispositivos e especialização, sem attachments que alterem valores. Isso mantém o jogo limpo e legível — o que você vê é o que o inimigo tem.<br><br>A meta muda com frequência a cada temporada, e a Embark tem histórico de ajustes rápidos. Existem armas dominantes por temporada, mas a variedade efetiva é maior que a de CoD ou Battlefield porque o gadget importa tanto quanto a arma.',
  meta:'Rotativa por temporada. O que define a meta são as combinações de classe e dispositivo, não apenas a arma — o que amplia a variedade real.',
  dominante:false,
  dominanteTxt:'Não de forma sufocante. Existem escolhas fortes por temporada, mas o peso dos dispositivos e da composição de trio mantém o espaço de escolha aberto — é um dos jogos mais saudáveis da base nesse quesito.',
  notas:[['Variedade',7.5],['Balanceamento',7.5],['Diferenciação entre armas',8.0],['Personalização',5.0],['Qualidade do recuo',8.0],['Distância efetiva bem definida',8.0],['Viabilidade das categorias',8.0]]
},
mapas:{
  texto:'Mapas urbanos verticais desenhados para serem demolidos. A rejogabilidade é a mais alta da base por uma razão simples: <strong>o mapa nunca é o mesmo duas vezes</strong>, porque cada partida o reescreve fisicamente. Uma rota do início da partida pode não existir no fim.<br><br>Verticalidade é altíssima e essencial — arranha-céus com dezenas de andares utilizáveis. Os pontos de estrangulamento são temporários por natureza: você cria e destrói funis com espuma, plataformas e explosivos.<br><br>Balanceamento entre times é naturalmente cuidado pelo formato de três equipes, que evita o problema clássico de vantagem de lado. O conhecimento de mapa importa menos que em jogos táticos justamente porque a geometria é instável — o que se aprende são princípios, não posições.',
  destaques:[
    {nome:'Las Vegas / Monaco',txt:'Mapas urbanos densos com verticalidade extrema — o melhor palco para a destruição funcionar como mecânica.'},
    {nome:'Seoul / Kyoto',txt:'Mapas mais recentes, com combinação de estruturas frágeis e núcleos resistentes que criam decisões de demolição mais interessantes.'},
    {nome:'Formato 3v3v3',txt:'A escolha de design mais inteligente do jogo: com três times, não existe vantagem de lado, e o terceiro time é sempre uma variável tática.'}
  ],
  notas:[['Quantidade',7.0],['Qualidade',8.5],['Variedade',8.0],['Design',8.5],['Verticalidade',9.5],['Qualidade das rotas',8.0],['Balanceamento de lados',9.0],['Rejogabilidade',9.8],['Peso do conhecimento de mapa',6.5]]
},
competitivo:{
  classificacao:'Competitivo',
  texto:'Existe estrutura competitiva — modo Torneio com formato eliminatório, ranqueado e World Tour — e o formato é genuinamente interessante para assistir. A Embark investiu em ferramentas de espectador e em eventos.<br><br>O obstáculo é a <strong>população</strong>. Com médias mensais oscilando entre 7 mil e 18 mil simultâneos no Steam ao longo do último ano, a base é pequena demais para sustentar um matchmaking competitivo de qualidade em faixas altas e horários fora de pico. Nenhuma quantidade de bom design compensa falta de gente na fila.<br><br>Cheating existe, mas em escala muito menor que em CS2 ou Warzone, e a comunidade é notavelmente menos tóxica que a média do gênero — provavelmente porque o formato de três times reduz o alvo de culpa individual.',
  notas:[['Ranking',6.5],['Matchmaking',5.0],['Sistema competitivo',7.0],['Esports',4.5],['Cenário profissional',4.0],['Skill gap',8.5],['Qualidade das ranqueadas',5.5],['Integridade competitiva',7.0],['Controle de smurfs',6.5],['Controle de cheaters',7.0],['Ambiente / toxicidade',8.0]],
  justificativa:'Competitivo, com limitação de escala. O design suporta competição séria e o skill gap é alto, mas sem população não há cena, e sem cena não há competitivo de verdade.'
},
experiencia:{
  iniciante:'Muito bom. O jogo explica bem, as classes são intuitivas, e a comunidade é a mais receptiva da base. Você se diverte com destruição mesmo perdendo.',
  intermediario:'Espaço claro e incomum: você evolui aprendendo o que o ambiente permite, não decorando ângulos. É uma progressão criativa em vez de mecânica.',
  avancado:'Recompensa domínio técnico de forma diferente do resto do gênero — o jogador avançado é o que resolve problemas espaciais rápido, não necessariamente o que mira melhor.',
  competitivo:'Profundidade suficiente no design, mas a população limita o quanto isso pode ser explorado seriamente.'
},
tecnico:{
  texto:'Tecnicamente ambicioso e caro: a destruição total é <strong>processada no servidor</strong> e replicada para todos os jogadores, o que é uma proeza real de engenharia de rede. O custo é performance — o jogo é exigente e apresenta quedas de FPS em momentos de destruição intensa, que é justamente quando você mais precisa de estabilidade.<br><br>Netcode é bom para o formato, e a Embark tem histórico de comunicação técnica aberta. Estabilidade é razoável.',
  itens:[['FPS','Bom em hardware moderno; quedas notáveis em cenas de destruição pesada'],['Otimização','Razoável para o que o jogo processa — o custo da destruição é real'],['Input lag','Aceitável'],['Netcode','Bom; destruição replicada com consistência surpreendente'],['Tick rate','Sem publicação oficial atual e clara da Embark'],['Estabilidade','Razoável'],['Escalabilidade','Média — o piso de hardware é alto pela simulação de física']],
  semDados:'A Embark não publica tick rate por região nem métricas de latência. Números que circulam em fóruns não têm confirmação.',
  notas:[['FPS',7.0],['Otimização',7.0],['Input lag',7.5],['Netcode',8.0],['Estabilidade',7.5],['Escalabilidade gráfica',7.0]]
},
av:{
  texto:'Estética de game show — colorida, exagerada, com apresentadores comentando a partida em tempo real. É uma das direções de arte mais originais do gênero e sustenta o tom sem prejudicar a leitura: silhuetas de classe são distintas por porte, o que resolve a clareza de forma elegante.<br><br>A destruição é o espetáculo visual: prédios desabam com física convincente, poeira se propaga, detritos ficam no mapa. O áudio acompanha — colapso estrutural tem som próprio e é informação tática real (você ouve o time inimigo demolindo o andar de baixo).<br><br>O custo: em momentos de destruição máxima, a poluição visual e sonora é a maior da base.',
  impacto:'Ambíguos, e conscientemente. A legibilidade base é boa (silhuetas por porte), mas o caos de destruição prejudica a leitura em picos de ação. É o preço explícito da proposta.',
  notas:[['Qualidade visual',9.0],['Animações',8.5],['Iluminação',9.0],['Texturas',8.5],['Design visual',9.5],['Clareza do inimigo',7.5],['Som dos disparos',8.5],['Passos (footsteps)',7.5],['Direcionalidade',8.0],['Mixagem',7.5]]
},
progressao:{
  texto:'Passe de batalha por temporada, cosméticos de loja e progressão de armas por uso. Nada afeta jogabilidade. As temporadas são substanciais — a Temporada 11 ("Galaxy Masters") foi descrita pela imprensa especializada como uma reformulação significativa do jogo, e levou o pico de jogadores ao maior patamar em dez meses.<br><br>A monetização é das mais honestas do mercado atual: preços moderados, passe com valor real, sem mecânicas de escassez agressiva e sem caixa aleatória paga. A Embark também tem histórico de devolver ou ajustar decisões impopulares rapidamente.',
  classe:'Boa',
  classeTxt:'Boa. Free-to-play sem vantagem paga, passe de preço justo, loja sem pressão de escassez artificial e temporadas que entregam mudanças reais de jogo e não só cosméticos. É o modelo mais respeitoso da base junto com o de Battlefield 6, e num jogo gratuito isso pesa mais.',
  p2w:'Nenhum. Todos os itens pagos são cosméticos.',
  notas:[['Progressão',7.5],['Battle Pass',8.5],['Skins (qualidade)',8.0],['Recompensas gratuitas',8.0],['Conteúdo sazonal',8.5],['Frequência de atualização',8.5],['Monetização (justiça)',8.5],['Ausência de pay-to-win',10.0]]
},
problemas:[
  {tipo:'fato',t:'População pequena para o formato',p:'Médias mensais no Steam oscilando entre cerca de 7 mil e 18 mil simultâneos ao longo do último ano, com os picos concentrados em lançamentos de temporada. Para um jogo de trio com ranqueado, essa escala compromete objetivamente a qualidade do matchmaking em faixas altas.'},
  {tipo:'fato',t:'Custo de performance da destruição',p:'A simulação de destruição total tem custo mensurável de FPS em cenas pesadas. É consequência direta da proposta técnica, não um bug.'},
  {tipo:'reclamacao',t:'Balanceamento entre classes',p:'Discussão recorrente sobre o poder relativo de Leve, Médio e Pesado a cada temporada. A Embark ajusta com frequência; a comunidade nunca converge.'},
  {tipo:'reclamacao',t:'Falta de visibilidade e marketing',p:'Queixa comum da própria comunidade: um jogo desta qualidade com esta população indica problema de alcance, não de produto. É percepção compartilhada, não uma métrica.'},
  {tipo:'opiniao',t:'"O caos atrapalha a competição"',p:'Parte dos jogadores considera que a destruição introduz aleatoriedade demais para competição séria. É julgamento de preferência sobre o quanto de caos um jogo competitivo deve tolerar.'}
],
fortes:[
  'Destruição total processada no servidor — a proeza técnica mais ambiciosa de qualquer FPS em atividade.',
  'Rejogabilidade máxima: o mapa é reescrito fisicamente a cada partida.',
  'Formato 3v3v3, que elimina vantagem de lado e cria decisão tática permanente.',
  'Monetização honesta: sem caixa aleatória, sem escassez artificial, sem vantagem paga.',
  'Comunidade notavelmente menos tóxica que a média do gênero.'
],
fracos:[
  'População pequena, que compromete matchmaking e inviabiliza cena competitiva séria.',
  'Custo de performance alto justamente nos momentos de maior ação.',
  'Ausência de cenário profissional relevante apesar de um formato ideal para espectador.',
  'Balanceamento de classes em discussão permanente entre temporadas.',
  'Alcance e visibilidade insuficientes — o maior risco à sobrevivência do jogo.'
],
concorrentes:['apex','ow','bf6','arc'],
vale:{
  veredito:'Sim',
  texto:'Vale, e com folga. É gratuito, é o FPS mais original em atividade, tem a monetização mais honesta da base e uma comunidade agradável. A ressalva não é sobre qualidade, é sobre escala: se você quer uma cena competitiva séria para investir anos, ela não está aqui.',
  perfis:[
    ['Casual','Sim, primeira escolha entre os gratuitos. Divertido mesmo perdendo, e a comunidade não hostiliza.'],
    ['Competitivo','Com ressalvas. O design suporta, a população não.'],
    ['Solo','Sim, com ressalvas. Funciona melhor que a maioria dos jogos de trio porque o formato de três times perdoa mais.'],
    ['Com amigos','Excelente — é o melhor jogo da base para um trio que quer se divertir sem levar a sério.'],
    ['Foco em ranking','Com ressalvas. Existe ranqueado, mas o matchmaking sofre com a base pequena.'],
    ['Foco em esports','Não. Não há cena profissional relevante, apesar do formato ser ideal para isso.']
  ]
},
veredito:{
  melhor:'A destruição total — a mecânica mais impressionante em qualquer FPS hoje.',
  problema:'População pequena demais para o que o jogo é capaz de ser.',
  diferencial:'Um mapa que se reescreve fisicamente a cada partida, replicado no servidor.',
  risco:'A Nexon reduzir investimento se a escala não crescer — o risco de descontinuação é real.',
  perfil:'Jogador criativo, com trio de amigos, que valoriza originalidade acima de cena competitiva.',
  vale2026:'Sim',
  conclusao:'The Finals é o melhor argumento de que qualidade e sucesso comercial não são a mesma coisa. A Embark construiu a mecânica mais ambiciosa do gênero, cobra pouco por ela e trata os jogadores com respeito — e mesmo assim opera numa fração da população de jogos objetivamente piores. Se você joga FPS e nunca experimentou, é a recomendação mais fácil desta base inteira. Só não conte com ele para uma carreira competitiva.'
},
dados:[
  {l:'Temporada atual',v:'Temporada 11 ("Galaxy Masters") — descrita pela imprensa especializada como uma reformulação significativa, levou o pico de jogadores ao maior patamar em dez meses',f:'Insider Gaming',u:'https://insider-gaming.com/the-finals-player-count-10-month-high-season-11/'},
  {l:'População no Steam',v:'Médias mensais oscilando entre cerca de 7.000 e 18.000 simultâneos no último ano, com picos em lançamentos de temporada',f:'Icon Era / Steam Charts',u:'https://icon-era.com/statistics/the-finals/'},
  {l:'Base total',v:'Mais de 30 milhões de usuários registrados acumulados em todas as plataformas (2026)',f:'Embark / agregadores',u:'https://icon-era.com/statistics/the-finals/'},
  {l:'Ressalva',v:'"Usuários registrados acumulados" é uma métrica de marketing e não indica jogadores ativos. A medida relevante para matchmaking é a de simultâneos.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= ESCAPE FROM TARKOV ======================= */
GAMES.push({
id:'tarkov', nome:'Escape from Tarkov', cor:'#8b9a6b', tipo:'Extração', tags:['Extração','Hardcore','Simulação'],
pitch:'A simulação de combate mais profunda já feita, jogada num ambiente que os próprios desenvolvedores não conseguem limpar.',
notaGeral:7.0,
scores:{gameplay:8.0,mira:8.5,mapas:8.5,competitivo:4.0,graficos:7.5,performance:5.0,conteudo:8.5,comunidade:4.5,monetizacao:4.5},
visao:{
  completo:'Escape from Tarkov', dev:'Battlestate Games', publisher:'Battlestate Games',
  ano:'Acesso antecipado em 2017; versão 1.0 lançada em novembro de 2025',
  plataformas:'PC (Windows)',
  engine:'Unity',
  modelo:'Pago, com edições de preço escalonado que concedem vantagens de armazenamento e itens iniciais',
  modos:'PMC (raides PvPvE), Scav, Arena (modo de combate direto), PvE',
  perfil:'Shooter de extração hardcore com simulação balística, gestão de inventário e perda permanente de equipamento.',
  publico:'Jogador de nicho com alta tolerância a frustração e interesse em simulação militar.',
  situacao:'Pós-1.0 e na Steam. Base engajada, mas com o problema de cheating mais grave e mais documentado do gênero.'
},
resumoNota:'7,0 pela profundidade de simulação sem paralelo — balística por camada de armadura, saúde por membro, economia de itens com valor real — e pela tensão que nenhum outro FPS reproduz. A nota cai por performance ruim, ausência total de estrutura competitiva e um problema de cheating que a própria desenvolvedora admite não ter resolvido.',
gameplay:{
  texto:'Tarkov é o FPS mais punitivo que existe. Você entra numa raide com equipamento que comprou ou encontrou, e se morrer <strong>perde tudo</strong> — a arma, a armadura, os itens. A tensão que isso gera é a razão de existir do jogo e não tem substituto.<br><br>A simulação é o núcleo: balística modela penetração por camada de armadura e por classe de munição, saúde é dividida por membro (uma perna quebrada muda como você anda, um braço afeta a mira), e a escolha de munição é frequentemente mais importante que a escolha de arma. Recoil é pesado e altamente modificável pelo build da arma.<br><br>O TTK é extremamente baixo com a munição certa e alto com a errada — dois jogadores podem trocar dezenas de tiros sem efeito se a munição não penetra a armadura. Essa camada de conhecimento é a maior barreira de entrada de qualquer FPS.',
  notas:[['Velocidade das partidas',3.5],['Fluidez',6.5],['Tiro',8.5],['Recuo (qualidade do modelo)',8.5],['Movimento',7.0],['Precisão',8.5],['Peso da mira',8.0],['Peso da estratégia',9.5],['Peso do posicionamento',9.8]],
  ttk:'Extremamente variável e dependente de munição vs. armadura. Com a munição certa, mata em um tiro; com a errada, quase não fere.',
  curva:'A mais íngreme de qualquer FPS. Não é a mira — são tabelas de munição, mapas sem minimapa, saídas de extração condicionais, tarefas de comerciantes e economia de itens.',
  skillGap:'Enorme, e sobretudo de conhecimento. Um veterano tem vantagem esmagadora antes mesmo do primeiro tiro.',
  dificuldade:'O mais alto da base, sem competição.'
},
armas:{
  texto:'O sistema de armas mais profundo de qualquer jogo, ponto. Cada arma é montada peça por peça — receptor, cano, guarda-mão, gatilho, mola, coronha, freio de boca — e cada peça altera ergonomia, recuo vertical e horizontal de forma modelada. Uma AK montada corretamente é uma arma completamente diferente de uma AK padrão.<br><br>A munição é uma segunda camada igualmente profunda: cada calibre tem múltiplos tipos com valores distintos de penetração, dano e fragmentação. Escolher munição errada é o erro mais caro e mais comum do jogo.<br><br>Não existe uma "meta de arma" no sentido convencional — existe uma <strong>meta de munição e armadura</strong>, e ela se move conforme a economia do wipe e os preços dos comerciantes.',
  meta:'Definida por munição e classe de armadura muito mais que por arma. Muda ao longo de cada wipe conforme a economia dos jogadores evolui.',
  dominante:false,
  dominanteTxt:'Não no sentido tradicional. Há munições dominantes por calibre, mas a variedade de armas viáveis é a maior da base — porque o que decide o duelo é o que sai do cano, não o que o segura.',
  notas:[['Variedade',9.8],['Balanceamento',7.5],['Diferenciação entre armas',9.0],['Personalização',10.0],['Qualidade do recuo',8.5],['Distância efetiva bem definida',9.0],['Viabilidade das categorias',9.0]]
},
mapas:{
  texto:'Mapas grandes, densos e desenhados sem qualquer concessão à conveniência: <strong>não há minimapa</strong>, não há marcadores, e as saídas de extração variam por raide e às vezes exigem condições (item, companhia, pagamento). Aprender um mapa de Tarkov leva dezenas de horas e é a maior parte da progressão real do jogador.<br><br>A verticalidade é significativa em mapas urbanos como Streets of Tarkov, e a densidade de loot cria uma geografia de risco — os melhores itens ficam nas áreas mais disputadas.<br><br>O peso do conhecimento de mapa é o maior de todos os jogos desta base. Saber onde os Scavs aparecem, quais rotas os outros PMCs usam e quais extrações são prováveis é literalmente a diferença entre sobreviver e perder o equipamento.',
  destaques:[
    {nome:'Customs',txt:'O mapa de entrada e o mais jogado. Corredor central com pontos de conflito previsíveis; é onde a maioria das tarefas iniciais acontece.'},
    {nome:'Streets of Tarkov',txt:'O mais ambicioso e o mais exigente em hardware. Denso, vertical e urbano — o melhor e o mais pesado do jogo.'},
    {nome:'Labs',txt:'O mapa de maior risco e maior recompensa. Exige item de acesso e concentra os jogadores mais bem equipados.'},
    {nome:'Woods / Shoreline',txt:'Mapas abertos que privilegiam combate de longa distância e leitura de terreno — o contraponto ao urbanismo de Streets.'}
  ],
  notas:[['Quantidade',8.5],['Qualidade',9.0],['Variedade',9.0],['Design',8.5],['Verticalidade',8.0],['Qualidade das rotas',8.5],['Balanceamento de lados',7.0],['Rejogabilidade',9.0],['Peso do conhecimento de mapa',10.0]]
},
competitivo:{
  classificacao:'Casual',
  texto:'Tarkov não tem estrutura competitiva no sentido convencional. Não há ranqueado com rating comparável, não há circuito profissional relevante, e o modo Arena — criado para oferecer combate direto — não gerou uma cena. O jogo é uma experiência de sobrevivência e economia, não de medição.<br><br>O problema mais grave, e o mais documentado da base inteira, é o <strong>cheating</strong>. De janeiro a março de 2026, de aproximadamente 25 mil contas banidas, 54% foram por trapaça direta e 46% por outras violações (comércio de itens por dinheiro real, bots de progressão, scripts). A Battlestate afirma banir milhares de contas por dia. O diretor do jogo declarou antes do 1.0 ter "alguns truques na manga" contra trapaceiros; a comunidade permanece cética, e os relatos de wallhack seguem constantes em 2026.<br><br>Isso importa muito mais aqui do que em outros jogos: quando você perde uma raide para um cheater, você não perde uma partida — você perde o equipamento que levou horas para juntar.',
  notas:[['Ranking',2.0],['Matchmaking',4.0],['Sistema competitivo',3.0],['Esports',2.0],['Cenário profissional',2.5],['Skill gap',9.5],['Qualidade das ranqueadas',3.5],['Integridade competitiva',3.0],['Controle de smurfs',5.0],['Controle de cheaters',3.0],['Ambiente / toxicidade',5.0]],
  justificativa:'Casual na classificação formal, apesar de ser um dos jogos mais exigentes que existem. A distinção é importante: exigência não é competitividade. Sem ranqueado, sem cena e sem integridade de partida, não há competição estruturada — há apenas dificuldade.'
},
experiencia:{
  iniciante:'Brutalmente difícil, e o jogo não ajuda: sem minimapa, sem tutorial adequado, sem explicação de munição. Praticamente exige consumo de conteúdo externo. É o pior onboarding de qualquer jogo desta base.',
  intermediario:'Espaço enorme e gratificante. Cada mapa memorizado, cada tabela de munição decorada, cada tarefa concluída é ganho permanente e sensível.',
  avancado:'Recompensa domínio como nenhum outro. Um jogador experiente entra numa raide com um plano completo — rota, extração, o que vai pegar, o que vai evitar — e executa. É o auge do conhecimento aplicado.',
  competitivo:'Não se aplica no sentido usual. Há profundidade infinita, mas não há estrutura para competir. E o cheating corrói a confiança no resultado de qualquer raide.'
},
tecnico:{
  texto:'É o ponto mais fraco do jogo. Tarkov roda sobre Unity com uma quantidade de simulação que o motor não foi feito para suportar, e o resultado é <strong>performance ruim mesmo em hardware caro</strong> — Streets of Tarkov é notório por derrubar FPS em máquinas de topo. Tempos de carregamento longos, desconexões e stuttering são parte da experiência há anos.<br><br>Netcode e dessincronização ("desync") são queixas antigas e persistentes, e num jogo onde uma morte custa equipamento real, isso pesa mais que em qualquer outro título da base.',
  itens:[['FPS','Ruim — o pior da base, mesmo em hardware de topo, especialmente em Streets of Tarkov'],['Otimização','Fraca; limitação estrutural do motor frente ao escopo da simulação'],['Input lag','Aceitável'],['Netcode','Ponto crítico: desync é queixa antiga e persistente'],['Tick rate','Sem publicação oficial atual e clara da Battlestate'],['Estabilidade','Fraca — desconexões e erros de raide são recorrentes'],['Escalabilidade','Limitada: reduzir gráficos ajuda pouco em mapas densos']],
  semDados:'A Battlestate publica números de banimento esporadicamente, mas não divulga métricas de performance, tick rate ou taxa de detecção auditáveis.',
  notas:[['FPS',4.0],['Otimização',4.0],['Input lag',6.5],['Netcode',5.0],['Estabilidade',5.0],['Escalabilidade gráfica',5.0]]
},
av:{
  texto:'Visual realista e sombrio, com excelente trabalho de modelagem de armas e equipamentos — o detalhe das armas é provavelmente o melhor de qualquer jogo. Iluminação e atmosfera criam tensão de forma muito eficaz.<br><br>A clareza do inimigo é intencionalmente ruim: camuflagem funciona, ambientes escuros escondem gente, e você frequentemente morre sem nunca ver quem atirou. Isso é design, não defeito — mas é exatamente o que torna o cheating tão devastador aqui.<br><br>O áudio é competitivamente central e ambicioso (som binaural, propagação por material), embora tenha histórico de bugs de direcionalidade que a comunidade cobra há anos.',
  impacto:'Prejudicam deliberadamente a "competitividade" no sentido esportivo e favorecem a imersão e a tensão. É coerente com a proposta — e é também a razão de o jogo ser tão vulnerável a wallhack.',
  notas:[['Qualidade visual',8.0],['Animações',9.0],['Iluminação',8.5],['Texturas',8.0],['Design visual',8.0],['Clareza do inimigo',4.0],['Som dos disparos',9.0],['Passos (footsteps)',8.0],['Direcionalidade',6.5],['Mixagem',7.5]]
},
progressao:{
  texto:'Progressão é profunda e cíclica: nível de PMC, reputação com comerciantes, habilidades treináveis, esconderijo modular e tarefas. Tudo isso é zerado periodicamente num <strong>wipe</strong>, o que reinicia a economia e é um dos motivos da longevidade do jogo.<br><br>A monetização é o ponto mais criticado do modelo: o jogo é vendido em <strong>edições de preço escalonado</strong>, e as edições mais caras concedem mais espaço de armazenamento (uma vantagem prática real na economia do jogo) e itens iniciais melhores. Isso não é vantagem de combate direto, mas é vantagem econômica comprável — algo que nenhum outro jogo desta base faz.',
  classe:'Predatória',
  classeTxt:'Predatória. É o único jogo da base onde pagar mais concede vantagem funcional e permanente — espaço de inventário é economia, e economia é poder em um jogo de extração. Somado a preços de edição altos e a um histórico de mudanças controversas nas condições de edições já compradas, é o modelo menos respeitoso da base.',
  p2w:'Zona cinzenta real. Não há vantagem de dano ou precisão comprável, mas edições mais caras dão mais armazenamento e melhor equipamento inicial — vantagem econômica concreta e permanente.',
  notas:[['Progressão',9.5],['Battle Pass',5.0],['Skins (qualidade)',5.0],['Recompensas gratuitas',4.0],['Conteúdo sazonal',7.5],['Frequência de atualização',6.5],['Monetização (justiça)',3.5],['Ausência de pay-to-win',4.5]]
},
problemas:[
  {tipo:'fato',t:'Cheating em escala documentada',p:'Entre janeiro e março de 2026, de cerca de 25 mil contas banidas, 54% foram por trapaça direta e 46% por outras violações (comércio por dinheiro real, bots, scripts). A Battlestate afirma banir milhares por dia. É o problema de integridade mais documentado desta base.'},
  {tipo:'fato',t:'Performance estruturalmente ruim',p:'Verificável e reconhecido: o jogo roda mal mesmo em hardware de topo, com Streets of Tarkov como caso extremo. É limitação de motor frente ao escopo, não configuração do jogador.'},
  {tipo:'fato',t:'Vantagem econômica por edição comprada',p:'Edições mais caras concedem mais espaço de armazenamento e melhor equipamento inicial. É vantagem funcional comprável, documentada na própria página de venda.'},
  {tipo:'reclamacao',t:'Desync e registro de tiro',p:'Queixa antiga e persistente. Especialmente grave num jogo onde a morte custa equipamento real. Sem métricas oficiais que a quantifiquem.'},
  {tipo:'reclamacao',t:'Ceticismo com as promessas de anticheat',p:'O diretor do jogo prometeu medidas novas para o 1.0. A comunidade recebeu com desconfiança, e relatos de wallhack seguem frequentes em 2026. É percepção amplamente compartilhada.'},
  {tipo:'opiniao',t:'"O jogo respeita demais o tempo do veterano e nada o do novato"',p:'Crítica frequente ao design deliberadamente opaco. É julgamento sobre filosofia de design — a Battlestate defende a opacidade como parte da proposta.'}
],
fortes:[
  'A simulação de combate mais profunda de qualquer jogo: balística por armadura, saúde por membro, munição como decisão central.',
  'Customização de armas peça por peça, com efeito modelado em ergonomia e recuo — insuperável.',
  'Tensão de perda permanente que nenhum outro FPS reproduz.',
  'Mapas sem concessões, com o maior peso de conhecimento de qualquer jogo da base.',
  'Economia de itens com valor real e ciclos de wipe que renovam o jogo periodicamente.'
],
fracos:[
  'Cheating em escala documentada, num jogo onde cada morte custa equipamento real.',
  'Performance ruim mesmo em hardware caro — a pior da base.',
  'Edições pagas concedem vantagem econômica permanente.',
  'Onboarding hostil ao ponto de exigir conteúdo externo para ser jogável.',
  'Ausência completa de estrutura competitiva ou de cena relevante.'
],
concorrentes:['arc','delta','r6','bf6'],
vale:{
  veredito:'Sim, com ressalvas',
  texto:'Vale se você quer a experiência de FPS mais intensa e mais profunda que existe e aceita pagar por isso em frustração, performance e convivência com cheaters. Não vale se você tem pouco tempo, pouca paciência ou espera um jogo justo.',
  perfis:[
    ['Casual','Não. É o oposto de um jogo casual em todos os eixos.'],
    ['Competitivo','Não. Não há estrutura competitiva, e o cheating inviabiliza qualquer medição confiável.'],
    ['Solo','Sim, com ressalvas. Solo é a forma clássica e mais tensa de jogar, mas também a mais punitiva.'],
    ['Com amigos','Sim. Um esquadrão coordenado reduz drasticamente a frustração e é a melhor forma de aprender.'],
    ['Foco em ranking','Não. Não existe ranking significativo.'],
    ['Foco em esports','Não. Não há cena relevante, apesar da tentativa do modo Arena.']
  ]
},
veredito:{
  melhor:'A profundidade de simulação — balística, munição e economia sem paralelo em qualquer jogo.',
  problema:'Cheating em escala documentada, num formato onde ele custa mais caro que em qualquer outro lugar.',
  diferencial:'Perda permanente de equipamento: uma tensão que nenhum concorrente reproduz.',
  risco:'A Battlestate não conseguir resolver o cheating e a performance após anos — o histórico não é encorajador.',
  perfil:'Jogador de nicho, com tempo, paciência e tolerância alta a frustração e injustiça.',
  vale2026:'Sim, com ressalvas',
  conclusao:'Tarkov é o jogo mais ambicioso desta base e o pior administrado. A profundidade é real e nenhum concorrente chegou perto — nem os que tentaram copiar o formato. Mas você paga caro por uma edição, roda mal em hardware bom, perde equipamento para trapaceiros e recebe de volta a admissão de que o problema não foi resolvido. É uma obra genuinamente notável entregue com uma operação que não está à altura dela.'
},
dados:[
  {l:'Versão 1.0',v:'Lançada em novembro de 2025, encerrando mais de oito anos de acesso antecipado, com chegada à Steam',f:'Wikipedia / PCGamesN',u:'https://en.wikipedia.org/wiki/Escape_from_Tarkov'},
  {l:'Banimentos em 2026',v:'Cerca de 25.000 contas banidas entre janeiro e março de 2026; 54% por trapaça direta, 46% por outras violações (RMT, bots, scripts)',f:'Insider Gaming / ixbt.games',u:'https://insider-gaming.com/escape-from-tarkov-banned-players-cheating/'},
  {l:'Ritmo de banimento',v:'A Battlestate afirma banir vários milhares de contas por dia, a maioria após pouco tempo de jogo',f:'Battlestate via imprensa especializada',u:'https://www.pcgamesn.com/escape-from-tarkov/1-0-steam-cheating-measures-battlestate-interview'},
  {l:'Sem dado confiável',v:'Não há série pública e auditável de jogadores simultâneos de Tarkov comparável à do Steam para outros jogos, já que boa parte da base historicamente usa o launcher próprio da Battlestate.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= DELTA FORCE ======================= */
GAMES.push({
id:'delta', nome:'Delta Force', cor:'#4aa3c9', tipo:'Militar', tags:['Larga escala','Extração','Free-to-play'],
pitch:'Dois jogos pelo preço de nenhum: larga escala e extração num pacote gratuito surpreendentemente competente.',
notaGeral:7.4,
scores:{gameplay:7.8,mira:7.8,mapas:7.5,competitivo:6.0,graficos:7.8,performance:8.0,conteudo:7.8,comunidade:6.0,monetizacao:7.2},
visao:{
  completo:'Delta Force', dev:'Team Jade (TiMi Studio Group)', publisher:'Tencent / Level Infinite',
  ano:'2024 (acesso), com expansões e campanha em 2025',
  plataformas:'PC, PlayStation 5, Xbox Series X|S, mobile (versão Garena/mobile separada)',
  engine:'Unreal Engine 4',
  modelo:'Free-to-play, com passe de batalha e cosméticos',
  modos:'Havoc Warfare (larga escala), Hazard Operations (extração), campanha Black Hawk Down',
  perfil:'Shooter militar híbrido: combate de larga escala com veículos e um modo de extração PvPvE completo.',
  publico:'Jogador que quer Battlefield e Tarkov sem pagar por nenhum dos dois.',
  situacao:'Estável e crescendo. Base sólida no Steam, com variação mensal baixa e conteúdo regular.'
},
resumoNota:'7,4 pelo custo-benefício excepcional — dois formatos completos, bem executados e gratuitos, com performance melhor que a dos concorrentes pagos. A nota não sobe porque o jogo é essencialmente derivativo: faz bem o que outros inventaram, sem propor nada próprio.',
gameplay:{
  texto:'Delta Force é competente em dois registros diferentes. Em <strong>Havoc Warfare</strong> é um Battlefield sólido: 32v32, veículos, classes com habilidades (gancho, drone, escudo) e destruição limitada. Em <strong>Hazard Operations</strong> é um Tarkov mais acessível: raides com perda de equipamento, mas com curva bem mais suave e sistemas mais legíveis.<br><br>O gunplay é bom sem ser notável — recuo controlável, feedback claro, e um TTK médio-curto. O movimento é fluido e as habilidades de operador dão verticalidade tática sem transformar o jogo em hero shooter.<br><br>A crítica justa é de originalidade: quase tudo aqui existe em outro lugar, feito primeiro e geralmente com mais personalidade. O que Delta Force oferece é execução sólida e preço zero.',
  notas:[['Velocidade das partidas',7.5],['Fluidez',8.0],['Tiro',7.8],['Recuo (qualidade do modelo)',7.5],['Movimento',8.0],['Precisão',7.5],['Peso da mira',7.5],['Peso da estratégia',7.5],['Peso do posicionamento',8.0]],
  ttk:'Médio-curto em Havoc Warfare; mais letal e dependente de armadura em Hazard Operations.',
  curva:'Suave no modo de larga escala, média no de extração — bem mais acessível que Tarkov, propositalmente.',
  skillGap:'Moderado a alto, dependendo do modo. Extração premia conhecimento; larga escala dilui o impacto individual.',
  dificuldade:'Médio. É o meio-termo entre a acessibilidade de Battlefield e a dureza de Tarkov.'
},
armas:{
  texto:'Arsenal grande com personalização profunda de attachments, no modelo Gunsmith. As armas são bem diferenciadas e o sistema de montagem tem impacto real em recuo e manuseio.<br><br>No modo de extração há camada adicional de munição e armadura, mais simples que a de Tarkov mas suficiente para criar decisão. Não há vantagem paga: attachments e armas se obtêm jogando.<br><br>A meta é relativamente móvel, com ajustes frequentes por temporada. Há concentração em rifles de assalto versáteis, como em qualquer jogo militar moderno.',
  meta:'Rifles de assalto versáteis dominam Havoc Warfare; em Hazard Operations a escolha de munição e armadura pesa mais que a arma.',
  dominante:true,
  dominanteTxt:'Sim, moderada. Há armas claramente preferidas por temporada, mas o balanceamento é ativo e a variedade efetiva é razoável — melhor que a de Call of Duty, pior que a de Tarkov.',
  notas:[['Variedade',8.5],['Balanceamento',7.5],['Diferenciação entre armas',7.5],['Personalização',8.5],['Qualidade do recuo',7.5],['Distância efetiva bem definida',7.5],['Viabilidade das categorias',7.5]]
},
mapas:{
  texto:'Mapas de larga escala bem dimensionados — notavelmente, resolvem melhor que Battlefield 6 o problema de escala, com espaço real para manobra de veículos e múltiplas rotas de aproximação. Não são memoráveis artisticamente, mas funcionam.<br><br>Os mapas de extração são densos, com zonas de loot escalonadas por risco e extrações variáveis, seguindo o modelo consagrado por Tarkov com sinalização mais generosa.<br><br>Verticalidade é moderada. O peso do conhecimento de mapa é alto no modo de extração e médio no de larga escala.',
  destaques:[
    {nome:'Mapas de Havoc Warfare',txt:'Escala generosa com rotas de veículo bem definidas — resolvem o problema de funil que a comunidade aponta em Battlefield 6.'},
    {nome:'Mapas de Hazard Operations',txt:'Estrutura de risco escalonado no modelo Tarkov, com sinalização mais clara de extrações e zonas de loot.'},
    {nome:'Campanha Black Hawk Down',txt:'Remake da campanha clássica, separado dos modos multijogador. Bem recebido como conteúdo de nostalgia.'}
  ],
  notas:[['Quantidade',7.5],['Qualidade',7.5],['Variedade',8.0],['Design',7.5],['Verticalidade',7.0],['Qualidade das rotas',8.0],['Balanceamento de lados',7.5],['Rejogabilidade',7.5],['Peso do conhecimento de mapa',7.5]]
},
competitivo:{
  classificacao:'Casual',
  texto:'Não há estrutura competitiva relevante. Existe progressão e ranqueamento leve, mas nenhum circuito profissional de peso e nenhum sistema de rating comparável ao de CS2 ou Valorant. O jogo é claramente posicionado como entretenimento de larga escala e extração, não como esporte.<br><br>A integridade tem o problema típico de jogos de extração gratuitos: contas grátis mais formato com perda de equipamento é um convite ao cheating, e o modo Hazard Operations concentra as reclamações. Como publisher chinesa de grande porte, a Tencent aplica anticheat próprio, mas sem métricas públicas verificáveis.',
  notas:[['Ranking',5.0],['Matchmaking',6.5],['Sistema competitivo',5.0],['Esports',3.5],['Cenário profissional',3.5],['Skill gap',7.0],['Qualidade das ranqueadas',6.0],['Integridade competitiva',5.5],['Controle de smurfs',5.5],['Controle de cheaters',5.5],['Ambiente / toxicidade',6.5]],
  justificativa:'Casual. Não há ranqueado sério nem cena; o jogo é de consumo, não de medição. O modo de extração tem profundidade, mas sem estrutura competitiva ao redor.'
},
experiencia:{
  iniciante:'Muito bom. Gratuito, acessível, e o modo de larga escala permite contribuir sem habilidade. É a melhor porta de entrada ao gênero de extração que existe — muito mais gentil que Tarkov.',
  intermediario:'Espaço razoável, principalmente no modo de extração, onde conhecimento de mapa e economia de itens têm retorno claro.',
  avancado:'Recompensa parcialmente. Existe teto em extração, mas o jogo não tem a profundidade de simulação de Tarkov nem o teto mecânico de Apex.',
  competitivo:'Não. Falta estrutura, falta cena, falta posicionamento. Não é o jogo para isso.'
},
tecnico:{
  texto:'Boa engenharia: roda bem em hardware médio, escala melhor que Battlefield 6 e tem estabilidade razoável. A Unreal Engine 4 é usada de forma conservadora e o resultado é performance sólida sem grandes ambições visuais.<br><br>Netcode é adequado. Não há histórico de queixas estruturais graves comparáveis às de Apex ou Tarkov.',
  itens:[['FPS','Bom em hardware médio — melhor escalabilidade que os concorrentes pagos'],['Otimização','Boa'],['Input lag','Aceitável'],['Netcode','Adequado; sem queixas estruturais graves'],['Tick rate','Sem publicação oficial clara'],['Estabilidade','Boa'],['Escalabilidade','Boa — de PCs modestos a consoles atuais']],
  semDados:'Não há métricas públicas verificáveis de tick rate, latência por região ou detecção de cheating.',
  notas:[['FPS',8.5],['Otimização',8.5],['Input lag',7.5],['Netcode',7.5],['Estabilidade',8.0],['Escalabilidade gráfica',8.5]]
},
av:{
  texto:'Visual militar competente e sem personalidade forte — bem feito, tecnicamente correto, esteticamente genérico. Comparado a Battlefield 6, perde claramente em espetáculo e em som.<br><br>A clareza do inimigo é razoável, ajudada por skins mais contidas que as de Call of Duty. O áudio é funcional, com direcionalidade adequada, mas sem o trabalho de mixagem e peso que distingue Battlefield.',
  impacto:'Neutros. Não favorecem especialmente a competitividade nem a prejudicam — é um pacote audiovisual funcional e sem opinião.',
  notas:[['Qualidade visual',8.0],['Animações',7.5],['Iluminação',7.5],['Texturas',7.5],['Design visual',6.5],['Clareza do inimigo',7.5],['Som dos disparos',7.5],['Passos (footsteps)',7.5],['Direcionalidade',7.5],['Mixagem',7.0]]
},
progressao:{
  texto:'Progressão de armas e operadores por uso, passe de batalha sazonal e loja de cosméticos. Não há vantagem paga: armas, attachments e operadores se obtêm jogando.<br><br>Para um jogo gratuito de uma publisher conhecida por monetização agressiva, o modelo é surpreendentemente contido. Os preços são moderados e a pressão de loja é menor que a de Call of Duty ou Apex.',
  classe:'Boa',
  classeTxt:'Boa. Free-to-play com dois modos completos, sem vantagem comprável e com preços moderados. Não é generoso ao ponto de The Finals, mas entrega muito conteúdo por zero e não usa mecânicas de escassez agressiva.',
  p2w:'Nenhum em combate. Cosméticos e conveniências não afetam dano, recuo ou armadura.',
  notas:[['Progressão',7.5],['Battle Pass',7.5],['Skins (qualidade)',7.0],['Recompensas gratuitas',7.5],['Conteúdo sazonal',7.5],['Frequência de atualização',8.0],['Monetização (justiça)',7.5],['Ausência de pay-to-win',9.0]]
},
problemas:[
  {tipo:'fato',t:'Proposta derivativa',p:'Verificável por comparação direta: Havoc Warfare replica a estrutura de Battlefield e Hazard Operations replica a de Tarkov, sem inovação mecânica própria significativa. É uma constatação de design, não um defeito de execução.'},
  {tipo:'reclamacao',t:'Cheating no modo de extração',p:'Queixa recorrente concentrada em Hazard Operations, o padrão de qualquer jogo de extração gratuito. Sem métricas públicas que permitam dimensionar.'},
  {tipo:'reclamacao',t:'Identidade visual genérica',p:'Crítica comum de que o jogo não tem personalidade artística própria. Amplamente compartilhada; é julgamento estético apoiado em comparação.'},
  {tipo:'reclamacao',t:'Fragmentação entre versões',p:'Existem versões distintas por região e plataforma (incluindo mobile via Garena), com conteúdo e ritmo diferentes. Gera confusão sobre qual é "o" jogo.'},
  {tipo:'opiniao',t:'"É só um clone"',p:'Redução comum. Ignora que a execução é competente e que o preço zero muda a equação de valor — mas é uma leitura defensável do posicionamento.'}
],
fortes:[
  'Dois formatos completos e bem executados num único pacote gratuito.',
  'Mapas de larga escala com escala melhor resolvida que a de Battlefield 6.',
  'Performance e escalabilidade superiores às dos concorrentes pagos do mesmo gênero.',
  'Melhor porta de entrada existente para o gênero de extração, muito mais acessível que Tarkov.',
  'Monetização contida para um free-to-play, sem vantagem comprável.'
],
fracos:[
  'Derivativo: quase nada aqui é original, e os originais têm mais personalidade.',
  'Identidade visual e sonora genérica, muito atrás de Battlefield 6.',
  'Cheating no modo de extração, com o agravante das contas gratuitas.',
  'Ausência de estrutura competitiva ou de cena relevante.',
  'Fragmentação entre versões regionais e plataformas confunde o jogador.'
],
concorrentes:['bf6','tarkov','bo7','arc'],
vale:{
  veredito:'Sim',
  texto:'Vale, especialmente se você não quer pagar. Você recebe um Battlefield decente e um Tarkov acessível de graça, rodando bem em hardware modesto. Não espere originalidade nem uma cena competitiva — espere muito conteúdo competente por custo zero.',
  perfis:[
    ['Casual','Sim. Gratuito, acessível, com dois formatos para alternar conforme a vontade.'],
    ['Competitivo','Não. Não há estrutura, ranking sério nem cena.'],
    ['Solo','Sim. Ambos os modos funcionam bem solo, e a extração é bem mais tolerante que a de Tarkov.'],
    ['Com amigos','Excelente. É um dos melhores jogos gratuitos para um grupo que quer variar entre formatos.'],
    ['Foco em ranking','Não. O ranqueamento é superficial.'],
    ['Foco em esports','Não. Não há cena relevante.']
  ]
},
veredito:{
  melhor:'A relação valor-conteúdo: dois jogos completos e competentes por zero.',
  problema:'Ausência total de identidade própria — é bom no que copia e não propõe nada.',
  diferencial:'Ser a porta de entrada acessível ao gênero de extração, sem o muro de Tarkov.',
  risco:'Depender de comparação permanente com originais melhores e perder relevância quando eles melhorarem.',
  perfil:'Jogador que quer variedade militar sem gastar e sem se comprometer com uma cena.',
  vale2026:'Sim',
  conclusao:'Delta Force é o melhor argumento de custo-benefício desta base. Não inventa nada e não finge inventar: pega duas fórmulas comprovadas, executa as duas com competência, roda bem e cobra zero. Para quem quer testar o gênero de extração sem o investimento de Tarkov, ou quer larga escala sem pagar por Battlefield 6, é uma recomendação fácil. Só não espere que ele seja memorável.'
},
dados:[
  {l:'População no Steam',v:'Cerca de 110.000 jogadores simultâneos em levantamentos recentes, com pico histórico de ~246.900',f:'SteamDB / agregadores',u:'https://steamdb.info/app/2507950/charts/'},
  {l:'Estabilidade da base',v:'Variação de aproximadamente 11,4% no último mês — uma das bases mais estáveis desta comparação',f:'activeplayer.io',u:'https://activeplayer.io/steam/delta-force/'},
  {l:'Escopo',v:'Combina PvP de larga escala, modo de extração e um remake da campanha Black Hawk Down',f:'Team Jade / Level Infinite',u:'https://steamdb.info/app/2507950/charts/'},
  {l:'Ressalva',v:'Existe uma versão mobile distinta (Garena Delta Force) com números e conteúdo próprios; os dados acima referem-se à versão de PC no Steam.',f:'—',u:''}
],
atualizado:'2026-08-28'
});

/* ======================= ARC RAIDERS ======================= */
GAMES.push({
id:'arc', nome:'ARC Raiders', cor:'#c9a227', tipo:'Extração', tags:['Extração','PvPvE','Terceira pessoa'],
pitch:'O extraction shooter que provou que o gênero podia ser tenso sem ser hostil. Terceira pessoa — não é FPS estrito.',
notaGeral:8.0,
scores:{gameplay:8.5,mira:7.5,mapas:8.0,competitivo:5.0,graficos:9.0,performance:8.0,conteudo:7.0,comunidade:8.5,monetizacao:7.0},
visao:{
  completo:'ARC Raiders', dev:'Embark Studios', publisher:'Nexon', ano:'Novembro de 2025',
  plataformas:'PC, PlayStation 5, Xbox Series X|S (com crossplay)',
  engine:'Unreal Engine 5',
  modelo:'Pago (compra do jogo), com cosméticos e passe',
  modos:'Raides PvPvE de extração, com progressão de base e comerciantes',
  perfil:'Extraction shooter em terceira pessoa, PvPvE, com máquinas hostis (ARC) como ameaça ambiental constante.',
  publico:'Jogador que quer tensão de extração com atrito menor que o de Tarkov.',
  situacao:'Sucesso comercial expressivo seguido de acomodação. A base estabilizou bem acima do que a maioria dos lançamentos de 2025 conseguiu.'
},
resumoNota:'8,0 pela execução: som, atmosfera, design de inimigos e um loop de extração que funciona sem exigir centenas de horas de estudo. Está na base como comparativo por ser o principal concorrente de mercado dos shooters de extração — mas é jogo de terceira pessoa, e isso pesa na avaliação de mira.',
gameplay:{
  texto:'ARC Raiders resolve o problema central do gênero de extração: como manter a tensão sem a hostilidade de Tarkov. A resposta foi o PvE — as máquinas ARC são uma ameaça real e constante, o que significa que <strong>o outro jogador não é sua única preocupação</strong>, e frequentemente é um aliado circunstancial. Isso produziu momentos de cooperação espontânea que viraram a marca do jogo.<br><br>É jogado em <strong>terceira pessoa</strong>, o que muda fundamentalmente a leitura de ângulos: você vê por cima de coberturas sem se expor. Para quem vem de FPS competitivo, isso é uma diferença séria e legítima de crítica — o duelo de mira pura é menos limpo que num jogo em primeira pessoa.<br><br>O gunplay é sólido sem ser excepcional, e o loop de loot, gestão de risco e extração é bem calibrado — mais generoso que o de Tarkov, mais tenso que o de Delta Force.',
  notas:[['Velocidade das partidas',5.5],['Fluidez',8.0],['Tiro',7.5],['Recuo (qualidade do modelo)',7.5],['Movimento',8.0],['Precisão',7.5],['Peso da mira',7.0],['Peso da estratégia',9.0],['Peso do posicionamento',9.0]],
  ttk:'Médio contra jogadores; contra máquinas ARC, depende fortemente do tipo e do ponto de acerto.',
  curva:'Média — muito mais suave que a de Tarkov. Você entende o loop na primeira raide e leva dezenas de horas para dominá-lo.',
  skillGap:'Alto em conhecimento de mapa e gestão de risco; moderado em mecânica, comprimido pela terceira pessoa.',
  dificuldade:'Médio-alto. Tenso, mas com muito menos atrito que o líder do gênero.'
},
armas:{
  texto:'Arsenal moderado com fabricação e melhoria de armas na base entre raides, em vez de montagem por peça. É um sistema mais simples que o de Tarkov e mais legível — você entende o que uma arma faz sem consultar tabelas.<br><br>A diferenciação é boa, com armas voltadas para PvP e outras claramente melhores contra máquinas ARC, o que cria decisão real de loadout. Não há vantagem paga.<br><br>A meta existe mas é branda, e a Embark ajusta com a mesma frequência que faz em The Finals.',
  meta:'Definida pela combinação de arma para PvP e ferramenta para PvE. Móvel entre temporadas, com ajustes regulares.',
  dominante:false,
  dominanteTxt:'Não. A necessidade de lidar com PvE e PvP no mesmo loadout mantém a variedade de escolhas viva — é um dos jogos mais saudáveis da base nesse aspecto, junto com The Finals e Tarkov.',
  notas:[['Variedade',7.5],['Balanceamento',8.0],['Diferenciação entre armas',8.0],['Personalização',6.5],['Qualidade do recuo',7.5],['Distância efetiva bem definida',8.0],['Viabilidade das categorias',8.5]]
},
mapas:{
  texto:'Mapas de superfície pós-apocalíptica com forte trabalho de atmosfera e verticalidade generosa. O design é orientado a <strong>rotas de risco</strong>: zonas de loot melhor recompensadas são também as mais patrulhadas por máquinas ARC e mais disputadas por jogadores.<br><br>A leitura do mapa é auxiliada por sinalização visual clara — de novo, o contraste com Tarkov é deliberado. Extrações são conhecidas e o jogo não esconde informação por princípio.<br><br>Rejogabilidade é alta pela combinação de spawn de máquinas variável, eventos dinâmicos e a imprevisibilidade de encontrar outros jogadores.',
  destaques:[
    {nome:'Design orientado a risco',txt:'A geografia do loot cria uma economia de risco: onde está o melhor equipamento estão as piores máquinas e os outros jogadores.'},
    {nome:'Ameaça ambiental como terceiro time',txt:'As máquinas ARC funcionam como o "terceiro time" que The Finals cria com o formato 3v3v3 — desviam o conflito do PvP puro.'},
    {nome:'Sinalização clara',txt:'Ao contrário de Tarkov, o jogo mostra extrações e comunica perigo visualmente. É a decisão de design que torna o gênero acessível.'}
  ],
  notas:[['Quantidade',7.0],['Qualidade',8.5],['Variedade',7.5],['Design',8.5],['Verticalidade',8.0],['Qualidade das rotas',8.5],['Balanceamento de lados',8.0],['Rejogabilidade',8.5],['Peso do conhecimento de mapa',8.5]]
},
competitivo:{
  classificacao:'Casual',
  texto:'Não há estrutura competitiva. Não existe ranqueado com rating, não existe circuito profissional, e o formato PvPvE com loot aleatório é intrinsecamente incompatível com medição justa de habilidade.<br><br>Isso é posicionamento, não falha. ARC Raiders é um jogo de experiência e de história emergente, não de competição.<br><br>Integridade é razoável para o gênero: por ser pago e ter anticheat ativo, o problema de cheating é menor que em Tarkov, embora exista. A comunidade é notavelmente positiva — o design que incentiva cooperação circunstancial produziu uma cultura menos hostil que a de qualquer outro jogo desta base.',
  notas:[['Ranking',2.5],['Matchmaking',6.0],['Sistema competitivo',3.0],['Esports',2.0],['Cenário profissional',2.0],['Skill gap',7.5],['Qualidade das ranqueadas',4.0],['Integridade competitiva',7.0],['Controle de smurfs',6.5],['Controle de cheaters',7.0],['Ambiente / toxicidade',9.0]],
  justificativa:'Casual. Nenhuma estrutura competitiva e nenhuma pretensão de ter uma. A profundidade existe, mas é de experiência e conhecimento, não de competição medida.'
},
experiencia:{
  iniciante:'Muito bom para o gênero. É de longe a forma mais acessível de entender o que é um shooter de extração, com sinalização clara e uma comunidade que frequentemente ajuda em vez de atacar.',
  intermediario:'Espaço claro: conhecimento de mapa, gestão de risco, rotas de extração e otimização de loadout são progressões concretas.',
  avancado:'Recompensa domínio de conhecimento e de leitura de situação. O teto mecânico é menor que o dos FPS competitivos, em parte por ser terceira pessoa.',
  competitivo:'Não. Não há estrutura, não há cena, e o formato não permite medição justa.'
},
tecnico:{
  texto:'Bem otimizado para um jogo de Unreal Engine 5 com esse nível visual — a Embark demonstrou de novo competência técnica acima da média. Estabilidade boa, netcode adequado para o formato PvPvE.<br><br>Requisitos são moderados a altos, mas o escalonamento de opções é bom.',
  itens:[['FPS','Bom em hardware moderno; escalável'],['Otimização','Boa para UE5 com este nível visual'],['Input lag','Aceitável'],['Netcode','Adequado ao formato; sem queixas estruturais graves'],['Tick rate','Sem publicação oficial clara'],['Estabilidade','Boa'],['Escalabilidade','Boa, com crossplay funcional entre PC e consoles']],
  semDados:'A Embark não publica métricas de tick rate, latência ou detecção de cheating.',
  notas:[['FPS',8.0],['Otimização',8.0],['Input lag',7.5],['Netcode',8.0],['Estabilidade',8.5],['Escalabilidade gráfica',8.0]]
},
av:{
  texto:'O melhor trabalho de atmosfera da base. Iluminação, escala das máquinas ARC e a paleta pós-apocalíptica criam uma identidade visual imediatamente reconhecível — a Embark é excepcional nisso, em ARC Raiders como em The Finals.<br><br>O <strong>áudio é o destaque absoluto</strong>: as máquinas ARC são identificáveis por som antes de serem vistas, e a mixagem faz o silêncio funcionar como tensão. É provavelmente o melhor design sonoro de qualquer jogo desta base.<br><br>Clareza do inimigo é boa contra máquinas e média contra jogadores — a terceira pessoa ajuda a ver e simultaneamente permite que vejam você de formas que a primeira pessoa não permitiria.',
  impacto:'Favorecem a imersão acima da competitividade, coerentemente. A câmera em terceira pessoa é a decisão que mais afeta a pureza do duelo — dá vantagem a quem está em cobertura.',
  notas:[['Qualidade visual',9.5],['Animações',8.5],['Iluminação',9.5],['Texturas',9.0],['Design visual',9.5],['Clareza do inimigo',7.0],['Som dos disparos',9.0],['Passos (footsteps)',8.5],['Direcionalidade',9.0],['Mixagem',9.5]]
},
progressao:{
  texto:'Progressão de base, comerciantes, fabricação de equipamento e árvore de melhorias. O loop de "sair com pouco, voltar com muito, investir na base" é bem calibrado e recompensa sessões curtas.<br><br>Jogo pago com cosméticos e passe. Sem vantagem comprável — diferente de Tarkov, não há edição que dê mais armazenamento. Essa é uma diferença moral relevante entre os dois principais jogos do gênero.',
  classe:'Boa',
  classeTxt:'Boa. Jogo pago com monetização cosmética contida e sem vantagem funcional comprável — o contraste com o modelo de edições de Tarkov é o argumento comercial mais forte de ARC Raiders.',
  p2w:'Nenhum. Nenhum item pago concede vantagem funcional.',
  notas:[['Progressão',8.0],['Battle Pass',7.0],['Skins (qualidade)',7.5],['Recompensas gratuitas',6.5],['Conteúdo sazonal',7.0],['Frequência de atualização',7.5],['Monetização (justiça)',8.0],['Ausência de pay-to-win',10.0]]
},
problemas:[
  {tipo:'fato',t:'Queda acentuada após o lançamento',p:'Verificável: pico de 481.966 simultâneos no Steam em 16/11/2025, com estabilização na faixa de 90.000–100.000 em abril/2026 — cerca de 80% de queda. Padrão típico de lançamento de sucesso, mas expressivo em magnitude.'},
  {tipo:'fato',t:'É jogo de terceira pessoa',p:'Relevante nesta base: ARC Raiders não é FPS estrito. A câmera em terceira pessoa altera a leitura de ângulos e favorece quem está em cobertura, o que afeta diretamente a avaliação de mira e de duelo.'},
  {tipo:'reclamacao',t:'Conteúdo de longo prazo',p:'Queixa recorrente de que o loop se esgota depois de um número grande de horas, com menos profundidade de sistemas que Tarkov. Percepção compartilhada; a Embark responde com temporadas.'},
  {tipo:'reclamacao',t:'Cheating',p:'Existe e é relatado, embora em escala menor que em Tarkov graças ao modelo pago e ao anticheat. Sem métricas públicas.'},
  {tipo:'opiniao',t:'"Extração para iniciantes"',p:'Crítica de veteranos de Tarkov de que o jogo é raso demais. É julgamento de preferência — a acessibilidade foi uma escolha deliberada de design, não um acidente.'}
],
fortes:[
  'Design sonoro provavelmente o melhor de qualquer jogo desta base.',
  'Atmosfera e direção de arte excepcionais, com identidade visual imediata.',
  'PvE como terceiro agente: as máquinas ARC desviam o conflito e criam cooperação espontânea.',
  'A porta de entrada mais bem construída para o gênero de extração, sem o muro de Tarkov.',
  'Monetização honesta, sem vantagem comprável — o contraste direto com o modelo de edições de Tarkov.'
],
fracos:[
  'Terceira pessoa compromete a pureza do duelo e favorece quem está em cobertura.',
  'Queda de aproximadamente 80% em relação ao pico de lançamento.',
  'Profundidade de sistemas menor que a de Tarkov — o loop se esgota mais cedo.',
  'Nenhuma estrutura competitiva ou cena, apesar do interesse do público.',
  'Divergência grande entre fontes de população indica base instável ou mal medida.'
],
concorrentes:['tarkov','delta','finals','bf6'],
vale:{
  veredito:'Sim',
  texto:'Vale, e é a melhor recomendação da base para quem quer experimentar extração pela primeira vez. Atmosfera de primeira, som excelente, comunidade agradável e um loop bem calibrado. As ressalvas: é terceira pessoa, é pago, e a profundidade de longo prazo fica atrás de Tarkov.',
  perfis:[
    ['Casual','Sim, com ressalvas. É tenso por natureza, mas o atrito é bem menor que o do resto do gênero.'],
    ['Competitivo','Não. Não há estrutura competitiva nem intenção de ter.'],
    ['Solo','Sim. Funciona muito bem solo, e as máquinas ARC dão objetivo mesmo em raides sem PvP.'],
    ['Com amigos','Excelente. É o melhor da base para um grupo pequeno que quer histórias emergentes.'],
    ['Foco em ranking','Não. Não existe ranking.'],
    ['Foco em esports','Não. Não há cena.']
  ]
},
veredito:{
  melhor:'O áudio e a atmosfera — nenhum jogo desta base chega perto.',
  problema:'Profundidade de longo prazo menor que a do líder do gênero.',
  diferencial:'PvE como ameaça constante, que transforma o outro jogador em aliado circunstancial.',
  risco:'A queda de população continuar e o conteúdo sazonal não sustentar o interesse.',
  perfil:'Jogador que quer tensão e histórias emergentes sem o castigo permanente de Tarkov.',
  vale2026:'Sim',
  conclusao:'ARC Raiders fez pelo gênero de extração o que The Finals tentou fazer pelo arena shooter: mostrou que dá para ser ambicioso e acolhedor ao mesmo tempo. É a Embark de novo entregando som, atmosfera e uma ideia central sólida — aqui, a de que a ameaça compartilhada gera cooperação. Não tem a profundidade de Tarkov e não é FPS estrito, mas é o jogo de extração que a maioria das pessoas deveria jogar.'
},
dados:[
  {l:'Pico de lançamento',v:'481.966 jogadores simultâneos no Steam em 16/11/2025',f:'SteamDB / agregadores',u:'https://arcstatus.com/arc-raiders-player-count'},
  {l:'Vendas e base',v:'14 milhões de cópias vendidas e 6 milhões de jogadores ativos semanais em todas as plataformas, segundo o diretor do jogo',f:'Declaração do diretor do jogo',u:'https://arcraiders.gg/blog/arc-raiders-player-count/'},
  {l:'DIVERGÊNCIA IMPORTANTE ENTRE FONTES',v:'As fontes discordam fortemente sobre a população atual no Steam: alguns agregadores relatam média de 85.000–100.000 simultâneos, enquanto outro levantamento aponta pico diário de apenas 31.310 em 24/08/2026, com variação de 12.106 a 30.343. A ordem de grandeza não é consensual e nenhum dos números deve ser tratado como definitivo.',f:'activeplayer.io / arcstatus / arc-raiders.online',u:'https://activeplayer.io/arc-raiders/'},
  {l:'Ressalva de escopo',v:'ARC Raiders é jogado em terceira pessoa. Está incluído nesta base como concorrente direto de mercado dos shooters de extração, não como FPS estrito.',f:'—',u:''}
],
atualizado:'2026-08-28'
});
