# OrçaPro — MVP de orçamentos para prestadores de serviço

App estático (HTML/CSS/JS, sem build). Abra `orcamentos/index.html` no navegador. Dados ficam no `localStorage` (backup/importação em Configurações).

Fluxo: cliente → pedido → serviços e materiais → orçamento → revisão → PDF → acompanhamento.

| Arquivo | Responsabilidade |
|---|---|
| `js/catalog.js` | Especialidades, unidades, sugestões de serviço (sem preço), campos extras do pedido, modelos de inclusões/exclusões |
| `js/calc.js` | Cálculos determinísticos em centavos inteiros |
| `js/store.js` | Persistência local, numeração, histórico |
| `js/ai.js` | Triagem da mensagem do cliente: API Claude (chave opcional) ou extrator local por regras |
| `js/pdf.js` | Proposta imprimível (salvar como PDF pelo navegador) |
| `js/app.js` | UI, onboarding, rotas e regras de revisão |

Regras principais:
- IA só sugere; nada entra no pedido sem confirmação. Valores extraídos sem trecho literal na mensagem são descartados.
- Etapa de avaliação (pendente / aguardando visita / pronto) separada do status comercial (rascunho / enviado / aprovado / perdido).
- Avaliação não concluída exige "Estimativa preliminar" ou "Aguardando visita técnica".
- PDF e "enviado" exigem revisão confirmada; qualquer alteração posterior invalida a revisão e gera nova versão.

Testes: `node orcamentos/tests/calc.test.js`
