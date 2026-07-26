# Rapidão Suplementos — site próprio

Delivery de suplementos em Recife e região metropolitana. Substitui a loja atual
na Vendizap (`rapidaosuplementos.vendizap.com`).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve o `dist/` localmente, para conferir antes de publicar |

## Stack

React 18 · Vite 6 · Tailwind CSS v4 · React Router 7 · lucide-react

## Estrutura

```
src/
  routes.jsx              definição central das rotas
  layouts/RootLayout      header + footer + WhatsApp + aviso de carrinho
  pages/                  Home, Catalogo, Produto, Carrinho, Checkout,
                          AreaAtuacao, NaoEncontrada
  services/produtos.js    ÚNICA fronteira de dados (ver abaixo)
  context/CarrinhoContext reducer + persistência em localStorage
  data/                   mock: produtos, categorias, vitrines, imagens
  lib/                    formato (BRL), frete, loja (dados institucionais)
```

Rotas: `/` · `/produtos` · `/c/:categoria` · `/v/:vitrine` · `/busca?q=` ·
`/p/:slug` · `/carrinho` · `/checkout` · `/area-de-atuacao`

**Categoria x vitrine:** categoria é taxonomia do produto (creatina, whey);
vitrine é curadoria comercial (Top 20, Kits, Promoções). Editar
`src/data/vitrines.js` muda o menu do topo inteiro.

## Convenções

- **Preços em centavos** (inteiro). Float em dinheiro acumula erro de
  arredondamento no somatório do carrinho. `lib/formato.js` converte na exibição.
- **Nenhuma página importa `data/` diretamente** — tudo passa por
  `services/produtos.js`, que já é assíncrono. Trocar o corpo dessas funções é a
  migração inteira para o Supabase.

## Pendências antes de lançar

- [ ] **Imagens apontam para o CDN da Vendizap** (`src/data/imagens.js`). Baixar
      e subir para o Supabase Storage; só a constante `BASE` muda.
- [ ] **Checkout é stub** — falta o layout em etapas.
- [ ] **Remover `noindex`** do `index.html` e do `vercel.json` no lançamento.
- [ ] Tabela nutricional é estática e igual em todo produto.
- [ ] Vitrine "Novidades" depende de data de cadastro (virá do Supabase).
