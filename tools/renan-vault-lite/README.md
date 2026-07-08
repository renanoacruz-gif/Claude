# Renan Vault Lite — uso imediato e pessoal

Versão local do Renan Vault: transforma seus posts salvos do Instagram em uma base de conhecimento pesquisável com IA, **rodando 100% na sua máquina**. Sem Google Cloud, sem deploy, sem custo de infraestrutura — só Node.js e uma chave gratuita do Gemini.

## Como funciona

- **Servidor local** (`server.js`, zero dependências) guarda tudo em `data/vault.json` — seus dados ficam com você.
- **Captura** por 3 vias: bookmarklet (1 clique no post aberto), colar URL no dashboard, ou importar o export oficial do Instagram (`saved_posts.json`).
- **Enriquecimento** com Gemini 2.5 Flash (resumo, categoria, tags, insights, ações…) e **busca semântica** com embeddings — usando a chave gratuita do Google AI Studio.
- **Chat** com sua biblioteca ("quais restaurantes italianos salvei?").

## Instalação (5 minutos)

1. **Pré-requisito:** Node.js 18+ (`node -v`).

2. **Pegue sua chave gratuita do Gemini:** acesse [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → *Create API key*. O free tier cobre o uso pessoal.

3. **Rode:**

```bash
cd tools/renan-vault-lite
node server.js
```

4. Abra **http://localhost:8787** → aba **Configurações** → cole a chave do Gemini → salvar.

## Capturando seus posts

### Via bookmarklet (recomendado — 1 clique)
Em **Configurações**, arraste o botão **"→ Vault"** para a barra de favoritos do Chrome. Depois, em qualquer post do Instagram aberto no navegador: clique no bookmarklet → informe a coleção → pronto. O post cai no Vault e é enriquecido automaticamente.

### Via URL
Aba **Biblioteca** → botão **+ Adicionar** → cole a URL do post (e a legenda, se quiser análise mais rica).

### Importando todo o seu histórico (export oficial da Meta)
1. Instagram → **Configurações → Central de Contas → Suas informações e permissões → Baixar suas informações** → formato **JSON**.
2. Quando o ZIP chegar (até 48h), extraia e localize `your_instagram_activity/saved/saved_posts.json`.
3. Aba **Configurações → Importar** → selecione o arquivo.
4. Clique em **Enriquecer tudo** — os posts são processados um a um pela IA (respeitando o rate limit do free tier).

> O export oficial não inclui legenda nem coleção — a IA analisa com o que há (URL, autor, data) e você pode completar depois. Para capturas ricas, use o bookmarklet no dia a dia.

## Uso diário

- **Busca instantânea** enquanto digita; botão **Busca IA** para busca semântica ("negociação" acha posts que nem usam essa palavra).
- **Chat**: "monte um roteiro com os lugares que salvei", "o que salvei sobre liderança e ainda não implementei?"
- Em cada post: **Favorito ★ · Quero testar · Implementado ✓ · Arquivar**.
- **Backup**: copie `data/vault.json` (ou use o botão Exportar). É um arquivo só — seus dados são portáveis para sempre.

## Limites desta versão (por design)

- Roda enquanto o `node server.js` estiver aberto (crie um atalho/serviço se quiser).
- Não captura automaticamente ao salvar no Instagram — isso exige a extensão Chrome da versão completa (ver `docs/renan-vault/`). O bookmarklet é o meio-termo: 1 clique.
- Imagens são referenciadas da CDN do Instagram (podem expirar); o conhecimento (texto/análise) é permanente.

Quando sentir que o Lite ficou pequeno, a documentação em `docs/renan-vault/` é o upgrade natural — o formato dos dados é compatível.
