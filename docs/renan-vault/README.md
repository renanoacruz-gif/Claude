# Renan Vault — Documentação de Arquitetura

> **Transforme tudo o que você salva no Instagram em uma base de conhecimento inteligente, pesquisável e acionável.**

O Instagram é hoje seu "inbox" de conhecimento — mas funciona apenas como armazenamento. O Renan Vault captura tudo o que você salva (com a coleção de origem), enriquece com IA (Gemini), indexa semanticamente (embeddings + busca vetorial) e entrega um dashboard premium para pesquisar, conversar e **agir** sobre esse conhecimento.

---

## Índice da documentação

| Doc | Conteúdo |
|-----|----------|
| [01 — Arquitetura do Sistema](./01-arquitetura.md) | Visão geral, fluxogramas, diagrama de componentes, decisões de arquitetura (ADRs) |
| [02 — Captura do Instagram](./02-captura-instagram.md) | Comparação técnica das estratégias de captura, riscos, ToS, arquitetura recomendada |
| [03 — Modelo de Dados](./03-modelo-de-dados.md) | Diagrama do banco, modelagem de todas as entidades, índices, estratégia Firestore |
| [04 — APIs e Estrutura de Pastas](./04-apis-e-estrutura.md) | Contratos REST, eventos internos, monorepo, estrutura de pastas |
| [05 — Estratégia de IA](./05-ia-embeddings-busca.md) | Enriquecimento com Gemini, embeddings, busca vetorial, RAG, personalização |
| [06 — Segurança e Autenticação](./06-seguranca.md) | Firebase Auth, criptografia, controle de acesso, LGPD, backup, versionamento |
| [07 — Operação](./07-operacao-deploy-custos.md) | Deploy, CI/CD, monitoramento, observabilidade, custos GCP, escalabilidade, testes |
| [08 — UX e Design System](./08-ux-design.md) | Interface dark premium, telas, atalhos, interações, modos de visualização |
| [09 — Roadmap e Backlog](./09-roadmap-backlog.md) | MVP → V2 → V3 → Enterprise, backlog priorizado em épicos/sprints, plano passo a passo |

---

## O produto em uma frase

**"Second Brain automático para o Instagram"**: você salva um post na coleção certa (como já faz hoje) e, minutos depois, ele aparece no seu Vault — resumido, categorizado, taggeado, com insights, checklist de ações e pesquisável por linguagem natural.

## Princípios de produto

1. **Zero fricção na captura.** O comportamento do usuário não muda: salvar no Instagram continua sendo o único gesto. Tudo o mais é automático.
2. **Conhecimento > armazenamento.** Cada item deve responder: *o que é isso, por que salvei, o que faço com isso?*
3. **Busca instantânea.** Qualquer pergunta em linguagem natural encontra o conteúdo certo em < 500 ms percebidos.
4. **Do salvar ao fazer.** O sistema mede implementação (salvei → testei → implementei), não só acúmulo.
5. **Privacidade primeiro.** Dados pessoais, single-tenant por padrão, LGPD by design.

## Decisões-chave (resumo executivo)

| Decisão | Escolha | Por quê |
|---------|---------|---------|
| Captura | **Extensão Chrome (MV3)** observando a sessão real do usuário | Única estratégia que roda dentro da sessão legítima, sem credenciais armazenadas em servidor, com menor risco de bloqueio (detalhes no [Doc 02](./02-captura-instagram.md)) |
| Backend | **Cloud Run** (API) + **Cloud Tasks/PubSub** (pipeline assíncrono) | Serverless, escala a zero, custo ~zero para 1 usuário |
| Banco | **Firestore (Native mode)** com **vector search nativo** | Sem servidor, tempo real para o dashboard, KNN nativo suficiente até ~1M itens; migração para Vertex AI Vector Search prevista na V3 |
| Enriquecimento | **Gemini 2.5 Flash** com *structured output* (JSON Schema) | Melhor custo/qualidade para extração estruturada; Pro reservado para o chat RAG |
| Embeddings | **Vertex AI `gemini-embedding-001`** (multilíngue, 768d truncado) | Conteúdo em PT-BR + EN; 768 dimensões equilibram custo de storage e recall |
| Frontend | **Next.js 15 + React + TS + Tailwind + shadcn/ui + Framer Motion** | Stack pedida; App Router + React Query + Zustand |
| Auth | **Firebase Authentication (Google Sign-In)** | Integra nativamente com Firestore Security Rules e o restante do GCP |
| Deploy | **Cloud Build + GitHub Actions → Cloud Run / Firebase Hosting** | CI/CD gerenciado, rollback nativo por revisão |

## Custo estimado (1 usuário ativo, ~300 posts/mês)

**≈ US$ 5–15/mês** — dominado por Gemini (enriquecimento) e Cloud Run min-instances=0. Detalhamento completo no [Doc 07](./07-operacao-deploy-custos.md).

## Aviso importante sobre o Instagram

A API oficial do Instagram **não expõe posts salvos/coleções**. Toda estratégia de captura automática opera em área cinzenta dos Termos de Uso da Meta. O [Doc 02](./02-captura-instagram.md) compara todas as opções com riscos explícitos e recomenda a arquitetura que minimiza risco técnico e de conta: **extensão de navegador passiva + fallback manual (share-to-vault)**. O sistema é desenhado para que a camada de captura seja **plugável** — se o Instagram mudar, só essa camada é trocada.
