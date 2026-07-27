-- ============================================================
-- Formas de pagamento reais da loja
--
-- Débito passou a andar junto com dinheiro (mesma condição: sem acréscimo,
-- maquininha na entrega) e o crédito virou "até 3x" com acréscimo fixo
-- repassado pela maquininha.
-- ============================================================

-- Pedidos antigos (testes) migram para os novos valores antes da troca do
-- check, senão a constraint recusa as linhas já gravadas.
update public.pedidos set forma_pagamento = 'dinheiro_debito'
 where forma_pagamento in ('dinheiro', 'debito');

update public.pedidos set forma_pagamento = 'credito_3x'
 where forma_pagamento = 'credito';

alter table public.pedidos drop constraint if exists pedidos_forma_pagamento_check;

alter table public.pedidos add constraint pedidos_forma_pagamento_check
  check (forma_pagamento in ('pix', 'dinheiro_debito', 'credito_3x'));

-- O acréscimo fica em coluna própria: somado ao total, mas não é frete nem
-- produto. Sem isso não dá para conferir o repasse da maquininha depois.
alter table public.pedidos
  add column if not exists acrescimo_centavos integer not null default 0
  check (acrescimo_centavos >= 0);

-- ============================================================
-- Recalcula o total considerando o acréscimo do cartão
-- ============================================================
create or replace function public.criar_pedido(dados jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  minimo_frete_gratis constant integer := 8999;
  frete_padrao        constant integer := 999;
  acrescimo_cartao    constant integer := 1499;
  cidades_atendidas   constant text[]  := array[
    'Recife','Olinda','Paulista','Jaboatão','Abreu e Lima','Camaragibe','São Lourenço da Mata'
  ];

  item        jsonb;
  produto     public.produtos%rowtype;
  quantidade  integer;
  v_forma     text;
  v_pedido_id bigint;
  v_numero    text;
  v_subtotal  integer := 0;
  v_frete     integer;
  v_acrescimo integer;
  v_total     integer;
  v_troco     integer;
begin
  if dados->'itens' is null or jsonb_array_length(dados->'itens') = 0 then
    raise exception 'Pedido sem itens';
  end if;

  if not (dados->>'cidade') = any (cidades_atendidas) then
    raise exception 'Não entregamos em %', dados->>'cidade';
  end if;

  v_forma := dados->>'forma_pagamento';
  if v_forma not in ('pix', 'dinheiro_debito', 'credito_3x') then
    raise exception 'Forma de pagamento inválida';
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

  v_frete     := case when v_subtotal >= minimo_frete_gratis then 0 else frete_padrao end;
  v_acrescimo := case when v_forma = 'credito_3x' then acrescimo_cartao else 0 end;
  v_total     := v_subtotal + v_frete + v_acrescimo;

  v_troco := nullif(dados->>'troco_para_centavos','')::integer;
  if coalesce((dados->>'precisa_troco')::boolean, false) and coalesce(v_troco, 0) < v_total then
    raise exception 'Troco menor que o total do pedido';
  end if;

  v_numero := to_char(now() at time zone 'America/Recife', 'YYMMDD')
              || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));

  insert into public.pedidos (
    numero, cliente_nome, cliente_telefone, cliente_email,
    cep, rua, numero_endereco, complemento, bairro, cidade, referencia,
    forma_pagamento, precisa_troco, troco_para_centavos, observacao,
    subtotal_centavos, frete_centavos, acrescimo_centavos, total_centavos
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
    v_forma,
    coalesce((dados->>'precisa_troco')::boolean, false),
    v_troco,
    nullif(dados->>'observacao',''),
    v_subtotal, v_frete, v_acrescimo, v_total
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

  return jsonb_build_object(
    'numero', v_numero,
    'subtotal_centavos', v_subtotal,
    'frete_centavos', v_frete,
    'acrescimo_centavos', v_acrescimo,
    'total_centavos', v_total
  );
end;
$$;

revoke all on function public.criar_pedido(jsonb) from public;
grant execute on function public.criar_pedido(jsonb) to anon, authenticated;
