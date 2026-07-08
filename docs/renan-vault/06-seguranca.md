# 06 — Segurança, Autenticação e LGPD

## 1. Autenticação

- **Firebase Authentication com Google Sign-In** como único método (conta pessoal do usuário).
- **Web:** `signInWithPopup` → ID token (1 h) renovado automaticamente pelo SDK; sessão persistida com `browserLocalPersistence`.
- **Extensão:** `chrome.identity.launchWebAuthFlow` → credencial Google → `signInWithCredential` no service worker; refresh token guardado em `chrome.storage.session`/`local` criptografado pelo perfil do Chrome.
- **Serviços:** `firebase-admin.verifyIdToken()` em middleware; o `uid` do token é a **única** fonte de escopo de dados.
- **Serviço-a-serviço:** OIDC (Cloud Tasks → enrichment; Scheduler → digest) com service accounts dedicadas por serviço e `roles/run.invoker` restrito.
- **Allowlist:** MVP restringe login ao(s) e-mail(s) autorizados via custom claim `allowed=true` (Cloud Function no primeiro login) — o Vault não é um serviço aberto.

## 2. Autorização e regras

### Firestore Security Rules (essência)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == uid
                         && request.auth.token.allowed == true;
    }
    // Campos de pipeline só mudam via Admin SDK (serviços):
    match /users/{uid}/posts/{postId} {
      allow update: if request.auth.uid == uid
        && !request.resource.data.diff(resource.data).affectedKeys()
             .hasAny(['ai', 'embedding', 'status', 'media']);
    }
  }
}
```

### Storage Rules

`users/{uid}/**` legível apenas pelo próprio `uid`; escrita somente pelos serviços (Admin). Mídia servida por **signed URLs curtas (15 min)** geradas no backend — nada de bucket público.

### IAM (menor privilégio)

| Service account | Papéis |
|---|---|
| `sa-ingest` | `datastore.user`, `cloudtasks.enqueuer` |
| `sa-enrichment` | `datastore.user`, `storage.objectAdmin` (só no bucket de mídia), `aiplatform.user` |
| `sa-rag` | `datastore.user` (leitura), `aiplatform.user` |
| `sa-digest` | `datastore.user`, `aiplatform.user` |
| Deploy (WIF) | `run.developer`, `cloudbuild.builds.editor` — via **Workload Identity Federation** (sem chaves JSON no GitHub) |

## 3. Criptografia

- **Em trânsito:** TLS 1.3 em tudo (Cloud Run gerencia certificados).
- **Em repouso:** criptografia padrão do Google (AES-256) em Firestore/GCS/logs. CMEK só na versão Enterprise.
- **Segredos:** exclusivamente no **Secret Manager** (API keys de terceiros se houver); serviços montam via referência de env var no Cloud Run; **zero segredos em código, CI ou `.env` commitado**.
- **Extensão:** não armazena nenhuma credencial do Instagram — captura opera na sessão nativa do navegador (ver Doc 02).

## 4. Proteções de API

- CORS restrito às origens da extensão (`chrome-extension://<id>`) e do dashboard.
- Rate limiting por `uid` (em memória + Firestore para persistente): ingest 120/min, chat 20/min.
- Zod em todo input; caption/anotações sanitizadas (XSS) antes de renderizar; CSP estrita no Next.js.
- App Check (reCAPTCHA Enterprise) no dashboard na V2.

## 5. Backup e versionamento

| Mecanismo | Frequência | Retenção | Cobre |
|---|---|---|---|
| **Firestore PITR** (point-in-time recovery) | contínuo | 7 dias | erro humano/lógico recente |
| **Export gerenciado do Firestore → GCS** (Scheduler + Function) | diário 03:00 | 30 diários + 12 mensais | disaster recovery |
| **GCS bucket de mídia → dual-region + Object Versioning** | contínuo | 30 dias de versões | deleção/overwrite acidental |
| **Export de portabilidade** (`GET /v1/export`, JSON+CSV) | sob demanda | download do usuário | LGPD art. 18 / lock-in zero |

- Anotações têm versionamento próprio (subcoleção `versions`, Doc 03).
- **Teste de restore trimestral** documentado (runbook em `infra/runbooks/restore.md`): RPO 24 h, RTO 4 h.

## 6. Logs e auditoria

- Cloud Logging estruturado (JSON) com `uid`, `postId`, `traceId` — **nunca** logar caption/conteúdo pessoal em nível INFO; conteúdo só em DEBUG com retenção de 3 dias.
- Cloud Audit Logs (Admin Activity + Data Access em Firestore) ativados.
- `history/` (event log de domínio) dá trilha de auditoria por item, exposta ao usuário na UI ("linha do tempo deste post").
- Retenção: logs de aplicação 30 dias; audit 400 dias (padrão).

## 7. LGPD (o titular é o próprio usuário — e terceiros aparecem nos dados)

**Papéis:** para dados próprios, o usuário é titular e controlador de fato. Mas posts capturados contêm **dados pessoais de terceiros** (autores: nome, foto, @) — tratados sob legítimo interesse para uso pessoal/doméstico (art. 4º, I — tratamento por pessoa natural para fins exclusivamente particulares fica fora do escopo da LGPD; ainda assim aplicamos as salvaguardas abaixo por design, prevendo a versão Enterprise, que É controladora).

| Direito (art. 18) | Implementação |
|---|---|
| Acesso / portabilidade | `GET /v1/export` — JSON completo + CSV, self-service |
| Eliminação | `DELETE /v1/me` — apaga Firestore (recursivo), mídia GCS, logs de app; job confirma purge em 30 dias |
| Correção | Todos os campos de IA são editáveis na UI |
| Informação sobre tratamento | Página `/settings/privacy` descreve o que é coletado, onde fica, quem processa (Google Cloud como operador, região `southamerica-east1`) |

**Princípios aplicados:**
- **Minimização:** só metadados de posts salvos; a extensão não vê DMs, feed ou navegação.
- **Localização:** todos os recursos em `southamerica-east1` (São Paulo) — dados não saem do Brasil (Vertex AI: usar `us-central1` apenas se o modelo não existir em SP, documentado como transferência internacional para país com salvaguardas — cláusula padrão Google).
- **TTL:** `searchLog` 180 dias; logs 30 dias.
- **Privacy by default:** tudo privado, nada compartilhável até a V2 (share explícito com URL assinada).

## 8. Modelo de ameaças (resumo)

| Ameaça | Mitigação |
|---|---|
| Token Firebase vazado | TTL 1 h + revogação por logout global + App Check (V2) |
| Extensão maliciosa clonada | ID da extensão fixado no CORS + App Check attest |
| Injeção via caption (prompt injection no enriquecimento) | Caption é tratada como dado (delimitada no prompt), saída forçada por schema fechado, sem tools no enriquecimento |
| Prompt injection no chat RAG | Conteúdo citado delimitado; tools do chat só operam no escopo do uid; ações destrutivas exigem confirmação na UI |
| Exfiltração por signed URL | TTL 15 min + escopo por objeto |
| Comprometimento da conta Google | 2FA obrigatório (política pessoal) + allowlist de e-mail |
