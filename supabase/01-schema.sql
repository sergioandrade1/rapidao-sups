-- ============================================================
-- Rapidão Suplementos — estrutura do catálogo
-- Rode este arquivo PRIMEIRO, no SQL Editor do Supabase.
--
-- Como "Automatically expose new tables" está desligado, cada tabela
-- precisa de GRANT explícito. E como a chave do site é pública, o que
-- protege os dados é a RLS: leitura liberada, escrita bloqueada.
-- ============================================================

-- ---------- Categorias ----------
create table if not exists public.categorias (
  id        bigint generated always as identity primary key,
  slug      text not null unique,
  nome      text not null,
  emoji     text,
  destaque  boolean not null default false,
  ordem     integer not null default 0
);

-- ---------- Produtos ----------
create table if not exists public.produtos (
  id                 bigint generated always as identity primary key,
  slug               text not null unique,
  nome               text not null,
  marca              text not null,
  categoria_slug     text not null references public.categorias (slug),
  -- Preços SEMPRE em centavos: float em dinheiro acumula erro no carrinho.
  preco_centavos     integer not null check (preco_centavos > 0),
  preco_de_centavos  integer check (preco_de_centavos is null or preco_de_centavos > preco_centavos),
  tag                text,
  nota               smallint not null default 5 check (nota between 1 and 5),
  avaliacoes         integer not null default 0,
  estoque            integer not null default 0 check (estoque >= 0),
  destaque           boolean not null default false,
  mais_vendido       boolean not null default false,
  ativo              boolean not null default true,
  criado_em          timestamptz not null default now()
);

create index if not exists produtos_categoria_idx on public.produtos (categoria_slug);
create index if not exists produtos_criado_em_idx on public.produtos (criado_em desc);

-- ---------- Imagens ----------
create table if not exists public.produto_imagens (
  id         bigint generated always as identity primary key,
  produto_id bigint not null references public.produtos (id) on delete cascade,
  url        text not null,
  ordem      integer not null default 0
);

create index if not exists produto_imagens_produto_idx on public.produto_imagens (produto_id);

-- ---------- Variantes (sabor/tamanho) ----------
create table if not exists public.produto_variantes (
  id             bigint generated always as identity primary key,
  produto_id     bigint not null references public.produtos (id) on delete cascade,
  rotulo         text not null,
  preco_centavos integer check (preco_centavos is null or preco_centavos > 0),
  estoque        integer not null default 0 check (estoque >= 0)
);

create index if not exists produto_variantes_produto_idx on public.produto_variantes (produto_id);

-- ============================================================
-- Segurança
-- ============================================================
alter table public.categorias         enable row level security;
alter table public.produtos           enable row level security;
alter table public.produto_imagens    enable row level security;
alter table public.produto_variantes  enable row level security;

-- Catálogo é vitrine: qualquer visitante pode LER.
drop policy if exists "leitura publica" on public.categorias;
create policy "leitura publica" on public.categorias for select using (true);

drop policy if exists "leitura publica" on public.produtos;
create policy "leitura publica" on public.produtos for select using (ativo);

drop policy if exists "leitura publica" on public.produto_imagens;
create policy "leitura publica" on public.produto_imagens for select using (true);

drop policy if exists "leitura publica" on public.produto_variantes;
create policy "leitura publica" on public.produto_variantes for select using (true);

-- Nenhuma policy de insert/update/delete: ninguém escreve com a chave pública.
-- O cadastro de produtos será feito pelo painel do Supabase ou por uma área
-- administrativa autenticada, mais adiante.

-- Sem estes GRANTs as tabelas ficam invisíveis para a API.
grant select on public.categorias        to anon, authenticated;
grant select on public.produtos          to anon, authenticated;
grant select on public.produto_imagens   to anon, authenticated;
grant select on public.produto_variantes to anon, authenticated;
