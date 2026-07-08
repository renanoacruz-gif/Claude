# 01 — Arquitetura do Sistema

## 1. Visão geral

O Renan Vault é composto por **4 planos** independentes, conectados por eventos assíncronos:

1. **Plano de Captura** — extensão Chrome (e fallbacks) que detecta posts salvos e os envia para a API de ingestão.
2. **Plano de Ingestão & Enriquecimento** — pipeline assíncrono que normaliza, armazena mídia, enriquece com Gemini e gera embeddings.
3. **Plano de Conhecimento** — Firestore (dados + vetores), Cloud Storage (mídia), índices de busca.
4. **Plano de Experiência** — dashboard Next.js (Home, Biblioteca, Conteúdo, IA/Chat, Analytics) + jobs agendados (resumo semanal/mensal, backup).

### Diagrama de alto nível

```mermaid
flowchart LR
    subgraph Captura["🔌 Plano de Captura"]
        EXT[Extensão Chrome MV3]
        PWA[Share-to-Vault PWA<br/>fallback mobile]
        MAN[Captura manual<br/>colar URL]
    end

    subgraph GCP["☁️ Google Cloud"]
        subgraph Ingestao["⚙️ Ingestão & Enriquecimento"]
            API[Cloud Run<br/>API Gateway /ingest]
            TASKS[Cloud Tasks<br/>fila de enriquecimento]
            ENRICH[Cloud Run Worker<br/>enrichment-service]
            GEMINI[Vertex AI<br/>Gemini 2.5 Flash]
            EMB[Vertex AI<br/>gemini-embedding-001]
        end

        subgraph Conhecimento["🧠 Plano de Conhecimento"]
            FS[(Firestore<br/>dados + vetores)]
            GCS[(Cloud Storage<br/>imagens/vídeos)]
        end

        subgraph Experiencia["✨ Plano de Experiência"]
            WEB[Cloud Run<br/>Next.js Dashboard]
            CHAT[Cloud Run<br/>rag-service]
            SCHED[Cloud Scheduler<br/>digests + backup]
        end

        SM[Secret Manager]
        LOG[Cloud Logging/Monitoring]
    end

    USER((Renan))

    USER -->|salva post| EXT
    USER -->|compartilha| PWA
    USER -->|cola URL| MAN
    EXT -->|POST /v1/ingest| API
    PWA --> API
    MAN --> API
    API -->|persiste raw| FS
    API -->|enfileira| TASKS
    TASKS --> ENRICH
    ENRICH -->|analisa| GEMINI
    ENRICH -->|embedding| EMB
    ENRICH -->|salva mídia| GCS
    ENRICH -->|grava enriquecido| FS
    USER -->|usa| WEB
    WEB --> FS
    WEB --> CHAT
    CHAT --> EMB
    CHAT --> GEMINI
    CHAT --> FS
    SCHED -->|semanal/mensal| ENRICH
    SCHED -->|diário| FS
    API -.-> SM
    ENRICH -.-> LOG
```

---

## 2. Fluxograma principal: do "salvar" ao "pesquisável"

```mermaid
sequenceDiagram
    autonumber
    participant R as Renan
    participant IG as Instagram (web)
    participant EXT as Extensão Chrome
    participant API as ingest-api (Cloud Run)
    participant FS as Firestore
    participant CT as Cloud Tasks
    participant EN as enrichment-service
    participant VX as Vertex AI (Gemini + Embeddings)
    participant ST as Cloud Storage

    R->>IG: Salva post na coleção "Vendas"
    IG-->>EXT: Resposta GraphQL interceptada<br/>(save + collection_id)
    EXT->>EXT: Extrai metadados do DOM/JSON<br/>(url, caption, autor, mídia, hashtags…)
    EXT->>API: POST /v1/ingest (JWT Firebase)
    API->>API: Valida, deduplica (shortcode)
    API->>FS: posts/{id} status=captured
    API->>CT: enqueue enrich(postId)
    API-->>EXT: 202 Accepted
    Note over EXT: Badge ✅ "Salvo no Vault"

    CT->>EN: HTTP push enrich(postId)
    EN->>ST: Baixa e persiste capa/vídeo
    EN->>VX: Gemini 2.5 Flash → JSON estruturado<br/>(resumo, categoria, tags, insights, ações…)
    EN->>VX: gemini-embedding-001 → vetor 768d
    EN->>FS: posts/{id} status=enriched<br/>+ aiAnalysis + embedding
    EN->>FS: Atualiza tags/, authors/, stats/

    R->>API: "quais conteúdos de negociação?"
    API->>VX: embedding da pergunta
    API->>FS: findNearest(embedding, k=20) + filtros
    API-->>R: Resultados ranqueados < 500ms
```

### Estados de um post no pipeline

```mermaid
stateDiagram-v2
    [*] --> captured: extensão envia
    captured --> media_stored: mídia no GCS
    media_stored --> enriched: Gemini OK
    enriched --> indexed: embedding gravado
    indexed --> [*]
    captured --> failed: erro (retry via Cloud Tasks)
    media_stored --> failed
    failed --> captured: retry (backoff exponencial, máx 5)
    failed --> dead_letter: esgotou retries → alerta
```

---

## 3. Diagrama de componentes

```mermaid
flowchart TB
    subgraph Client["Cliente"]
        direction LR
        C1[chrome-extension<br/>MV3, TypeScript]
        C2[web dashboard<br/>Next.js 15]
    end

    subgraph Services["Serviços (Cloud Run)"]
        direction LR
        S1[ingest-api<br/>Hono/Node 22]
        S2[enrichment-service<br/>worker HTTP]
        S3[rag-service<br/>chat + busca semântica]
        S4[digest-service<br/>resumos semanais/mensais]
    end

    subgraph Data["Dados"]
        D1[(Firestore)]
        D2[(Cloud Storage)]
    end

    subgraph AI["Vertex AI"]
        A1[Gemini 2.5 Flash<br/>enriquecimento]
        A2[Gemini 2.5 Pro<br/>chat RAG]
        A3[gemini-embedding-001]
    end

    subgraph Infra["Plataforma"]
        I1[Cloud Tasks]
        I2[Cloud Scheduler]
        I3[Secret Manager]
        I4[Cloud Logging + Monitoring]
        I5[Firebase Auth]
        I6[Cloud Build + GitHub Actions]
    end

    C1 -->|REST + Firebase JWT| S1
    C2 -->|REST + Firebase JWT| S1
    C2 --> S3
    S1 --> D1
    S1 --> I1
    I1 --> S2
    S2 --> A1 & A3
    S2 --> D1 & D2
    S3 --> A2 & A3
    S3 --> D1
    I2 --> S4
    S4 --> A1
    S4 --> D1
    C1 & C2 -.->|login Google| I5
    Services -.-> I3 & I4
```

### Responsabilidade de cada componente

| Componente | Responsabilidade | Tecnologia |
|------------|------------------|------------|
| `chrome-extension` | Detectar saves, extrair metadados, enviar à API; fila offline local | MV3, TS, IndexedDB |
| `ingest-api` | Autenticação, validação (Zod), dedupe, persistência raw, enfileirar | Cloud Run, Hono, Node 22 |
| `enrichment-service` | Download de mídia, análise Gemini, embeddings, atualização de agregados | Cloud Run (worker), Node 22 |
| `rag-service` | Busca vetorial, chat com a biblioteca (RAG), recomendações | Cloud Run, Node 22 |
| `digest-service` | Resumo semanal/mensal, detecção de padrões de comportamento | Cloud Run + Scheduler |
| `web` | Dashboard completo (Home, Biblioteca, Conteúdo, IA, Analytics) | Next.js 15 no Cloud Run |
| Firestore | Fonte de verdade: posts, coleções, tags, análises, embeddings, stats | Native mode, vector index |
| Cloud Storage | Capas, vídeos, thumbnails, exports de backup | Buckets com lifecycle |
| Cloud Tasks | Fila de enriquecimento com retry/backoff/dead-letter | Push para Cloud Run |
| Cloud Scheduler | Cron: digest semanal (dom 18h), mensal (dia 1), backup diário | — |

---

## 4. Decisões de arquitetura (ADRs resumidos)

### ADR-001 — Extensão Chrome como captura primária
**Contexto:** API oficial não expõe saved posts. **Decisão:** extensão MV3 passiva (observa a sessão real do usuário; não faz login automatizado nem scraping em servidor). **Consequências:** captura só ocorre com o navegador aberto; mitigada por sincronização retroativa ao abrir o Instagram web e fallback share-to-vault no mobile. Alternativas rejeitadas no [Doc 02](./02-captura-instagram.md).

### ADR-002 — Firestore como banco único (MVP)
**Contexto:** single-user, leitura pesada, escrita leve (~10–50 posts/dia), necessidade de tempo real no dashboard e busca vetorial. **Decisão:** Firestore Native com índice vetorial nativo (`findNearest`). **Consequências:** zero ops, custo ~zero; limite prático de KNN nativo aceitável até ~1M docs. Ponto de migração definido: quando `posts > 500k` ou p95 de busca > 300 ms → Vertex AI Vector Search (V3).

### ADR-003 — Pipeline assíncrono com Cloud Tasks (não Pub/Sub)
**Contexto:** enriquecimento leva 5–20 s (Gemini + mídia). **Decisão:** Cloud Tasks (push HTTP → Cloud Run) em vez de Pub/Sub. **Motivo:** retry configurável por fila, rate limiting nativo (protege cota do Gemini), dedupe por task name, sem necessidade de fan-out. Pub/Sub entra na V3 se houver múltiplos consumidores.

### ADR-004 — Monorepo com pnpm workspaces + Turborepo
Apps (`web`, `extension`) + serviços (`ingest-api`, `enrichment`, `rag`, `digest`) + pacotes compartilhados (`shared` com schemas Zod/tipos, `ai` com prompts, `ui`). Um único pipeline de CI, tipos ponta a ponta.

### ADR-005 — Structured Output do Gemini com JSON Schema
Todo enriquecimento usa `responseSchema` (JSON mode) — nunca parsing de texto livre. Garante os ~20 campos do enriquecimento sempre válidos; falha de schema → retry com temperatura menor → dead-letter.

### ADR-006 — Single-tenant com modelagem multi-tenant
Tudo é escopado por `users/{uid}` desde o dia 1 (subcoleções). Custo zero agora, e a versão Enterprise (multiusuário/times) não exige migração de dados.

---

## 5. Requisitos não-funcionais

| Atributo | Meta MVP | Meta V3 |
|----------|----------|---------|
| Latência de busca (p95) | < 500 ms | < 200 ms |
| Tempo captura → indexado | < 60 s | < 20 s |
| Disponibilidade dashboard | 99,5% | 99,9% |
| Perda de capturas | 0 (fila offline na extensão) | 0 |
| Custo mensal (1 usuário) | < US$ 15 | < US$ 40 |
| RPO (backup) | 24 h | 1 h |
| RTO | 4 h | 30 min |
