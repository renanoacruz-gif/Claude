# 10 — Guia de Execução Passo a Passo

> Este é o manual "mão na massa": do zero absoluto até o Renan Vault rodando, na ordem exata de execução. Cada fase termina com um **checkpoint verificável** — não avance sem ele passar.

**Pré-requisitos na sua máquina:**
- Node.js 22+ e pnpm 9+ (`npm i -g pnpm`)
- gcloud CLI (`curl https://sdk.cloud.google.com | bash`) e Firebase CLI (`npm i -g firebase-tools`)
- Terraform 1.8+ · Git · Chrome
- Conta Google (a mesma que você usará para login no Vault)
- Cartão cadastrado no Google Cloud (billing) — gasto esperado: US$ 5–15/mês

---

## FASE 0 — Fundação Google Cloud (dia 1, ~2h)

### 0.1 Criar os projetos

```bash
gcloud auth login

# Projeto de desenvolvimento e produção
gcloud projects create renan-vault-dev  --name="Renan Vault Dev"
gcloud projects create renan-vault-prod --name="Renan Vault Prod"

# Vincular billing (pegue o ID com: gcloud billing accounts list)
gcloud billing projects link renan-vault-dev  --billing-account=XXXXXX-XXXXXX-XXXXXX
gcloud billing projects link renan-vault-prod --billing-account=XXXXXX-XXXXXX-XXXXXX

# Trabalhe primeiro no dev
gcloud config set project renan-vault-dev
```

### 0.2 Ativar as APIs necessárias

```bash
gcloud services enable \
  run.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  aiplatform.googleapis.com \
  cloudtasks.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  identitytoolkit.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com
```

### 0.3 Criar Firestore, Storage e fila

```bash
# Firestore Native em São Paulo
gcloud firestore databases create --location=southamerica-east1

# Bucket de mídia (capas, vídeos) e de backups
gcloud storage buckets create gs://renan-vault-dev-media \
  --location=southamerica-east1 --uniform-bucket-level-access
gcloud storage buckets create gs://renan-vault-dev-backups \
  --location=southamerica-east1 --uniform-bucket-level-access
gcloud storage buckets update gs://renan-vault-dev-media --versioning

# Fila de enriquecimento (rate limit protege a cota do Gemini)
gcloud tasks queues create enrich-queue \
  --location=southamerica-east1 \
  --max-dispatches-per-second=2 \
  --max-attempts=5 --min-backoff=10s --max-backoff=300s
```

### 0.4 Alerta de custo (não pule!)

```bash
gcloud billing budgets create \
  --billing-account=XXXXXX-XXXXXX-XXXXXX \
  --display-name="Vault guard" --budget-amount=25USD \
  --threshold-rule=percent=0.5 --threshold-rule=percent=0.8 \
  --threshold-rule=percent=1.0
```

### 0.5 Configurar Firebase (Auth)

```bash
firebase login
firebase projects:addfirebase renan-vault-dev
```

No [console Firebase](https://console.firebase.google.com) → projeto `renan-vault-dev`:
1. **Authentication → Sign-in method → Google → Ativar**
2. **Project settings → adicionar app Web** → copie o `firebaseConfig` (vai para o `.env` do frontend e da extensão)

✅ **Checkpoint 0:** `gcloud firestore databases list` mostra o banco; console Firebase mostra Google Sign-In ativo; alerta de budget criado.

---

## FASE 1 — Monorepo e código base (dias 2–3)

### 1.1 Bootstrap do repositório

```bash
mkdir renan-vault && cd renan-vault && git init
pnpm init

cat > pnpm-workspace.yaml <<'EOF'
packages:
  - "apps/*"
  - "services/*"
  - "packages/*"
EOF

pnpm add -D turbo typescript vitest @types/node
mkdir -p apps/{web,extension} services/{ingest-api,enrichment,rag,digest} \
         packages/{shared,ig-parser,ai,ui} infra/{terraform,firebase}
```

Estrutura completa de pastas: ver [Doc 04](./04-apis-e-estrutura.md). Crie na ordem: `packages/shared` (schemas Zod — tudo depende dele) → `packages/ig-parser` → serviços → apps.

### 1.2 Schemas compartilhados primeiro

Em `packages/shared`, implemente os schemas Zod de `Post`, `AiAnalysis` e do payload de `/v1/ingest` exatamente como no [Doc 03](./03-modelo-de-dados.md). **Todo o resto valida contra eles** — extensão, API e workers.

### 1.3 Emuladores locais

```bash
cd infra/firebase
firebase init emulators   # selecione: Auth, Firestore, Storage
firebase emulators:start
```

✅ **Checkpoint 1:** `pnpm turbo build` passa; emuladores abrem em `localhost:4000`.

---

## FASE 2 — API de ingestão (dias 4–6)

### 2.1 Implementar `services/ingest-api`

Rotas mínimas (contratos no [Doc 04](./04-apis-e-estrutura.md)): `POST /v1/ingest`, `POST /v1/ingest/batch`, `GET /v1/posts/:id/status`. Middleware: verificação do Firebase ID token → `uid`; validação Zod; dedupe por `shortcode`; grava `users/{uid}/posts/{shortcode}` com `status=captured`; enfileira no Cloud Tasks.

### 2.2 Testar localmente contra os emuladores

```bash
cd services/ingest-api && pnpm dev
curl -X POST localhost:8080/v1/ingest \
  -H "Authorization: Bearer $(firebase auth token de teste)" \
  -H "Content-Type: application/json" -d @fixtures/ingest-example.json
# Esperado: 202 {"postId":"...","status":"captured"}
```

### 2.3 Primeiro deploy no Cloud Run

```bash
# Service accounts com menor privilégio (papéis: Doc 06)
gcloud iam service-accounts create sa-ingest
gcloud projects add-iam-policy-binding renan-vault-dev \
  --member="serviceAccount:sa-ingest@renan-vault-dev.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
gcloud projects add-iam-policy-binding renan-vault-dev \
  --member="serviceAccount:sa-ingest@renan-vault-dev.iam.gserviceaccount.com" \
  --role="roles/cloudtasks.enqueuer"

# Build + deploy direto do código-fonte
gcloud run deploy ingest-api \
  --source services/ingest-api \
  --region southamerica-east1 \
  --service-account sa-ingest@renan-vault-dev.iam.gserviceaccount.com \
  --allow-unauthenticated \
  --min-instances 0 --max-instances 5
```

✅ **Checkpoint 2:** `curl` contra a URL do Cloud Run retorna 202 e o doc aparece no Firestore (console GCP).

---

## FASE 3 — Extensão Chrome (dias 7–11)

### 3.1 Gravar os fixtures do Instagram (fazer ANTES de codar o parser)

1. Abra `instagram.com` logado, DevTools → aba Network → filtro `graphql`.
2. **Salve um post numa coleção** e copie o request/response da mutation de save (contém o `collection_id`).
3. Abra `instagram.com/SEU_USER/saved/`, role uma coleção e copie os JSONs de listagem.
4. Salve tudo em `packages/ig-parser/fixtures/2026-07/` — são a base dos testes de contrato.

### 3.2 Implementar `packages/ig-parser` + extensão

Arquitetura da extensão no [Doc 02](./02-captura-instagram.md): main-world interceptor → content script → service worker → fila IndexedDB → `POST /v1/ingest`.

### 3.3 Instalar e testar

```bash
cd apps/extension && pnpm build   # gera dist/
```

1. Chrome → `chrome://extensions` → ativar **Developer mode** → **Load unpacked** → pasta `dist/`.
2. Clique no ícone da extensão → **Entrar com Google** (mesma conta do Firebase).
3. Abra o Instagram e **salve um post em uma coleção**.

✅ **Checkpoint 3 (o momento mais importante do projeto):** toast "✅ Salvo no Vault → [coleção]" aparece, e o post está no Firestore com caption, autor, coleção e URLs de mídia. Depois, abra sua página /saved/ e role as coleções — a sync retroativa deve popular o histórico em lotes.

---

## FASE 4 — Enriquecimento com IA (dias 12–16)

### 4.1 Service account e worker

```bash
gcloud iam service-accounts create sa-enrichment
for role in roles/datastore.user roles/aiplatform.user; do
  gcloud projects add-iam-policy-binding renan-vault-dev \
    --member="serviceAccount:sa-enrichment@renan-vault-dev.iam.gserviceaccount.com" \
    --role="$role"; done
gcloud storage buckets add-iam-policy-binding gs://renan-vault-dev-media \
  --member="serviceAccount:sa-enrichment@renan-vault-dev.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

gcloud run deploy enrichment \
  --source services/enrichment \
  --region southamerica-east1 \
  --service-account sa-enrichment@renan-vault-dev.iam.gserviceaccount.com \
  --no-allow-unauthenticated \
  --min-instances 0 --max-instances 3 --concurrency 4 --memory 1Gi
```

Implemente o pipeline do [Doc 05](./05-ia-embeddings-busca.md): baixar mídia → Gemini 2.5 Flash com `responseSchema` (prompt `enrich_v1` em `packages/ai`) → validação Zod → `gemini-embedding-001` (768d) → grava `ai` + `embedding` + `status=indexed` → atualiza `stats/`, `tags/`, `authors/`.

### 4.2 Criar o índice vetorial

```bash
gcloud firestore indexes composite create \
  --collection-group=posts --query-scope=COLLECTION \
  --field-config=vector-config='{"dimension":768,"flat":{}}',field-path=embedding
```

### 4.3 Deploy do rag-service (busca semântica)

```bash
gcloud iam service-accounts create sa-rag
# papéis datastore.user + aiplatform.user (como acima)
gcloud run deploy rag --source services/rag --region southamerica-east1 \
  --service-account sa-rag@renan-vault-dev.iam.gserviceaccount.com \
  --allow-unauthenticated --min-instances 0
```

✅ **Checkpoint 4:** salve um post no Instagram → em até 60 s o doc no Firestore tem `ai.execSummary`, `ai.category`, embedding e `status=indexed`. Teste: `POST /v1/search/semantic {"query":"negociação"}` retorna os posts certos ranqueados.

---

## FASE 5 — Dashboard (dias 17–28)

### 5.1 Criar o app

```bash
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --app
pnpm add firebase @tanstack/react-query zustand framer-motion minisearch cmdk
pnpm dlx shadcn@latest init   # tema dark, tokens do Doc 08
```

Ordem de implementação (specs no [Doc 08](./08-ux-design.md)):
1. Login Google + auth guard + app shell (sidebar, tema dark)
2. **Biblioteca**: grid de cards + lista, filtros facetados, busca instantânea (MiniSearch) + busca semântica (rag-service)
3. **Página do Conteúdo**: mídia, análise da IA, checklist, anotações, lifecycle (Favorito / Quero testar / Implementado / Arquivado), relacionados
4. **Home**: stats, recentes, importantes, badge "✨ enriquecendo…" em tempo real (onSnapshot)
5. Command palette ⌘K + atalhos (J/K, F, T/I/E)

### 5.2 Regras de segurança + deploy

```bash
cd infra/firebase
firebase deploy --only firestore:rules,firestore:indexes,storage

cd apps/web
gcloud run deploy web --source . --region southamerica-east1 \
  --allow-unauthenticated --min-instances 0
```

✅ **Checkpoint 5:** fluxo completo funciona na URL do Cloud Run: salvar no Instagram → post aparece na Home enriquecido → busca "restaurantes" encontra → abrir post → marcar "Implementado".

---

## FASE 6 — Go-live: backfill do seu histórico (dias 29–30)

1. **Sync retroativa:** abra `instagram.com/SEU_USER/saved/`, entre em **cada coleção** e role até o fim, **devagar** (ritmo humano — a extensão captura em lotes enquanto você rola). Faça 2–3 coleções por dia, não tudo de uma vez.
2. **Export oficial (garantia):** Instagram → Configurações → Central de Contas → **Baixar suas informações** → JSON → quando chegar o ZIP, arraste em `/settings/import` no dashboard para reconciliar o que faltou.
3. **Backfill de enriquecimento em lote:** dispare o reprocessamento via Batch API (50% mais barato): `POST /v1/posts/reprocess?from=...` — 2.000 posts ≈ US$ 8–15, roda em algumas horas.
4. **Agendar rotinas:**

```bash
# Backup diário do Firestore
gcloud scheduler jobs create http firestore-backup \
  --location=southamerica-east1 --schedule="0 3 * * *" \
  --uri="https://firestore.googleapis.com/v1/projects/renan-vault-dev/databases/(default):exportDocuments" \
  --oauth-service-account-email=sa-digest@renan-vault-dev.iam.gserviceaccount.com \
  --message-body='{"outputUriPrefix":"gs://renan-vault-dev-backups"}'

# Digest semanal (domingo 18h) — quando o digest-service existir (V2)
gcloud scheduler jobs create http weekly-digest \
  --location=southamerica-east1 --schedule="0 18 * * 0" \
  --uri="https://digest-XXXX.run.app/tasks/digest" \
  --oidc-service-account-email=sa-digest@renan-vault-dev.iam.gserviceaccount.com
```

✅ **Checkpoint 6 — VOCÊ ESTÁ EM PRODUÇÃO:** todo o seu histórico está pesquisável; pergunte "quais restaurantes italianos salvei?" e receba a resposta.

---

## FASE 7 — Operação contínua (rotina)

| Frequência | Ação |
|---|---|
| Diário (automático) | Backup Firestore; alertas de custo/pipeline vigiam sozinhos |
| Ao usar o Instagram | Nada — a extensão captura sozinha |
| Semanal (5 min) | Olhar `/settings/system`: fila, dead-letter, custo do mês |
| Ao receber alerta `parse_miss` | Instagram mudou: gravar novo fixture (passo 3.1), atualizar `ig-parser`, reprocessar dead-letter (runbook `parse-miss.md`) |
| Trimestral | Novo export DYI para reconciliação; teste de restore do backup |
| A cada release | `pnpm turbo test` + eval de prompts (50 posts dourados) antes do deploy |

## Sequência das próximas versões

Com o MVP no ar, siga a ordem do [Doc 09](./09-roadmap-backlog.md): **Sprint 6** chat RAG (a funcionalidade de maior valor pós-busca) → **Sprint 7** Analytics + digest → **Sprint 8** share-to-vault mobile + análise de vídeo → **Sprint 9** UX premium (masonry, modos foco/apresentação, drag & drop).

## Solução de problemas frequentes

| Sintoma | Causa provável | Ação |
|---|---|---|
| Toast não aparece ao salvar | Instagram mudou o payload GraphQL | DevTools na aba do IG → ver erro do content script → atualizar fixture + parser |
| Post fica em `captured` para sempre | Fila/worker com erro | `gcloud tasks queues describe enrich-queue` + logs do enrichment no Cloud Logging |
| Gemini retorna JSON inválido | Prompt/schema divergentes | Retry automático já cobre; se persistir, rodar eval e ajustar prompt |
| Busca semântica vazia | Índice vetorial ainda em build | `gcloud firestore indexes composite list` — aguardar `READY` |
| 401 na API | Token Firebase expirado na extensão | Logout/login no popup; verificar refresh no service worker |
| Custo subiu | Reprocessamento em massa sem Batch API | Ver métrica `gemini_cost_usd`; usar Batch para lotes |
