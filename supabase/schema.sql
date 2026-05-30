-- ============================================================
-- Schema do Sistema Operacional da Vida
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- ============================================================

-- ============================================================
-- TABELA: tarefas
-- ============================================================
create table if not exists public.tarefas (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  titulo        text not null,
  descricao     text,
  data_limite   date,
  concluida     boolean not null default false,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Índices para performance
create index if not exists tarefas_user_id_idx on public.tarefas(user_id);
create index if not exists tarefas_data_limite_idx on public.tarefas(data_limite);

-- Atualiza automaticamente o campo atualizado_em
create or replace function public.atualizar_timestamp()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create or replace trigger tarefas_atualizado_em
  before update on public.tarefas
  for each row execute function public.atualizar_timestamp();

-- Row Level Security
alter table public.tarefas enable row level security;

create policy "Usuário lê suas tarefas"
  on public.tarefas for select
  using (auth.uid() = user_id);

create policy "Usuário cria suas tarefas"
  on public.tarefas for insert
  with check (auth.uid() = user_id);

create policy "Usuário edita suas tarefas"
  on public.tarefas for update
  using (auth.uid() = user_id);

create policy "Usuário exclui suas tarefas"
  on public.tarefas for delete
  using (auth.uid() = user_id);


-- ============================================================
-- TABELA: datas_especiais
-- ============================================================
create table if not exists public.datas_especiais (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  nome          text not null,
  data          date not null,
  tipo          text not null default 'aniversario' check (tipo in ('aniversario', 'evento')),
  recorrente    boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists datas_especiais_user_id_idx on public.datas_especiais(user_id);

create or replace trigger datas_especiais_atualizado_em
  before update on public.datas_especiais
  for each row execute function public.atualizar_timestamp();

alter table public.datas_especiais enable row level security;

create policy "Usuário lê suas datas"
  on public.datas_especiais for select
  using (auth.uid() = user_id);

create policy "Usuário cria suas datas"
  on public.datas_especiais for insert
  with check (auth.uid() = user_id);

create policy "Usuário edita suas datas"
  on public.datas_especiais for update
  using (auth.uid() = user_id);

create policy "Usuário exclui suas datas"
  on public.datas_especiais for delete
  using (auth.uid() = user_id);


-- ============================================================
-- TABELA: notas
-- ============================================================
create table if not exists public.notas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  conteudo   text not null,
  criado_em  timestamptz not null default now()
);

create index if not exists notas_user_id_idx on public.notas(user_id);

alter table public.notas enable row level security;

create policy "Usuário lê suas notas"
  on public.notas for select
  using (auth.uid() = user_id);

create policy "Usuário cria suas notas"
  on public.notas for insert
  with check (auth.uid() = user_id);

create policy "Usuário edita suas notas"
  on public.notas for update
  using (auth.uid() = user_id);

create policy "Usuário exclui suas notas"
  on public.notas for delete
  using (auth.uid() = user_id);


-- ============================================================
-- TABELA: configuracoes
-- ============================================================
create table if not exists public.configuracoes (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  resumo_hora          time default '08:00',
  tema                 text default 'escuro' check (tema in ('escuro', 'claro')),
  notificacoes_ativas  boolean default false,
  atualizado_em        timestamptz not null default now()
);

create or replace trigger configuracoes_atualizado_em
  before update on public.configuracoes
  for each row execute function public.atualizar_timestamp();

alter table public.configuracoes enable row level security;

create policy "Usuário lê suas configurações"
  on public.configuracoes for select
  using (auth.uid() = user_id);

create policy "Usuário salva suas configurações"
  on public.configuracoes for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza suas configurações"
  on public.configuracoes for update
  using (auth.uid() = user_id);


-- ============================================================
-- TRIGGER: cria configurações padrão ao registrar novo usuário
-- ============================================================
create or replace function public.criar_configuracoes_usuario()
returns trigger language plpgsql security definer as $$
begin
  insert into public.configuracoes(user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create or replace trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_configuracoes_usuario();
