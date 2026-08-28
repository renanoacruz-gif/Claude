# FPS Analyzer

App web para análise crítica e comparação de jogos FPS. HTML + CSS + JavaScript puro,
sem build e sem dependências — abra `fps-analyzer/index.html` no navegador.

## O que tem

| Aba | O que faz |
|-----|-----------|
| **Biblioteca** | 11 jogos com busca (aceita apelidos: `cs2`, `cod`, `r6`, `eft`…), filtro por tipo e ordenação por nota, ano, competitivo, monetização ou performance. |
| **Análise** | Relatório completo de 15 seções por jogo, no formato do prompt original: visão geral, gameplay, armas, mapas, competitivo, experiência por nível, técnico, gráficos/áudio, progressão, problemas, fortes, fracos, comparativo, para quem vale, veredito — mais um bloco de dados concretos com fontes. |
| **Comparar** | 2 a 5 jogos lado a lado: gráfico radar em canvas, tabela dos 9 critérios com o melhor de cada linha destacado, e um cartão por jogo mostrando em quantos critérios ele lidera. |
| **Melhor FPS** | Ranking por critério (top 5 de cada) e por perfil de jogador, com a fórmula de cada índice declarada em vez de escolha arbitrária. |
| **Metodologia** | Como as notas funcionam, a separação fato/reclamação/opinião, divergências entre fontes e os limites conhecidos da base. |

Para um jogo fora da base, a busca sem resultado oferece um botão que **gera e copia o prompt
de análise completo** para colar num assistente com acesso à web.

## Jogos na base

Counter-Strike 2 · Valorant · Rainbow Six Siege X · Battlefield 6 · Call of Duty: Black Ops 7 ·
Apex Legends · Overwatch · The Finals · Escape from Tarkov · Delta Force · ARC Raiders

## Regras da base

- Notas 0–10 são **avaliação editorial**, calibradas para comparação entre os jogos desta base.
  Não são médias de reviews nem agregam notas de terceiros.
- A nota geral **não é a média** dos nove critérios; cada análise explica a sua no bloco "Por que X".
- Problemas são rotulados como **fato** (verificável), **reclamação recorrente** (percepção ampla
  sem dado que a feche) ou **opinião** (julgamento subjetivo).
- Onde não há dado confiável, a análise diz isso explicitamente — tick rate, taxa de detecção de
  anticheat e latência por região quase nunca têm número oficial verificável.
- Divergências entre fontes ficam registradas em vez de resolvidas a favor de um lado
  (ver ARC Raiders e Overwatch).

## Arquivos

```
fps-analyzer/
├── index.html        estrutura e navegação
├── css/style.css     tema escuro, grid, tabelas, barras de nota
└── js/
    ├── data.js       CS2, Valorant, Siege X, Battlefield 6, Black Ops 7
    ├── data2.js      Apex, Overwatch, The Finals, Tarkov, Delta Force, ARC Raiders
    ├── charts.js     gráfico radar em canvas puro
    └── app.js        views, busca, filtros, comparador, ranking, gerador de prompt
```

Para adicionar um jogo, copie a estrutura de um objeto existente em `data2.js` e dê `GAMES.push()`.
Todas as telas — grid, comparador, ranking — se atualizam sozinhas a partir do array.

Dados revisados em 28/08/2026. Números de população envelhecem rápido: cada análise traz a data
de revisão e o link da fonte.

## Arquivo único

`node build.js` gera, a partir de `index.html` + `css/` + `js/`:

- `fps-analyzer.html` — documento completo com CSS e JS embutidos. Abre offline
  (só as fontes do Google vêm da rede; há stack de fallback).
- `dist/artifact.html` — só o conteúdo do body, para publicar como Artifact.

Edite sempre os arquivos separados e rode o build; os arquivos únicos são saída, não fonte.
