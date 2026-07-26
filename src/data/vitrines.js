/**
 * Vitrines — os atalhos da barra do topo.
 *
 * Diferente de categoria: categoria é taxonomia do produto (creatina, whey),
 * vitrine é curadoria comercial (o que a loja quer empurrar). Por isso vivem
 * em rotas separadas (/v/:slug) e cada uma carrega sua própria regra de corte.
 *
 * Mexer aqui muda o menu do topo — é o ponto único de edição.
 *
 * Cada vitrine traz duas versões da mesma regra:
 *  - `filtro`: predicado JS, usado no catálogo local (sem Supabase configurado)
 *  - `aplicar`: a mesma regra como consulta, para o banco filtrar no servidor
 *    em vez de trazer o catálogo inteiro e descartar no navegador.
 */
import { Boxes, Package, Sparkles, Tag, Trophy, Truck } from "lucide-react";

export const vitrines = [
  {
    slug: "kits-promocionais",
    nome: "Kits Promocionais",
    titulo: "Kits e combos promocionais",
    subtitulo: "Mais produto, menos por unidade. O melhor custo-benefício da loja.",
    Icone: Package,
    filtro: (p) => p.categoria === "packs" || /combo|2x/i.test(p.nome),
    aplicar: (q) => q.or("categoria_slug.eq.packs,nome.ilike.%combo%,nome.ilike.%2x %"),
  },
  {
    slug: "top-20",
    nome: "Top 20",
    titulo: "Top 20 mais vendidos",
    subtitulo: "O que mais sai em Recife e região.",
    Icone: Trophy,
    limite: 20,
    filtro: (p) => p.mais_vendido || p.destaque || p.tag === "MAIS VENDIDO",
    aplicar: (q) => q.or("mais_vendido.is.true,destaque.is.true,tag.eq.MAIS VENDIDO"),
  },
  {
    slug: "promocoes",
    nome: "Promoções",
    titulo: "Promoções",
    subtitulo: "Tudo com desconto, do maior pro menor.",
    Icone: Tag,
    destaque: true, // pintada de amarelo na barra
    filtro: (p) => p.preco_de_centavos && p.preco_de_centavos > p.preco_centavos,
    aplicar: (q) => q.not("preco_de_centavos", "is", null),
    ordenar: (a, b) =>
      (b.preco_de_centavos - b.preco_centavos) / b.preco_de_centavos -
      (a.preco_de_centavos - a.preco_centavos) / a.preco_de_centavos,
  },
  {
    slug: "frete-gratis",
    nome: "Frete Grátis",
    titulo: "Produtos com frete grátis",
    subtitulo: "Acima de R$ 89,99 a entrega é por nossa conta.",
    Icone: Truck,
    filtro: (p) => p.preco_centavos >= 8999,
    aplicar: (q) => q.gte("preco_centavos", 8999),
  },
  {
    slug: "novidades",
    nome: "Novidades",
    titulo: "Chegou agora",
    subtitulo: "Os lançamentos mais recentes no estoque.",
    Icone: Sparkles,
    filtro: (p) => p.tag === "NOVIDADE",
    aplicar: (q) => q.eq("tag", "NOVIDADE"),
  },
  {
    slug: "ate-50",
    nome: "Até R$ 50",
    titulo: "Tudo até R$ 50",
    subtitulo: "Pra completar o pedido e chegar no frete grátis.",
    Icone: Boxes,
    filtro: (p) => p.preco_centavos <= 5000,
    aplicar: (q) => q.lte("preco_centavos", 5000),
  },
];

export function acharVitrine(slug) {
  return vitrines.find((v) => v.slug === slug) ?? null;
}
