# 08 — UX e Design System

## 1. Direção visual: "Dark Premium"

Referências: **Linear** (densidade + velocidade), **Raycast** (command-first), **Notion** (flexibilidade calma), **Arc** (personalidade), **Apple/Material 3** (hierarquia tipográfica e motion com física).

### Tokens (packages/ui)

```css
:root[data-theme="dark"] {
  /* Superfícies — preto azulado em camadas, nunca #000 chapado */
  --bg-base:    #0A0A0F;   /* fundo do app */
  --bg-raised:  #111118;   /* cards */
  --bg-overlay: #16161F;   /* modais, palette */
  --border-subtle: rgba(255,255,255,.06);
  --border-strong: rgba(255,255,255,.12);

  /* Texto */
  --text-primary:   #EDEDF2;
  --text-secondary: #A0A0B0;
  --text-tertiary:  #62626E;

  /* Acento — violeta elétrico com gradiente sutil (identidade do Vault) */
  --accent:      #7C6CFF;
  --accent-soft: rgba(124,108,255,.14);
  --gradient-hero: linear-gradient(135deg,#7C6CFF 0%,#4CC9F0 100%);

  /* Semânticas */
  --success:#3ECF8E; --warning:#F5A623; --danger:#F0506E;

  /* Sistema */
  --radius-card:14px; --radius-input:10px;
  --shadow-card: 0 1px 0 rgba(255,255,255,.04) inset, 0 8px 24px rgba(0,0,0,.4);
  --font-sans:"Inter Variable"; --font-mono:"JetBrains Mono";
}
```

- **Motion (Framer Motion):** springs `stiffness 400 / damping 30`; entradas com fade+8px translateY em stagger de 30 ms; layout animations em mudanças de filtro/visualização; `prefers-reduced-motion` respeitado.
- **Densidade Linear:** linhas de 36–40 px em listas, tipografia 13–14 px no corpo, 4-pt grid.
- **Light mode** existe (tokens espelhados), mas dark é o padrão e a identidade.

## 2. Anatomia do app

```
┌──────┬───────────────────────────────────────────────┐
│      │  ⌘K  Busca instantânea…                 ◐ 🔔 👤 │
│  🏠  ├───────────────────────────────────────────────┤
│  📚  │                                               │
│  💬  │                ÁREA DE CONTEÚDO               │
│  📊  │                                               │
│  ⚙️  │                                               │
└──────┴───────────────────────────────────────────────┘
 sidebar 56px (ícones) → expande em hover para 220px
```

### Home
- Hero com saudação + **3 números vivos** (total, salvos na semana, taxa de implementação) em stat tiles.
- "**Para você hoje**": 3 cards recomendados (afinidade + spaced repetition) com o *porquê* ("você salvou 5 posts de negociação esta semana").
- Insights da IA (carrossel), resumo semanal/mensal (link para o digest), atividade recente, mini-heatmap.

### Biblioteca
- **Busca instantânea** no topo (MiniSearch < 10 ms por tecla) + botão "busca profunda ⏎" (semântica).
- **Rail de filtros** (facetas com contagem): Coleção, Categoria, Tags, Autor, Tipo, Lifecycle, Importância, Favoritos, Período.
- **3 visualizações** (toggle `1/2/3`): **Cards** (grid 3–4 col, capa 4:5, oneLiner, tags), **Lista** (densa, estilo Linear, 1 linha/post), **Masonry** (Pinterest, imagem dominante — perfeito para Restaurantes/Viagens/Lugares).
- Virtualização (TanStack Virtual) — 10k posts sem jank; skeletons com shimmer.

### Página do Conteúdo (`/post/[id]`)
Layout em duas colunas: **mídia à esquerda** (capa/vídeo player, link para o post original), **conhecimento à direita**:
1. oneLiner (título editorial) + badges (categoria, importância ★, complexidade, sentimento)
2. Resumo executivo · Principais ideias · Insights
3. **Checklist acionável** (checkboxes persistentes) · Aplicações práticas
4. Perguntas que responde / em aberto · Livros e assuntos relacionados
5. **Anotações pessoais** (markdown, autosave, histórico de versões)
6. **Relacionados** (cards por similaridade vetorial)
7. Barra de ações fixa: `Favoritar ★` · `Quero testar` · `Implementado ✓` · `Arquivar` · `Reprocessar IA`
8. Linha do tempo (histórico de eventos do post)

### IA (Chat)
- Estilo Raycast/ChatGPT: input central, streaming token a token, **citações como cards inline** (hover → preview, clique → post).
- Prompts sugeridos por contexto ("Monte um roteiro com meus lugares de Lisboa", "Treinamento com meus posts de vendas").
- Respostas com bloco "Fontes (12 posts)" expansível; ações em lote sugeridas ("marcar estes 3 como quero testar" → 1 clique).

### Analytics
- Stat tiles (total, taxa e tempo médio de implementação), evolução mensal (área), categorias (barras), tipos e autores (top-N), **heatmap de calendário** (estilo GitHub), **funil** inbox → quero testar → implementado.
- Tudo deriva de `stats/` + `history/` — sem agregação client-side pesada.

## 3. Velocidade e atalhos

| Atalho | Ação |
|---|---|
| `⌘K` | Command palette (busca + comandos + navegação — coração do app) |
| `/` | Foco na busca da Biblioteca |
| `1 / 2 / 3` | Cards / Lista / Masonry |
| `J / K` ou `↑↓` | Navegar entre posts |
| `↵` / `Esc` | Abrir / fechar |
| `F` | Favoritar |
| `T` / `I` / `E` | Quero testar / Implementado / Arquivar |
| `A` | Nova anotação |
| `G H · G L · G C · G A` | Ir para Home / Library / Chat / Analytics |
| `⌘⏎` | Busca semântica profunda |
| `?` | Overlay de atalhos |

- **Command palette** (cmdk) faz busca, navegação e ações — usuário avançado nunca toca o mouse.
- **Optimistic UI** em favoritar/lifecycle (React Query mutation + rollback).
- **Prefetch** do post no hover do card.
- **Metas:** LCP < 1,5 s, interação < 100 ms, busca instantânea < 50 ms.

## 4. Interações especiais

- **Drag & drop:** arrastar card → coleção/etiqueta na sidebar (dnd-kit); arrastar para "Implementado" no quadro de funil; arrastar ZIP do DYI para importar.
- **Modo foco:** `⌘.` esconde chrome da UI e abre 1 post em coluna de leitura centrada (65ch).
- **Modo leitura:** fila "ler depois" — posts em sequência, `J/K` avança, marca como revisado.
- **Modo apresentação:** seleção de posts → deck fullscreen (capa + oneLiner + ideias), `←→` navega — para apresentar um tema ao time usando os próprios saves.
- **Preview rápido:** `Espaço` abre quick-look (estilo macOS) sem sair da grade.

## 5. Estados e qualidade percebida

- **Empty states** ilustrados com próxima ação ("Instale a extensão e salve seu primeiro post").
- **Pipeline visível:** post recém-capturado aparece imediatamente com badge "✨ enriquecendo…" que resolve em tempo real (onSnapshot) — o momento mágico do produto.
- **Erros honestos:** parse-miss mostra "capturamos parcialmente; a IA completou o que pôde" + botão reprocessar.
- **Acessibilidade:** contraste AA no dark, foco visível, navegação 100% por teclado, `aria-live` no streaming do chat.
- **Toasts** discretos (canto inferior), nunca modais para sucesso.
