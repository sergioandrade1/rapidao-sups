# Banco de dados

## Estrutura

```
supabase/
  config.toml                 liga esta pasta ao projeto na nuvem
  migrations/                 mudancas de estrutura, aplicadas em ordem
    20260726120000_catalogo_schema.sql
  seed.sql                    catalogo inicial (NAO roda em producao)
```

## Como mudar o banco

Nunca edite uma migration já aplicada — ela já rodou no banco de produção e
não roda de novo. Crie um arquivo novo:

```
supabase/migrations/AAAAMMDDHHMMSS_o_que_mudou.sql
```

O nome precisa começar com data e hora, porque é o que define a ordem.

## Sobre o seed

`seed.sql` recria o catálogo do zero (dá `truncate` antes de inserir). É útil
para popular um banco vazio, mas **apagaria qualquer produto cadastrado à mão**
pelo painel. Por isso ele fica fora de `migrations/` — não é aplicado
automaticamente em produção.

Para regerá-lo a partir de `src/data/`, o gerador está descrito no histórico do
Git (commit "Catalogo passa a vir do Supabase").

## Segurança

Todas as tabelas têm RLS ligada com leitura pública e **nenhuma** policy de
escrita. A chave `anon` usada pelo site é pública — ela viaja no bundle e
qualquer visitante consegue lê-la. Quem impede alteração de dados é a ausência
de policy de escrita, não o sigilo da chave.

Ao criar tabela nova, lembre dos dois passos que o projeto exige (a opção
"expose new tables" está desligada de propósito):

```sql
alter table public.nova enable row level security;
create policy "leitura publica" on public.nova for select using (true);
grant select on public.nova to anon, authenticated;
```

Para dados sensíveis (pedidos, clientes), **não** crie policy de leitura
pública.
