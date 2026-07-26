/**
 * Mock de produtos — nomes, marcas e preços reais da loja atual (Vendizap).
 *
 * O formato final já é o do schema pretendido no Supabase, para que a troca de
 * origem de dados não obrigue a mexer nas telas:
 *  - preços em CENTAVOS (inteiro)
 *  - `slug` como identificador de rota
 *  - `preco_de_centavos` é o preço riscado; null quando não há desconto
 *  - `variantes[]` com estoque próprio, `imagens[]` (vazio: cai no placeholder)
 *
 * A tabela abaixo é escrita como tuplas só para caber legível; o `map` logo
 * em seguida devolve os objetos completos.
 *
 * [ nome, marca, categoria, preco_de, preco_por, tag ]  — valores em centavos
 */
import { imagensDoProduto } from "./imagens.js";

const LINHAS = [
  // Combos e packs em destaque
  ["COMBO MAX TITANIUM — 100% Whey + Creatina Monohidratada", "Max Titanium", "packs", 20000, 16999, "MAIS VENDIDO"],
  ["COMBO Emagrecimento Under Labz", "Under Labz", "termogenicos", 19999, 14999, null],
  ["COMBO Nutrata — Creatina 300g + Whey NPro 900g", "Nutrata", "packs", 20000, 14999, null],
  ["Creatina 100% Pura Monohidratada 1kg", "Absolut", "creatina", 25000, 12999, "MAIS VENDIDO"],
  ["COMBO Shark Pro", "Shark Pro", "packs", 25000, 15999, null],
  ["COMBO Integral Médica — Whey 900g + Creatina 300g", "Integralmédica", "packs", 35200, 19999, null],
  ["2x Creatina 100% Pura Monohidratada 300g (cada)", "Synthasize", "creatina", 30000, 9999, "FRETE GRÁTIS"],
  ["SuperCoffee 380g", "Caffeine Army", "termogenicos", 25000, 19999, null],
  ["2x Max 100% Concentrado 900g (cada)", "Max Titanium", "proteinas", 35000, 25999, null],

  // Promoções
  ["100% Whey Gold Standard 900g", "Optimum Nutrition", "proteinas", 35000, 27999, null],
  ["Creafort 300g com Selo Creapure", "Vitafor", "creatina", 25000, 17999, null],
  ["Thermo Flame 120 caps", "Black Skull", "termogenicos", 8495, 5999, null],
  ["Multimax Complex 90 caps", "Max Titanium", "vitaminas-e-minerais", 8000, 7499, null],
  ["Hi-Mass Prime 15000 3kg", "Leader Nutrition", "hipercalorico", 11999, 10999, null],
  ["100% Whey 900g", "Nutrata", "proteinas", 19999, 13999, null],
  ["Adaptogen Tasty Whey 3W Gourmet 912g", "Adaptogen", "proteinas", 25000, 21999, null],
  ["100% Prime Whey 900g", "Body Action", "proteinas", 14998, 10999, null],
  ["The Pumpfather 300g", "Under Labz", "pre-treino", 15999, 13999, "NOVIDADE"],
  ["Combo Emagrecimento Sineflex + T-Sek", "Power Supplements", "termogenicos", 14998, 13999, null],

  // Mais vendidos (sem preço riscado)
  ["Pasta de Amendoim Gourmet 650g", "Dr. Peanut", "lanches-fit", null, 5999, "MAIS VENDIDO"],
  ["Coqueteleira 600ml", "Max Titanium", "acessorios", null, 1999, null],
  ["Pasta de Amendoim Integral Tradicional 1kg", "Dr. Peanut", "lanches-fit", null, 2999, null],
  ["Creatina Turbo 150g", "Black Skull", "creatina", null, 4999, "MAIS VENDIDO"],
  ["Sense Bar 15g (unidade)", "Absolut", "lanches-fit", null, 699, null],

  // Catálogo geral
  ["C4 The Chosen One Pré-treino 200g", "New Millen", "pre-treino", null, 9499, null],
  ["Beta-Alanine 100g", "Black Skull", "beta-alanina", null, 7999, null],
  ["Melatonina 3mg 100 cápsulas", "NBF Nutrition", "melatonina", null, 7998, null],
  ["BCAA Fix Darkness 120 tabs", "Integralmédica", "bcaa", null, 8998, null],
  ["Life Vegan 450g", "Integralmédica", "proteinas-veganas", null, 13499, null],
  ["Dextrose 1kg", "Body Action", "carboidratos", null, 2999, null],
  ["Vitamina D3 10.000UI 30 softgels", "Healthy Origins", "vitaminas-e-minerais", null, 7998, null],
  ["Galão 1L", "Body Action", "acessorios", null, 3999, null],
  ["Complex A-Z com Ômega 3 60 caps", "Leader Nutrition", "omega-3", null, 4498, null],
  ["Simfort Plus 60 caps", "Vitafor", "probioticos-e-enzimas", null, 14298, null],
  ["Pré-hormonal Testodrol GH 60 tabletes", "Profit Labs", "pre-hormonais", null, 8499, null],
  ["Kit com 5 Mini Bands", "Live Up", "treine-em-casa", null, 15998, null],
  ["Tribulus Terrestris TRIB-X 1200mg 100 tabletes", "NBF Nutrition", "pre-hormonais", null, 10598, null],
  ["Maca Peruana 1000mg", "NBF Nutrition", "vitaminas-e-minerais", null, 10495, null],
  ["Mega Pack Hardcore (30 packs)", "Integralmédica", "packs", null, 19999, null],
  ["Colágeno Verisol + Ácido Hialurônico 300g", "Vitafor", "colageno", null, 12999, null],
];

/** Gera slug a partir do nome: remove acentos, pontuação e normaliza hífens. */
function gerarSlug(nome) {
  return nome
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Sabores usados como variantes nos produtos em pó. */
const SABORES = ["Chocolate", "Baunilha", "Morango", "Sem sabor"];

const CATEGORIAS_COM_SABOR = ["proteinas", "creatina", "pre-treino", "proteinas-veganas"];

/**
 * Curadoria das vitrines da home, espelhando a loja atual:
 * "Produtos em destaque" são os combos; "Mais vendidos" são os itens de giro
 * rápido (pastas, coqueteleira, creatina turbo).
 */
const SLUGS_DESTAQUE = [
  "combo-max-titanium-100-whey-creatina-monohidratada",
  "combo-emagrecimento-under-labz",
  "combo-nutrata-creatina-300g-whey-npro-900g",
  "creatina-100-pura-monohidratada-1kg",
  "combo-shark-pro",
  "combo-integral-medica-whey-900g-creatina-300g",
  "2x-creatina-100-pura-monohidratada-300g-cada",
  "supercoffee-380g",
  "2x-max-100-concentrado-900g-cada",
];

const SLUGS_MAIS_VENDIDOS = [
  "pasta-de-amendoim-gourmet-650g",
  "coqueteleira-600ml",
  "pasta-de-amendoim-integral-tradicional-1kg",
  "creatina-turbo-150g",
  "sense-bar-15g-unidade",
  "c4-the-chosen-one-pre-treino-200g",
  "100-whey-gold-standard-900g",
  "mega-pack-hardcore-30-packs",
];

export const produtos = LINHAS.map(([nome, marca, categoria, de, por, tag], i) => {
  const temSabor = CATEGORIAS_COM_SABOR.includes(categoria);
  const slug = gerarSlug(nome);
  return {
    id: i + 1,
    slug,
    destaque: SLUGS_DESTAQUE.includes(slug),
    mais_vendido: SLUGS_MAIS_VENDIDOS.includes(slug),
    nome,
    marca,
    categoria,
    preco_de_centavos: de,
    preco_centavos: por,
    tag,
    nota: 5,
    avaliacoes: 12 + ((i * 7) % 60),
    estoque: 3 + ((i * 5) % 28),
    imagens: imagensDoProduto(slug),
    variantes: temSabor
      ? SABORES.slice(0, 3).map((rotulo, v) => ({
          id: (i + 1) * 100 + v,
          rotulo,
          estoque: (i + v) % 4 === 0 ? 0 : 5 + ((i + v) % 10),
        }))
      : [],
  };
});

/** Marcas únicas, ordenadas — alimenta o filtro do catálogo. */
export const marcas = [...new Set(produtos.map((p) => p.marca))].sort((a, b) =>
  a.localeCompare(b, "pt-BR")
);
