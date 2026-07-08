# 09 — Roadmap, Plano de Implementação e Backlog

## 1. Roadmap por versão

### MVP — "Do save ao pesquisável" (Sprints 1–5, ~10 semanas)
**Meta: salvar no Instagram → aparecer enriquecido e pesquisável no dashboard em < 60 s.**
- Extensão Chrome: captura em tempo real + sync retroativa das coleções
- Pipeline: ingest → Cloud Tasks → Gemini Flash (schema completo) → embedding → Firestore
- Dashboard: Home simples, Biblioteca (cards/lista, filtros, busca instantânea + semântica), página do Conteúdo (com lifecycle, favorito, checklist, anotações)
- Auth Google + Security Rules + backup diário
- Backfill do histórico via sync retroativa + import DYI

### V2 — "Second Brain ativo" (Sprints 6–9, ~8 semanas)
- **Chat RAG completo** com citações, planos e tools
- Share-to-Vault (PWA mobile) · Analytics completo (funil, heatmap, autores)
- Digest semanal/mensal por e-mail/push · Behavior profile + recomendações na Home
- Masonry + modo foco/leitura/apresentação + drag&drop + atalhos completos
- Análise de vídeo (transcrição de reels) · App Check · export/eliminação LGPD self-service

### V3 — "Escala e inteligência" (Sprints 10–13)
- Vertex AI Vector Search (se gatilhos de escala) · Typesense para full-text
- Multi-fonte: YouTube, TikTok, X, artigos (mesma arquitetura de captura plugável)
- Grafo de conhecimento navegável (relacionamentos entre posts/temas/autores)
- Spaced repetition formal · agendamento de conteúdo ("me lembre disso sexta")
- Coleções inteligentes (regras + IA) · detecção de duplicados/conteúdo morto

### Enterprise — "De pessoal a produto"
- Multiusuário/times (workspaces), papéis e compartilhamento
- Billing (Stripe), quotas por tenant, onboarding
- CMEK, VPC-SC, SSO SAML/OIDC, DPA/LGPD como controlador
- Biblioteca de times: curadoria colaborativa, comentários, digest do time
- SLA 99,9%, suporte, mobile app nativo

## 2. Plano de implementação passo a passo (MVP)

**Fase 0 — Fundação (Sprint 1)**
1. Criar projetos GCP (`dev`/`prod`, região `southamerica-east1`) + billing alerts (US$ 25)
2. Terraform: Firestore, buckets, Artifact Registry, service accounts, WIF GitHub
3. Monorepo (pnpm + Turborepo) com `packages/shared` (schemas Zod: Post, AiAnalysis, DTOs)
4. Firebase Auth (Google) + allowlist + Security Rules base + emuladores locais
5. CI GitHub Actions: lint + typecheck + unit em PR

**Fase 1 — Ingestão (Sprint 2)**
6. `ingest-api` no Cloud Run: `/v1/ingest`, `/v1/ingest/batch`, dedupe por shortcode
7. Fila Cloud Tasks + `enrichment-service` esqueleto (persiste mídia no GCS)
8. `packages/ig-parser` v1 + fixtures de payloads reais gravados manualmente
9. Extensão MV3: main-world interceptor → content → service worker → fila IndexedDB → API
10. Sync retroativa (página /saved/) + badge de confirmação

**Fase 2 — Enriquecimento (Sprint 3)**
11. `packages/ai`: prompt `enrich_v1` + responseSchema + client Vertex
12. Enrichment completo: Gemini Flash → validação Zod → embedding 768d → status=indexed
13. Índice vetorial Firestore + `/v1/search/semantic` no rag-service
14. Agregados (`stats/`, `tags/`, `authors/`) transacionais + `history/` events
15. Eval dourado (50 posts) + dead-letter + alertas de pipeline

**Fase 3 — Dashboard (Sprints 4–5)**
16. Next.js: layout, auth guard, tokens de design, sidebar, ⌘K palette
17. Biblioteca: cards + lista, filtros facetados, MiniSearch instantâneo, busca semântica
18. Página do Conteúdo completa (mídia, análise, checklist, anotações, relacionados, lifecycle)
19. Home v1 (stats, recentes, importantes) + pipeline em tempo real (onSnapshot)
20. Import DYI + export LGPD + backup agendado + smoke E2E + **go-live: backfill do histórico**

## 3. Backlog priorizado

Estimativas em **story points** (1 SP ≈ meio dia focado). Prioridade: P0 = MVP bloqueante, P1 = MVP, P2 = V2, P3 = V3+.

### ÉPICO E1 — Fundação e Infraestrutura
| ID | Tarefa | SP | Prio | Depende de |
|----|--------|----|------|------------|
| E1.1 | Projetos GCP + Terraform base (Firestore, GCS, AR, SAs, WIF) | 5 | P0 | — |
| E1.2 | Monorepo pnpm/Turborepo + `packages/shared` (Zod) | 3 | P0 | — |
| E1.3 | Firebase Auth Google + allowlist + Security Rules v1 | 3 | P0 | E1.1 |
| E1.4 | CI (lint/type/test) + CD dev (Cloud Build → Cloud Run) | 5 | P0 | E1.1, E1.2 |
| E1.5 | Observabilidade base: logs estruturados, traceId, alertas de custo | 3 | P1 | E1.4 |
| E1.6 | Backup: PITR + export diário agendado + runbook restore | 3 | P1 | E1.1 |

### ÉPICO E2 — Captura (Extensão + Fallbacks)
| ID | Tarefa | SP | Prio | Depende de |
|----|--------|----|------|------------|
| E2.1 | `ig-parser` v1 + fixtures + testes de contrato | 5 | P0 | E1.2 |
| E2.2 | Extensão MV3: interceptor main-world + bridge + service worker | 8 | P0 | E2.1 |
| E2.3 | Fila offline (IndexedDB) + retry/backoff + auth Firebase na extensão | 5 | P0 | E2.2, E1.3 |
| E2.4 | Captura do save em tempo real (com collection_id) + toast/badge | 5 | P0 | E2.2 |
| E2.5 | Sync retroativa da página /saved/ (backfill coleções) | 8 | P0 | E2.2 |
| E2.6 | Telemetria parse-miss + alerta "Instagram mudou" | 3 | P1 | E2.2, E1.5 |
| E2.7 | Captura manual por URL (dashboard) + resolução oEmbed | 3 | P1 | E3.1 |
| E2.8 | Import DYI (ZIP oficial Meta) com reconciliação | 5 | P1 | E3.1 |
| E2.9 | Share-to-Vault PWA (Web Share Target + sugestão de coleção) | 8 | P2 | E3.x, E5.6 |

### ÉPICO E3 — Pipeline de Ingestão e Enriquecimento
| ID | Tarefa | SP | Prio | Depende de |
|----|--------|----|------|------------|
| E3.1 | `ingest-api`: /v1/ingest(+batch), dedupe, validação, 202 | 5 | P0 | E1.2, E1.3 |
| E3.2 | Cloud Tasks + enrichment esqueleto + persistência de mídia GCS | 5 | P0 | E3.1 |
| E3.3 | Prompt enrich v1 + responseSchema + client Vertex (`packages/ai`) | 5 | P0 | E1.2 |
| E3.4 | Enriquecimento completo + validação + retry + dead-letter | 5 | P0 | E3.2, E3.3 |
| E3.5 | Embeddings (documento sintético, task_type) + índice vetorial | 3 | P0 | E3.4 |
| E3.6 | Agregados stats/tags/authors + eventos history/ | 5 | P0 | E3.4 |
| E3.7 | Related posts (findNearest k=6 pós-index) | 2 | P1 | E3.5 |
| E3.8 | Eval dourado (50 posts) + script de regressão de prompt | 5 | P1 | E3.4 |
| E3.9 | Reprocessamento (/reprocess + por intervalo) com Batch API | 3 | P1 | E3.4 |
| E3.10 | Análise de vídeo/reel (input de vídeo no Gemini) | 5 | P2 | E3.4 |

### ÉPICO E4 — Dashboard
| ID | Tarefa | SP | Prio | Depende de |
|----|--------|----|------|------------|
| E4.1 | App shell: layout, sidebar, tema dark, tokens, auth guard | 5 | P0 | E1.3 |
| E4.2 | Command palette ⌘K (busca + navegação + ações) | 5 | P0 | E4.1 |
| E4.3 | Biblioteca: grid cards + lista + virtualização + skeletons | 8 | P0 | E4.1, E3.6 |
| E4.4 | Filtros facetados (coleção/categoria/tags/autor/tipo/lifecycle/★) | 5 | P0 | E4.3 |
| E4.5 | Busca instantânea (MiniSearch) + busca semântica (rag-service) | 5 | P0 | E4.3, E6.1 |
| E4.6 | Página do Conteúdo (mídia, análise, checklist, lifecycle, relacionados) | 8 | P0 | E4.1, E3.7 |
| E4.7 | Anotações markdown com versionamento | 3 | P1 | E4.6 |
| E4.8 | Home v1: stats, recentes, importantes, pipeline em tempo real | 5 | P1 | E4.1, E3.6 |
| E4.9 | Atalhos globais (J/K, F, T/I/E, G+…) + overlay `?` | 3 | P1 | E4.3 |
| E4.10 | Masonry (Pinterest) + quick-look Espaço | 5 | P2 | E4.3 |
| E4.11 | Modo foco + modo leitura + modo apresentação | 8 | P2 | E4.6 |
| E4.12 | Drag & drop (cards → coleções; funil) | 5 | P2 | E4.3 |
| E4.13 | Analytics completo (funil, heatmap, evolução, autores) | 8 | P2 | E3.6 |
| E4.14 | Settings: privacidade, export, apagar conta, saúde do sistema | 3 | P1 | E4.1 |

### ÉPICO E5 — IA Conversacional e Personalização
| ID | Tarefa | SP | Prio | Depende de |
|----|--------|----|------|------------|
| E5.1 | rag-service: busca semântica + intent router + rerank | 5 | P0 | E3.5 |
| E5.2 | Chat RAG streaming (SSE) com citações [postId] | 8 | P2 | E5.1 |
| E5.3 | Tools do chat: search_library, create_plan, update_lifecycle | 5 | P2 | E5.2 |
| E5.4 | UI do chat (streaming, cards de citação, prompts sugeridos) | 8 | P2 | E5.2, E4.1 |
| E5.5 | Digest semanal/mensal (Scheduler + Gemini + e-mail/push) | 5 | P2 | E3.6 |
| E5.6 | Behavior profile (job noturno) + recomendações na Home | 8 | P2 | E3.6 |
| E5.7 | Spaced repetition ("revisitar hoje") | 3 | P3 | E5.6 |
| E5.8 | Coleções inteligentes (regras + IA) | 5 | P3 | E5.6 |

### ÉPICO E6 — Qualidade, Segurança e LGPD
| ID | Tarefa | SP | Prio | Depende de |
|----|--------|----|------|------------|
| E6.1 | Testes integração com emuladores (pipeline + rules) | 5 | P0 | E3.4 |
| E6.2 | E2E Playwright (fluxos núcleo) + smoke pós-deploy | 5 | P1 | E4.6 |
| E6.3 | E2E extensão com HAR replay | 5 | P1 | E2.4 |
| E6.4 | Export LGPD (JSON/CSV) + eliminação de conta com purge | 3 | P1 | E3.6 |
| E6.5 | Rate limiting + CORS estrito + CSP + sanitização | 3 | P1 | E3.1 |
| E6.6 | App Check + auditoria de segurança | 3 | P2 | E6.5 |
| E6.7 | Testes de carga k6 (SLO busca/chat) | 3 | P2 | E5.1 |

### Alocação em sprints (2 semanas, ~20 SP/sprint)

| Sprint | Conteúdo | Marco |
|--------|----------|-------|
| S1 | E1.1–E1.4, E2.1 | CI/CD verde; parser com fixtures |
| S2 | E2.2–E2.5, E3.1 | **Save no IG chega ao Firestore** |
| S3 | E3.2–E3.6, E1.5 | **Post enriquecido + pesquisável (API)** |
| S4 | E4.1–E4.5, E5.1, E6.1 | **Biblioteca navegável com busca** |
| S5 | E4.6–E4.9, E4.14, E6.4, E1.6, E2.7–E2.8 | **🚀 Go-live MVP + backfill histórico** |
| S6 | E5.2–E5.4, E6.2–E6.3 | Chat RAG com citações |
| S7 | E4.13, E5.5, E2.6, E3.8–E3.9, E6.5 | Analytics + digest |
| S8 | E5.6, E2.9, E3.10 | Personalização + mobile share + vídeo |
| S9 | E4.10–E4.12, E4.11, E6.6–E6.7 | UX premium completo — **fim V2** |

### Caminho crítico

`E1.1 → E1.3 → E3.1 → E3.4 → E3.5 → E4.3/E5.1 → E4.6 → go-live`

Riscos de cronograma: E2.2/E2.5 (dependem do formato atual do Instagram — reservar buffer de 30%); E3.10 (qualidade da análise de vídeo pode exigir iteração de prompt).

## 4. Métricas de sucesso do produto

| Métrica | Meta 3 meses pós-MVP |
|---|---|
| % de saves capturados automaticamente | > 95% |
| Tempo captura → indexado (p90) | < 60 s |
| Buscas por semana (uso real) | > 20 |
| Taxa de implementação (inbox → implementado) | 2× o baseline |
| "Achei o que procurava" (primeiros 5 resultados) | > 80% |
| Custo mensal | < US$ 15 |
