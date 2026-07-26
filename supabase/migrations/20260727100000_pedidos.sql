-- ============================================================
-- Pedidos
--
-- Modelo de segurança diferente do catálogo. Produto é vitrine: qualquer um
-- lê. Pedido tem nome, telefone e endereço de cliente — ninguém pode ler, e
-- a escrita não pode passar direto pela tabela.
--
-- Por isso as tabelas ficam SEM policy e SEM grant: o site não as enxerga.
-- A única porta é a função `criar_pedido`, que roda com privilégio próprio
-- (security definer) e recalcula os preços no servidor.
-- ============================================================

create table if not exists public.pedidos (
  id                   bigint generated always as identity primary key,
  numero               text not null unique,
  criado_em            timestamptz not null default now(),
  status               text not null default 'novo'
                       check (status in ('novo','confirmado','em_rota','entregue','cancelado')),

  cliente_nome         text not null,
  cliente_telefone     text not null,
  cliente_email        text,

  cep                  text not null,
  rua                  text not null,
  numero_endereco      text not null,
  complemento          text,
  bairro               text not null,
  cidade               text not null,
  referencia           text,

  forma_pagamento      text not null
                       check (forma_pagamento in ('pix','credito','debito','dinheiro')),
  precisa_troco        boolean not null default false,
  troco_para_centavos  integer check (troco_para_centavos is null or troco_para_centavos > 0),
  observacao           text,

  subtotal_centavos    integer not null check (subtotal_centavos > 0),
  frete_centavos       integer not null check (frete_centavos >= 0),
  total_centavos       integer not null check (total_centavos > 0)
);

create index if not exists pedidos_criado_em_idx on public.pedidos (criado_em desc);
create index if not exists pedidos_status_idx on public.pedidos (status);

-- Os itens guardam CÓPIA de nome e preço. Se o produto mudar de preço amanhã,
-- o pedido tem de continuar mostrando o que foi cobrado hoje.
create table if not exists public.pedido_itens (
  id              bigint generated always as identity primary key,
  pedido_id       bigint not null references public.pedidos (id) on delete cascade,
  produto_id      bigint references public.produtos (id) on delete set null,
  produto_slug    text not null,
  nome            text not null,
  marca           text not null,
  variante_rotulo text,
  preco_centavos  integer not null check (preco_centavos > 0),
  quantidade      integer not null check (quantidade > 0)
);

create index if not exists pedido_itens_pedido_idx on public.pedido_itens (pedido_id);

alter table public.pedidos      enable row level security;
alter table public.pedido_itens enable row level security;
-- Nenhuma policy, nenhum grant: sem acesso direto pela chave pública.

-- ============================================================
-- Única porta de entrada
-- ============================================================
create or replace function public.criar_pedido(dados jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  minimo_frete_gratis constant integer := 8999;
  frete_padrao        constant integer := 1000;
  cidades_atendidas   constant text[]  := array[
    'Recife','Olinda','Paulista','Jaboatão','Abreu e Lima','Camaragibe','São Lourenço da Mata'
  ];

  item        jsonb;
  produto     public.produtos%rowtype;
  quantidade  integer;
  v_pedido_id bigint;
  v_numero    text;
  v_subtotal  integer := 0;
  v_frete     integer;
  v_total     integer;
  v_troco     integer;
begin
  if dados->'itens' is null or jsonb_array_length(dados->'itens') = 0 then
    raise exception 'Pedido sem itens';
  end if;

  if not (dados->>'cidade') = any (cidades_atendidas) then
    raise exception 'Não entregamos em %', dados->>'cidade';
  end if;

  -- O total NUNCA vem do navegador: é recalculado a partir do preço em banco.
  -- Sem isto, bastaria adulterar a requisição para comprar por R$ 0,01.
  for item in select * from jsonb_array_elements(dados->'itens')
  loop
    quantidade := (item->>'quantidade')::integer;
    if quantidade is null or quantidade < 1 then
      raise exception 'Quantidade inválida';
    end if;

    select * into produto
      from public.produtos
     where slug = item->>'produto_slug' and ativo;

    if not found then
      raise exception 'Produto indisponível: %', item->>'produto_slug';
    end if;

    v_subtotal := v_subtotal + produto.preco_centavos * quantidade;
  end loop;

  v_frete := case when v_subtotal >= minimo_frete_gratis then 0 else frete_padrao end;
  v_total := v_subtotal + v_frete;

  v_troco := nullif(dados->>'troco_para_centavos','')::integer;
  if coalesce((dados->>'precisa_troco')::boolean, false) and coalesce(v_troco, 0) < v_total then
    raise exception 'Troco menor que o total do pedido';
  end if;

  -- Número curto para o cliente citar no WhatsApp: 260727-A3F9
  v_numero := to_char(now() at time zone 'America/Recife', 'YYMMDD')
              || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));

  insert into public.pedidos (
    numero, cliente_nome, cliente_telefone, cliente_email,
    cep, rua, numero_endereco, complemento, bairro, cidade, referencia,
    forma_pagamento, precisa_troco, troco_para_centavos, observacao,
    subtotal_centavos, frete_centavos, total_centavos
  ) values (
    v_numero,
    dados->>'cliente_nome',
    dados->>'cliente_telefone',
    nullif(dados->>'cliente_email',''),
    dados->>'cep',
    dados->>'rua',
    dados->>'numero_endereco',
    nullif(dados->>'complemento',''),
    dados->>'bairro',
    dados->>'cidade',
    nullif(dados->>'referencia',''),
    dados->>'forma_pagamento',
    coalesce((dados->>'precisa_troco')::boolean, false),
    v_troco,
    nullif(dados->>'observacao',''),
    v_subtotal, v_frete, v_total
  )
  returning id into v_pedido_id;

  for item in select * from jsonb_array_elements(dados->'itens')
  loop
    select * into produto
      from public.produtos
     where slug = item->>'produto_slug' and ativo;

    insert into public.pedido_itens (
      pedido_id, produto_id, produto_slug, nome, marca,
      variante_rotulo, preco_centavos, quantidade
    ) values (
      v_pedido_id, produto.id, produto.slug, produto.nome, produto.marca,
      nullif(item->>'variante_rotulo',''),
      produto.preco_centavos,
      (item->>'quantidade')::integer
    );
  end loop;

  -- Devolve só o que o cliente precisa ver. Nada do resto do pedido vaza.
  return jsonb_build_object(
    'numero', v_numero,
    'subtotal_centavos', v_subtotal,
    'frete_centavos', v_frete,
    'total_centavos', v_total
  );
end;
$$;

revoke all on function public.criar_pedido(jsonb) from public;
grant execute on function public.criar_pedido(jsonb) to anon, authenticated;
