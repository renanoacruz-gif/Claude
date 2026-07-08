# 04 — APIs e Estrutura do Projeto

## 1. Princípios das APIs

- **REST + JSON**, versionadas por path (`/v1/...`).
- **Autenticação:** `Authorization: Bearer <Firebase ID token>` em tudo; verificação via Firebase Admin SDK; `uid` do token define o escopo dos dados (nunca vem do body).
- **Validação:** Zod schemas compartilhados em `packages/shared` — os mesmos tipos validam extensão, web e serviços.
- **Idempotência:** ingestão é idempotente por `shortcode`; mutações aceitam `Idempotency-Key`.
- **Erros:** RFC 7807 (`application/problem+json`), com `code` estável (`POST_NOT_FOUND`, `PARSE_FAILED`, `QUOTA_EXCEEDED`…).
- **Leituras do dashboard** vão direto ao Firestore via SDK client (Security Rules) — a API REST existe para ingestão, ações com lógica de servidor e IA. Isso corta latência e custo de Cloud Run.

## 2. Superfície das APIs

### ingest-api (`api.renanvault.app`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/ingest` | Recebe post capturado (extensão/share/manual). Retorna `202 {postId, status}` |
| POST | `/v1/ingest/batch` | Lote da sync retroativa (até 50 itens) |
| POST | `/v1/ingest/url` | Captura manual: só a URL; servidor resolve metadados (oEmbed) |
| POST | `/v1/import/dyi` | Upload do ZIP do export oficial da Meta (multipart, até 2 GB via signed URL) |
| GET | `/v1/posts/{id}/status` | Polling do pipeline (extensão mostra badge) |
| POST | `/v1/posts/{id}/reprocess` | Reenriquecer com prompt/modelo atual |
| PATCH | `/v1/posts/{id}` | lifecycle, favorite, userImportance, userTags |
| POST | `/v1/posts/{id}/annotations` · PATCH/DELETE `/{annId}` | Anotações (com versionamento) |
| PATCH | `/v1/posts/{id}/actions/{actionId}` | Checklist: todo/doing/done |
| GET | `/v1/export` | Export completo (JSON/CSV) — portabilidade LGPD |
| DELETE | `/v1/me` | Apagar conta e todos os dados — LGPD art. 18 |

**Payload de `/v1/ingest`:**

```jsonc
{
  "shortcode": "DAbC123xyz",
  "igUrl": "https://www.instagram.com/p/DAbC123xyz/",
  "source": "extension",
  "parserVersion": "2026.07.1",
  "savedAt": "2026-07-08T14:03:00Z",
  "igCollection": { "id": "17851...", "name": "Vendas" },
  "mediaType": "reel",
  "caption": "…", "hashtags": ["#vendas"],
  "author": { "username": "fulano", "fullName": "Fulano", "avatarUrl": "https://…cdn…" },
  "media": [{ "type": "video", "url": "https://…cdn…", "coverUrl": "https://…", "durationS": 42 }],
  "location": { "name": "São Paulo" },
  "likeCount": 15234, "commentCount": 210, "postedAt": "2026-07-01T10:00:00Z"
}
```

### rag-service (`ai.renanvault.app`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/search/semantic` | `{query, filters?, k?}` → posts ranqueados (embedding + findNearest + rerank) |
| POST | `/v1/chat` | Chat RAG com a biblioteca. **SSE streaming**; retorna citações `[postId]` |
| GET | `/v1/chat/sessions` · GET `/{id}` | Histórico de conversas |
| POST | `/v1/recommendations` | "O que revisitar hoje" (afinidade + spaced repetition) |
| POST | `/v1/plan` | Geração de planos/roteiros a partir de posts (ex.: roteiro de viagem, treinamento de vendas) |

**Resposta do chat (SSE):**

```
event: sources   data: {"posts":[{"id":"DAbC","oneLiner":"…","score":0.91}]}
event: token     data: {"t":"Com base nos 12 posts sobre negociação que você salvou…"}
event: done      data: {"messageId":"…","citedPostIds":["DAbC","XyZ9"]}
```

### enrichment-service (interno — só Cloud Tasks)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/tasks/enrich` | Pipeline completo de 1 post (mídia → Gemini → embedding → agregados) |
| POST | `/tasks/relate` | Recalcula `related[]` do post e vizinhos |
| POST | `/tasks/digest` | Gera resumo semanal/mensal (chamado pelo Scheduler) |
| POST | `/tasks/behavior` | Atualiza behaviorProfile com base em history/searchLog |

Protegido por **OIDC do Cloud Tasks** (service account own invoker) — inacessível publicamente.

## 3. Eventos internos (history/)

Todo serviço grava eventos padronizados — o Analytics inteiro deriva daqui:

```
post.captured · post.media_stored · post.enriched · post.indexed · post.failed
post.lifecycle_changed {from, to}          → funil de implementação
post.favorited · annotation.created · action.completed
search.performed {query, resultCount}      → aprendizado de comportamento
chat.message {sessionId, citedPostIds}
digest.generated {period}
```

## 4. Estrutura do monorepo

```
renan-vault/
├── package.json / pnpm-workspace.yaml / turbo.json
├── .github/workflows/            # ci.yml, deploy-*.yml
├── infra/
│   ├── terraform/                # projeto GCP, Cloud Run, filas, buckets, índices, alertas
│   └── firebase/                 # firestore.rules, firestore.indexes.json, storage.rules
│
├── apps/
│   ├── web/                      # Next.js 15 (dashboard)
│   │   ├── src/app/              # App Router
│   │   │   ├── (auth)/login/
│   │   │   └── (app)/            # layout com sidebar + command palette
│   │   │       ├── home/  library/  post/[id]/  chat/  analytics/  settings/
│   │   ├── src/components/       # ui/ (shadcn) · library/ · post/ · chat/ · analytics/
│   │   ├── src/hooks/            # usePosts, useSemanticSearch, useKeyboard…
│   │   ├── src/stores/           # Zustand: ui, filters, player
│   │   └── src/lib/              # firebase.ts, api.ts (client tipado), minisearch.ts
│   │
│   └── extension/                # Chrome MV3
│       ├── src/main-world/       # patch fetch/XHR (captura GraphQL)
│       ├── src/content/          # bridge + toasts
│       ├── src/background/       # service worker: fila, auth, envio
│       └── src/popup/            # status, últimas capturas, sync
│
├── services/
│   ├── ingest-api/               # Hono + firebase-admin; rotas /v1/ingest…
│   ├── enrichment/               # workers: media.ts, enrich.ts, embed.ts, aggregate.ts
│   ├── rag/                      # search.ts, chat.ts (SSE), plan.ts
│   └── digest/                   # weekly.ts, monthly.ts, behavior.ts
│
└── packages/
    ├── shared/                   # Zod schemas + tipos (Post, AiAnalysis, eventos, DTOs)
    ├── ig-parser/                # ★ parsing de payloads do Instagram, versionado + fixtures de teste
    ├── ai/                       # prompts versionados (enrich_v3.ts…), JSON schemas de saída, client Vertex
    └── ui/                       # tokens de design + componentes compartilhados
```

**Regra de ouro:** `packages/ig-parser` é o único lugar que conhece o formato do Instagram; `packages/ai` é o único lugar que conhece prompts. Mudanças externas ficam contidas.

## 5. Fluxo de dados no frontend

- **React Query** para tudo que vem do Firestore/API (cache, invalidation, optimistic updates em lifecycle/favorite).
- **Zustand** apenas para estado de UI (filtros ativos, modo de visualização, command palette aberta, player).
- **Streaming do chat** via EventSource; mensagens persistidas no Firestore pelo rag-service.
- **Assinatura em tempo real** (onSnapshot) só na Home e no status do pipeline — o resto é fetch com staleTime para segurar custo de leitura.
