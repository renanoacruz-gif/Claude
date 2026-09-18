# Forecast Comercial

Aplicativo web de Forecast + Pipeline + Reporte Gerencial para Executivos de Soluções e Negócios e seus
gestores. Não é um CRM: não há leads, contatos, atividades, tarefas ou funil de vendas — apenas o registro rápido
de oportunidades e a visão consolidada para o gestor.

## Stack

Next.js 16 (App Router, Server Components + Server Actions), TypeScript, Tailwind CSS v4, SQLite
(`better-sqlite3`, arquivo local em `data/forecast.db`, criado e populado automaticamente no primeiro start),
sessão em cookie assinado (JWT via `jose`), senhas com `bcryptjs`.

Não há chamadas de API/JSON internas: toda leitura acontece em Server Components (consultas diretas ao SQLite) e
toda escrita via Server Actions, com autorização verificada no servidor (por perfil e por dono do registro), não
apenas na interface.

## Como rodar

```bash
npm install
npm run dev     # http://localhost:3000
```

No primeiro acesso o banco é criado e populado com dados de demonstração:

| Perfil     | E-mail            | Senha   |
|------------|--------------------|---------|
| Gestor     | gestor@demo.com    | demo123 |
| Executivo  | ana@demo.com       | demo123 |
| Executivo  | bruno@demo.com     | demo123 |
| Executivo  | carla@demo.com     | demo123 |

`npm run build && npm run start` para rodar em modo produção.

## Perfis e permissões

- **Executivo de Soluções e Negócios**: vê e gerencia apenas as próprias oportunidades (criar, editar, excluir
  quando ainda não vendida/perdida), próprio histórico e própria conexão com Google Sheets.
- **Coordenador / Gerente / Administrador**: leitura de todas as oportunidades e históricos, dashboards
  consolidados, visão por Executivo, gestão de usuários (criar, ativar/desativar). Não cria nem edita
  oportunidades de outros Executivos.

O controle é aplicado em cada Server Action e em cada consulta ao banco (`lib/db.ts`), não apenas escondendo
botões na interface.

## Histórico de forecast

Toda vez que uma oportunidade é criada ou atualizada, um snapshot é gravado em `forecast_snapshots` — o forecast
de um período nunca é sobrescrito. As telas de Histórico (executivo e gestor) e o painel "O que mudou desde o
último reporte" são derivados desses snapshots.

## Integração com Google Sheets

Cada Executivo conecta sua própria planilha (ID + nome da aba) e sincroniza sob demanda. Nesta versão a
importação usa a exportação pública em CSV do Google Sheets (`.../gviz/tq?tqx=out:csv`), que não exige
credenciais — basta a planilha estar compartilhada como "Qualquer pessoa com o link". A deduplicação usa a
combinação Cliente + Descrição da oportunidade por Executivo (atualiza se já existir, cria caso contrário).

A tabela `sheets_connections` e o fluxo já isolam a lógica de sincronização (`src/actions/sheets.ts`) para que, no
futuro, uma sincronização bidirecional com OAuth do Google Cloud (login Google, planilhas privadas, escrita de
volta) possa ser adicionada sem mudar o restante da arquitetura — isso exigirá credenciais (Client ID/Secret) que
não existem neste ambiente.

## Limitações conhecidas do MVP

- Recuperação de senha é simulada (não há provedor de e-mail configurado neste ambiente): a tela sempre confirma
  o envio, sem revelar quais e-mails existem, mas nenhum e-mail real é disparado.
- Tipos de oportunidade ficam em uma tabela própria (`opportunity_types`) pensada para configuração futura, mas o
  MVP não inclui tela de administração desses tipos (fora do escopo obrigatório).
